-- ==============================================================================
-- 0002_hierarchy_refinement.sql
-- Refined Hierarchy Architecture from frontend/DATA/
-- 1. Reuses organisations tree (adds cin, is_filing_entity, boundary, etc.)
-- 2. Creates department (scoped to organisation) and versioned indicator tables
-- 3. Implements v_org_filing_entity recursive view
-- 4. Links existing activity_data rows to indicator.id and department.id
-- 5. Installs check_activity_hierarchy() and audit_row() triggers
-- ==============================================================================

BEGIN;

-- 1. CLEAN UP PREVIOUS INTERIM EXPERIMENTAL ARTIFACTS ------------------------
DROP TRIGGER IF EXISTS activity_hierarchy_check ON activity_data;
DROP TRIGGER IF EXISTS audit_site ON site;
DROP TRIGGER IF EXISTS audit_company ON company;
DROP TRIGGER IF EXISTS audit_department ON department;
DROP TRIGGER IF EXISTS audit_indicator ON indicator;

ALTER TABLE activity_data DROP COLUMN IF EXISTS site_id;
ALTER TABLE activity_data DROP COLUMN IF EXISTS dept_id;
ALTER TABLE activity_data DROP COLUMN IF EXISTS indicator_id;
ALTER TABLE activity_data DROP COLUMN IF EXISTS department_id;

DROP TABLE IF EXISTS site CASCADE;
DROP TABLE IF EXISTS company CASCADE;
DROP TABLE IF EXISTS department CASCADE;
DROP TABLE IF EXISTS indicator CASCADE;

-- 2. EXPAND ORGANISATIONS TABLE DEFINITION ------------------------------------
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS cin text;
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS ownership_pct numeric(5, 2) NOT NULL DEFAULT '100';
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS consolidation_method text NOT NULL DEFAULT 'OPERATIONAL_CONTROL';
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS valid_from date;
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS valid_to date;
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS in_boundary boolean NOT NULL DEFAULT true;
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS is_filing_entity boolean NOT NULL DEFAULT false;

ALTER TABLE organisations DROP CONSTRAINT IF EXISTS org_ownership_range;
ALTER TABLE organisations ADD CONSTRAINT org_ownership_range CHECK (ownership_pct BETWEEN 0 AND 100);

ALTER TABLE organisations DROP CONSTRAINT IF EXISTS org_valid_dates;
ALTER TABLE organisations ADD CONSTRAINT org_valid_dates CHECK (valid_to IS NULL OR valid_from IS NULL OR valid_to > valid_from);

-- 3. CREATE DEPARTMENT AND INDICATOR TABLES ----------------------------------
CREATE TABLE department (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organisation_id text NOT NULL REFERENCES organisations(id),
  name text NOT NULL,
  CONSTRAINT department_org_name_uq UNIQUE (organisation_id, name)
);

CREATE TABLE indicator (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  attribute_number integer,
  scope_type text,
  sub_item text,
  section text NOT NULL,
  principle_no integer,
  is_brsr_core boolean NOT NULL DEFAULT false,
  name text NOT NULL,
  unit text NOT NULL,
  kind text NOT NULL DEFAULT 'RAW',
  methodology_note text,
  effective_from date NOT NULL,
  effective_to date,
  CONSTRAINT indicator_code_version_uq UNIQUE (code, version),
  CONSTRAINT indicator_natural_key_uq UNIQUE (attribute_number, scope_type, sub_item, version),
  CONSTRAINT indicator_kind_ck CHECK (kind IN ('RAW','CALCULATED')),
  CONSTRAINT indicator_section_ck CHECK (section IN ('A','B','C'))
);

-- 4. EXPAND ACTIVITY_DATA COLUMNS --------------------------------------------
ALTER TABLE activity_data ADD COLUMN IF NOT EXISTS indicator_id text REFERENCES indicator(id);
ALTER TABLE activity_data ADD COLUMN IF NOT EXISTS department_id text REFERENCES department(id);
ALTER TABLE activity_data ADD COLUMN IF NOT EXISTS dimension text NOT NULL DEFAULT 'ALL';

-- 5. RUN USER'S EXACT BACKFILL LOGIC -----------------------------------------
-- Backfill identity, so any audit rows written during this migration are attributable.
SELECT set_config('app.user_email', 'migration@system', true);

-- 5a. Mark which organisations file a BRSR
UPDATE organisations SET is_filing_entity = TRUE WHERE type = 'SUBSIDIARY';
UPDATE organisations SET valid_from = DATE '2024-04-01' WHERE valid_from IS NULL;
UPDATE organisations SET cin = 'U45200TG1989PLC013058' WHERE id = 'meil-group';
UPDATE organisations SET cin = 'U45200TG2006PLC051234' WHERE id = 'sub-infra';

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM organisations WHERE is_filing_entity) THEN
    RAISE EXCEPTION 'No filing entity set. Fix step 1 using the real values of organisations.type';
  END IF;
END $$;

-- 5b. View: nearest filing-entity ancestor (or self) for every organisation
CREATE OR REPLACE VIEW v_org_filing_entity AS
WITH RECURSIVE up AS (
    SELECT id AS org_id, id AS cur_id, parent_id, is_filing_entity, 0 AS depth
    FROM organisations
  UNION ALL
    SELECT up.org_id, p.id, p.parent_id, p.is_filing_entity, up.depth + 1
    FROM up JOIN organisations p ON p.id = up.parent_id
    WHERE NOT up.is_filing_entity AND up.depth < 10
)
SELECT DISTINCT ON (org_id) org_id, cur_id AS filing_entity_id
FROM up WHERE is_filing_entity
ORDER BY org_id, depth;

-- 5c. Departments per filing entity
INSERT INTO department (organisation_id, name)
SELECT o.id, d.name
FROM organisations o
CROSS JOIN (VALUES ('EHS'), ('HR'), ('CSR'), ('Legal & Compliance'),
                   ('Procurement'), ('Finance')) AS d(name)
WHERE o.is_filing_entity
ON CONFLICT (organisation_id, name) DO NOTHING;

-- 5d. Indicators derived from the data you already hold
INSERT INTO indicator (code, version, attribute_number, scope_type, sub_item,
                       section, is_brsr_core, name, unit, kind, effective_from)
SELECT format('CORE%s-%s-%s', attribute_number,
              upper(regexp_replace(scope_type, '[^A-Za-z0-9]+', '-', 'g')),
              upper(regexp_replace(sub_item,   '[^A-Za-z0-9]+', '-', 'g'))),
       1, attribute_number, scope_type, sub_item,
       'C', TRUE, sub_item, min(unit), 'RAW', DATE '2024-04-01'
FROM activity_data
GROUP BY attribute_number, scope_type, sub_item
ON CONFLICT DO NOTHING;

-- 5e. Link existing activity rows
ALTER TABLE activity_data DISABLE TRIGGER USER;

UPDATE activity_data a
SET indicator_id = i.id
FROM indicator i
WHERE i.version = 1
  AND i.attribute_number = a.attribute_number
  AND i.scope_type = a.scope_type
  AND i.sub_item = a.sub_item;

UPDATE activity_data a                      -- owner department by BRSR Core attribute
SET department_id = d.id
FROM v_org_filing_entity fe
JOIN department d ON d.organisation_id = fe.filing_entity_id
WHERE fe.org_id = a.organisation_id
  AND d.name = CASE
        WHEN a.attribute_number BETWEEN 1 AND 4 THEN 'EHS'
        WHEN a.attribute_number IN (5, 6)       THEN 'HR'
        WHEN a.attribute_number = 7             THEN 'CSR'
        WHEN a.attribute_number = 8             THEN 'Legal & Compliance'
        WHEN a.attribute_number = 9             THEN 'Procurement'
      END;

ALTER TABLE activity_data ENABLE TRIGGER USER;

-- 6. INTEGRITY: department must belong to its unit's filing entity ------------
CREATE OR REPLACE FUNCTION check_activity_hierarchy() RETURNS trigger AS $$
DECLARE fe TEXT; dept_org TEXT;
BEGIN
    SELECT filing_entity_id INTO fe FROM v_org_filing_entity WHERE org_id = NEW.organisation_id;
    SELECT organisation_id INTO dept_org FROM department WHERE id = NEW.department_id;
    IF fe IS DISTINCT FROM dept_org THEN
        RAISE EXCEPTION 'Department % does not belong to the filing entity of organisation %',
                        NEW.department_id, NEW.organisation_id;
    END IF;
    RETURN NEW;
END $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS activity_hierarchy_check ON activity_data;
CREATE TRIGGER activity_hierarchy_check
BEFORE INSERT OR UPDATE OF organisation_id, department_id ON activity_data
FOR EACH ROW EXECUTE FUNCTION check_activity_hierarchy();

-- 7. AUDIT MASTER TABLES WITH GENERIC TRIGGER ---------------------------------
DROP TRIGGER IF EXISTS audit_organisations ON organisations;
CREATE TRIGGER audit_organisations AFTER INSERT OR UPDATE OR DELETE ON organisations
    FOR EACH ROW EXECUTE FUNCTION audit_row();

DROP TRIGGER IF EXISTS audit_department ON department;
CREATE TRIGGER audit_department AFTER INSERT OR UPDATE OR DELETE ON department
    FOR EACH ROW EXECUTE FUNCTION audit_row();

DROP TRIGGER IF EXISTS audit_indicator ON indicator;
CREATE TRIGGER audit_indicator AFTER INSERT OR UPDATE OR DELETE ON indicator
    FOR EACH ROW EXECUTE FUNCTION audit_row();

-- 8. SANITY CHECK & AUDIT LEDGER ENTRY ---------------------------------------
DO $$
DECLARE n INT;
BEGIN
    SELECT count(*) INTO n FROM activity_data
    WHERE indicator_id IS NULL OR department_id IS NULL;
    IF n > 0 THEN
        RAISE EXCEPTION '% activity_data rows could not be linked (no filing entity ancestor or unmapped attribute)', n;
    END IF;
END $$;

INSERT INTO audit_logs (id, table_name, record_id, action, old_value, new_value, changed_by)
VALUES (gen_random_uuid()::text, 'MIGRATION', '0001_hierarchy_backfill', 'BACKFILL', NULL,
        jsonb_build_object(
          'activity_rows_linked', (SELECT count(*) FROM activity_data),
          'indicators_created',   (SELECT count(*) FROM indicator),
          'departments_created',  (SELECT count(*) FROM department),
          'note', 'activity_data user triggers disabled during link step'),
        'migration@system');

COMMIT;

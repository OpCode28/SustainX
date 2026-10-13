-- Custom migration: drizzle-kit generate --custom --name=hierarchy_backfill
-- Run AFTER the generated migration that adds the new organisations columns,
-- the department and indicator tables, and activity_data.indicator_id / department_id / dimension.
--
-- BEFORE RUNNING, check these and edit the lines marked CONFIRM:
--   SELECT type, count(*) FROM organisations GROUP BY type;
--   SELECT attribute_number, scope_type, sub_item, count(DISTINCT unit) FROM activity_data
--     GROUP BY 1,2,3 HAVING count(DISTINCT unit) > 1;          -- must return no rows
-- Test on a COPY of the database first.

BEGIN;

-- Backfill identity, so any audit rows written during this migration are attributable.
SELECT set_config('app.user_email', 'migration@system', true);

-- 1. Mark which organisations file a BRSR ---------------------------------------
UPDATE organisations SET is_filing_entity = TRUE WHERE type = 'SUBSIDIARY';   -- CONFIRM
UPDATE organisations SET valid_from = DATE '2024-04-01' WHERE valid_from IS NULL;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM organisations WHERE is_filing_entity) THEN
    RAISE EXCEPTION 'No filing entity set. Fix step 1 using the real values of organisations.type';
  END IF;
END $$;

-- 2. View: nearest filing-entity ancestor (or self) for every organisation -------
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

-- 3. Departments per filing entity ---------------------------------------------
INSERT INTO department (organisation_id, name)
SELECT o.id, d.name
FROM organisations o
CROSS JOIN (VALUES ('EHS'), ('HR'), ('CSR'), ('Legal & Compliance'),
                   ('Procurement'), ('Finance')) AS d(name)          -- CONFIRM list
WHERE o.is_filing_entity
ON CONFLICT (organisation_id, name) DO NOTHING;

-- 4. Indicators derived from the data you already hold ---------------------------
--    The seed script should add the rest of the catalogue (Sections A, B, other principles).
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

-- 5. Link existing activity rows --------------------------------------------------
--    The approval-lock trigger would block updates to APPROVED rows, so user triggers on
--    activity_data are switched off for these two statements only. This is a deliberate,
--    documented bypass; it is recorded in audit_logs in step 8. Needs the table owner.
ALTER TABLE activity_data DISABLE TRIGGER USER;

UPDATE activity_data a
SET indicator_id = i.id
FROM indicator i
WHERE i.version = 1
  AND i.attribute_number = a.attribute_number
  AND i.scope_type = a.scope_type
  AND i.sub_item = a.sub_item;

UPDATE activity_data a                      -- owner department by BRSR Core attribute
SET department_id = d.id                    -- CONFIRM the attribute -> department mapping
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

-- 6. Integrity: a number's department must belong to its unit's filing entity -----
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

CREATE TRIGGER activity_hierarchy_check
BEFORE INSERT OR UPDATE OF organisation_id, department_id ON activity_data
FOR EACH ROW EXECUTE FUNCTION check_activity_hierarchy();

-- 7. Audit the master tables with your existing generic trigger ---------------------
--    Verify audit_row() reads the key from NEW.id / OLD.id (these tables all use "id").
CREATE TRIGGER audit_organisations AFTER INSERT OR UPDATE OR DELETE ON organisations
    FOR EACH ROW EXECUTE FUNCTION audit_row();
CREATE TRIGGER audit_department    AFTER INSERT OR UPDATE OR DELETE ON department
    FOR EACH ROW EXECUTE FUNCTION audit_row();
CREATE TRIGGER audit_indicator     AFTER INSERT OR UPDATE OR DELETE ON indicator
    FOR EACH ROW EXECUTE FUNCTION audit_row();

-- 8. Sanity check, then record the migration itself in the ledger -------------------
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

-- ----------------------------------------------------------------------------------
-- CONTRACT STEP: a SEPARATE later migration, after the API writes the new columns.
--   -- find duplicates first; this must return no rows:
--   SELECT organisation_id, reporting_period_id, indicator_id, dimension, count(*)
--   FROM activity_data GROUP BY 1,2,3,4 HAVING count(*) > 1;
--
--   ALTER TABLE activity_data
--     ALTER COLUMN indicator_id  SET NOT NULL,
--     ALTER COLUMN department_id SET NOT NULL;
--   ALTER TABLE organisations ALTER COLUMN valid_from SET NOT NULL;
--   CREATE UNIQUE INDEX activity_data_one_value_uq
--     ON activity_data (organisation_id, reporting_period_id, indicator_id, dimension);
--   -- later, once nothing reads them: drop scope_type / sub_item from activity_data.

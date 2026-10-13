-- ==============================================================================
-- 0001_hierarchy_expand_and_backfill.sql
-- Expand Step: Create company, department, site, indicator tables and nullable FKs
-- Backfill Step: Migrate organisations tree and link existing activity_data rows
-- Audit & Integrity: Attach audit_row() triggers and hierarchy validation trigger
-- ==============================================================================

BEGIN;

-- 1. GROUP > COMPANY > DEPARTMENT > SITE TABLES -------------------------------

CREATE TABLE IF NOT EXISTS company (
    company_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    parent_company_id integer REFERENCES company(company_id),
    cin text UNIQUE,
    name text NOT NULL,
    ownership_pct numeric(5, 2) DEFAULT '100' NOT NULL,
    consolidation_method text DEFAULT 'OPERATIONAL_CONTROL' NOT NULL,
    valid_from date NOT NULL,
    valid_to date,
    legacy_organisation_id text REFERENCES organisations(id),
    CONSTRAINT ownership_range CHECK (ownership_pct BETWEEN 0 AND 100),
    CONSTRAINT valid_dates CHECK (valid_to IS NULL OR valid_to > valid_from)
);

CREATE TABLE IF NOT EXISTS department (
    dept_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    company_id integer NOT NULL REFERENCES company(company_id),
    name text NOT NULL,
    CONSTRAINT department_company_id_name_unique UNIQUE(company_id, name)
);

CREATE TABLE IF NOT EXISTS site (
    site_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    company_id integer NOT NULL REFERENCES company(company_id),
    site_name text NOT NULL,
    state text,
    in_boundary boolean DEFAULT true NOT NULL,
    legacy_organisation_id text REFERENCES organisations(id),
    CONSTRAINT site_company_id_site_name_unique UNIQUE(company_id, site_name)
);
CREATE INDEX IF NOT EXISTS site_company_id_index ON site(company_id);

CREATE TABLE IF NOT EXISTS indicator (
    indicator_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    code text NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    section text NOT NULL,
    principle_no integer,
    category text,
    is_brsr_core boolean DEFAULT false NOT NULL,
    core_attribute_no integer,
    name text NOT NULL,
    unit text NOT NULL,
    kind text NOT NULL,
    owner_dept_name text,
    methodology_note text,
    effective_from date NOT NULL,
    effective_to date,
    CONSTRAINT indicator_code_version_unique UNIQUE(code, version),
    CONSTRAINT kind_valid CHECK (kind IN ('RAW','CALCULATED')),
    CONSTRAINT section_valid CHECK (section IN ('A','B','C'))
);

-- 2. EXPAND ACTIVITY_DATA WITH NULLABLE COLUMNS --------------------------------

ALTER TABLE activity_data ADD COLUMN IF NOT EXISTS site_id integer REFERENCES site(site_id);
ALTER TABLE activity_data ADD COLUMN IF NOT EXISTS dept_id integer REFERENCES department(dept_id);
ALTER TABLE activity_data ADD COLUMN IF NOT EXISTS indicator_id integer REFERENCES indicator(indicator_id);
ALTER TABLE activity_data ADD COLUMN IF NOT EXISTS dimension text DEFAULT 'ALL' NOT NULL;

-- 3. SEED INDICATOR MASTER (BRSR CORE ATTRIBUTES) -----------------------------

INSERT INTO indicator (code, version, section, principle_no, category, is_brsr_core, core_attribute_no, name, unit, kind, owner_dept_name, methodology_note, effective_from)
VALUES 
  ('P6-E-ELEC', 1, 'C', 6, 'ESSENTIAL', true, 1, 'Scope 2 Purchased Electricity', 'kWh', 'RAW', 'EHS', 'Utility grid meter bills certified via CEA v20 grid emission factor (0.7160 kgCO2e/kWh)', DATE '2024-04-01'),
  ('CORE-1-S2', 1, 'C', 6, 'ESSENTIAL', true, 1, 'Scope 2 Purchased Energy (Grid + Thermal)', 'kWh', 'RAW', 'EHS', 'BRSR Core Attribute 1: Scope 2 Purchased Electricity', DATE '2024-04-01'),
  ('CORE-1-S1-STAT', 1, 'C', 6, 'ESSENTIAL', true, 1, 'Scope 1 Stationary Combustion (Diesel/Gas)', 'liters', 'RAW', 'EHS', 'Fuel purchase invoices and consumption logs for DG sets, boilers, furnaces', DATE '2024-04-01'),
  ('CORE-1-S1-MOB', 1, 'C', 6, 'ESSENTIAL', true, 1, 'Scope 1 Mobile Combustion (Fleet)', 'liters', 'RAW', 'Procurement', 'Company transport fleet fuel receipts', DATE '2024-04-01'),
  ('CORE-1-S3-T&D', 1, 'C', 6, 'ESSENTIAL', true, 1, 'Scope 3 Category 3 Fuel- and energy-related activities', 'kWh', 'RAW', 'EHS', 'Upstream transmission and distribution grid losses', DATE '2024-04-01'),
  ('CORE-2-WATER', 1, 'C', 6, 'ESSENTIAL', true, 2, 'Water Consumption (Net Withdrawal)', 'KL', 'RAW', 'EHS', 'Calibrated water meter readings & municipal bills', DATE '2024-04-01'),
  ('CORE-3-RE-SHARE', 1, 'C', 6, 'ESSENTIAL', true, 3, 'Renewable Energy Share', 'percentage', 'CALCULATED', 'EHS', 'Calculated: Renewable energy divided by total energy consumed', DATE '2024-04-01'),
  ('CORE-4-WASTE-GEN', 1, 'C', 6, 'ESSENTIAL', true, 4, 'Total Waste Generated', 'metric_tonnes', 'RAW', 'EHS', 'Hazardous and non-hazardous operational waste registers', DATE '2024-04-01'),
  ('CORE-5-SAFETY-LTIFR', 1, 'C', 3, 'ESSENTIAL', true, 5, 'Lost Time Injury Frequency Rate (LTIFR)', 'rate', 'CALCULATED', 'EHS', 'Safety incident logs per million person-hours worked', DATE '2024-04-01'),
  ('CORE-6-GENDER-PARITY', 1, 'C', 5, 'ESSENTIAL', true, 6, 'Female Wage & Headcount Representation', 'percentage', 'CALCULATED', 'HR', 'Consolidated gender payroll and workforce records', DATE '2024-04-01'),
  ('CORE-7-MSME-PROC', 1, 'C', 8, 'ESSENTIAL', true, 7, 'Purchases from MSMEs and Small Producers', 'INR', 'RAW', 'Procurement', 'Verified Udyam vendor purchase ledger', DATE '2024-04-01'),
  ('CORE-8-PAYABLE-DAYS', 1, 'A', 1, 'ESSENTIAL', true, 8, 'Accounts Payable Turnaround Days', 'days', 'CALCULATED', 'Finance', 'Statutory payable-days formula: (Accounts Payable / Cost of Procurement) * 365', DATE '2024-04-01'),
  ('CORE-9-RPT-SHARE', 1, 'A', 1, 'ESSENTIAL', true, 9, 'Related Party Transactions Share', 'percentage', 'CALCULATED', 'Legal & Secretarial', 'Ind AS 24 statutory RPT disclosure vs balance sheet total', DATE '2024-04-01')
ON CONFLICT (code, version) DO NOTHING;

-- 4. BACKFILL ORGANISATIONS HIERARCHY ----------------------------------------

-- 4a. Group becomes parent company
INSERT INTO company (name, valid_from, legacy_organisation_id, cin)
SELECT o.name, DATE '2024-04-01', o.id, 'U45200TG1989PLC013058'
FROM organisations o
WHERE o.type = 'GROUP'
  AND NOT EXISTS (SELECT 1 FROM company c WHERE c.legacy_organisation_id = o.id);

-- 4b. Subsidiaries become child companies
INSERT INTO company (name, valid_from, legacy_organisation_id, parent_company_id, cin)
SELECT o.name, DATE '2024-04-01', o.id, g.company_id, 'U45200TG2006PLC051234'
FROM organisations o
JOIN company g ON g.legacy_organisation_id = o.parent_id
WHERE o.type = 'SUBSIDIARY'
  AND NOT EXISTS (SELECT 1 FROM company c WHERE c.legacy_organisation_id = o.id);

-- 4c. Business Units and Projects become physical / reporting Sites
-- Recursive CTE to find nearest company ancestor
WITH RECURSIVE up AS (
    SELECT o.id AS org_id, o.id AS cur_id, o.parent_id, o.type
    FROM organisations o 
    WHERE o.type IN ('BUSINESS_UNIT', 'PROJECT')
  UNION ALL
    SELECT up.org_id, p.id, p.parent_id, p.type
    FROM up 
    JOIN organisations p ON p.id = up.parent_id
    WHERE up.type NOT IN ('GROUP', 'SUBSIDIARY')
)
INSERT INTO site (company_id, site_name, legacy_organisation_id, in_boundary, state)
SELECT 
    c.company_id, 
    o.name, 
    o.id, 
    true, 
    o.state
FROM up
JOIN organisations o ON o.id = up.org_id
JOIN company c       ON c.legacy_organisation_id = up.cur_id
WHERE up.type = 'SUBSIDIARY'
ON CONFLICT (company_id, site_name) DO NOTHING;

-- 4d. Default departments per company
INSERT INTO department (company_id, name)
SELECT c.company_id, d.name
FROM company c
CROSS JOIN (VALUES ('EHS'), ('HR'), ('Finance'), ('Procurement'), ('Legal & Secretarial')) AS d(name)
ON CONFLICT (company_id, name) DO NOTHING;

-- 5. BACKFILL EXISTING ACTIVITY_DATA ROWS -------------------------------------

-- Map indicator_id
UPDATE activity_data a
SET indicator_id = i.indicator_id
FROM indicator i
WHERE (i.code = 'P6-E-ELEC' OR i.code = 'CORE-1-S2')
  AND a.sub_item = 'grid_electricity'
  AND a.indicator_id IS NULL;

-- Map site_id
UPDATE activity_data a
SET site_id = s.site_id
FROM site s
WHERE s.legacy_organisation_id = a.organisation_id
  AND a.site_id IS NULL;

-- Map dept_id (Scope 2 electricity belongs to EHS)
UPDATE activity_data a
SET dept_id = d.dept_id
FROM site s
JOIN department d ON d.company_id = s.company_id AND d.name = 'EHS'
WHERE a.site_id = s.site_id 
  AND a.dept_id IS NULL;

-- 6. ATTACH UNIVERSAL AUDIT TRIGGER TO NEW TABLES ----------------------------

DROP TRIGGER IF EXISTS audit_company ON company;
CREATE TRIGGER audit_company
AFTER INSERT OR UPDATE OR DELETE ON company
FOR EACH ROW EXECUTE FUNCTION audit_row();

DROP TRIGGER IF EXISTS audit_department ON department;
CREATE TRIGGER audit_department
AFTER INSERT OR UPDATE OR DELETE ON department
FOR EACH ROW EXECUTE FUNCTION audit_row();

DROP TRIGGER IF EXISTS audit_site ON site;
CREATE TRIGGER audit_site
AFTER INSERT OR UPDATE OR DELETE ON site
FOR EACH ROW EXECUTE FUNCTION audit_row();

DROP TRIGGER IF EXISTS audit_indicator ON indicator;
CREATE TRIGGER audit_indicator
AFTER INSERT OR UPDATE OR DELETE ON indicator
FOR EACH ROW EXECUTE FUNCTION audit_row();

-- 7. INTEGRITY TRIGGER: Department and Site must belong to same Company --------

CREATE OR REPLACE FUNCTION check_activity_hierarchy() RETURNS trigger AS $$
DECLARE 
    s_company INT; 
    d_company INT;
BEGIN
    IF NEW.site_id IS NOT NULL AND NEW.dept_id IS NOT NULL THEN
        SELECT company_id INTO s_company FROM site       WHERE site_id = NEW.site_id;
        SELECT company_id INTO d_company FROM department WHERE dept_id = NEW.dept_id;
        IF s_company IS DISTINCT FROM d_company THEN
            RAISE EXCEPTION 'Hierarchy integrity violation: site % (company %) and department % (company %) belong to different legal entities.',
                            NEW.site_id, s_company, NEW.dept_id, d_company;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS activity_hierarchy_check ON activity_data;
CREATE TRIGGER activity_hierarchy_check
BEFORE INSERT OR UPDATE ON activity_data
FOR EACH ROW EXECUTE FUNCTION check_activity_hierarchy();

-- 8. SANITY VERIFICATION -----------------------------------------------------

DO $$
DECLARE 
    unlinked_cnt INT;
BEGIN
    SELECT count(*) INTO unlinked_cnt 
    FROM activity_data
    WHERE site_id IS NULL OR dept_id IS NULL OR indicator_id IS NULL;
    
    IF unlinked_cnt > 0 THEN 
        RAISE EXCEPTION 'Backfill validation failed: % activity_data rows remain unlinked.', unlinked_cnt; 
    END IF;
END $$;

COMMIT;

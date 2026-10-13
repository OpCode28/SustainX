-- ==============================================================================
-- 1. UNIVERSAL AUDIT TRIGGER FUNCTION
-- Captures table name, action, old/new jsonb, user context, and server clock
-- ==============================================================================
CREATE OR REPLACE FUNCTION audit_row()
RETURNS TRIGGER AS $$
DECLARE
  v_user TEXT;
  v_record_id TEXT;
BEGIN
  -- Resolve user from transaction set_config, fallback to PostgreSQL session_user
  v_user := COALESCE(current_setting('app.user_email', true), session_user);

  IF TG_OP = 'DELETE' THEN
    v_record_id := COALESCE(
      to_jsonb(OLD) ->> 'id',
      to_jsonb(OLD) ->> 'company_id',
      to_jsonb(OLD) ->> 'dept_id',
      to_jsonb(OLD) ->> 'site_id',
      to_jsonb(OLD) ->> 'indicator_id',
      'unknown'
    );
  ELSE
    v_record_id := COALESCE(
      to_jsonb(NEW) ->> 'id',
      to_jsonb(NEW) ->> 'company_id',
      to_jsonb(NEW) ->> 'dept_id',
      to_jsonb(NEW) ->> 'site_id',
      to_jsonb(NEW) ->> 'indicator_id',
      'unknown'
    );
  END IF;

  INSERT INTO audit_logs (
    id,
    table_name,
    record_id,
    action,
    old_value,
    new_value,
    changed_by,
    timestamp
  ) VALUES (
    gen_random_uuid()::TEXT,
    TG_TABLE_NAME,
    v_record_id,
    TG_OP,
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    v_user,
    clock_timestamp()
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Attach audit trigger to core tables
DROP TRIGGER IF EXISTS audit_activity_data ON activity_data;
CREATE TRIGGER audit_activity_data
AFTER INSERT OR UPDATE OR DELETE ON activity_data
FOR EACH ROW EXECUTE FUNCTION audit_row();

DROP TRIGGER IF EXISTS audit_calculation_results ON calculation_results;
CREATE TRIGGER audit_calculation_results
AFTER INSERT OR UPDATE OR DELETE ON calculation_results
FOR EACH ROW EXECUTE FUNCTION audit_row();

DROP TRIGGER IF EXISTS audit_evidence ON evidence;
CREATE TRIGGER audit_evidence
AFTER INSERT OR UPDATE OR DELETE ON evidence
FOR EACH ROW EXECUTE FUNCTION audit_row();

DROP TRIGGER IF EXISTS audit_organisations ON organisations;
CREATE TRIGGER audit_organisations
AFTER INSERT OR UPDATE OR DELETE ON organisations
FOR EACH ROW EXECUTE FUNCTION audit_row();

DROP TRIGGER IF EXISTS audit_department ON department;
CREATE TRIGGER audit_department
AFTER INSERT OR UPDATE OR DELETE ON department
FOR EACH ROW EXECUTE FUNCTION audit_row();

DROP TRIGGER IF EXISTS audit_indicator ON indicator;
CREATE TRIGGER audit_indicator
AFTER INSERT OR UPDATE OR DELETE ON indicator
FOR EACH ROW EXECUTE FUNCTION audit_row();

-- ==============================================================================
-- 1B. HIERARCHY INTEGRITY TRIGGER ON activity_data
-- Ensures department belongs to the filing entity of the organisation
-- ==============================================================================
CREATE OR REPLACE FUNCTION check_activity_hierarchy() RETURNS trigger AS $$
DECLARE fe TEXT; dept_org TEXT;
BEGIN
    IF NEW.department_id IS NOT NULL THEN
        SELECT filing_entity_id INTO fe FROM v_org_filing_entity WHERE org_id = NEW.organisation_id;
        SELECT organisation_id INTO dept_org FROM department WHERE id = NEW.department_id;
        IF fe IS DISTINCT FROM dept_org THEN
            RAISE EXCEPTION 'Department % does not belong to the filing entity of organisation %',
                            NEW.department_id, NEW.organisation_id;
        END IF;
    END IF;
    RETURN NEW;
END $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS activity_hierarchy_check ON activity_data;
CREATE TRIGGER activity_hierarchy_check
BEFORE INSERT OR UPDATE OF organisation_id, department_id ON activity_data
FOR EACH ROW EXECUTE FUNCTION check_activity_hierarchy();


-- ==============================================================================
-- 2. APPEND-ONLY IMMUTABILITY ON audit_logs
-- Rejects any UPDATE or DELETE at the database kernel level
-- ==============================================================================
CREATE OR REPLACE FUNCTION protect_audit_log_immutability()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Statutory assurance violation: audit_logs is append-only. Modification or deletion is strictly forbidden.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_audit_logs ON audit_logs;
CREATE TRIGGER trg_protect_audit_logs
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION protect_audit_log_immutability();


-- ==============================================================================
-- 3. IMMUTABILITY LOCK ON APPROVED ESG RECORDS
-- Rejects any mutation once status is 'APPROVED'
-- ==============================================================================
CREATE OR REPLACE FUNCTION prevent_modifying_approved_records()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'APPROVED' THEN
    RAISE EXCEPTION 'Cannot update or delete an APPROVED statutory ESG record (ID: %). An authorized correction workflow is required.', OLD.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_lock_approved_activity ON activity_data;
CREATE TRIGGER trg_lock_approved_activity
BEFORE UPDATE OR DELETE ON activity_data
FOR EACH ROW EXECUTE FUNCTION prevent_modifying_approved_records();

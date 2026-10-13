// packages/db/src/schema.ts  -- EXPAND step. Everything new is nullable or has a default.
// Matches your real schema: text ids, existing `organisations` tree reused (no duplicate company/site tables).
import {
  pgTable, text, integer, boolean, numeric, date, unique, check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ---------------------------------------------------------------------------
// 1) ADD these columns inside your existing `organisations` table definition
// ---------------------------------------------------------------------------
//   cin:                 text('cin'),
//   ownershipPct:        numeric('ownership_pct', { precision: 5, scale: 2 }).notNull().default('100'),
//   consolidationMethod: text('consolidation_method').notNull().default('OPERATIONAL_CONTROL'),
//   validFrom:           date('valid_from'),            // fill in backfill, then set NOT NULL later
//   validTo:             date('valid_to'),
//   inBoundary:          boolean('in_boundary').notNull().default(true),
//   isFilingEntity:      boolean('is_filing_entity').notNull().default(false), // the entity that files a BRSR
//
//   and in its table callback:
//   check('org_ownership_range', sql`${t.ownershipPct} BETWEEN 0 AND 100`),
//   check('org_valid_dates', sql`${t.validTo} IS NULL OR ${t.validFrom} IS NULL OR ${t.validTo} > ${t.validFrom}`),

// ---------------------------------------------------------------------------
// 2) NEW tables (put after `organisations` so the reference resolves)
// ---------------------------------------------------------------------------
export const department = pgTable('department', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  organisationId: text('organisation_id').notNull().references(() => organisations.id),
  name: text('name').notNull(),               // EHS, HR, CSR, Procurement ...
}, (t) => [unique('department_org_name_uq').on(t.organisationId, t.name)]);

export const indicator = pgTable('indicator', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  code: text('code').notNull(),               // 'CORE1-SCOPE-2-ELECTRICITY'
  version: integer('version').notNull().default(1),   // new row when a definition changes
  attributeNumber: integer('attribute_number'),       // 1..9 for BRSR Core, null otherwise
  scopeType: text('scope_type'),              // keeps the link to activity_data.scope_type
  subItem: text('sub_item'),                  // keeps the link to activity_data.sub_item
  section: text('section').notNull(),         // A | B | C
  principleNo: integer('principle_no'),
  isBrsrCore: boolean('is_brsr_core').notNull().default(false),
  name: text('name').notNull(),
  unit: text('unit').notNull(),
  kind: text('kind').notNull().default('RAW'),        // RAW | CALCULATED
  methodologyNote: text('methodology_note'),
  effectiveFrom: date('effective_from').notNull(),
  effectiveTo: date('effective_to'),
}, (t) => [
  unique('indicator_code_version_uq').on(t.code, t.version),
  unique('indicator_natural_key_uq').on(t.attributeNumber, t.scopeType, t.subItem, t.version),
  check('indicator_kind_ck', sql`${t.kind} IN ('RAW','CALCULATED')`),
  check('indicator_section_ck', sql`${t.section} IN ('A','B','C')`),
]);

// ---------------------------------------------------------------------------
// 3) ADD these columns inside your existing `activity_data` table definition
// ---------------------------------------------------------------------------
//   indicatorId:  text('indicator_id').references(() => indicator.id),    // NOT NULL in contract step
//   departmentId: text('department_id').references(() => department.id), // NOT NULL in contract step
//   dimension:    text('dimension').notNull().default('ALL'),             // 'Male','Female','Permanent'...
//
//   organisation_id keeps its meaning: the unit (BU/project/site) the number comes from.
//   department_id says who owns the number. The filing entity is derived (see v_org_filing_entity).

// Then:  pnpm drizzle-kit generate           (review the SQL, do not trust renames)
//        pnpm drizzle-kit generate --custom --name=hierarchy_backfill   (paste 0001_hierarchy_backfill.sql)

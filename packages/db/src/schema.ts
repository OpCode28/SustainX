import { 
  pgTable, 
  text, 
  timestamp, 
  numeric, 
  boolean, 
  integer, 
  jsonb, 
  date, 
  unique, 
  check 
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// 1. ORGANISATIONS HIERARCHY (Unified Conglomerate Tree: Group > Subsidiary > BU > Project/Site)
export const organisations = pgTable('organisations', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'GROUP' | 'SUBSIDIARY' | 'BUSINESS_UNIT' | 'PROJECT'
  parentId: text('parent_id'),
  businessVertical: text('business_vertical'),
  country: text('country').default('India'),
  state: text('state'),
  city: text('city'),
  completionRate: integer('completion_rate').default(0),
  status: text('status').default('HEALTHY'), // 'HEALTHY' | 'NEEDS_ATTENTION' | 'PENDING'

  // Statutory Filing & Boundary metadata
  cin: text('cin'),
  ownershipPct: numeric('ownership_pct', { precision: 5, scale: 2 }).notNull().default('100'),
  consolidationMethod: text('consolidation_method').notNull().default('OPERATIONAL_CONTROL'),
  validFrom: date('valid_from'),
  validTo: date('valid_to'),
  inBoundary: boolean('in_boundary').notNull().default(true),
  isFilingEntity: boolean('is_filing_entity').notNull().default(false), // Entity that files BRSR

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  check('org_ownership_range', sql`${t.ownershipPct} BETWEEN 0 AND 100`),
  check('org_valid_dates', sql`${t.validTo} IS NULL OR ${t.validFrom} IS NULL OR ${t.validTo} > ${t.validFrom}`),
]);

// Self-referencing relations for tree hierarchy
export const organisationsRelations = relations(organisations, ({ one, many }) => ({
  parent: one(organisations, {
    fields: [organisations.parentId],
    references: [organisations.id],
    relationName: 'org_hierarchy',
  }),
  children: many(organisations, {
    relationName: 'org_hierarchy',
  }),
  departments: many(department),
  users: many(users),
  activityRecords: many(activityData),
  calculationResults: many(calculationResults),
}));

// ---------- Department Scoped to Organisation ----------
export const department = pgTable('department', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  organisationId: text('organisation_id').notNull().references(() => organisations.id),
  name: text('name').notNull(), // EHS, HR, CSR, Legal & Compliance, Procurement, Finance
}, (t) => [unique('department_org_name_uq').on(t.organisationId, t.name)]);

export const departmentRelations = relations(department, ({ one, many }) => ({
  organisation: one(organisations, {
    fields: [department.organisationId],
    references: [organisations.id],
  }),
  activityRecords: many(activityData),
}));

// ---------- Versioned Indicator Master (BRSR Core & Essential/Leadership) ----------
export const indicator = pgTable('indicator', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  code: text('code').notNull(), // 'CORE1-SCOPE-2-ELECTRICITY'
  version: integer('version').notNull().default(1), // new row when definition changes
  attributeNumber: integer('attribute_number'), // 1..9 for BRSR Core, null otherwise
  scopeType: text('scope_type'), // keeps link to activity_data.scope_type
  subItem: text('sub_item'), // keeps link to activity_data.sub_item
  section: text('section').notNull(), // A | B | C
  principleNo: integer('principle_no'),
  isBrsrCore: boolean('is_brsr_core').notNull().default(false),
  name: text('name').notNull(),
  unit: text('unit').notNull(),
  kind: text('kind').notNull().default('RAW'), // RAW | CALCULATED
  methodologyNote: text('methodology_note'),
  effectiveFrom: date('effective_from').notNull(),
  effectiveTo: date('effective_to'),
  // BRSR Roles & Governance additions:
  ownerRole: text('owner_role').notNull().default('SITE_ENGINEER'), // 'SITE_ENGINEER' | 'SITE_EHS' | 'GROUP_FUNCTION' | 'GROUP_ESG_HEAD'
  levelOfEntry: text('level_of_entry').notNull().default('PROJECT'), // 'PROJECT' | 'SUBSIDIARY' | 'GROUP'
  mandatoryProof: boolean('mandatory_proof').notNull().default(true),
  frequency: text('frequency').notNull().default('MONTHLY'), // 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
}, (t) => [
  unique('indicator_code_version_uq').on(t.code, t.version),
  unique('indicator_natural_key_uq').on(t.attributeNumber, t.scopeType, t.subItem, t.version),
  check('indicator_kind_ck', sql`${t.kind} IN ('RAW','CALCULATED')`),
  check('indicator_section_ck', sql`${t.section} IN ('A','B','C')`),
]);

export const indicatorRelations = relations(indicator, ({ many }) => ({
  activityRecords: many(activityData),
}));

// 2. USERS & RBAC
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  roleId: text('role_id').notNull(), // 'SYS_ADMIN' | 'GROUP_ESG_HEAD' | 'GROUP_FUNCTION' | 'BOARD_APPROVER' | 'SUB_ESG_MANAGER' | 'BU_COORDINATOR' | 'PROJECT_MANAGER' | 'SITE_ENGINEER' | 'SITE_EHS' | 'AUDITOR'
  organisationId: text('organisation_id').references(() => organisations.id).notNull(),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true).notNull(),
  firstLogin: boolean('first_login').default(false).notNull(),
  mfaEnabled: boolean('mfa_enabled').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  organisation: one(organisations, {
    fields: [users.organisationId],
    references: [organisations.id],
  }),
  scopes: many(userOrganisationScopes),
  roles: many(userRoles),
}));

// User Roles & Node Assignment (Multi-Role Node Bindings)
export const userRoles = pgTable('user_roles', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'SYS_ADMIN' | 'GROUP_ESG_HEAD' | 'GROUP_FUNCTION' | 'BOARD_APPROVER' | 'SUB_ESG_MANAGER' | 'BU_COORDINATOR' | 'PROJECT_MANAGER' | 'SITE_ENGINEER' | 'SITE_EHS' | 'AUDITOR'
  nodeId: text('node_id').notNull().references(() => organisations.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  unique('user_roles_user_role_node_uq').on(t.userId, t.role, t.nodeId)
]);

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  node: one(organisations, {
    fields: [userRoles.nodeId],
    references: [organisations.id],
  }),
}));

// User Explicit Scopes (Optional Multi-Unit Mapping & Boundary Scoping)
export const userOrganisationScopes = pgTable('user_organisation_scopes', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  userId: text('user_id').notNull().references(() => users.id),
  organisationId: text('organisation_id').notNull().references(() => organisations.id),
  scopeRole: text('scope_role').default('MEMBER').notNull(), // 'MEMBER' | 'LEAD'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userOrganisationScopesRelations = relations(userOrganisationScopes, ({ one }) => ({
  user: one(users, {
    fields: [userOrganisationScopes.userId],
    references: [users.id],
  }),
  organisation: one(organisations, {
    fields: [userOrganisationScopes.organisationId],
    references: [organisations.id],
  }),
}));

// 3. REPORTING PERIODS
export const reportingPeriods = pgTable('reporting_periods', {
  id: text('id').primaryKey(),
  financialYear: text('financial_year').notNull(), // 'FY 2026-27'
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  status: text('status').default('OPEN').notNull(), // 'OPEN' | 'CLOSED' | 'ARCHIVED'
  isCurrent: boolean('is_current').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. REGULATORY EMISSION FACTORS (CEA, DEFRA, IPCC)
export const emissionFactors = pgTable('emission_factors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(), // 'SCOPE_1' | 'SCOPE_2' | 'SCOPE_3'
  fuelOrActivity: text('fuel_or_activity').notNull(), // e.g. 'grid_electricity', 'stationary_diesel'
  factorValue: numeric('factor_value', { precision: 12, scale: 6 }).notNull(), // string in TS
  unit: text('unit').notNull(), // e.g. 'kgCO2e/kWh', 'kgCO2e/liter'
  source: text('source').notNull(), // 'CEA_INDIA_V20', 'DEFRA_2024', 'IPCC'
  versionYear: integer('version_year').default(2024).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 5. ACTIVITY DATA COLLECTION (The "Collect" Step)
export const activityData = pgTable('activity_data', {
  id: text('id').primaryKey(),
  organisationId: text('organisation_id').references(() => organisations.id).notNull(),
  reportingPeriodId: text('reporting_period_id').references(() => reportingPeriods.id).notNull(),
  attributeNumber: integer('attribute_number').notNull(), // 1 to 9 (from BRSR Core PDF)
  scopeType: text('scope_type').notNull(), // 'SCOPE_1' | 'SCOPE_2' | 'SCOPE_3' | 'WATER' | 'WASTE' | etc.
  subItem: text('sub_item').notNull(), // e.g. 'grid_electricity', 'stationary_diesel'
  quantity: numeric('quantity', { precision: 16, scale: 4 }).notNull(), // string in TS
  unit: text('unit').notNull(), // 'kWh', 'liters', 'KL', 'metric_tonnes'
  evidenceFileId: text('evidence_file_id'),
  status: text('status').default('DRAFT').notNull(), // 'DRAFT' | 'SUBMITTED' | 'PROJECT_APPROVED' | 'BU_APPROVED' | 'SUBSIDIARY_APPROVED' | 'GROUP_APPROVED' | 'LOCKED' | 'REJECTED'
  enteredBy: text('entered_by').notNull(),
  approvedBy: text('approved_by'),
  notes: text('notes'),

  // Statutory Workflow Additions:
  rejectionComment: text('rejection_comment'),
  submittedBy: text('submitted_by'),
  reviewedBy: text('reviewed_by'),
  lockedAt: timestamp('locked_at', { withTimezone: true }),
  rawDetails: jsonb('raw_details'),

  // Expand Step: Indicator and Department links
  indicatorId: text('indicator_id').references(() => indicator.id),
  departmentId: text('department_id').references(() => department.id),
  dimension: text('dimension').notNull().default('ALL'),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const activityDataRelations = relations(activityData, ({ one, many }) => ({
  organisation: one(organisations, {
    fields: [activityData.organisationId],
    references: [organisations.id],
  }),
  period: one(reportingPeriods, {
    fields: [activityData.reportingPeriodId],
    references: [reportingPeriods.id],
  }),
  department: one(department, {
    fields: [activityData.departmentId],
    references: [department.id],
  }),
  indicator: one(indicator, {
    fields: [activityData.indicatorId],
    references: [indicator.id],
  }),
  evidenceFiles: many(evidence),
  approvals: many(approvals),
}));

// 6. CALCULATION RESULTS & INTENSITY (The "Convert" & "Scale" Step)
export const calculationResults = pgTable('calculation_results', {
  id: text('id').primaryKey(),
  organisationId: text('organisation_id').references(() => organisations.id).notNull(),
  reportingPeriodId: text('reporting_period_id').references(() => reportingPeriods.id).notNull(),
  scope1_tco2e: numeric('scope1_tco2e', { precision: 16, scale: 4 }).default('0.0000').notNull(),
  scope2_tco2e: numeric('scope2_tco2e', { precision: 16, scale: 4 }).default('0.0000').notNull(),
  scope3_tco2e: numeric('scope3_tco2e', { precision: 16, scale: 4 }).default('0.0000').notNull(),
  totalGhg_tco2e: numeric('total_ghg_tco2e', { precision: 16, scale: 4 }).default('0.0000').notNull(),
  turnoverInrCrores: numeric('turnover_inr_crores', { precision: 16, scale: 4 }).default('0.0000').notNull(),
  ghgIntensityPerCrore: numeric('ghg_intensity_per_crore', { precision: 14, scale: 6 }).default('0.000000').notNull(),
  calculatedAt: timestamp('calculated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const calculationResultsRelations = relations(calculationResults, ({ one }) => ({
  organisation: one(organisations, {
    fields: [calculationResults.organisationId],
    references: [organisations.id],
  }),
  period: one(reportingPeriods, {
    fields: [calculationResults.reportingPeriodId],
    references: [reportingPeriods.id],
  }),
}));

// 7. EVIDENCE & SOURCE RECORDS (Auditor Traceability)
export const evidence = pgTable('evidence', {
  id: text('id').primaryKey(),
  activityDataId: text('activity_data_id').references(() => activityData.id),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  fileType: text('file_type').notNull(),
  fileSize: integer('file_size').notNull(), // in bytes
  fileHash: text('file_hash').notNull(), // SHA-256 hash
  documentType: text('document_type').notNull(), // e.g. 'electricity_bill', 'fuel_invoice', 'weighbridge_slip'
  uploadedBy: text('uploaded_by').notNull(),
  uploadedByName: text('uploaded_by_name').notNull(),
  verificationStatus: text('verification_status').default('VERIFIED').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const evidenceRelations = relations(evidence, ({ one }) => ({
  activityData: one(activityData, {
    fields: [evidence.activityDataId],
    references: [activityData.id],
  }),
}));

// 7.1 STATUTORY MULTI-TIER APPROVAL TRAIL
export const approvals = pgTable('approvals', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
  entryId: text('entry_id').notNull().references(() => activityData.id, { onDelete: 'cascade' }),
  level: text('level').notNull(), // 'PROJECT' | 'BU' | 'SUBSIDIARY' | 'GROUP' | 'BOARD'
  action: text('action').notNull(), // 'APPROVE' | 'REJECT' | 'UNLOCK'
  comment: text('comment'),
  by: text('by').notNull(),
  byName: text('by_name'),
  at: timestamp('at', { withTimezone: true }).defaultNow().notNull(),
});

export const approvalsRelations = relations(approvals, ({ one }) => ({
  entry: one(activityData, {
    fields: [approvals.entryId],
    references: [activityData.id],
  }),
}));

// 8. IMMUTABLE APPEND-ONLY AUDIT LOGS (Kernel-Level Tamper-Evident Ledger)
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  tableName: text('table_name').notNull(),
  recordId: text('record_id').notNull(),
  action: text('action').notNull(), // 'INSERT' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'SUBMIT' | 'APPROVE' | 'REJECT' | 'LOCK' | 'UNLOCK'
  oldValue: jsonb('old_value'),
  newValue: jsonb('new_value'),
  reason: text('reason'),
  changedBy: text('changed_by').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
});

// Aliases for Domain Consistency
export const orgNodes = organisations;
export const indicators = indicator;
export const entries = activityData;
export const factors = emissionFactors;

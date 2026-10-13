"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factors = exports.entries = exports.indicators = exports.orgNodes = exports.auditLogs = exports.approvalsRelations = exports.approvals = exports.evidenceRelations = exports.evidence = exports.calculationResultsRelations = exports.calculationResults = exports.activityDataRelations = exports.activityData = exports.emissionFactors = exports.reportingPeriods = exports.userOrganisationScopesRelations = exports.userOrganisationScopes = exports.userRolesRelations = exports.userRoles = exports.usersRelations = exports.users = exports.indicatorRelations = exports.indicator = exports.departmentRelations = exports.department = exports.organisationsRelations = exports.organisations = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// 1. ORGANISATIONS HIERARCHY (Unified Conglomerate Tree: Group > Subsidiary > BU > Project/Site)
exports.organisations = (0, pg_core_1.pgTable)('organisations', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    code: (0, pg_core_1.text)('code').notNull(),
    name: (0, pg_core_1.text)('name').notNull(),
    type: (0, pg_core_1.text)('type').notNull(), // 'GROUP' | 'SUBSIDIARY' | 'BUSINESS_UNIT' | 'PROJECT'
    parentId: (0, pg_core_1.text)('parent_id'),
    businessVertical: (0, pg_core_1.text)('business_vertical'),
    country: (0, pg_core_1.text)('country').default('India'),
    state: (0, pg_core_1.text)('state'),
    city: (0, pg_core_1.text)('city'),
    completionRate: (0, pg_core_1.integer)('completion_rate').default(0),
    status: (0, pg_core_1.text)('status').default('HEALTHY'), // 'HEALTHY' | 'NEEDS_ATTENTION' | 'PENDING'
    // Statutory Filing & Boundary metadata
    cin: (0, pg_core_1.text)('cin'),
    ownershipPct: (0, pg_core_1.numeric)('ownership_pct', { precision: 5, scale: 2 }).notNull().default('100'),
    consolidationMethod: (0, pg_core_1.text)('consolidation_method').notNull().default('OPERATIONAL_CONTROL'),
    validFrom: (0, pg_core_1.date)('valid_from'),
    validTo: (0, pg_core_1.date)('valid_to'),
    inBoundary: (0, pg_core_1.boolean)('in_boundary').notNull().default(true),
    isFilingEntity: (0, pg_core_1.boolean)('is_filing_entity').notNull().default(false), // Entity that files BRSR
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
    (0, pg_core_1.check)('org_ownership_range', (0, drizzle_orm_1.sql) `${t.ownershipPct} BETWEEN 0 AND 100`),
    (0, pg_core_1.check)('org_valid_dates', (0, drizzle_orm_1.sql) `${t.validTo} IS NULL OR ${t.validFrom} IS NULL OR ${t.validTo} > ${t.validFrom}`),
]);
// Self-referencing relations for tree hierarchy
exports.organisationsRelations = (0, drizzle_orm_1.relations)(exports.organisations, ({ one, many }) => ({
    parent: one(exports.organisations, {
        fields: [exports.organisations.parentId],
        references: [exports.organisations.id],
        relationName: 'org_hierarchy',
    }),
    children: many(exports.organisations, {
        relationName: 'org_hierarchy',
    }),
    departments: many(exports.department),
    users: many(exports.users),
    activityRecords: many(exports.activityData),
    calculationResults: many(exports.calculationResults),
}));
// ---------- Department Scoped to Organisation ----------
exports.department = (0, pg_core_1.pgTable)('department', {
    id: (0, pg_core_1.text)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()::text`),
    organisationId: (0, pg_core_1.text)('organisation_id').notNull().references(() => exports.organisations.id),
    name: (0, pg_core_1.text)('name').notNull(), // EHS, HR, CSR, Legal & Compliance, Procurement, Finance
}, (t) => [(0, pg_core_1.unique)('department_org_name_uq').on(t.organisationId, t.name)]);
exports.departmentRelations = (0, drizzle_orm_1.relations)(exports.department, ({ one, many }) => ({
    organisation: one(exports.organisations, {
        fields: [exports.department.organisationId],
        references: [exports.organisations.id],
    }),
    activityRecords: many(exports.activityData),
}));
// ---------- Versioned Indicator Master (BRSR Core & Essential/Leadership) ----------
exports.indicator = (0, pg_core_1.pgTable)('indicator', {
    id: (0, pg_core_1.text)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()::text`),
    code: (0, pg_core_1.text)('code').notNull(), // 'CORE1-SCOPE-2-ELECTRICITY'
    version: (0, pg_core_1.integer)('version').notNull().default(1), // new row when definition changes
    attributeNumber: (0, pg_core_1.integer)('attribute_number'), // 1..9 for BRSR Core, null otherwise
    scopeType: (0, pg_core_1.text)('scope_type'), // keeps link to activity_data.scope_type
    subItem: (0, pg_core_1.text)('sub_item'), // keeps link to activity_data.sub_item
    section: (0, pg_core_1.text)('section').notNull(), // A | B | C
    principleNo: (0, pg_core_1.integer)('principle_no'),
    isBrsrCore: (0, pg_core_1.boolean)('is_brsr_core').notNull().default(false),
    name: (0, pg_core_1.text)('name').notNull(),
    unit: (0, pg_core_1.text)('unit').notNull(),
    kind: (0, pg_core_1.text)('kind').notNull().default('RAW'), // RAW | CALCULATED
    methodologyNote: (0, pg_core_1.text)('methodology_note'),
    effectiveFrom: (0, pg_core_1.date)('effective_from').notNull(),
    effectiveTo: (0, pg_core_1.date)('effective_to'),
    // BRSR Roles & Governance additions:
    ownerRole: (0, pg_core_1.text)('owner_role').notNull().default('SITE_ENGINEER'), // 'SITE_ENGINEER' | 'SITE_EHS' | 'GROUP_FUNCTION' | 'GROUP_ESG_HEAD'
    levelOfEntry: (0, pg_core_1.text)('level_of_entry').notNull().default('PROJECT'), // 'PROJECT' | 'SUBSIDIARY' | 'GROUP'
    mandatoryProof: (0, pg_core_1.boolean)('mandatory_proof').notNull().default(true),
    frequency: (0, pg_core_1.text)('frequency').notNull().default('MONTHLY'), // 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
}, (t) => [
    (0, pg_core_1.unique)('indicator_code_version_uq').on(t.code, t.version),
    (0, pg_core_1.unique)('indicator_natural_key_uq').on(t.attributeNumber, t.scopeType, t.subItem, t.version),
    (0, pg_core_1.check)('indicator_kind_ck', (0, drizzle_orm_1.sql) `${t.kind} IN ('RAW','CALCULATED')`),
    (0, pg_core_1.check)('indicator_section_ck', (0, drizzle_orm_1.sql) `${t.section} IN ('A','B','C')`),
]);
exports.indicatorRelations = (0, drizzle_orm_1.relations)(exports.indicator, ({ many }) => ({
    activityRecords: many(exports.activityData),
}));
// 2. USERS & RBAC
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    passwordHash: (0, pg_core_1.text)('password_hash').notNull(),
    fullName: (0, pg_core_1.text)('full_name').notNull(),
    roleId: (0, pg_core_1.text)('role_id').notNull(), // 'SYS_ADMIN' | 'GROUP_ESG_HEAD' | 'GROUP_FUNCTION' | 'BOARD_APPROVER' | 'SUB_ESG_MANAGER' | 'BU_COORDINATOR' | 'PROJECT_MANAGER' | 'SITE_ENGINEER' | 'SITE_EHS' | 'AUDITOR'
    organisationId: (0, pg_core_1.text)('organisation_id').references(() => exports.organisations.id).notNull(),
    avatarUrl: (0, pg_core_1.text)('avatar_url'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    firstLogin: (0, pg_core_1.boolean)('first_login').default(false).notNull(),
    mfaEnabled: (0, pg_core_1.boolean)('mfa_enabled').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ one, many }) => ({
    organisation: one(exports.organisations, {
        fields: [exports.users.organisationId],
        references: [exports.organisations.id],
    }),
    scopes: many(exports.userOrganisationScopes),
    roles: many(exports.userRoles),
}));
// User Roles & Node Assignment (Multi-Role Node Bindings)
exports.userRoles = (0, pg_core_1.pgTable)('user_roles', {
    id: (0, pg_core_1.text)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()::text`),
    userId: (0, pg_core_1.text)('user_id').notNull().references(() => exports.users.id, { onDelete: 'cascade' }),
    role: (0, pg_core_1.text)('role').notNull(), // 'SYS_ADMIN' | 'GROUP_ESG_HEAD' | 'GROUP_FUNCTION' | 'BOARD_APPROVER' | 'SUB_ESG_MANAGER' | 'BU_COORDINATOR' | 'PROJECT_MANAGER' | 'SITE_ENGINEER' | 'SITE_EHS' | 'AUDITOR'
    nodeId: (0, pg_core_1.text)('node_id').notNull().references(() => exports.organisations.id, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
    (0, pg_core_1.unique)('user_roles_user_role_node_uq').on(t.userId, t.role, t.nodeId)
]);
exports.userRolesRelations = (0, drizzle_orm_1.relations)(exports.userRoles, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.userRoles.userId],
        references: [exports.users.id],
    }),
    node: one(exports.organisations, {
        fields: [exports.userRoles.nodeId],
        references: [exports.organisations.id],
    }),
}));
// User Explicit Scopes (Optional Multi-Unit Mapping & Boundary Scoping)
exports.userOrganisationScopes = (0, pg_core_1.pgTable)('user_organisation_scopes', {
    id: (0, pg_core_1.text)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()::text`),
    userId: (0, pg_core_1.text)('user_id').notNull().references(() => exports.users.id),
    organisationId: (0, pg_core_1.text)('organisation_id').notNull().references(() => exports.organisations.id),
    scopeRole: (0, pg_core_1.text)('scope_role').default('MEMBER').notNull(), // 'MEMBER' | 'LEAD'
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.userOrganisationScopesRelations = (0, drizzle_orm_1.relations)(exports.userOrganisationScopes, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.userOrganisationScopes.userId],
        references: [exports.users.id],
    }),
    organisation: one(exports.organisations, {
        fields: [exports.userOrganisationScopes.organisationId],
        references: [exports.organisations.id],
    }),
}));
// 3. REPORTING PERIODS
exports.reportingPeriods = (0, pg_core_1.pgTable)('reporting_periods', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    financialYear: (0, pg_core_1.text)('financial_year').notNull(), // 'FY 2026-27'
    startDate: (0, pg_core_1.text)('start_date').notNull(),
    endDate: (0, pg_core_1.text)('end_date').notNull(),
    status: (0, pg_core_1.text)('status').default('OPEN').notNull(), // 'OPEN' | 'CLOSED' | 'ARCHIVED'
    isCurrent: (0, pg_core_1.boolean)('is_current').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
// 4. REGULATORY EMISSION FACTORS (CEA, DEFRA, IPCC)
exports.emissionFactors = (0, pg_core_1.pgTable)('emission_factors', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    category: (0, pg_core_1.text)('category').notNull(), // 'SCOPE_1' | 'SCOPE_2' | 'SCOPE_3'
    fuelOrActivity: (0, pg_core_1.text)('fuel_or_activity').notNull(), // e.g. 'grid_electricity', 'stationary_diesel'
    factorValue: (0, pg_core_1.numeric)('factor_value', { precision: 12, scale: 6 }).notNull(), // string in TS
    unit: (0, pg_core_1.text)('unit').notNull(), // e.g. 'kgCO2e/kWh', 'kgCO2e/liter'
    source: (0, pg_core_1.text)('source').notNull(), // 'CEA_INDIA_V20', 'DEFRA_2024', 'IPCC'
    versionYear: (0, pg_core_1.integer)('version_year').default(2024).notNull(),
    description: (0, pg_core_1.text)('description'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
// 5. ACTIVITY DATA COLLECTION (The "Collect" Step)
exports.activityData = (0, pg_core_1.pgTable)('activity_data', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    organisationId: (0, pg_core_1.text)('organisation_id').references(() => exports.organisations.id).notNull(),
    reportingPeriodId: (0, pg_core_1.text)('reporting_period_id').references(() => exports.reportingPeriods.id).notNull(),
    attributeNumber: (0, pg_core_1.integer)('attribute_number').notNull(), // 1 to 9 (from BRSR Core PDF)
    scopeType: (0, pg_core_1.text)('scope_type').notNull(), // 'SCOPE_1' | 'SCOPE_2' | 'SCOPE_3' | 'WATER' | 'WASTE' | etc.
    subItem: (0, pg_core_1.text)('sub_item').notNull(), // e.g. 'grid_electricity', 'stationary_diesel'
    quantity: (0, pg_core_1.numeric)('quantity', { precision: 16, scale: 4 }).notNull(), // string in TS
    unit: (0, pg_core_1.text)('unit').notNull(), // 'kWh', 'liters', 'KL', 'metric_tonnes'
    evidenceFileId: (0, pg_core_1.text)('evidence_file_id'),
    status: (0, pg_core_1.text)('status').default('DRAFT').notNull(), // 'DRAFT' | 'SUBMITTED' | 'PROJECT_APPROVED' | 'BU_APPROVED' | 'SUBSIDIARY_APPROVED' | 'GROUP_APPROVED' | 'LOCKED' | 'REJECTED'
    enteredBy: (0, pg_core_1.text)('entered_by').notNull(),
    approvedBy: (0, pg_core_1.text)('approved_by'),
    notes: (0, pg_core_1.text)('notes'),
    // Statutory Workflow Additions:
    rejectionComment: (0, pg_core_1.text)('rejection_comment'),
    submittedBy: (0, pg_core_1.text)('submitted_by'),
    reviewedBy: (0, pg_core_1.text)('reviewed_by'),
    lockedAt: (0, pg_core_1.timestamp)('locked_at', { withTimezone: true }),
    rawDetails: (0, pg_core_1.jsonb)('raw_details'),
    // Expand Step: Indicator and Department links
    indicatorId: (0, pg_core_1.text)('indicator_id').references(() => exports.indicator.id),
    departmentId: (0, pg_core_1.text)('department_id').references(() => exports.department.id),
    dimension: (0, pg_core_1.text)('dimension').notNull().default('ALL'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.activityDataRelations = (0, drizzle_orm_1.relations)(exports.activityData, ({ one, many }) => ({
    organisation: one(exports.organisations, {
        fields: [exports.activityData.organisationId],
        references: [exports.organisations.id],
    }),
    period: one(exports.reportingPeriods, {
        fields: [exports.activityData.reportingPeriodId],
        references: [exports.reportingPeriods.id],
    }),
    department: one(exports.department, {
        fields: [exports.activityData.departmentId],
        references: [exports.department.id],
    }),
    indicator: one(exports.indicator, {
        fields: [exports.activityData.indicatorId],
        references: [exports.indicator.id],
    }),
    evidenceFiles: many(exports.evidence),
    approvals: many(exports.approvals),
}));
// 6. CALCULATION RESULTS & INTENSITY (The "Convert" & "Scale" Step)
exports.calculationResults = (0, pg_core_1.pgTable)('calculation_results', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    organisationId: (0, pg_core_1.text)('organisation_id').references(() => exports.organisations.id).notNull(),
    reportingPeriodId: (0, pg_core_1.text)('reporting_period_id').references(() => exports.reportingPeriods.id).notNull(),
    scope1_tco2e: (0, pg_core_1.numeric)('scope1_tco2e', { precision: 16, scale: 4 }).default('0.0000').notNull(),
    scope2_tco2e: (0, pg_core_1.numeric)('scope2_tco2e', { precision: 16, scale: 4 }).default('0.0000').notNull(),
    scope3_tco2e: (0, pg_core_1.numeric)('scope3_tco2e', { precision: 16, scale: 4 }).default('0.0000').notNull(),
    totalGhg_tco2e: (0, pg_core_1.numeric)('total_ghg_tco2e', { precision: 16, scale: 4 }).default('0.0000').notNull(),
    turnoverInrCrores: (0, pg_core_1.numeric)('turnover_inr_crores', { precision: 16, scale: 4 }).default('0.0000').notNull(),
    ghgIntensityPerCrore: (0, pg_core_1.numeric)('ghg_intensity_per_crore', { precision: 14, scale: 6 }).default('0.000000').notNull(),
    calculatedAt: (0, pg_core_1.timestamp)('calculated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.calculationResultsRelations = (0, drizzle_orm_1.relations)(exports.calculationResults, ({ one }) => ({
    organisation: one(exports.organisations, {
        fields: [exports.calculationResults.organisationId],
        references: [exports.organisations.id],
    }),
    period: one(exports.reportingPeriods, {
        fields: [exports.calculationResults.reportingPeriodId],
        references: [exports.reportingPeriods.id],
    }),
}));
// 7. EVIDENCE & SOURCE RECORDS (Auditor Traceability)
exports.evidence = (0, pg_core_1.pgTable)('evidence', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    activityDataId: (0, pg_core_1.text)('activity_data_id').references(() => exports.activityData.id),
    fileName: (0, pg_core_1.text)('file_name').notNull(),
    filePath: (0, pg_core_1.text)('file_path').notNull(),
    fileType: (0, pg_core_1.text)('file_type').notNull(),
    fileSize: (0, pg_core_1.integer)('file_size').notNull(), // in bytes
    fileHash: (0, pg_core_1.text)('file_hash').notNull(), // SHA-256 hash
    documentType: (0, pg_core_1.text)('document_type').notNull(), // e.g. 'electricity_bill', 'fuel_invoice', 'weighbridge_slip'
    uploadedBy: (0, pg_core_1.text)('uploaded_by').notNull(),
    uploadedByName: (0, pg_core_1.text)('uploaded_by_name').notNull(),
    verificationStatus: (0, pg_core_1.text)('verification_status').default('VERIFIED').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.evidenceRelations = (0, drizzle_orm_1.relations)(exports.evidence, ({ one }) => ({
    activityData: one(exports.activityData, {
        fields: [exports.evidence.activityDataId],
        references: [exports.activityData.id],
    }),
}));
// 7.1 STATUTORY MULTI-TIER APPROVAL TRAIL
exports.approvals = (0, pg_core_1.pgTable)('approvals', {
    id: (0, pg_core_1.text)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()::text`),
    entryId: (0, pg_core_1.text)('entry_id').notNull().references(() => exports.activityData.id, { onDelete: 'cascade' }),
    level: (0, pg_core_1.text)('level').notNull(), // 'PROJECT' | 'BU' | 'SUBSIDIARY' | 'GROUP' | 'BOARD'
    action: (0, pg_core_1.text)('action').notNull(), // 'APPROVE' | 'REJECT' | 'UNLOCK'
    comment: (0, pg_core_1.text)('comment'),
    by: (0, pg_core_1.text)('by').notNull(),
    byName: (0, pg_core_1.text)('by_name'),
    at: (0, pg_core_1.timestamp)('at', { withTimezone: true }).defaultNow().notNull(),
});
exports.approvalsRelations = (0, drizzle_orm_1.relations)(exports.approvals, ({ one }) => ({
    entry: one(exports.activityData, {
        fields: [exports.approvals.entryId],
        references: [exports.activityData.id],
    }),
}));
// 8. IMMUTABLE APPEND-ONLY AUDIT LOGS (Kernel-Level Tamper-Evident Ledger)
exports.auditLogs = (0, pg_core_1.pgTable)('audit_logs', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    tableName: (0, pg_core_1.text)('table_name').notNull(),
    recordId: (0, pg_core_1.text)('record_id').notNull(),
    action: (0, pg_core_1.text)('action').notNull(), // 'INSERT' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'SUBMIT' | 'APPROVE' | 'REJECT' | 'LOCK' | 'UNLOCK'
    oldValue: (0, pg_core_1.jsonb)('old_value'),
    newValue: (0, pg_core_1.jsonb)('new_value'),
    reason: (0, pg_core_1.text)('reason'),
    changedBy: (0, pg_core_1.text)('changed_by').notNull(),
    timestamp: (0, pg_core_1.timestamp)('timestamp', { withTimezone: true }).defaultNow().notNull(),
});
// Aliases for Domain Consistency
exports.orgNodes = exports.organisations;
exports.indicators = exports.indicator;
exports.entries = exports.activityData;
exports.factors = exports.emissionFactors;
//# sourceMappingURL=schema.js.map
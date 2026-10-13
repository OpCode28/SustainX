import { db, sqlClient } from './client';
import { 
  organisations, 
  users, 
  userRoles,
  reportingPeriods, 
  emissionFactors, 
  activityData, 
  calculationResults,
  department,
  indicator
} from './schema';
import { OFFICIAL_EMISSION_FACTORS } from '@brsr/shared';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

async function seed() {
  console.log('🌱 Starting MEIL ESG database seeding in PostgreSQL 17 (Phase 1: Roles & Tree)...');

  // 0. Ensure base tables exist from 0000 migration if running on a fresh database
  try {
    const tableCheck = await sqlClient`
      SELECT to_regclass('public.users') as has_users;
    `;
    if (!tableCheck[0]?.has_users) {
      console.log('📦 Clean database detected. Initializing base schema from 0000 migration...');
      const initSqlPath = path.resolve(__dirname, '../drizzle/0000_lame_layla_miller.sql');
      if (fs.existsSync(initSqlPath)) {
        const initSql = fs.readFileSync(initSqlPath, 'utf-8');
        const statements = initSql.split('--> statement-breakpoint');
        for (const stmt of statements) {
          const trimmed = stmt.trim();
          if (trimmed) {
            try {
              await sqlClient.unsafe(trimmed);
            } catch (e: any) {
              // Ignore if already created
            }
          }
        }
      }
    }
  } catch (err: any) {
    console.warn('Initial schema check notice:', err.message);
  }

  // 0.1 RUN SCHEMA MIGRATIONS / ALTERATIONS
  console.log('📦 Applying table structural migrations for BRSR Roles & Governance...');
  await sqlClient.unsafe(`
    -- Add columns to users if missing
    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS first_login BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN NOT NULL DEFAULT false;

    -- Add columns to indicator if missing
    ALTER TABLE indicator ADD COLUMN IF NOT EXISTS owner_role TEXT NOT NULL DEFAULT 'SITE_ENGINEER';
    ALTER TABLE indicator ADD COLUMN IF NOT EXISTS level_of_entry TEXT NOT NULL DEFAULT 'PROJECT';
    ALTER TABLE indicator ADD COLUMN IF NOT EXISTS mandatory_proof BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE indicator ADD COLUMN IF NOT EXISTS frequency TEXT NOT NULL DEFAULT 'MONTHLY';

    -- Add columns to activity_data if missing
    ALTER TABLE activity_data ADD COLUMN IF NOT EXISTS rejection_comment TEXT;
    ALTER TABLE activity_data ADD COLUMN IF NOT EXISTS submitted_by TEXT;
    ALTER TABLE activity_data ADD COLUMN IF NOT EXISTS reviewed_by TEXT;
    ALTER TABLE activity_data ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ;
    ALTER TABLE activity_data ADD COLUMN IF NOT EXISTS raw_details JSONB;

    -- Add column to audit_logs if missing
    ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS reason TEXT;

    -- Create user_roles table if missing
    CREATE TABLE IF NOT EXISTS user_roles (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      node_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT user_roles_user_role_node_uq UNIQUE (user_id, role, node_id)
    );

    -- Create approvals table if missing
    CREATE TABLE IF NOT EXISTS approvals (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      entry_id TEXT NOT NULL REFERENCES activity_data(id) ON DELETE CASCADE,
      level TEXT NOT NULL,
      action TEXT NOT NULL,
      comment TEXT,
      by TEXT NOT NULL,
      by_name TEXT,
      at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log('✅ Schema structural migrations verified.');

  // 1. APPLY DATABASE TRIGGERS
  console.log('🛡️ Applying database triggers (audit_row, immutability, and lock)...');
  const triggerSqlPath = path.resolve(__dirname, 'triggers.sql');
  const triggerSql = fs.readFileSync(triggerSqlPath, 'utf8');
  await sqlClient.unsafe(triggerSql);
  console.log('✅ PostgreSQL triggers successfully installed.');

  // 2. SEED ORGANISATIONS (Unified Conglomerate Tree)
  console.log('🏢 Seeding MEIL Conglomerate Organisation Hierarchy...');
  await db.insert(organisations).values([
    {
      id: 'meil-group',
      code: 'MEIL-HQ',
      name: 'MEIL Group (Corporate HQ)',
      type: 'GROUP',
      parentId: null,
      businessVertical: 'Corporate HQ',
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      completionRate: 89,
      status: 'HEALTHY',
      cin: 'U45200TG1989PLC013058',
      ownershipPct: '100.00',
      consolidationMethod: 'OPERATIONAL_CONTROL',
      validFrom: '2024-04-01',
      inBoundary: true,
      isFilingEntity: false,
    },
    {
      id: 'sub-infra',
      code: 'MEIL-INFRA',
      name: 'MEIL Infrastructure Projects Ltd',
      type: 'SUBSIDIARY',
      parentId: 'meil-group',
      businessVertical: 'Heavy Civil & Transportation',
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      completionRate: 84,
      status: 'HEALTHY',
      cin: 'U45200TG2006PLC051234',
      ownershipPct: '100.00',
      consolidationMethod: 'OPERATIONAL_CONTROL',
      validFrom: '2024-04-01',
      inBoundary: true,
      isFilingEntity: true, // Key BRSR filing entity
    },
    {
      id: 'bu-infra-metro',
      code: 'BU-METRO',
      name: 'Metro & Rail Business Unit',
      type: 'BUSINESS_UNIT',
      parentId: 'sub-infra',
      businessVertical: 'Urban Transit',
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      completionRate: 92,
      status: 'HEALTHY',
      ownershipPct: '100.00',
      consolidationMethod: 'OPERATIONAL_CONTROL',
      validFrom: '2024-04-01',
      inBoundary: true,
      isFilingEntity: false,
    },
    {
      id: 'proj-alpha',
      code: 'PRJ-ALPHA',
      name: 'Demo Project Alpha (250MW Solar Park)',
      type: 'PROJECT',
      parentId: 'bu-infra-metro',
      businessVertical: 'Clean Energy & Infra',
      country: 'India',
      state: 'Andhra Pradesh',
      city: 'Kurnool',
      completionRate: 94,
      status: 'HEALTHY',
      ownershipPct: '100.00',
      consolidationMethod: 'OPERATIONAL_CONTROL',
      validFrom: '2024-04-01',
      inBoundary: true,
      isFilingEntity: false,
    },
    {
      id: 'proj-beta',
      code: 'PRJ-BETA',
      name: 'Demo Project Beta (High-Speed Tunneling)',
      type: 'PROJECT',
      parentId: 'bu-infra-metro',
      businessVertical: 'Underground Transport',
      country: 'India',
      state: 'Maharashtra',
      city: 'Thane',
      completionRate: 72,
      status: 'NEEDS_ATTENTION',
      ownershipPct: '100.00',
      consolidationMethod: 'OPERATIONAL_CONTROL',
      validFrom: '2024-04-01',
      inBoundary: true,
      isFilingEntity: false,
    },
    {
      id: 'proj-gamma',
      code: 'PRJ-GAMMA',
      name: 'Demo Project Gamma (Underground Metro Line 3)',
      type: 'PROJECT',
      parentId: 'bu-infra-metro',
      businessVertical: 'Urban Transit Rail',
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      completionRate: 65,
      status: 'HEALTHY',
      ownershipPct: '100.00',
      consolidationMethod: 'OPERATIONAL_CONTROL',
      validFrom: '2024-04-01',
      inBoundary: true,
      isFilingEntity: false,
    },
    {
      id: 'sub-water',
      code: 'MEIL-WATER',
      name: 'MEIL Hydro & Water Corp',
      type: 'SUBSIDIARY',
      parentId: 'meil-group',
      businessVertical: 'Water Management & Irrigation',
      country: 'India',
      state: 'Andhra Pradesh',
      city: 'Vijayawada',
      completionRate: 84,
      status: 'NEEDS_ATTENTION',
      ownershipPct: '100.00',
      consolidationMethod: 'OPERATIONAL_CONTROL',
      validFrom: '2024-04-01',
      inBoundary: true,
      isFilingEntity: false,
    },
    {
      id: 'bu-water-irrigation',
      code: 'BU-IRRIGATION',
      name: 'Lift Irrigation Business Unit',
      type: 'BUSINESS_UNIT',
      parentId: 'sub-water',
      businessVertical: 'Irrigation & Pumping Stations',
      country: 'India',
      state: 'Telangana',
      city: 'Karimnagar',
      completionRate: 78,
      status: 'NEEDS_ATTENTION',
      ownershipPct: '100.00',
      consolidationMethod: 'OPERATIONAL_CONTROL',
      validFrom: '2024-04-01',
      inBoundary: true,
      isFilingEntity: false,
    },
    {
      id: 'sub-energy',
      code: 'MEIL-ENERGY',
      name: 'MEIL Clean Energy Ltd',
      type: 'SUBSIDIARY',
      parentId: 'meil-group',
      businessVertical: 'Solar & Wind EPC',
      country: 'India',
      state: 'Gujarat',
      city: 'Ahmedabad',
      completionRate: 95,
      status: 'HEALTHY',
      ownershipPct: '100.00',
      consolidationMethod: 'OPERATIONAL_CONTROL',
      validFrom: '2024-04-01',
      inBoundary: true,
      isFilingEntity: false,
    },
  ]).onConflictDoNothing();

  // 3. SEED REPORTING PERIODS
  console.log('📅 Seeding Reporting Periods...');
  await db.insert(reportingPeriods).values([
    {
      id: 'fy-2026-27',
      financialYear: 'FY 2026-27',
      startDate: '2026-04-01',
      endDate: '2027-03-31',
      status: 'OPEN',
      isCurrent: true,
    },
    {
      id: 'fy-2025-26',
      financialYear: 'FY 2025-26',
      startDate: '2025-04-01',
      endDate: '2026-03-31',
      status: 'CLOSED',
      isCurrent: false,
    },
  ]).onConflictDoNothing();

  // 4. SEED USERS & USER_ROLES (13 Demo Accounts + Existing Aliases)
  console.log('👥 Seeding Statutory Demo Users & user_roles Mappings...');
  
  const DEMO_USERS_MAP = [
    {
      id: 'user-rahul-beta',
      email: 'rahul@meil-infra.demo',
      fullName: 'Rahul Sharma (Site Engg)',
      roleId: 'SITE_ENGINEER',
      organisationId: 'proj-beta',
      passwordHash: 'Meil@2026',
      role: 'SITE_ENGINEER',
      nodeId: 'proj-beta',
    },
    {
      id: 'user-ehs-beta',
      email: 'ehs.beta@meil-infra.demo',
      fullName: 'Vikram Joshi (Site Safety & EHS)',
      roleId: 'SITE_EHS',
      organisationId: 'proj-beta',
      passwordHash: 'Meil@2026',
      role: 'SITE_EHS',
      nodeId: 'proj-beta',
    },
    {
      id: 'user-pm-beta',
      email: 'pm.beta@meil-infra.demo',
      fullName: 'Rajesh Nair (Project Manager - Beta)',
      roleId: 'PROJECT_MANAGER',
      organisationId: 'proj-beta',
      passwordHash: 'Meil@2026',
      role: 'PROJECT_MANAGER',
      nodeId: 'proj-beta',
    },
    {
      id: 'user-pm-gamma',
      email: 'pm.gamma@meil-infra.demo',
      fullName: 'Vikram Rao (Project Manager - Gamma)',
      roleId: 'PROJECT_MANAGER',
      organisationId: 'proj-gamma',
      passwordHash: 'Meil@2026',
      role: 'PROJECT_MANAGER',
      nodeId: 'proj-gamma',
    },
    {
      id: 'user-site-gamma',
      email: 'site.gamma@meil-infra.demo',
      fullName: 'Siddharth Varma (Site Engg - Gamma)',
      roleId: 'SITE_ENGINEER',
      organisationId: 'proj-gamma',
      passwordHash: 'Meil@2026',
      role: 'SITE_ENGINEER',
      nodeId: 'proj-gamma',
    },
    {
      id: 'user-bu-metro',
      email: 'bu.metro@meil-infra.demo',
      fullName: 'Ananya Roy (Metro BU Coordinator)',
      roleId: 'BU_COORDINATOR',
      organisationId: 'bu-infra-metro',
      passwordHash: 'Meil@2026',
      role: 'BU_COORDINATOR',
      nodeId: 'bu-infra-metro',
    },
    {
      id: 'user-bu-lift',
      email: 'bu.lift@meil-water.demo',
      fullName: 'Suresh Rao (Irrigation BU Coordinator)',
      roleId: 'BU_COORDINATOR',
      organisationId: 'bu-water-irrigation',
      passwordHash: 'Meil@2026',
      role: 'BU_COORDINATOR',
      nodeId: 'bu-water-irrigation',
    },
    {
      id: 'user-esg-infra',
      email: 'esg.infra@meil-infra.demo',
      fullName: 'Priya Nair (Sub ESG Manager - Infra)',
      roleId: 'SUB_ESG_MANAGER',
      organisationId: 'sub-infra',
      passwordHash: 'Meil@2026',
      role: 'SUB_ESG_MANAGER',
      nodeId: 'sub-infra',
    },
    {
      id: 'user-esg-hydro',
      email: 'esg.hydro@meil-water.demo',
      fullName: 'Ramesh Patel (Sub ESG Manager - Hydro)',
      roleId: 'SUB_ESG_MANAGER',
      organisationId: 'sub-water',
      passwordHash: 'Meil@2026',
      role: 'SUB_ESG_MANAGER',
      nodeId: 'sub-water',
    },
    {
      id: 'user-cso',
      email: 'cso@meil-group.demo',
      fullName: 'Amit Verma (Chief Sustainability Officer)',
      roleId: 'GROUP_ESG_HEAD',
      organisationId: 'meil-group',
      passwordHash: 'Meil@2026',
      role: 'GROUP_ESG_HEAD',
      nodeId: 'meil-group',
    },
    {
      id: 'user-hr-group',
      email: 'hr@meil-group.demo',
      fullName: 'Sunita Rao (Group HR Head)',
      roleId: 'GROUP_FUNCTION',
      organisationId: 'meil-group',
      passwordHash: 'Meil@2026',
      role: 'GROUP_FUNCTION',
      nodeId: 'meil-group',
    },
    {
      id: 'user-finance-group',
      email: 'finance@meil-group.demo',
      fullName: 'Deepak Singhal (Group Finance & CS)',
      roleId: 'GROUP_FUNCTION',
      organisationId: 'meil-group',
      passwordHash: 'Meil@2026',
      role: 'GROUP_FUNCTION',
      nodeId: 'meil-group',
    },
    {
      id: 'user-board',
      email: 'board@meil-group.demo',
      fullName: 'Justice (Retd.) K. Murthy (Board Approver)',
      roleId: 'BOARD_APPROVER',
      organisationId: 'meil-group',
      passwordHash: 'Meil@2026',
      role: 'BOARD_APPROVER',
      nodeId: 'meil-group',
    },
    {
      id: 'user-auditor',
      email: 'auditor@meil-group.demo',
      fullName: 'Sarah Jenkins (Statutory ESG Assessor)',
      roleId: 'AUDITOR',
      organisationId: 'meil-group',
      passwordHash: 'Meil@2026',
      role: 'AUDITOR',
      nodeId: 'meil-group',
    },
    {
      id: 'user-admin',
      email: 'admin@meil.demo',
      fullName: 'Kiran Reddy (Global System Admin)',
      roleId: 'SYS_ADMIN',
      organisationId: 'meil-group',
      passwordHash: 'Meil@2026',
      role: 'SYS_ADMIN',
      nodeId: 'meil-group',
    },
    // Backwards-compatible aliases
    {
      id: 'user-site-01',
      email: 'rahul.sharma@meil-infra.demo',
      fullName: 'Rahul Sharma (Site Engg)',
      roleId: 'SITE_ENGINEER',
      organisationId: 'proj-beta',
      passwordHash: 'Meil@2026',
      role: 'SITE_ENGINEER',
      nodeId: 'proj-beta',
    },
    {
      id: 'user-esg-01',
      email: 'priya.nair@meil-infra.demo',
      fullName: 'Priya Nair (ESG Lead)',
      roleId: 'SUB_ESG_MANAGER',
      organisationId: 'sub-infra',
      passwordHash: 'Meil@2026',
      role: 'SUB_ESG_MANAGER',
      nodeId: 'sub-infra',
    },
    {
      id: 'user-group-01',
      email: 'amit.verma@meil-group.demo',
      fullName: 'Amit Verma (Chief Sustainability Officer)',
      roleId: 'GROUP_ESG_HEAD',
      organisationId: 'meil-group',
      passwordHash: 'Meil@2026',
      role: 'GROUP_ESG_HEAD',
      nodeId: 'meil-group',
    },
    {
      id: 'user-auditor-01',
      email: 'sarah.jenkins@ernst-audit.demo',
      fullName: 'Sarah Jenkins (Statutory ESG Assessor)',
      roleId: 'AUDITOR',
      organisationId: 'meil-group',
      passwordHash: 'Meil@2026',
      role: 'AUDITOR',
      nodeId: 'meil-group',
    },
    {
      id: 'user-admin-01',
      email: 'admin.esg@meil.demo',
      fullName: 'Kiran Reddy (System Admin)',
      roleId: 'SYS_ADMIN',
      organisationId: 'meil-group',
      passwordHash: 'Meil@2026',
      role: 'SYS_ADMIN',
      nodeId: 'meil-group',
    },
  ];

  for (const u of DEMO_USERS_MAP) {
    await db.insert(users).values({
      id: u.id,
      email: u.email,
      passwordHash: u.passwordHash,
      fullName: u.fullName,
      roleId: u.roleId,
      organisationId: u.organisationId,
      isActive: true,
      firstLogin: false,
      mfaEnabled: false,
    }).onConflictDoUpdate({
      target: users.id,
      set: {
        email: u.email,
        passwordHash: u.passwordHash,
        fullName: u.fullName,
        roleId: u.roleId,
        organisationId: u.organisationId,
      }
    });

    // Insert user_roles mapping
    await sqlClient`
      INSERT INTO user_roles (id, user_id, role, node_id)
      VALUES (
        ${`ur-${u.id}-${u.role}`},
        ${u.id},
        ${u.role},
        ${u.nodeId}
      )
      ON CONFLICT (user_id, role, node_id) DO UPDATE
      SET node_id = EXCLUDED.node_id;
    `;
  }

  // 5. SEED OFFICIAL EMISSION FACTORS (CEA & DEFRA)
  console.log('⚡ Seeding CEA v20 & DEFRA Official Emission Factors...');
  for (const factor of OFFICIAL_EMISSION_FACTORS) {
    await db.insert(emissionFactors).values({
      id: factor.id,
      name: factor.name,
      category: factor.category,
      fuelOrActivity: factor.fuelOrActivity,
      factorValue: factor.factorValue,
      unit: factor.unit,
      source: factor.source,
      versionYear: factor.versionYear,
      description: factor.description,
      isActive: true,
    }).onConflictDoNothing();
  }

  // 6. SEED DEPARTMENTS PER FILING ENTITY
  console.log('🏢 Seeding Departments for Filing Entities...');
  for (const deptName of ['EHS', 'HR', 'CSR', 'Legal & Compliance', 'Procurement', 'Finance']) {
    await db.insert(department).values({
      organisationId: 'sub-infra',
      name: deptName,
    }).onConflictDoNothing();
  }

  // 7. SEED INDICATORS WITH owner_role, level_of_entry, mandatory_proof
  console.log('📊 Seeding Indicator Master with owner_role and level_of_entry...');
  const INDICATORS_LIST = [
    {
      code: 'CORE1-SCOPE-2-GRID-ELECTRICITY',
      version: 1,
      attributeNumber: 1,
      scopeType: 'SCOPE_2',
      subItem: 'grid_electricity',
      section: 'C',
      principleNo: 6,
      isBrsrCore: true,
      name: 'Scope 2 Purchased Grid Electricity',
      unit: 'kWh',
      kind: 'RAW',
      methodologyNote: 'CEA v20.0 national grid emission factor (0.7160 kgCO2e/kWh)',
      effectiveFrom: '2024-04-01',
      ownerRole: 'SITE_ENGINEER',
      levelOfEntry: 'PROJECT',
      mandatoryProof: true,
      frequency: 'MONTHLY',
    },
    {
      code: 'CORE1-SCOPE-1-STATIONARY-DIESEL',
      version: 1,
      attributeNumber: 1,
      scopeType: 'SCOPE_1',
      subItem: 'stationary_diesel',
      section: 'C',
      principleNo: 6,
      isBrsrCore: true,
      name: 'Scope 1 Direct GHG Emissions (Fuel Combustion)',
      unit: 'tCO2e',
      kind: 'RAW',
      methodologyNote: 'IPCC / CEA stationary fuel factors (Diesel, Petrol, LPG)',
      effectiveFrom: '2024-04-01',
      ownerRole: 'SITE_ENGINEER',
      levelOfEntry: 'PROJECT',
      mandatoryProof: true,
      frequency: 'MONTHLY',
    },
    {
      code: 'CORE2-WATER-CONSUMPTION',
      version: 1,
      attributeNumber: 2,
      scopeType: 'WATER',
      subItem: 'net_consumption',
      section: 'C',
      principleNo: 6,
      isBrsrCore: true,
      name: 'Total Water Consumption',
      unit: 'KL',
      kind: 'RAW',
      methodologyNote: 'Water meter logs and tanker challans',
      effectiveFrom: '2024-04-01',
      ownerRole: 'SITE_ENGINEER',
      levelOfEntry: 'PROJECT',
      mandatoryProof: true,
      frequency: 'MONTHLY',
    },
    {
      code: 'CORE3-WASTE-GENERATED',
      version: 1,
      attributeNumber: 4,
      scopeType: 'WASTE',
      subItem: 'total_waste',
      section: 'C',
      principleNo: 6,
      isBrsrCore: true,
      name: 'Total Waste Generated & Recycled',
      unit: 'MT',
      kind: 'RAW',
      methodologyNote: 'Weighbridge terminal slips and Form 10 manifests',
      effectiveFrom: '2024-04-01',
      ownerRole: 'SITE_ENGINEER',
      levelOfEntry: 'PROJECT',
      mandatoryProof: true,
      frequency: 'MONTHLY',
    },
    {
      code: 'CORE-P3-SAFETY-LTIFR',
      version: 1,
      attributeNumber: 7,
      scopeType: 'SAFETY',
      subItem: 'ltifr',
      section: 'C',
      principleNo: 3,
      isBrsrCore: true,
      name: 'Lost Time Injury Frequency Rate (LTIFR)',
      unit: 'Rate / Million Hours',
      kind: 'CALCULATED',
      methodologyNote: '(Lost Time Injuries * 1,000,000) / Total Man-Hours',
      effectiveFrom: '2024-04-01',
      ownerRole: 'SITE_EHS',
      levelOfEntry: 'PROJECT',
      mandatoryProof: true,
      frequency: 'MONTHLY',
    },
    {
      code: 'CORE-P3-SAFETY-FATALITIES',
      version: 1,
      attributeNumber: 7,
      scopeType: 'SAFETY',
      subItem: 'fatalities',
      section: 'C',
      principleNo: 3,
      isBrsrCore: true,
      name: 'Work-Related Fatalities',
      unit: 'Count',
      kind: 'RAW',
      methodologyNote: 'EHS statutory incident registers (Form 21 / 24)',
      effectiveFrom: '2024-04-01',
      ownerRole: 'SITE_EHS',
      levelOfEntry: 'PROJECT',
      mandatoryProof: true,
      frequency: 'MONTHLY',
    },
    {
      code: 'CORE-A18-TOTAL-WORKFORCE',
      version: 1,
      attributeNumber: 8,
      scopeType: 'WORKFORCE',
      subItem: 'headcount',
      section: 'A',
      principleNo: null,
      isBrsrCore: false,
      name: 'Total Employee & Worker Headcount',
      unit: 'Count',
      kind: 'RAW',
      methodologyNote: 'HR muster roll and biometric attendance',
      effectiveFrom: '2024-04-01',
      ownerRole: 'GROUP_FUNCTION',
      levelOfEntry: 'GROUP',
      mandatoryProof: false,
      frequency: 'YEARLY',
    },
    {
      code: 'CORE-B-POLICY-DISCLOSURES',
      version: 1,
      attributeNumber: 9,
      scopeType: 'GOVERNANCE',
      subItem: 'policy',
      section: 'B',
      principleNo: null,
      isBrsrCore: false,
      name: 'Section B ESG Policy & Management Disclosures',
      unit: 'Text',
      kind: 'RAW',
      methodologyNote: 'Corporate Board-approved sustainability policies',
      effectiveFrom: '2024-04-01',
      ownerRole: 'GROUP_ESG_HEAD',
      levelOfEntry: 'GROUP',
      mandatoryProof: false,
      frequency: 'YEARLY',
    },
  ];

  for (const ind of INDICATORS_LIST) {
    await db.insert(indicator).values(ind as any).onConflictDoUpdate({
      target: [indicator.code, indicator.version],
      set: {
        ownerRole: ind.ownerRole,
        levelOfEntry: ind.levelOfEntry,
        mandatoryProof: ind.mandatoryProof,
        frequency: ind.frequency,
        name: ind.name,
        unit: ind.unit,
      }
    });
  }

  // Find department ID and indicator ID
  const [ehsDept] = await db
    .select()
    .from(department)
    .where(and(eq(department.organisationId, 'sub-infra'), eq(department.name, 'EHS')));
  
  const [elecIndicator] = await db
    .select()
    .from(indicator)
    .where(eq(indicator.code, 'CORE1-SCOPE-2-GRID-ELECTRICITY'));

  // 8. SEED INITIAL SCOPE 2 ACTIVITY RECORD (Baseline)
  console.log('🔌 Seeding Initial Scope 2 Electricity Baseline...');
  await db.insert(activityData).values({
    id: 'act-elec-alpha-baseline',
    organisationId: 'proj-alpha',
    reportingPeriodId: 'fy-2026-27',
    attributeNumber: 1,
    scopeType: 'SCOPE_2',
    subItem: 'grid_electricity',
    quantity: '1850000.0000', // 1,850,000 kWh purchased electricity
    unit: 'kWh',
    status: 'SUBMITTED',
    enteredBy: 'rahul@meil-infra.demo',
    submittedBy: 'rahul@meil-infra.demo',
    indicatorId: elecIndicator?.id,
    departmentId: ehsDept?.id,
    dimension: 'ALL',
    notes: 'Q1-Q3 Grid electricity consumption from certified distribution meter bills',
  }).onConflictDoNothing();

  await db.insert(calculationResults).values({
    id: 'calc-alpha-baseline',
    organisationId: 'proj-alpha',
    reportingPeriodId: 'fy-2026-27',
    scope1_tco2e: '450.2500',
    scope2_tco2e: '1324.6000',
    scope3_tco2e: '210.0000',
    totalGhg_tco2e: '1984.8500',
    turnoverInrCrores: '120.0000',
    ghgIntensityPerCrore: '16.540417',
  }).onConflictDoNothing();

  console.log('🎉 Phase 1 Seeding successfully completed! All 13 accounts, user_roles, and node hierarchy populated.');
  await sqlClient.end();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});

import { 
  User, 
  Organisation, 
  ReportingPeriod, 
  IndicatorCategory, 
  Indicator, 
  DataEntry, 
  Evidence, 
  AuditLog, 
  AnomalyAlert, 
  DashboardSummary,
  TraceabilityNode
} from '../types';

// ==========================================
// 1. DEMO USERS (For 1-Click Role Switching)
// ==========================================
export const DEMO_USERS: Record<string, User> = {
  SITE_USER: {
    id: 'user-site-01',
    email: 'rahul.sharma@meil-infra.demo',
    fullName: 'Rahul Sharma (Site Engg)',
    roleId: 'SITE_USER',
    organisationId: 'proj-alpha',
    organisationName: 'Demo Project Alpha (250MW Solar)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  ESG_OFFICER: {
    id: 'user-esg-01',
    email: 'priya.nair@meil-infra.demo',
    fullName: 'Priya Nair (ESG Lead)',
    roleId: 'ESG_OFFICER',
    organisationId: 'sub-infra',
    organisationName: 'MEIL Infra Projects Ltd',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
  },
  GROUP_SUSTAINABILITY: {
    id: 'user-group-01',
    email: 'amit.verma@meil-group.demo',
    fullName: 'Amit Verma (Chief Sustainability Officer)',
    roleId: 'GROUP_SUSTAINABILITY',
    organisationId: 'meil-group',
    organisationName: 'MEIL Group (Corporate HQ)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  AUDITOR: {
    id: 'user-auditor-01',
    email: 'sarah.jenkins@ernst-audit.demo',
    fullName: 'Sarah Jenkins (Statutory ESG Assessor)',
    roleId: 'AUDITOR',
    organisationId: 'meil-group',
    organisationName: 'Independent Assurance Team',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  },
  ADMIN: {
    id: 'user-admin-01',
    email: 'admin.esg@meil.demo',
    fullName: 'Kiran Reddy (System Admin)',
    roleId: 'ADMIN',
    organisationId: 'meil-group',
    organisationName: 'MEIL Group IT & Compliance',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  }
};

// ==========================================
// 2. REPORTING PERIODS
// ==========================================
export const REPORTING_PERIODS: ReportingPeriod[] = [
  {
    id: 'fy-2026-27',
    financialYear: 'FY 2026-27',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    status: 'OPEN',
    isCurrent: true
  },
  {
    id: 'fy-2025-26',
    financialYear: 'FY 2025-26',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    status: 'CLOSED',
    isCurrent: false
  },
  {
    id: 'fy-2024-25',
    financialYear: 'FY 2024-25',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    status: 'ARCHIVED',
    isCurrent: false
  }
];

// ==========================================
// 3. ORGANISATIONAL HIERARCHY (MEIL DEMO)
// ==========================================
export const ORGANISATIONS: Organisation[] = [
  {
    id: 'meil-group',
    code: 'MEIL-GRP',
    name: 'MEIL Group (Corporate HQ)',
    type: 'GROUP',
    parentId: null,
    businessVertical: 'Conglomerate - Infra, Energy, Water & Transport',
    country: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    completionRate: 89,
    status: 'HEALTHY'
  },
  // Subsidiary 1
  {
    id: 'sub-infra',
    code: 'MEIL-INFRA',
    name: 'MEIL Infrastructure Projects Ltd',
    type: 'SUBSIDIARY',
    parentId: 'meil-group',
    businessVertical: 'Heavy Infrastructure & Transportation',
    country: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    completionRate: 92,
    status: 'HEALTHY'
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
    completionRate: 95,
    status: 'HEALTHY'
  },
  {
    id: 'proj-alpha',
    code: 'PRJ-ALPHA-250',
    name: 'Demo Project Alpha (250MW Solar Park)',
    type: 'PROJECT',
    parentId: 'bu-infra-metro',
    businessVertical: 'Renewable Power & EPC',
    country: 'India',
    state: 'Rajasthan',
    city: 'Bhadla',
    completionRate: 94,
    status: 'HEALTHY'
  },
  {
    id: 'proj-beta',
    code: 'PRJ-BETA-TUNNEL',
    name: 'Demo Project Beta (High-Speed Tunneling)',
    type: 'PROJECT',
    parentId: 'bu-infra-metro',
    businessVertical: 'Underground Transport',
    country: 'India',
    state: 'Maharashtra',
    city: 'Thane',
    completionRate: 72,
    status: 'NEEDS_ATTENTION'
  },
  // Subsidiary 2
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
    status: 'NEEDS_ATTENTION'
  },
  {
    id: 'bu-water-irrigation',
    code: 'BU-IRRIGATION',
    name: 'Lift Irrigation Business Unit',
    type: 'BUSINESS_UNIT',
    parentId: 'sub-water',
    businessVertical: 'Agricultural Water Infra',
    country: 'India',
    state: 'Telangana',
    city: 'Karimnagar',
    completionRate: 84,
    status: 'NEEDS_ATTENTION'
  },
  {
    id: 'proj-gamma',
    code: 'PRJ-GAMMA-LIFT',
    name: 'Demo Project Gamma (Lift Irrigation Canal)',
    type: 'PROJECT',
    parentId: 'bu-water-irrigation',
    businessVertical: 'Hydraulic Structures',
    country: 'India',
    state: 'Telangana',
    city: 'Kaleshwaram',
    completionRate: 88,
    status: 'HEALTHY'
  },
  // Subsidiary 3
  {
    id: 'sub-energy',
    code: 'MEIL-ENERGY',
    name: 'MEIL Clean Energy Ltd',
    type: 'SUBSIDIARY',
    parentId: 'meil-group',
    businessVertical: 'Clean Power Generation',
    country: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    completionRate: 90,
    status: 'HEALTHY'
  },
  {
    id: 'bu-energy-renewables',
    code: 'BU-RENEWABLES',
    name: 'Solar & Wind BU',
    type: 'BUSINESS_UNIT',
    parentId: 'sub-energy',
    businessVertical: 'Green Energy',
    country: 'India',
    state: 'Gujarat',
    city: 'Kutch',
    completionRate: 90,
    status: 'HEALTHY'
  },
  {
    id: 'proj-delta',
    code: 'PRJ-DELTA-WIND',
    name: 'Demo Project Delta (150MW Wind Grid)',
    type: 'PROJECT',
    parentId: 'bu-energy-renewables',
    businessVertical: 'Wind Energy',
    country: 'India',
    state: 'Gujarat',
    city: 'Bhuj',
    completionRate: 90,
    status: 'HEALTHY'
  }
];

// Build nested tree helper
export const getOrganisationTree = (): Organisation => {
  const orgMap = new Map<string, Organisation>();
  ORGANISATIONS.forEach(org => orgMap.set(org.id, { ...org, children: [] }));
  
  let root: Organisation | null = null;
  ORGANISATIONS.forEach(org => {
    const node = orgMap.get(org.id)!;
    if (org.parentId && orgMap.has(org.parentId)) {
      orgMap.get(org.parentId)!.children!.push(node);
    } else if (!org.parentId) {
      root = node;
    }
  });
  return root || orgMap.get('meil-group')!;
};

// ==========================================
// 4. INDICATOR CATEGORIES & BRSR REGISTRY
// ==========================================
export const INDICATOR_CATEGORIES: IndicatorCategory[] = [
  { id: 'cat-env', code: 'ENVIRONMENT', name: 'Environment', colorCode: '#10B981' },
  { id: 'cat-soc', code: 'SOCIAL', name: 'Social', colorCode: '#3B82F6' },
  { id: 'cat-gov', code: 'GOVERNANCE', name: 'Governance', colorCode: '#8B5CF6' }
];

export const INDICATORS: Indicator[] = [
  // SECTION C - PRINCIPLE 6 (ENVIRONMENT)
  {
    id: 'ind-p6-e1-s1',
    code: 'P6-E1-S1',
    name: 'Scope 1 Direct GHG Emissions',
    description: 'Direct greenhouse gas emissions from stationary combustion, diesel generators, and fleet at construction sites.',
    categoryId: 'cat-env',
    categoryCode: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    isCore: true,
    dataType: 'numeric',
    unit: 'tCO2e',
    aggregationType: 'SUM',
    isMandatory: true,
    requiresEvidence: true,
    validationRule: { min: 0 },
    isActive: true
  },
  {
    id: 'ind-p6-e1-s2',
    code: 'P6-E1-S2',
    name: 'Scope 2 Indirect GHG Emissions',
    description: 'Indirect emissions resulting from purchased electricity from the grid for site camps and heavy equipment.',
    categoryId: 'cat-env',
    categoryCode: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    isCore: true,
    dataType: 'numeric',
    unit: 'tCO2e',
    aggregationType: 'SUM',
    isMandatory: true,
    requiresEvidence: true,
    validationRule: { min: 0 },
    isActive: true
  },
  {
    id: 'ind-p6-e2-tot',
    code: 'P6-E2-TOT',
    name: 'Total Energy Consumption',
    description: 'Total energy consumed across project operations including diesel, electricity, and captive sources in Giga Joules (GJ).',
    categoryId: 'cat-env',
    categoryCode: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    isCore: true,
    dataType: 'numeric',
    unit: 'GJ',
    aggregationType: 'SUM',
    isMandatory: true,
    requiresEvidence: true,
    validationRule: { min: 0 },
    isActive: true
  },
  {
    id: 'ind-p6-e2-ren',
    code: 'P6-E2-REN',
    name: 'Renewable Energy Share',
    description: 'Percentage of total energy consumption sourced from renewable sources (solar, wind, captive hydro).',
    categoryId: 'cat-env',
    categoryCode: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    isCore: true,
    dataType: 'percentage',
    unit: '%',
    aggregationType: 'AVERAGE',
    isMandatory: true,
    requiresEvidence: false,
    validationRule: { min: 0, max: 100 },
    isActive: true
  },
  {
    id: 'ind-p6-e3-wat',
    code: 'P6-E3-WAT',
    name: 'Total Water Consumption',
    description: 'Total volume of water withdrawn and consumed from surface, groundwater, and municipal tankers in Kilo Litres (KL).',
    categoryId: 'cat-env',
    categoryCode: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    isCore: true,
    dataType: 'numeric',
    unit: 'KL',
    aggregationType: 'SUM',
    isMandatory: true,
    requiresEvidence: true,
    validationRule: { min: 0 },
    isActive: true
  },
  {
    id: 'ind-p6-e3-dis',
    code: 'P6-E3-DIS',
    name: 'Total Water Discharge',
    description: 'Treated water safely discharged back or repurposed for dust suppression at project sites.',
    categoryId: 'cat-env',
    categoryCode: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    isCore: true,
    dataType: 'numeric',
    unit: 'KL',
    aggregationType: 'SUM',
    isMandatory: false,
    requiresEvidence: true,
    validationRule: { min: 0, logicalFormula: 'Water Discharge <= Water Consumption' },
    isActive: true
  },
  {
    id: 'ind-p6-e4-wst',
    code: 'P6-E4-WST',
    name: 'Total Waste Generated',
    description: 'Total construction, excavation, hazardous, and municipal waste generated at project sites in Metric Tonnes (MT).',
    categoryId: 'cat-env',
    categoryCode: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    isCore: true,
    dataType: 'numeric',
    unit: 'Metric Tonnes',
    aggregationType: 'SUM',
    isMandatory: true,
    requiresEvidence: false,
    validationRule: { min: 0 },
    isActive: true
  },
  {
    id: 'ind-p6-e4-rec',
    code: 'P6-E4-REC',
    name: 'Waste Recycled / Reused',
    description: 'Quantity of construction aggregates, steel scrap, and excavation rubble recycled or diverted from landfills.',
    categoryId: 'cat-env',
    categoryCode: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    isCore: true,
    dataType: 'numeric',
    unit: 'Metric Tonnes',
    aggregationType: 'SUM',
    isMandatory: true,
    requiresEvidence: true,
    validationRule: { min: 0, logicalFormula: 'Recycled Waste <= Total Waste Generated' },
    isActive: true
  },

  // SECTION A - GENERAL DISCLOSURES & SOCIAL WORKFORCE
  {
    id: 'ind-a-18-emp-tot',
    code: 'A-18-EMP-TOT',
    name: 'Total Employee Workforce',
    description: 'Headcount of total employees including on-roll permanent staff and contractual project site personnel.',
    categoryId: 'cat-soc',
    categoryCode: 'SOCIAL',
    section: 'A',
    isCore: false,
    dataType: 'numeric',
    unit: 'Count',
    aggregationType: 'SUM',
    isMandatory: true,
    requiresEvidence: false,
    validationRule: { min: 1 },
    isActive: true
  },
  {
    id: 'ind-a-18-emp-perm',
    code: 'A-18-EMP-PERM',
    name: 'Permanent Employees',
    description: 'Number of full-time permanent employees registered under company payroll.',
    categoryId: 'cat-soc',
    categoryCode: 'SOCIAL',
    section: 'A',
    isCore: false,
    dataType: 'numeric',
    unit: 'Count',
    aggregationType: 'SUM',
    isMandatory: true,
    requiresEvidence: false,
    validationRule: { min: 0 },
    isActive: true
  },
  {
    id: 'ind-a-18-fem-rep',
    code: 'A-18-FEM-REP',
    name: 'Female Workforce Representation',
    description: 'Percentage of female representation across engineering, site supervision, and managerial cadres.',
    categoryId: 'cat-soc',
    categoryCode: 'SOCIAL',
    section: 'A',
    isCore: true,
    dataType: 'percentage',
    unit: '%',
    aggregationType: 'AVERAGE',
    isMandatory: true,
    requiresEvidence: false,
    validationRule: { min: 0, max: 100 },
    isActive: true
  },
  {
    id: 'ind-a-19-diff-abl',
    code: 'A-19-DIFF-ABL',
    name: 'Differently Abled Employees',
    description: 'Count of differently-abled workforce actively employed in project administrative and engineering units.',
    categoryId: 'cat-soc',
    categoryCode: 'SOCIAL',
    section: 'A',
    isCore: true,
    dataType: 'numeric',
    unit: 'Count',
    aggregationType: 'SUM',
    isMandatory: true,
    requiresEvidence: false,
    validationRule: { min: 0 },
    isActive: true
  },

  // SECTION C - PRINCIPLE 3 (SOCIAL & EMPLOYEE WELLBEING)
  {
    id: 'ind-p3-e1-well',
    code: 'P3-E1-WELL',
    name: 'Employee Wellbeing & Health Insurance Coverage',
    description: 'Percentage of total workforce covered by medical insurance, accident cover, and annual health checkups.',
    categoryId: 'cat-soc',
    categoryCode: 'SOCIAL',
    section: 'C',
    principleNumber: 3,
    isCore: true,
    dataType: 'percentage',
    unit: '%',
    aggregationType: 'AVERAGE',
    isMandatory: true,
    requiresEvidence: true,
    validationRule: { min: 0, max: 100 },
    isActive: true
  },
  {
    id: 'ind-p3-e2-safe-ltir',
    code: 'P3-E2-SAFE-LTIR',
    name: 'Lost Time Injury Frequency Rate (LTIFR)',
    description: 'Rate of lost time injuries per million man-hours worked across project execution sites.',
    categoryId: 'cat-soc',
    categoryCode: 'SOCIAL',
    section: 'C',
    principleNumber: 3,
    isCore: true,
    dataType: 'numeric',
    unit: 'Rate / Million Hours',
    aggregationType: 'AVERAGE',
    isMandatory: true,
    requiresEvidence: true,
    validationRule: { min: 0 },
    isActive: true
  },
  {
    id: 'ind-p3-e2-safe-fat',
    code: 'P3-E2-SAFE-FAT',
    name: 'Fatalities at Project Sites',
    description: 'Number of work-related fatal safety incidents recorded during the reporting financial period.',
    categoryId: 'cat-soc',
    categoryCode: 'SOCIAL',
    section: 'C',
    principleNumber: 3,
    isCore: true,
    dataType: 'numeric',
    unit: 'Count',
    aggregationType: 'SUM',
    isMandatory: true,
    requiresEvidence: true,
    validationRule: { min: 0 },
    isActive: true
  },
  {
    id: 'ind-p3-e4-trn',
    code: 'P3-E4-TRN',
    name: 'Average Safety & Skill Training Hours',
    description: 'Average hours of safety induction, technical training, and ESG awareness conducted per employee.',
    categoryId: 'cat-soc',
    categoryCode: 'SOCIAL',
    section: 'C',
    principleNumber: 3,
    isCore: false,
    dataType: 'numeric',
    unit: 'Hours/Person',
    aggregationType: 'AVERAGE',
    isMandatory: true,
    requiresEvidence: false,
    validationRule: { min: 0 },
    isActive: true
  },

  // SECTION C - PRINCIPLE 1, 5, 8, 9 (GOVERNANCE & RESPONSIBLE BUSINESS)
  {
    id: 'ind-p1-e1-eth',
    code: 'P1-E1-ETH',
    name: 'Anti-Corruption & Business Ethics Coverage',
    description: 'Percentage of key managerial, procurement, and project staff trained on Code of Conduct and Anti-Bribery policies.',
    categoryId: 'cat-gov',
    categoryCode: 'GOVERNANCE',
    section: 'C',
    principleNumber: 1,
    isCore: false,
    dataType: 'percentage',
    unit: '%',
    aggregationType: 'AVERAGE',
    isMandatory: true,
    requiresEvidence: false,
    validationRule: { min: 0, max: 100 },
    isActive: true
  },
  {
    id: 'ind-p5-e1-grv',
    code: 'P5-E1-GRV',
    name: 'Human Rights & Community Grievances Filed',
    description: 'Total number of grievances received through whistle-blower hotline, local community desk, or labor union.',
    categoryId: 'cat-gov',
    categoryCode: 'GOVERNANCE',
    section: 'C',
    principleNumber: 5,
    isCore: false,
    dataType: 'numeric',
    unit: 'Count',
    aggregationType: 'SUM',
    isMandatory: true,
    requiresEvidence: false,
    validationRule: { min: 0 },
    isActive: true
  },
  {
    id: 'ind-p8-e1-msme',
    code: 'P8-E1-MSME',
    name: 'Procurement Spend from MSME Suppliers',
    description: 'Percentage of total procurement spend sourced directly from verified Micro, Small, and Medium Enterprises (MSMEs).',
    categoryId: 'cat-gov',
    categoryCode: 'GOVERNANCE',
    section: 'C',
    principleNumber: 8,
    isCore: true,
    dataType: 'percentage',
    unit: '%',
    aggregationType: 'AVERAGE',
    isMandatory: true,
    requiresEvidence: true,
    validationRule: { min: 0, max: 100 },
    isActive: true
  },
  {
    id: 'ind-p9-e1-cyber',
    code: 'P9-E1-CYBER',
    name: 'Customer Data & Cybersecurity Incidents',
    description: 'Number of verified customer data breaches or supervisory privacy regulatory warnings received.',
    categoryId: 'cat-gov',
    categoryCode: 'GOVERNANCE',
    section: 'C',
    principleNumber: 9,
    isCore: true,
    dataType: 'numeric',
    unit: 'Count',
    aggregationType: 'SUM',
    isMandatory: true,
    requiresEvidence: false,
    validationRule: { min: 0 },
    isActive: true
  }
];

// ==========================================
// 5. SAMPLE EVIDENCE
// ==========================================
export const DEMO_EVIDENCE: Evidence[] = [
  {
    id: 'ev-01',
    dataEntryId: 'entry-alpha-scope1',
    fileName: 'diesel_generator_consumption_log_q3.pdf',
    filePath: '/uploads/diesel_generator_consumption_log_q3.pdf',
    fileType: 'application/pdf',
    fileSize: 2450, // 2.45 MB
    fileHash: 'sha256-8a7f92b49c018274d8e7bca90f1e29c882749',
    uploadedBy: 'user-site-01',
    uploadedByName: 'Rahul Sharma (Site Engg)',
    uploadedAt: '2026-09-15T10:30:00Z',
    description: 'Certified fuel purchase receipts and telematics run-hour log for 6 captive DG sets.',
    verificationStatus: 'VERIFIED',
    aiConfidence: 98
  },
  {
    id: 'ev-02',
    dataEntryId: 'entry-alpha-scope1',
    fileName: 'calibrated_meter_reading_solar_camp.jpg',
    filePath: '/uploads/calibrated_meter_reading_solar_camp.jpg',
    fileType: 'image/jpeg',
    fileSize: 1280, // 1.28 MB
    fileHash: 'sha256-4c9103e99b0cba2837482910fedcba9830218',
    uploadedBy: 'user-site-01',
    uploadedByName: 'Rahul Sharma (Site Engg)',
    uploadedAt: '2026-09-15T10:32:00Z',
    description: 'Timestamped photograph of central flow meter display at site substation.',
    verificationStatus: 'VERIFIED',
    aiConfidence: 95
  },
  {
    id: 'ev-03',
    dataEntryId: 'entry-alpha-water',
    fileName: 'borewell_extraction_noc_and_flowmeter_log.pdf',
    filePath: '/uploads/borewell_extraction_noc_and_flowmeter_log.pdf',
    fileType: 'application/pdf',
    fileSize: 3120,
    fileHash: 'sha256-11f84b28cba765431098afe09823475618293',
    uploadedBy: 'user-site-01',
    uploadedByName: 'Rahul Sharma (Site Engg)',
    uploadedAt: '2026-09-18T14:15:00Z',
    description: 'CGWA extraction approval copy and weekly electromagnetic meter logs.',
    verificationStatus: 'VERIFIED',
    aiConfidence: 96
  }
];

// ==========================================
// 6. SAMPLE DATA ENTRIES (Current & Historical)
// ==========================================
export const DEMO_DATA_ENTRIES: DataEntry[] = [
  // Project Alpha Entries (FY 2026-27)
  {
    id: 'entry-alpha-scope1',
    organisationId: 'proj-alpha',
    indicatorId: 'ind-p6-e1-s1',
    reportingPeriodId: 'fy-2026-27',
    numericValue: 18500.00,
    unit: 'tCO2e',
    sourceType: 'MANUAL',
    status: 'APPROVED',
    remarks: 'Diesel generator fleet emissions verified against telematics telemetry data.',
    evidenceCount: 2,
    evidenceFiles: [DEMO_EVIDENCE[0], DEMO_EVIDENCE[1]],
    createdBy: 'user-site-01',
    createdAt: '2026-09-15T10:30:00Z',
    updatedAt: '2026-09-20T11:00:00Z',
    previousYearValue: 19800.00,
    yoyChangePercent: -6.56
  },
  {
    id: 'entry-alpha-scope2',
    organisationId: 'proj-alpha',
    indicatorId: 'ind-p6-e1-s2',
    reportingPeriodId: 'fy-2026-27',
    numericValue: 4200.00,
    unit: 'tCO2e',
    sourceType: 'MANUAL',
    status: 'APPROVED',
    remarks: 'Grid electricity invoices for staff colony and precast yard.',
    evidenceCount: 1,
    createdBy: 'user-site-01',
    createdAt: '2026-09-16T11:20:00Z',
    updatedAt: '2026-09-20T11:05:00Z',
    previousYearValue: 4500.00,
    yoyChangePercent: -6.67
  },
  {
    id: 'entry-alpha-energy',
    organisationId: 'proj-alpha',
    indicatorId: 'ind-p6-e2-tot',
    reportingPeriodId: 'fy-2026-27',
    numericValue: 245000.00,
    unit: 'GJ',
    sourceType: 'MANUAL',
    status: 'APPROVED',
    remarks: 'Total energy from fuel + grid electricity.',
    evidenceCount: 1,
    createdBy: 'user-site-01',
    createdAt: '2026-09-16T11:45:00Z',
    updatedAt: '2026-09-20T11:10:00Z',
    previousYearValue: 260000.00,
    yoyChangePercent: -5.77
  },
  {
    id: 'entry-alpha-water',
    organisationId: 'proj-alpha',
    indicatorId: 'ind-p6-e3-wat',
    reportingPeriodId: 'fy-2026-27',
    numericValue: 48500.00,
    unit: 'KL',
    sourceType: 'MANUAL',
    status: 'APPROVED',
    remarks: 'Construction concrete batching plant and dust suppression.',
    evidenceCount: 1,
    evidenceFiles: [DEMO_EVIDENCE[2]],
    createdBy: 'user-site-01',
    createdAt: '2026-09-18T14:15:00Z',
    updatedAt: '2026-09-20T11:15:00Z',
    previousYearValue: 52000.00,
    yoyChangePercent: -6.73
  },

  // Project Beta Entries (Pending Review / Attention)
  {
    id: 'entry-beta-scope1',
    organisationId: 'proj-beta',
    indicatorId: 'ind-p6-e1-s1',
    reportingPeriodId: 'fy-2026-27',
    numericValue: 22700.00,
    unit: 'tCO2e',
    sourceType: 'MANUAL',
    status: 'SUBMITTED',
    remarks: 'Tunnel boring machine power packs and earth-moving trucks.',
    evidenceCount: 1,
    createdBy: 'user-site-01',
    createdAt: '2026-09-28T16:00:00Z',
    updatedAt: '2026-09-28T16:00:00Z',
    previousYearValue: 16000.00,
    yoyChangePercent: 41.87
  },
  {
    id: 'entry-beta-water',
    organisationId: 'proj-beta',
    indicatorId: 'ind-p6-e3-wat',
    reportingPeriodId: 'fy-2026-27',
    numericValue: 62400.00,
    unit: 'KL',
    sourceType: 'MANUAL',
    status: 'UNDER_REVIEW',
    remarks: 'High groundwater encountered in tunnel face requiring pumping.',
    evidenceCount: 1,
    createdBy: 'user-site-01',
    createdAt: '2026-09-29T09:30:00Z',
    updatedAt: '2026-09-29T10:00:00Z',
    previousYearValue: 44000.00,
    yoyChangePercent: 41.82
  },

  // Project Gamma Entries
  {
    id: 'entry-gamma-scope1',
    organisationId: 'proj-gamma',
    indicatorId: 'ind-p6-e1-s1',
    reportingPeriodId: 'fy-2026-27',
    numericValue: 31200.00,
    unit: 'tCO2e',
    sourceType: 'MANUAL',
    status: 'APPROVED',
    remarks: 'Pump house erection and penstock fabrication.',
    evidenceCount: 1,
    createdBy: 'user-site-01',
    createdAt: '2026-09-10T12:00:00Z',
    updatedAt: '2026-09-12T15:00:00Z',
    previousYearValue: 33000.00,
    yoyChangePercent: -5.45
  },

  // Project Delta Entries
  {
    id: 'entry-delta-scope1',
    organisationId: 'proj-delta',
    indicatorId: 'ind-p6-e1-s1',
    reportingPeriodId: 'fy-2026-27',
    numericValue: 53030.00,
    unit: 'tCO2e',
    sourceType: 'MANUAL',
    status: 'APPROVED',
    remarks: 'Turbine tower crane logistics and site preparation.',
    evidenceCount: 1,
    createdBy: 'user-site-01',
    createdAt: '2026-09-11T14:30:00Z',
    updatedAt: '2026-09-13T10:00:00Z',
    previousYearValue: 51000.00,
    yoyChangePercent: 3.98
  }
];

// ==========================================
// 7. AUDIT LOGS (Immutable Timeline)
// ==========================================
export const DEMO_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-01',
    tableName: 'data_entries',
    recordId: 'entry-alpha-scope1',
    indicatorCode: 'P6-E1-S1',
    indicatorName: 'Scope 1 Direct GHG Emissions',
    organisationName: 'Demo Project Alpha',
    action: 'CREATE',
    newValue: { value: 18500.00, unit: 'tCO2e', status: 'DRAFT' },
    changedBy: 'user-site-01',
    changedByName: 'Rahul Sharma (Site Engg)',
    userRole: 'SITE_USER',
    ipAddress: '10.14.88.22',
    timestamp: '2026-09-15T10:30:00Z',
    reason: 'Initial data entry for Q2-Q3 fuel telemetry'
  },
  {
    id: 'audit-02',
    tableName: 'evidence',
    recordId: 'ev-01',
    indicatorCode: 'P6-E1-S1',
    indicatorName: 'Scope 1 Direct GHG Emissions',
    organisationName: 'Demo Project Alpha',
    action: 'CREATE',
    newValue: { fileName: 'diesel_generator_consumption_log_q3.pdf', size: '2.45MB' },
    changedBy: 'user-site-01',
    changedByName: 'Rahul Sharma (Site Engg)',
    userRole: 'SITE_USER',
    ipAddress: '10.14.88.22',
    timestamp: '2026-09-15T10:32:00Z',
    reason: 'Supporting calibrated logbook attached'
  },
  {
    id: 'audit-03',
    tableName: 'data_entries',
    recordId: 'entry-alpha-scope1',
    indicatorCode: 'P6-E1-S1',
    indicatorName: 'Scope 1 Direct GHG Emissions',
    organisationName: 'Demo Project Alpha',
    action: 'TRANSITION',
    oldValue: { status: 'DRAFT' },
    newValue: { status: 'SUBMITTED' },
    changedBy: 'user-site-01',
    changedByName: 'Rahul Sharma (Site Engg)',
    userRole: 'SITE_USER',
    ipAddress: '10.14.88.22',
    timestamp: '2026-09-16T09:00:00Z',
    reason: 'Submitted for Subsidiary ESG review'
  },
  {
    id: 'audit-04',
    tableName: 'data_entries',
    recordId: 'entry-alpha-scope1',
    indicatorCode: 'P6-E1-S1',
    indicatorName: 'Scope 1 Direct GHG Emissions',
    organisationName: 'Demo Project Alpha',
    action: 'TRANSITION',
    oldValue: { status: 'SUBMITTED' },
    newValue: { status: 'APPROVED' },
    changedBy: 'user-esg-01',
    changedByName: 'Priya Nair (ESG Lead)',
    userRole: 'ESG_OFFICER',
    ipAddress: '10.2.14.102',
    timestamp: '2026-09-20T11:00:00Z',
    reason: 'Verified against OEM telematics log and approved for group rollup.'
  }
];

// ==========================================
// 8. ANOMALIES & ATTENTION ALERTS
// ==========================================
export const DEMO_ALERTS: AnomalyAlert[] = [
  {
    id: 'alert-01',
    organisationId: 'proj-beta',
    organisationName: 'Demo Project Beta (High-Speed Tunneling)',
    indicatorId: 'ind-p6-e3-wat',
    indicatorCode: 'P6-E3-WAT',
    indicatorName: 'Total Water Consumption',
    reportingPeriodId: 'fy-2026-27',
    alertType: 'ANOMALY',
    severity: 'HIGH',
    message: 'Water consumption surged +41.8% YoY (62,400 KL vs 44,000 KL in FY 2025-26). Ground dewatering review advised.',
    status: 'OPEN',
    createdAt: '2026-09-29T10:05:00Z'
  },
  {
    id: 'alert-02',
    organisationId: 'proj-beta',
    organisationName: 'Demo Project Beta (High-Speed Tunneling)',
    indicatorId: 'ind-p6-e4-rec',
    indicatorCode: 'P6-E4-REC',
    indicatorName: 'Waste Recycled / Reused',
    reportingPeriodId: 'fy-2026-27',
    alertType: 'MISSING_EVIDENCE',
    severity: 'MEDIUM',
    message: 'Missing mandatory recycling dispatch slip / manifest document.',
    status: 'OPEN',
    createdAt: '2026-09-28T17:00:00Z'
  },
  {
    id: 'alert-03',
    organisationId: 'proj-gamma',
    organisationName: 'Demo Project Gamma (Lift Irrigation Canal)',
    indicatorId: 'ind-p3-e4-trn',
    indicatorCode: 'P3-E4-TRN',
    indicatorName: 'Average Safety Training Hours',
    reportingPeriodId: 'fy-2026-27',
    alertType: 'MISSING_DATA',
    severity: 'LOW',
    message: 'Q3 safety induction training hours pending site submission.',
    status: 'OPEN',
    createdAt: '2026-09-25T08:00:00Z'
  }
];

// ==========================================
// 9. EXECUTIVE DASHBOARD SUMMARY
// ==========================================
export const DEMO_DASHBOARD_SUMMARY: DashboardSummary = {
  totalProjects: 12,
  submittedProjects: 10,
  pendingReviewProjects: 2,
  overallReadinessPercent: 89,
  brsrCoreReadinessPercent: 91,
  sectionAReadiness: 96,
  sectionBReadiness: 88,
  sectionCReadiness: 82,
  environmentalSummary: {
    energyConsumptionGJ: 1845200,
    renewableEnergyPercent: 38.4,
    scope1GHG_tCO2e: 125430,
    scope2GHG_tCO2e: 38920,
    waterConsumptionKL: 412800,
    wasteGeneratedMT: 84200,
    wasteRecycledPercent: 74.2
  },
  socialSummary: {
    totalWorkforce: 28450,
    femaleRepresentationPercent: 14.8,
    permanentEmployees: 11200,
    safetyIncidentsCount: 3,
    trainingHoursPerEmployee: 24.6,
    wellbeingCoveragePercent: 96.5
  },
  governanceSummary: {
    ethicsTrainingPercent: 98.2,
    grievancesResolvedPercent: 94.0,
    msmeProcurementPercent: 27.5,
    dataBreachesCount: 0
  },
  yoyTrends: [
    { year: 'FY 2023-24', energyGJ: 2100000, waterKL: 480000, ghgScope1_2: 182000, wasteMT: 95000 },
    { year: 'FY 2024-25', energyGJ: 1980000, waterKL: 445000, ghgScope1_2: 174000, wasteMT: 89000 },
    { year: 'FY 2025-26', energyGJ: 1920000, waterKL: 428000, ghgScope1_2: 168000, wasteMT: 86000 },
    { year: 'FY 2026-27', energyGJ: 1845200, waterKL: 412800, ghgScope1_2: 164350, wasteMT: 84200 }
  ]
};

// ==========================================
// 10. FLAGSHIP TRACEABILITY TREE (DEMO)
// ==========================================
export const DEMO_TRACEABILITY_GHG_TREE: TraceabilityNode = {
  orgId: 'meil-group',
  orgName: 'MEIL Group (Corporate Aggregate)',
  orgType: 'GROUP',
  value: 125430,
  unit: 'tCO2e',
  status: 'APPROVED',
  children: [
    {
      orgId: 'sub-infra',
      orgName: 'MEIL Infrastructure Projects Ltd',
      orgType: 'SUBSIDIARY',
      value: 72400,
      unit: 'tCO2e',
      status: 'APPROVED',
      children: [
        {
          orgId: 'bu-infra-metro',
          orgName: 'Metro & Rail Business Unit',
          orgType: 'BUSINESS_UNIT',
          value: 41200,
          unit: 'tCO2e',
          status: 'APPROVED',
          children: [
            {
              orgId: 'proj-alpha',
              orgName: 'Demo Project Alpha (250MW Solar Park)',
              orgType: 'PROJECT',
              value: 18500,
              unit: 'tCO2e',
              status: 'APPROVED',
              enteredBy: 'Rahul Sharma (Site Engg)',
              approvedBy: 'Priya Nair (ESG Lead)',
              evidenceFiles: [DEMO_EVIDENCE[0], DEMO_EVIDENCE[1]],
              auditHistory: DEMO_AUDIT_LOGS.filter(a => a.recordId === 'entry-alpha-scope1')
            },
            {
              orgId: 'proj-beta',
              orgName: 'Demo Project Beta (High-Speed Tunneling)',
              orgType: 'PROJECT',
              value: 22700,
              unit: 'tCO2e',
              status: 'SUBMITTED',
              enteredBy: 'Sanjay Deshmukh (Project Engg)',
              approvedBy: 'Under Review',
              evidenceFiles: [],
              auditHistory: []
            }
          ]
        },
        {
          orgId: 'bu-infra-highways',
          orgName: 'Highways & Expressways BU',
          orgType: 'BUSINESS_UNIT',
          value: 31200,
          unit: 'tCO2e',
          status: 'APPROVED',
          children: []
        }
      ]
    },
    {
      orgId: 'sub-water',
      orgName: 'MEIL Hydro & Water Corp',
      orgType: 'SUBSIDIARY',
      value: 31200,
      unit: 'tCO2e',
      status: 'APPROVED',
      children: [
        {
          orgId: 'bu-water-irrigation',
          orgName: 'Lift Irrigation Business Unit',
          orgType: 'BUSINESS_UNIT',
          value: 31200,
          unit: 'tCO2e',
          status: 'APPROVED',
          children: [
            {
              orgId: 'proj-gamma',
              orgName: 'Demo Project Gamma (Lift Irrigation Canal)',
              orgType: 'PROJECT',
              value: 31200,
              unit: 'tCO2e',
              status: 'APPROVED',
              enteredBy: 'K. Venkatesh (Site Engg)',
              approvedBy: 'Priya Nair (ESG Lead)',
              evidenceFiles: [],
              auditHistory: []
            }
          ]
        }
      ]
    },
    {
      orgId: 'sub-energy',
      orgName: 'MEIL Clean Energy Ltd',
      orgType: 'SUBSIDIARY',
      value: 21830,
      unit: 'tCO2e',
      status: 'APPROVED',
      children: [
        {
          orgId: 'bu-energy-renewables',
          orgName: 'Solar & Wind BU',
          orgType: 'BUSINESS_UNIT',
          value: 21830,
          unit: 'tCO2e',
          status: 'APPROVED',
          children: [
            {
              orgId: 'proj-delta',
              orgName: 'Demo Project Delta (150MW Wind Grid)',
              orgType: 'PROJECT',
              value: 21830,
              unit: 'tCO2e',
              status: 'APPROVED',
              enteredBy: 'M. Patel (Site Incharge)',
              approvedBy: 'Priya Nair (ESG Lead)',
              evidenceFiles: [],
              auditHistory: []
            }
          ]
        }
      ]
    }
  ]
};

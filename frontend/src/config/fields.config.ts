export interface FieldConfig {
  id: string;
  code: string;
  codeDescription: string;
  name: string;
  description: string;
  category: 'ENVIRONMENT' | 'SOCIAL' | 'GOVERNANCE';
  section: 'A' | 'B' | 'C';
  principleNumber?: number;
  principleName?: string;
  topic: 'Energy' | 'Emissions' | 'Water' | 'Waste' | 'Workforce' | 'Safety' | 'Ethics' | 'Governance';
  unit: string;
  dataType: 'numeric' | 'percentage' | 'count';
  isCore: boolean;
  isMandatory: boolean;
  requiresEvidence: boolean;
  ownerRole?: 'SITE_ENGINEER' | 'SITE_EHS' | 'GROUP_FUNCTION' | 'GROUP_ESG_HEAD';
  levelOfEntry?: 'PROJECT' | 'SUBSIDIARY' | 'GROUP';
  mandatoryProof?: boolean;
  allowZero: boolean;
  maxIntDigits: number;
  maxDecimals: number;
  min: number;
  max?: number;
  methodology: {
    formula: string;
    instrumentOrSource: string;
    documentToUpload: string;
    example: string;
  };
  calculatorType?: 'scope1' | 'scope2' | 'energy' | 'water' | 'waste' | 'ltifr';
  defaultEmissionFactor?: number;
  emissionFactorUnit?: string;
  emissionFactorSource?: string;
}

export interface IndicatorStatutoryMetadata {
  ownerRole: 'SITE_ENGINEER' | 'SITE_EHS' | 'GROUP_FUNCTION' | 'GROUP_ESG_HEAD';
  ownerTitle: string;
  ownerDepartment: string;
  levelOfEntry: 'Project, rolled up' | 'Subsidiary or Group' | 'Group only';
  frequency: 'Monthly' | 'Quarterly or yearly' | 'Yearly';
  isGroupOnly: boolean;
  isProjectLevel: boolean;
}

export function getIndicatorStatutoryMetadata(field: FieldConfig): IndicatorStatutoryMetadata {
  // Section 4 statutory mapping ("Who fills what")
  // 1. Section A: GROUP_FUNCTION (Finance, HR, CS) | Group only | Yearly
  if (field.section === 'A') {
    return {
      ownerRole: 'GROUP_FUNCTION',
      ownerTitle: 'Group Function (Finance, HR, CS)',
      ownerDepartment: 'Finance, HR & Company Secretarial',
      levelOfEntry: 'Group only',
      frequency: 'Yearly',
      isGroupOnly: true,
      isProjectLevel: false,
    };
  }

  // 2. Section B: GROUP_ESG_HEAD (with Legal) | Group only | Yearly
  if (field.section === 'B') {
    return {
      ownerRole: 'GROUP_ESG_HEAD',
      ownerTitle: 'Group ESG Head (CSO)',
      ownerDepartment: 'Corporate ESG & Legal',
      levelOfEntry: 'Group only',
      frequency: 'Yearly',
      isGroupOnly: true,
      isProjectLevel: false,
    };
  }

  // 3. Section C: P6 (fuel, electricity, water, waste) | SITE_ENGINEER | Project, rolled up | Monthly
  if (field.section === 'C' && field.principleNumber === 6) {
    return {
      ownerRole: 'SITE_ENGINEER',
      ownerTitle: 'Site Engineer',
      ownerDepartment: 'Engineering, Plant & Machinery (P&M)',
      levelOfEntry: 'Project, rolled up',
      frequency: 'Monthly',
      isGroupOnly: false,
      isProjectLevel: true,
    };
  }

  // 4. Section C: P3 (safety) | SITE_EHS | Project, rolled up | Monthly
  if (
    field.section === 'C' && 
    field.principleNumber === 3 && 
    (field.topic === 'Safety' || field.code.includes('SAFE') || field.code.includes('MANHRS') || field.code.includes('TRN'))
  ) {
    return {
      ownerRole: 'SITE_EHS',
      ownerTitle: 'Site Safety & EHS',
      ownerDepartment: 'Environment, Health & Safety (EHS)',
      levelOfEntry: 'Project, rolled up',
      frequency: 'Monthly',
      isGroupOnly: false,
      isProjectLevel: true,
    };
  }

  // 5. Section C: P3 (HR part), P5 | HR (GROUP_FUNCTION) | Subsidiary or Group | Quarterly or yearly
  if (field.section === 'C' && (field.principleNumber === 5 || (field.principleNumber === 3 && field.topic !== 'Safety'))) {
    return {
      ownerRole: 'GROUP_FUNCTION',
      ownerTitle: 'HR & Workforce (Group Function)',
      ownerDepartment: 'Human Resources & Industrial Relations',
      levelOfEntry: 'Subsidiary or Group',
      frequency: 'Quarterly or yearly',
      isGroupOnly: false,
      isProjectLevel: false,
    };
  }

  // 6. Section C: P1, P8, P9 | Legal, CSR, Customer Service (GROUP_FUNCTION) | Group | Yearly
  if (field.section === 'C' && (field.principleNumber === 1 || field.principleNumber === 8 || field.principleNumber === 9)) {
    return {
      ownerRole: 'GROUP_FUNCTION',
      ownerTitle: 'Legal, CSR & CS (Group Function)',
      ownerDepartment: 'Legal, CSR & Customer Service',
      levelOfEntry: 'Group only',
      frequency: 'Yearly',
      isGroupOnly: true,
      isProjectLevel: false,
    };
  }

  return {
    ownerRole: 'GROUP_FUNCTION',
    ownerTitle: 'Group Function',
    ownerDepartment: 'Corporate Governance',
    levelOfEntry: 'Group only',
    frequency: 'Yearly',
    isGroupOnly: true,
    isProjectLevel: false,
  };
}

export function getIndicatorOwnerRole(field: FieldConfig): 'SITE_ENGINEER' | 'SITE_EHS' | 'GROUP_FUNCTION' | 'GROUP_ESG_HEAD' {
  return getIndicatorStatutoryMetadata(field).ownerRole;
}

export const CEA_INDIA_GRID_FACTOR = 0.716; // tCO2 / MWh
export const DIESEL_EMISSION_FACTOR = 2.68; // kgCO2 / Litre
export const PETROL_EMISSION_FACTOR = 2.31; // kgCO2 / Litre
export const LPG_EMISSION_FACTOR = 1.51; // kgCO2 / Litre

export const FIELDS_CONFIG: FieldConfig[] = [
  // ==========================================
  // SECTION C - PRINCIPLE 6: ENVIRONMENT
  // ==========================================
  {
    id: 'ind-p6-e1-s1',
    code: 'P6-E1-S1',
    codeDescription: 'Principle 6, Essential Indicator 1, Emissions, Scope 1 Direct emissions',
    name: 'Scope 1 Direct GHG Emissions',
    description: 'Direct greenhouse gas emissions from stationary combustion, diesel generators, and fleet at construction sites.',
    category: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    topic: 'Emissions',
    unit: 'tCO2e',
    dataType: 'numeric',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: false,
    maxIntDigits: 9,
    maxDecimals: 2,
    min: 0,
    calculatorType: 'scope1',
    defaultEmissionFactor: 2.68,
    emissionFactorUnit: 'kgCO2e / L',
    emissionFactorSource: 'IPCC 2006 / CEA Guidelines 2024',
    methodology: {
      formula: 'Scope 1 (tCO2e) = [Diesel Litres × 2.68 + Petrol Litres × 2.31 + LPG kg × 2.98] / 1000',
      instrumentOrSource: 'DG hour meter log, fuel bowser issue register, bulk fuel purchase invoices',
      documentToUpload: 'Fuel delivery challan, DG log sheet stamped by site supervisor, fuel purchase invoices',
      example: '46,800 Litres diesel consumed in DG sets = (46,800 × 2.68) / 1000 = 125.42 tCO2e'
    }
  },
  {
    id: 'ind-p6-e1-s2',
    code: 'P6-E1-S2',
    codeDescription: 'Principle 6, Essential Indicator 1, Emissions, Scope 2 Grid electricity emissions',
    name: 'Scope 2 Indirect GHG Emissions',
    description: 'Indirect emissions resulting from purchased electricity from the utility grid for site camps, batching plants, and tunneling.',
    category: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    topic: 'Emissions',
    unit: 'tCO2e',
    dataType: 'numeric',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: false,
    maxIntDigits: 9,
    maxDecimals: 2,
    min: 0,
    calculatorType: 'scope2',
    defaultEmissionFactor: CEA_INDIA_GRID_FACTOR,
    emissionFactorUnit: 'tCO2e / MWh',
    emissionFactorSource: 'Central Electricity Authority (CEA) CO2 Baseline Database v19 (2024)',
    methodology: {
      formula: 'Scope 2 (tCO2e) = Electricity (kWh) × CEA Grid Factor (0.716 tCO2/MWh) / 1000',
      instrumentOrSource: 'HT/LT tariff electricity meter, DISCOM utility bill, sub-station logbook',
      documentToUpload: 'Monthly DISCOM power utility invoice with meter reading photo and payment receipt',
      example: '250,000 kWh from grid = (250,000 × 0.716) / 1000 = 179.00 tCO2e'
    }
  },
  {
    id: 'ind-p6-e2-tot',
    code: 'P6-E2-TOT',
    codeDescription: 'Principle 6, Essential Indicator 2, Energy, Total Energy Consumption',
    name: 'Total Energy Consumption',
    description: 'Total energy consumed across project operations including diesel, grid electricity, and captive sources in Giga Joules (GJ).',
    category: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    topic: 'Energy',
    unit: 'GJ',
    dataType: 'numeric',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: false,
    maxIntDigits: 9,
    maxDecimals: 2,
    min: 0,
    calculatorType: 'energy',
    methodology: {
      formula: 'Energy (GJ) = [Diesel (L) × 0.0386] + [Grid Electricity (kWh) × 0.0036] + [LPG (kg) × 0.0461]',
      instrumentOrSource: 'Fuel disbursement registers and electricity bills',
      documentToUpload: 'Consolidated site fuel and power balance sheet certified by Project Manager',
      example: '46,800 L diesel (1,806.48 GJ) + 250,000 kWh (900.00 GJ) = 2,706.48 GJ'
    }
  },
  {
    id: 'ind-p6-e2-ren',
    code: 'P6-E2-REN',
    codeDescription: 'Principle 6, Essential Indicator 2, Energy, Renewable Energy Share percentage',
    name: 'Renewable Energy Share',
    description: 'Percentage of total site energy consumption sourced from renewable sources (rooftop solar, captive wind/hydro).',
    category: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    topic: 'Energy',
    unit: '%',
    dataType: 'percentage',
    isCore: true,
    isMandatory: true,
    requiresEvidence: false,
    allowZero: false,
    maxIntDigits: 3,
    maxDecimals: 2,
    min: 0.01,
    max: 100,
    methodology: {
      formula: 'Renewable Energy Share (%) = [Renewable Energy (GJ) / Total Energy (GJ)] × 100',
      instrumentOrSource: 'Solar inverter net meter reading, wheeling agreement green certificate',
      documentToUpload: 'Solar SCADA generation report or green power wheeling bill',
      example: '324 GJ solar generated ÷ 2,706.48 GJ total energy = 11.97%'
    }
  },
  {
    id: 'ind-p6-e3-wat',
    code: 'P6-E3-WAT',
    codeDescription: 'Principle 6, Essential Indicator 3, Water, Total Water Consumption',
    name: 'Total Water Consumption',
    description: 'Total volume of water withdrawn and consumed from surface, groundwater borewells, and municipal tankers in Kilo Litres (KL).',
    category: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    topic: 'Water',
    unit: 'KL',
    dataType: 'numeric',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: false,
    maxIntDigits: 9,
    maxDecimals: 2,
    min: 0,
    calculatorType: 'water',
    methodology: {
      formula: 'Water (KL) = (Current Meter Reading - Previous Reading) OR (Tanker Count × Tanker Capacity in KL)',
      instrumentOrSource: 'Electromagnetic flow meter, digital borehole meter, tanker trip challans',
      documentToUpload: 'Monthly water flow meter calibration card or water tanker trip log with gate stamp',
      example: 'Borewell meter diff: 8,400 KL + 40 tankers × 20 KL = 9,200.00 KL'
    }
  },
  {
    id: 'ind-p6-e3-dis',
    code: 'P6-E3-DIS',
    codeDescription: 'Principle 6, Essential Indicator 3, Water, Water Discharge and Reuse',
    name: 'Total Water Discharge & Reuse',
    description: 'Treated water safely discharged or recycled for curing, wheel washing, and site dust suppression.',
    category: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    topic: 'Water',
    unit: 'KL',
    dataType: 'numeric',
    isCore: true,
    isMandatory: false,
    requiresEvidence: true,
    allowZero: false,
    maxIntDigits: 9,
    maxDecimals: 2,
    min: 0,
    methodology: {
      formula: 'Water Discharge (KL) = Total STP/ETP Treated Flow Meter Volume Reused/Discharged',
      instrumentOrSource: 'Effluent treatment plant (ETP) / sewage treatment plant (STP) outlet flow meter',
      documentToUpload: 'ETP treated water lab test report & outlet flow meter logbook',
      example: 'STP treated effluent reused for dust suppression = 2,450.00 KL'
    }
  },
  {
    id: 'ind-p6-e4-wst',
    code: 'P6-E4-WST',
    codeDescription: 'Principle 6, Essential Indicator 4, Waste, Total Waste Generated',
    name: 'Total Waste Generated',
    description: 'Total construction, excavation, hazardous, and non-hazardous waste generated at project site in Metric Tonnes (MT).',
    category: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    topic: 'Waste',
    unit: 'MT',
    dataType: 'numeric',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: false,
    maxIntDigits: 9,
    maxDecimals: 2,
    min: 0,
    calculatorType: 'waste',
    methodology: {
      formula: 'Waste Generated (MT) = Sum of weighbridge net slips for excavated rock, rubble, scrap, & hazardous waste',
      instrumentOrSource: 'Site weighbridge terminal, hazardous waste manifest Form 10',
      documentToUpload: 'Weighbridge summary statement and authorized scrap vendor handover slips',
      example: '32 weighbridge slips totaling 1,450.00 MT of muck and excavated rubble'
    }
  },
  {
    id: 'ind-p6-e4-rec',
    code: 'P6-E4-REC',
    codeDescription: 'Principle 6, Essential Indicator 4, Waste, Waste Recycled and Diverted',
    name: 'Waste Recycled / Reused',
    description: 'Quantity of construction aggregates, steel scrap, and rubble recycled or diverted from landfills in Metric Tonnes (MT).',
    category: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    topic: 'Waste',
    unit: 'MT',
    dataType: 'numeric',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: false,
    maxIntDigits: 9,
    maxDecimals: 2,
    min: 0,
    methodology: {
      formula: 'Waste Recycled (MT) = Aggregates crushed for backfill + Steel scrap dispatched to recycling mill',
      instrumentOrSource: 'Crusher plant weighbridge log and authorized recycler dispatch challans',
      documentToUpload: 'Recycler gate receipts and State Pollution Control Board certified recyclers manifest',
      example: '986.00 MT rubble used for embankment backfill + 120.00 MT steel scrap = 1,106.00 MT'
    }
  },

  // ==========================================
  // SECTION A: GENERAL DISCLOSURES & WORKFORCE
  // ==========================================
  {
    id: 'ind-a-18-emp-tot',
    code: 'A-18-EMP-TOT',
    codeDescription: 'Section A, Q18, Employees, Total employee workforce headcount',
    name: 'Total Employee Workforce',
    description: 'Total active headcount of on-roll permanent staff and contractual personnel assigned to this site.',
    category: 'SOCIAL',
    section: 'A',
    topic: 'Workforce',
    unit: 'Count',
    dataType: 'count',
    isCore: false,
    isMandatory: true,
    requiresEvidence: false,
    allowZero: false,
    maxIntDigits: 7,
    maxDecimals: 0,
    min: 1,
    methodology: {
      formula: 'Total Workforce = Permanent Employees (Payroll) + Contractual Site Workforce (Muster Roll)',
      instrumentOrSource: 'Biometric site access register, HRMS active deployment muster roll',
      documentToUpload: 'Monthly HR muster roll certified by Site HR Manager',
      example: '240 personnel on biometric attendance register'
    }
  },
  {
    id: 'ind-a-18-emp-perm',
    code: 'A-18-EMP-PERM',
    codeDescription: 'Section A, Q18, Employees, Permanent payroll employees',
    name: 'Permanent Employees',
    description: 'Number of full-time permanent employees registered under company payroll stationed at this site.',
    category: 'SOCIAL',
    section: 'A',
    topic: 'Workforce',
    unit: 'Count',
    dataType: 'count',
    isCore: false,
    isMandatory: true,
    requiresEvidence: false,
    allowZero: false,
    maxIntDigits: 7,
    maxDecimals: 0,
    min: 1,
    methodology: {
      formula: 'Count of active employee codes under permanent company salary roll on last day of month',
      instrumentOrSource: 'SAP/ERP HR personnel master list',
      documentToUpload: 'Site permanent personnel payroll summary extract',
      example: '62 permanent engineers, managers, and safety officers'
    }
  },
  {
    id: 'ind-a-18-fem-rep',
    code: 'A-18-FEM-REP',
    codeDescription: 'Section A, Q18, Diversity, Female Workforce Representation percentage',
    name: 'Female Workforce Representation',
    description: 'Percentage of female representation across site engineering, lab testing, supervision, and administration.',
    category: 'SOCIAL',
    section: 'A',
    topic: 'Workforce',
    unit: '%',
    dataType: 'percentage',
    isCore: true,
    isMandatory: true,
    requiresEvidence: false,
    allowZero: false,
    maxIntDigits: 3,
    maxDecimals: 2,
    min: 0.01,
    max: 100,
    methodology: {
      formula: 'Female Representation (%) = (Female Headcount / Total Site Workforce) × 100',
      instrumentOrSource: 'Gender-segregated biometric attendance report',
      documentToUpload: 'HR gender diversity deployment report',
      example: '30 female personnel ÷ 240 total personnel = 12.50%'
    }
  },
  {
    id: 'ind-a-19-diff-abl',
    code: 'A-19-DIFF-ABL',
    codeDescription: 'Section A, Q19, Diversity, Differently Abled Employees count',
    name: 'Differently Abled Employees',
    description: 'Count of differently-abled workforce actively employed in project administrative and engineering units.',
    category: 'SOCIAL',
    section: 'A',
    topic: 'Workforce',
    unit: 'Count',
    dataType: 'count',
    isCore: true,
    isMandatory: true,
    requiresEvidence: false,
    allowZero: true, // allowZero enabled with confirmation checkbox
    maxIntDigits: 7,
    maxDecimals: 0,
    min: 0,
    methodology: {
      formula: 'Count of differently-abled employees declared under RPwD Act 2016 guidelines',
      instrumentOrSource: 'HR employee diversity declarations and medical records',
      documentToUpload: 'HR muster roll or confirmation letter',
      example: '0 or 2 employees deployed in CAD drafting/stores'
    }
  },

  // ==========================================
  // SECTION C - PRINCIPLE 3: SOCIAL & SAFETY
  // ==========================================
  {
    id: 'ind-p3-e1-well',
    code: 'P3-E1-WELL',
    codeDescription: 'Principle 3, Essential Indicator 1, Wellbeing, Employee Insurance Coverage',
    name: 'Employee Wellbeing & Health Insurance Coverage',
    description: 'Percentage of total workforce covered by medical insurance, accident policy, and workmen compensation.',
    category: 'SOCIAL',
    section: 'C',
    principleNumber: 3,
    principleName: 'Principle 3: Employee Well-being',
    topic: 'Safety',
    unit: '%',
    dataType: 'percentage',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: false,
    maxIntDigits: 3,
    maxDecimals: 2,
    min: 0.01,
    max: 100,
    methodology: {
      formula: 'Coverage (%) = (Insured Personnel with active policy / Total Site Workforce) × 100',
      instrumentOrSource: 'Group mediclaim and Workmen Compensation (WC) policy endorsement rolls',
      documentToUpload: 'Current insurance policy copy with endorsed site personnel headcount sheet',
      example: '221 insured personnel ÷ 240 total = 92.08%'
    }
  },
  {
    id: 'ind-p3-e2-safe-ltir',
    code: 'P3-E2-SAFE-LTIR',
    codeDescription: 'Principle 3, Essential Indicator 2, Safety, Lost Time Injury Frequency Rate (LTIFR)',
    name: 'Lost Time Injury Frequency Rate (LTIFR)',
    description: 'Rate of lost time injuries per million person-hours worked across project execution sites.',
    category: 'SOCIAL',
    section: 'C',
    principleNumber: 3,
    principleName: 'Principle 3: Employee Well-being',
    topic: 'Safety',
    unit: 'Rate / Million Hours',
    dataType: 'numeric',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: true, // zero allowed when zero injuries
    maxIntDigits: 7,
    maxDecimals: 2,
    min: 0,
    calculatorType: 'ltifr',
    methodology: {
      formula: 'LTIFR = (Number of Lost Time Injuries × 1,000,000) / Total Man-Hours Worked',
      instrumentOrSource: 'EHS incident logbook and daily site man-hour attendance records',
      documentToUpload: 'Monthly EHS Safety Statistics Report signed by Site Safety Head',
      example: '0 injuries × 1,000,000 ÷ 125,000 man-hours = 0.00'
    }
  },
  {
    id: 'ind-p3-e2-safe-fat',
    code: 'P3-E2-SAFE-FAT',
    codeDescription: 'Principle 3, Essential Indicator 2, Safety, Work-Related Fatalities count',
    name: 'Fatalities at Project Sites',
    description: 'Number of work-related fatal safety incidents recorded during the reporting financial period.',
    category: 'SOCIAL',
    section: 'C',
    principleNumber: 3,
    principleName: 'Principle 3: Employee Well-being',
    topic: 'Safety',
    unit: 'Count',
    dataType: 'count',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: true, // allowZero=true: Zero needs confirmation checkbox + 1 proof file
    maxIntDigits: 7,
    maxDecimals: 0,
    min: 0,
    methodology: {
      formula: 'Count of fatalities investigated and registered under Factories Act / BOCW Act',
      instrumentOrSource: 'EHS statutory accident register (Form 21 / Form 24)',
      documentToUpload: 'Monthly EHS Zero Incident Certificate or statutory accident closure report',
      example: '0 fatalities recorded with certified EHS audit declaration'
    }
  },
  {
    id: 'ind-p3-e4-trn',
    code: 'P3-E4-TRN',
    codeDescription: 'Principle 3, Essential Indicator 4, Training, Safety & Skill Training Hours',
    name: 'Average Safety & Skill Training Hours',
    description: 'Average hours of safety induction, tool-box talks (TBT), and technical training per worker.',
    category: 'SOCIAL',
    section: 'C',
    principleNumber: 3,
    principleName: 'Principle 3: Employee Well-being',
    topic: 'Safety',
    unit: 'Hours/Person',
    dataType: 'numeric',
    isCore: false,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: false,
    maxIntDigits: 7,
    maxDecimals: 2,
    min: 0.1,
    methodology: {
      formula: 'Avg Training Hours = Total Training Man-Hours (Inductions + TBT + Technical) / Total Workforce',
      instrumentOrSource: 'Tool-box talk attendance sign-sheets and induction records',
      documentToUpload: 'Monthly safety training register with participant signature logs',
      example: '7,680 training person-hours ÷ 240 personnel = 32.00 hours/person'
    }
  },

  // ==========================================
  // SECTION C - PRINCIPLE 1, 5, 8, 9: GOVERNANCE
  // ==========================================
  {
    id: 'ind-p1-e1-eth',
    code: 'P1-E1-ETH',
    codeDescription: 'Principle 1, Essential Indicator 1, Ethics, Anti-Corruption Training Coverage',
    name: 'Anti-Corruption & Business Ethics Coverage',
    description: 'Percentage of site supervisory, procurement, and billing staff trained on Anti-Bribery Code of Conduct.',
    category: 'GOVERNANCE',
    section: 'C',
    principleNumber: 1,
    principleName: 'Principle 1: Business Ethics & Integrity',
    topic: 'Ethics',
    unit: '%',
    dataType: 'percentage',
    isCore: false,
    isMandatory: true,
    requiresEvidence: false,
    allowZero: false,
    maxIntDigits: 3,
    maxDecimals: 2,
    min: 0.01,
    max: 100,
    methodology: {
      formula: 'Coverage (%) = (Staff Completed Anti-Bribery Module / Total Supervisory Staff) × 100',
      instrumentOrSource: 'LMS completion log and signed ethics compliance undertakings',
      documentToUpload: 'Signed site procurement & supervisory ethics undertaking register',
      example: '38 trained personnel ÷ 40 staff = 95.00%'
    }
  },
  {
    id: 'ind-p5-e1-grv',
    code: 'P5-E1-GRV',
    codeDescription: 'Principle 5, Essential Indicator 1, Human Rights, Community Grievances Filed',
    name: 'Human Rights & Community Grievances Filed',
    description: 'Total number of grievances received through whistle-blower hotline, local community desk, or labor union.',
    category: 'GOVERNANCE',
    section: 'C',
    principleNumber: 5,
    principleName: 'Principle 5: Human Rights & Equity',
    topic: 'Ethics',
    unit: 'Count',
    dataType: 'count',
    isCore: false,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: true, // allowZero=true
    maxIntDigits: 7,
    maxDecimals: 0,
    min: 0,
    methodology: {
      formula: 'Count of formal grievances logged in public liaison register or grievance box',
      instrumentOrSource: 'Public grievance register and site labor welfare committee minutes',
      documentToUpload: 'Grievance register extract or Nil Grievances declaration by Site Liaison Officer',
      example: '0 complaints received; certified by Site HR & Admin Head'
    }
  },
  {
    id: 'ind-p8-e1-msme',
    code: 'P8-E1-MSME',
    codeDescription: 'Principle 8, Essential Indicator 1, Value Chain, MSME Sourced Procurement Share',
    name: 'Procurement Spend from MSME Suppliers',
    description: 'Percentage of site local procurement spend sourced directly from registered Micro, Small, and Medium Enterprises (MSMEs).',
    category: 'GOVERNANCE',
    section: 'C',
    principleNumber: 8,
    principleName: 'Principle 8: Inclusive Growth',
    topic: 'Governance',
    unit: '%',
    dataType: 'percentage',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: false,
    maxIntDigits: 3,
    maxDecimals: 2,
    min: 0.01,
    max: 100,
    methodology: {
      formula: 'MSME Share (%) = (Total Invoiced Spend with Udyam-Registered MSME Vendors / Total Spend) × 100',
      instrumentOrSource: 'ERP purchase register and vendor Udyam registration certificates',
      documentToUpload: 'Quarterly MSME vendor procurement spend statement certified by site accounts',
      example: '₹31.2 Lakh MSME spend ÷ ₹120.0 Lakh total site purchases = 26.00%'
    }
  },
  {
    id: 'ind-p9-e1-cyber',
    code: 'P9-E1-CYBER',
    codeDescription: 'Principle 9, Essential Indicator 1, Governance, Customer Data & Cyber Incidents',
    name: 'Customer Data & Cybersecurity Incidents',
    description: 'Number of verified site telemetry data breaches, ransomware incidents, or client confidential data leaks.',
    category: 'GOVERNANCE',
    section: 'C',
    principleNumber: 9,
    principleName: 'Principle 9: Consumer Value & Responsibility',
    topic: 'Governance',
    unit: 'Count',
    dataType: 'count',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: true, // allowZero=true
    maxIntDigits: 7,
    maxDecimals: 0,
    min: 0,
    methodology: {
      formula: 'Count of IT security incidents logged with SOC or CERT-In reports',
      instrumentOrSource: 'Site IT network firewall logs and EDR console',
      documentToUpload: 'Monthly IT security compliance certificate by Site Systems Engineer',
      example: '0 cyber incidents logged for the period'
    }
  },

  // ==========================================
  // PHASE 2 FIELDS: ADDITIONAL BRSR CORE EXPANSIONS
  // ==========================================
  {
    id: 'ind-p6-e2-fuel-split',
    code: 'P6-E2-FUEL',
    codeDescription: 'Principle 6, Essential Indicator 2, Energy, Fuel Combustion Diesel & Petrol split',
    name: 'Stationary & Mobile Fuel Combustion',
    description: 'Quantity of high-speed diesel, petrol, and lubricants consumed in site plant, machinery, and vehicles in Litres.',
    category: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    topic: 'Energy',
    unit: 'Litres',
    dataType: 'numeric',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: false,
    maxIntDigits: 9,
    maxDecimals: 2,
    min: 0,
    methodology: {
      formula: 'Total Fuel (L) = DG Fuel Dispensed (L) + Heavy Equipment Fuel Dispensed (L)',
      instrumentOrSource: 'Fuel storage bowser calibrated flow meter and daily dispensing log',
      documentToUpload: 'Fuel stock reconciliation report and supplier delivery challans',
      example: '46,800.00 Litres HSD dispensed across 3 DG sets and 4 excavators'
    }
  },
  {
    id: 'ind-p6-e2-elec-split',
    code: 'P6-E2-ELEC',
    codeDescription: 'Principle 6, Essential Indicator 2, Energy, Purchased Grid Electricity in kWh',
    name: 'Purchased Grid Electricity',
    description: 'Total electricity purchased from the distribution utility grid in kilowatt-hours (kWh).',
    category: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    topic: 'Energy',
    unit: 'kWh',
    dataType: 'numeric',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: false,
    maxIntDigits: 9,
    maxDecimals: 2,
    min: 0,
    methodology: {
      formula: 'Electricity (kWh) = Active energy consumption recorded on DISCOM TOD meter',
      instrumentOrSource: 'Tri-vector HT electricity meter',
      documentToUpload: 'Monthly electricity bill with meter reading display photo',
      example: '250,000.00 kWh billed by DISCOM'
    }
  },
  {
    id: 'ind-p6-e3-wat-src',
    code: 'P6-E3-SRC',
    codeDescription: 'Principle 6, Essential Indicator 3, Water, Groundwater extraction volume in KL',
    name: 'Groundwater Extraction Volume',
    description: 'Volume of groundwater pumped from authorized site borewells in Kilo Litres (KL).',
    category: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    topic: 'Water',
    unit: 'KL',
    dataType: 'numeric',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: false,
    maxIntDigits: 9,
    maxDecimals: 2,
    min: 0,
    methodology: {
      formula: 'Groundwater Volume (KL) = Borewell digital flow meter end reading - start reading',
      instrumentOrSource: 'CGWA-compliant telemetry flow meter on borewell discharge line',
      documentToUpload: 'Central Ground Water Authority (CGWA) log sheet and meter photograph',
      example: '8,400.00 KL pumped over the reporting period'
    }
  },
  {
    id: 'ind-p6-e4-haz-wst',
    code: 'P6-E4-HAZ',
    codeDescription: 'Principle 6, Essential Indicator 4, Waste, Hazardous Waste generated in MT',
    name: 'Hazardous Waste Disposed',
    description: 'Quantity of used lube oil, oily rags, chemical containers, and contaminated filters in Metric Tonnes (MT).',
    category: 'ENVIRONMENT',
    section: 'C',
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    topic: 'Waste',
    unit: 'MT',
    dataType: 'numeric',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: true, // allowZero=true with confirmation
    maxIntDigits: 9,
    maxDecimals: 2,
    min: 0,
    methodology: {
      formula: 'Hazardous Waste (MT) = Sum of weights on Hazardous Waste Manifest Form 10',
      instrumentOrSource: 'State PCB Form 10 hazardous waste manifest',
      documentToUpload: 'SPCB authorized TSDF facility receipt or Form 10 manifest signed by transporter',
      example: '4.80 MT of used hydraulic oil barrels dispatched to TSDF'
    }
  },
  {
    id: 'ind-a-18-contr-wrk',
    code: 'A-18-CONTR',
    codeDescription: 'Section A, Q18, Workers, Contract and subcontract labour count',
    name: 'Contractual Construction Workers',
    description: 'Count of contract workers and trade laborers deployed by civil subcontractors at site.',
    category: 'SOCIAL',
    section: 'A',
    topic: 'Workforce',
    unit: 'Count',
    dataType: 'count',
    isCore: true,
    isMandatory: true,
    requiresEvidence: false,
    allowZero: false,
    maxIntDigits: 7,
    maxDecimals: 0,
    min: 1,
    methodology: {
      formula: 'Count of active contractual workers registered on site wage sheet under CLRA Act 1970',
      instrumentOrSource: 'Contract Labor Regulation Act (CLRA) Form XVI muster roll',
      documentToUpload: 'Subcontractor wage sheet certified by site EHS and admin officer',
      example: '178 contract workers on site'
    }
  },
  {
    id: 'ind-p3-e2-safe-inj',
    code: 'P3-E2-INJ',
    codeDescription: 'Principle 3, Essential Indicator 2, Safety, Lost Time Work Injuries count',
    name: 'Lost Time Work-Related Injuries',
    description: 'Number of reportable workplace injuries resulting in more than 48 hours absence from work.',
    category: 'SOCIAL',
    section: 'C',
    principleNumber: 3,
    principleName: 'Principle 3: Employee Well-being',
    topic: 'Safety',
    unit: 'Count',
    dataType: 'count',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: true, // allowZero=true
    maxIntDigits: 7,
    maxDecimals: 0,
    min: 0,
    methodology: {
      formula: 'Count of lost time injury cases recorded in statutory accident register',
      instrumentOrSource: 'EHS incident report and site first-aid dispensary log',
      documentToUpload: 'EHS Incident Investigation Report or Zero Incident declaration',
      example: '0 injuries recorded'
    }
  },
  {
    id: 'ind-p3-e2-man-hrs',
    code: 'P3-E2-MANHRS',
    codeDescription: 'Principle 3, Essential Indicator 2, Safety, Total Person-Hours worked',
    name: 'Total Person-Hours Worked',
    description: 'Cumulative operational person-hours worked across all shifts at project site.',
    category: 'SOCIAL',
    section: 'C',
    principleNumber: 3,
    principleName: 'Principle 3: Employee Well-being',
    topic: 'Safety',
    unit: 'Hours',
    dataType: 'numeric',
    isCore: true,
    isMandatory: true,
    requiresEvidence: false,
    allowZero: false,
    maxIntDigits: 9,
    maxDecimals: 0,
    min: 1,
    methodology: {
      formula: 'Person-Hours = Daily headcount × daily working hours (8) × operating days in month',
      instrumentOrSource: 'Gate biometric attendance system total hours report',
      documentToUpload: 'Monthly cumulative site man-hours certification',
      example: '125,000 person-hours worked'
    }
  },
  {
    id: 'ind-p5-e2-posh',
    code: 'P5-E2-POSH',
    codeDescription: 'Principle 5, Essential Indicator 2, Governance, POSH Complaints Received',
    name: 'POSH Sexual Harassment Complaints',
    description: 'Complaints filed under Prevention of Sexual Harassment (POSH) Act 2013 during reporting cycle.',
    category: 'GOVERNANCE',
    section: 'C',
    principleNumber: 5,
    principleName: 'Principle 5: Human Rights & Equity',
    topic: 'Ethics',
    unit: 'Count',
    dataType: 'count',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: true, // allowZero=true
    maxIntDigits: 7,
    maxDecimals: 0,
    min: 0,
    methodology: {
      formula: 'Count of formal complaints registered with Internal Committee (IC)',
      instrumentOrSource: 'POSH Internal Complaints Committee annual statutory log',
      documentToUpload: 'Internal Committee annual statutory return extract or Nil report declaration',
      example: '0 complaints filed'
    }
  },
  {
    id: 'ind-p5-e3-child-lab',
    code: 'P5-E3-CHILD',
    codeDescription: 'Principle 5, Essential Indicator 3, Human Rights, Child or Forced Labour Cases',
    name: 'Child, Forced or Involuntary Labour Cases',
    description: 'Incidents of child labour or forced/bonded labour identified or reported at site.',
    category: 'GOVERNANCE',
    section: 'C',
    principleNumber: 5,
    principleName: 'Principle 5: Human Rights & Equity',
    topic: 'Ethics',
    unit: 'Count',
    dataType: 'count',
    isCore: true,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: true, // allowZero=true
    maxIntDigits: 7,
    maxDecimals: 0,
    min: 0,
    methodology: {
      formula: 'Count of underage or forced labor violations identified during audits',
      instrumentOrSource: 'Labor gate pass age verification register (Aadhaar cross-check)',
      documentToUpload: 'Child labour compliance audit report or Nil certificate',
      example: '0 violations found'
    }
  },

  // ==========================================
  // SECTION B - MANAGEMENT & PROCESS DISCLOSURES
  // ==========================================
  {
    id: 'ind-b-pol-gov',
    code: 'B-POL-GOV',
    codeDescription: 'Section B, Policy & Governance, Corporate ESG Policy Commitments',
    name: 'Corporate ESG Policy & Governance Coverage',
    description: 'Percentage of the nine National Guidelines on Responsible Business Conduct (NGRBC) principles covered by Board-approved corporate policies.',
    category: 'GOVERNANCE',
    section: 'B',
    topic: 'Governance',
    unit: '%',
    dataType: 'percentage',
    isCore: false,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: false,
    maxIntDigits: 3,
    maxDecimals: 2,
    min: 0,
    max: 100,
    methodology: {
      formula: '(Number of NGRBC Principles Covered by Active Policies / 9) × 100',
      instrumentOrSource: 'MEIL Board Resolutions and Corporate Sustainability Charter',
      documentToUpload: 'Board-approved ESG Policy documents with sign-off extracts',
      example: '9 covered principles / 9 = 100.00%'
    }
  },
  {
    id: 'ind-b-stake-eng',
    code: 'B-STAKE-ENG',
    codeDescription: 'Section B, Stakeholder Engagement, Consultation & Grievance Governance',
    name: 'Stakeholder Consultation & Grievance Governance',
    description: 'Proportion of key stakeholder groups (communities, employees, supply chain) covered by formal grievance redressing mechanisms.',
    category: 'GOVERNANCE',
    section: 'B',
    topic: 'Governance',
    unit: '%',
    dataType: 'percentage',
    isCore: false,
    isMandatory: true,
    requiresEvidence: true,
    allowZero: false,
    maxIntDigits: 3,
    maxDecimals: 2,
    min: 0,
    max: 100,
    methodology: {
      formula: '(Covered Stakeholder Groups with Formal Redressal / Total Identified Key Stakeholders) × 100',
      instrumentOrSource: 'Corporate Stakeholder Engagement Matrix and Ombudsperson Charter',
      documentToUpload: 'Stakeholder Consultation Annual Summary Report',
      example: '5 covered groups / 5 = 100.00%'
    }
  }
];

// Helper to calculate Indian Financial Year from system date
export function getCurrentIndianFinancialYear(): { financialYear: string; id: string; startDate: string; endDate: string } {
  const now = new Date();
  const month = now.getMonth(); // 0 is January, 3 is April
  const year = now.getFullYear();
  const startYear = month >= 3 ? year : year - 1;
  const endYear = startYear + 1;
  const shortEnd = String(endYear).slice(-2);
  return {
    financialYear: `FY ${startYear}-${shortEnd}`,
    id: `fy-${startYear}-${shortEnd}`,
    startDate: `${startYear}-04-01`,
    endDate: `${endYear}-03-31`
  };
}

// Validator helper function
export function validateFieldValue(
  config: FieldConfig,
  rawValue: string | number | undefined,
  hasConfirmedZero: boolean,
  hasProofFile: boolean
): { isValid: boolean; error?: string } {
  if (rawValue === undefined || rawValue === '' || rawValue === null) {
    return { isValid: false, error: 'Value is required and cannot be empty on submit.' };
  }

  const str = String(rawValue).trim();

  // Block negative characters, exponent characters
  if (str.includes('-') || str.toLowerCase().includes('e')) {
    return { isValid: false, error: 'Negative numbers and exponents are not allowed.' };
  }

  const num = Number(str);
  if (isNaN(num)) {
    return { isValid: false, error: 'Please enter a valid numeric value.' };
  }

  if (num < 0) {
    return { isValid: false, error: 'Value cannot be negative (min: 0).' };
  }

  // Integer check for counts
  if (config.dataType === 'count' && !Number.isInteger(num)) {
    return { isValid: false, error: 'Count fields must be whole numbers (integers only).' };
  }

  // Zero handling
  if (num === 0) {
    if (!config.allowZero) {
      return { isValid: false, error: 'Enter a value greater than 0. Zero is not permitted for this field.' };
    }
    // allowZero=true exception
    if (!hasConfirmedZero) {
      return { isValid: false, error: 'Please check "Confirm zero incidents" to submit a value of 0.' };
    }
    if (!hasProofFile) {
      return { isValid: false, error: 'At least 1 supporting declaration/proof document is required to confirm zero.' };
    }
  }

  // Percentage bounds
  if (config.dataType === 'percentage') {
    if (num < 0.01 || num > 100) {
      return { isValid: false, error: 'Percentage must be between 0.01% and 100%.' };
    }
  }

  // Digit limits
  const parts = str.split('.');
  const intPart = parts[0];
  const decPart = parts[1] || '';

  if (intPart.length > config.maxIntDigits) {
    return { isValid: false, error: `Exceeds maximum of ${config.maxIntDigits} integer digits.` };
  }

  if (decPart.length > config.maxDecimals) {
    return { isValid: false, error: `Exceeds maximum of ${config.maxDecimals} decimal places.` };
  }

  return { isValid: true };
}

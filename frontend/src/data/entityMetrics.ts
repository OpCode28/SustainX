import { DashboardSummary } from '../types';

export interface EntityMetricsRecord extends DashboardSummary {
  orgId: string;
  orgName: string;
  orgType: 'GROUP' | 'SUBSIDIARY' | 'BUSINESS_UNIT' | 'PROJECT';
}

export interface EntityLeagueItem {
  id: string;
  name: string;
  type: string;
  vertical: string;
  completionRate: number;
  status: 'HEALTHY' | 'ON_TRACK' | 'NEEDS_ATTENTION' | 'CRITICAL';
  totalProjects: number;
  submittedProjects: number;
  pendingReview: number;
  scope1_2_tCO2e: number;
  scope3_tCO2e: number;
  lastUpdated: string;
  workflow: {
    draft: number;
    submitted: number;
    approved: number;
    locked: number;
  };
}

export interface BrsrCoreAttributeItem {
  attributeNumber: number;
  principleNumber: number;
  principleName: string;
  name: string;
  description: string;
  unit: string;
  status: 'ASSURED' | 'READY_FOR_ASSURANCE' | 'IN_VERIFICATION' | 'ACTION_REQUIRED';
  assuranceLevel: 'Reasonable Assurance' | 'Limited Assurance';
  evidenceCount: number;
  measuredShare: number;
  valueDisplay: string;
  traceabilityPath: string;
}

export interface DecarbonisationTarget {
  baselineYear: string;
  baselineEmissions_tCO2e: number;
  targetYear: string;
  targetReductionPercent: number;
  targetEmissions_tCO2e: number;
  currentActual_tCO2e: number;
  currentReductionPercent: number;
  status: 'AHEAD_OF_TARGET' | 'ON_TRACK' | 'AT_RISK';
}

// 1. All 9 BRSR Core Attributes mandated by SEBI Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122
export const BRSR_CORE_9_ATTRIBUTES: BrsrCoreAttributeItem[] = [
  {
    attributeNumber: 1,
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    name: 'Greenhouse Gas Footprint (Scope 1, 2 & 3)',
    description: 'Scope 1 direct emissions, Scope 2 location/market-based electricity, Scope 3 value chain, and intensity per ₹ turnover & PPP.',
    unit: 'tCO₂e & tCO₂e/₹ Cr',
    status: 'READY_FOR_ASSURANCE',
    assuranceLevel: 'Reasonable Assurance',
    evidenceCount: 28,
    measuredShare: 92,
    valueDisplay: '212,550 tCO₂e (Intensity: 1.45 / ₹ Cr)',
    traceabilityPath: '/traceability'
  },
  {
    attributeNumber: 2,
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    name: 'Water Consumption & Discharge Intensity',
    description: 'Total water withdrawal by source, surface extraction, groundwater, recycled water share and turnover intensity.',
    unit: 'KL & KL/₹ Cr',
    status: 'ASSURED',
    assuranceLevel: 'Reasonable Assurance',
    evidenceCount: 16,
    measuredShare: 94,
    valueDisplay: '412,800 KL (Intensity: 28.17 / ₹ Cr)',
    traceabilityPath: '/traceability'
  },
  {
    attributeNumber: 3,
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    name: 'Energy Footprint & Renewable Electricity Share',
    description: 'Total fuel and electricity consumption in GJ, renewable mix (solar, wind, captive hydro) and energy intensity.',
    unit: 'GJ & % RE',
    status: 'ASSURED',
    assuranceLevel: 'Reasonable Assurance',
    evidenceCount: 22,
    measuredShare: 96,
    valueDisplay: '1,845,200 GJ (38.4% Renewable)',
    traceabilityPath: '/traceability'
  },
  {
    attributeNumber: 4,
    principleNumber: 6,
    principleName: 'Principle 6: Environmental Protection',
    name: 'Waste Generation & Circular Recovery',
    description: 'Hazardous and non-hazardous waste generation by category, recovery, recycling, co-processing and landfill diversion.',
    unit: 'MT & % Diverted',
    status: 'ASSURED',
    assuranceLevel: 'Reasonable Assurance',
    evidenceCount: 19,
    measuredShare: 89,
    valueDisplay: '84,200 MT (74.2% Diverted)',
    traceabilityPath: '/traceability'
  },
  {
    attributeNumber: 5,
    principleNumber: 3,
    principleName: 'Principle 3: Employee Well-being',
    name: 'Employee Health & Safety (LTIFR & Fatalities)',
    description: 'Lost Time Injury Frequency Rate (LTIFR), zero fatalities track, total recordable injury frequency rate across permanent & contract labour.',
    unit: 'Rate per million hrs',
    status: 'ASSURED',
    assuranceLevel: 'Reasonable Assurance',
    evidenceCount: 34,
    measuredShare: 100,
    valueDisplay: 'LTIFR: 0.12 | 0 Fatalities (Healthy)',
    traceabilityPath: '/review'
  },
  {
    attributeNumber: 6,
    principleNumber: 5,
    principleName: 'Principle 5: Human Rights & Equity',
    name: 'Gender Diversity & Equal Opportunities',
    description: 'Female representation across Board of Directors, Key Management Personnel, executive leadership and site engineering workforce.',
    unit: '% & Ratio',
    status: 'ASSURED',
    assuranceLevel: 'Reasonable Assurance',
    evidenceCount: 14,
    measuredShare: 100,
    valueDisplay: '18.4% Female (22% Exec) | Parity: 1.02:1',
    traceabilityPath: '/reports'
  },
  {
    attributeNumber: 7,
    principleNumber: 3,
    principleName: 'Principle 3: Employee Well-being',
    name: 'Fair Living Wages & Statutory Minimum Wages',
    description: 'Percentage of permanent, contractual and third-party site workers paid at or above living wage / prevailing statutory minimum wage.',
    unit: '% Compliant',
    status: 'ASSURED',
    assuranceLevel: 'Reasonable Assurance',
    evidenceCount: 21,
    measuredShare: 100,
    valueDisplay: '100% Workforce Paid >= Fair Wage',
    traceabilityPath: '/reports'
  },
  {
    attributeNumber: 8,
    principleNumber: 5,
    principleName: 'Principle 5: Human Rights & Equity',
    name: 'Gross Wages Paid to Women & Wage Equality',
    description: 'Ratio of median remuneration of women to men for each category of employees and gross wages paid to female personnel.',
    unit: 'Ratio F:M',
    status: 'ASSURED',
    assuranceLevel: 'Reasonable Assurance',
    evidenceCount: 12,
    measuredShare: 100,
    valueDisplay: 'Female-to-Male Remuneration: 1.02 : 1',
    traceabilityPath: '/reports'
  },
  {
    attributeNumber: 9,
    principleNumber: 1,
    principleName: 'Principle 1 & 8: Integrity & Value Chain',
    name: 'Openness of Business, Anti-Corruption & MSME Spend',
    description: 'Anti-bribery/corruption training coverage, zero regulatory fines/penalties, and procurement spend with MSMEs & Tier-2/3 vendors.',
    unit: '% MSME & Cases',
    status: 'READY_FOR_ASSURANCE',
    assuranceLevel: 'Reasonable Assurance',
    evidenceCount: 26,
    measuredShare: 95,
    valueDisplay: '0 Fines | 27.5% MSME Spend (>25% Met)',
    traceabilityPath: '/reports'
  }
];

// 2. Trajectory for MEIL Group 2030 Decarbonisation
export const MEIL_DECARBONISATION_TRAJECTORY: DecarbonisationTarget = {
  baselineYear: 'FY 2023-24',
  baselineEmissions_tCO2e: 242600,
  targetYear: 'FY 2029-30',
  targetReductionPercent: 25.0,
  targetEmissions_tCO2e: 181950,
  currentActual_tCO2e: 212550,
  currentReductionPercent: 12.39,
  status: 'AHEAD_OF_TARGET'
};

// 3. Subsidiary League Table
export const SUBSIDIARY_LEAGUE_TABLE: EntityLeagueItem[] = [
  {
    id: 'sub-energy',
    name: 'MEIL Clean Energy Ltd',
    type: 'SUBSIDIARY',
    vertical: 'Clean Power Generation & Renewables',
    completionRate: 90,
    status: 'HEALTHY',
    totalProjects: 4,
    submittedProjects: 4,
    pendingReview: 0,
    scope1_2_tCO2e: 27550,
    scope3_tCO2e: 7800,
    lastUpdated: '12 Oct 2026, 08:45 AM',
    workflow: { draft: 1, submitted: 2, approved: 29, locked: 0 }
  },
  {
    id: 'sub-infra',
    name: 'MEIL Infrastructure Projects Ltd',
    type: 'SUBSIDIARY',
    vertical: 'Urban Mass Rapid Transit & Expressways',
    completionRate: 86,
    status: 'ON_TRACK',
    totalProjects: 4,
    submittedProjects: 3,
    pendingReview: 1,
    scope1_2_tCO2e: 94200,
    scope3_tCO2e: 27600,
    lastUpdated: '12 Oct 2026, 09:12 AM',
    workflow: { draft: 2, submitted: 3, approved: 45, locked: 0 }
  },
  {
    id: 'sub-water',
    name: 'MEIL Hydro & Water Corp',
    type: 'SUBSIDIARY',
    vertical: 'Water Management & Lift Irrigation',
    completionRate: 84,
    status: 'NEEDS_ATTENTION',
    totalProjects: 4,
    submittedProjects: 3,
    pendingReview: 1,
    scope1_2_tCO2e: 42600,
    scope3_tCO2e: 12800,
    lastUpdated: '11 Oct 2026, 17:30 PM',
    workflow: { draft: 1, submitted: 3, approved: 38, locked: 0 }
  }
];

// 4. Entity Specific Metrics Repository
export const ENTITY_METRICS_MAP: Record<string, EntityMetricsRecord> = {
  // 4.1 GROUP LEVEL
  'meil-group': {
    orgId: 'meil-group',
    orgName: 'MEIL Group (Consolidated Corporate Aggregate)',
    orgType: 'GROUP',
    totalProjects: 12,
    submittedProjects: 10,
    pendingReviewProjects: 2,
    overallReadinessPercent: 89,
    brsrCoreReadinessPercent: 91,
    governanceAdherencePercent: 94,
    sectionAReadiness: 96,
    sectionBReadiness: 88,
    sectionCReadiness: 82,
    turnoverCr: 14650,
    turnoverMUsdPPP: 5120,
    environmentalSummary: {
      energyConsumptionGJ: 1845200,
      renewableEnergyPercent: 38.4,
      scope1GHG_tCO2e: 125430,
      scope2GHG_tCO2e: 38920,
      scope3GHG_tCO2e: 48200,
      totalGHG_tCO2e: 212550,
      ghgIntensityPerCrore: 1.45,
      ghgIntensityPPP: 18.2,
      waterConsumptionKL: 412800,
      waterIntensityKL: 28.17,
      wasteGeneratedMT: 84200,
      wasteRecycledPercent: 74.2
    },
    socialSummary: {
      totalWorkforce: 14280,
      contractualWorkforce: 14170,
      femaleRepresentationPercent: 18.4,
      femaleExecPercent: 22.0,
      wageParityRatio: '1.02 : 1',
      permanentEmployees: 14280,
      safetyIncidentsCount: 1,
      ltifr: 0.12,
      fatalities: 0,
      lostTimeInjuries: 1,
      highConsequenceInjuries: 0,
      trainingHoursPerEmployee: 24.6,
      wellbeingCoveragePercent: 96.5
    },
    governanceSummary: {
      ethicsTrainingPercent: 98.2,
      grievancesResolvedPercent: 94.0,
      msmeProcurementPercent: 27.5,
      dataBreachesCount: 0,
      ethicsComplaintsCount: 0,
      antiCorruptionCoveragePercent: 100,
      regulatoryFines: 0
    },
    dataQualitySummary: {
      measuredPercent: 88,
      estimatedPercent: 12,
      evidenceCoveragePercent: 92.4,
      assuranceStatus: 'Stage 2 Sample Testing & Field Verification',
      assurerName: 'Ernst & Young LLP (EY India)',
      assuranceStage: 'Reasonable Assurance for Top 250 Listed Entities',
      openFindingsCount: 2
    },
    workflowSummary: {
      draft: 4,
      submitted: 8,
      approved: 112,
      locked: 0
    },
    yoyTrends: [
      { year: 'FY 2023-24', energyGJ: 2100000, waterKL: 480000, ghgScope1_2: 182000, scope3_tco2e: 60600, wasteMT: 95000 },
      { year: 'FY 2024-25', energyGJ: 1980000, waterKL: 445000, ghgScope1_2: 174000, scope3_tco2e: 55200, wasteMT: 89000 },
      { year: 'FY 2025-26', energyGJ: 1920000, waterKL: 428000, ghgScope1_2: 168000, scope3_tco2e: 51800, wasteMT: 86000 },
      { year: 'FY 2026-27 YTD', energyGJ: 1845200, waterKL: 412800, ghgScope1_2: 164350, scope3_tco2e: 48200, wasteMT: 84200 }
    ]
  },

  // 4.2 SUBSIDIARY: MEIL Infrastructure Projects Ltd
  'sub-infra': {
    orgId: 'sub-infra',
    orgName: 'MEIL Infrastructure Projects Ltd',
    orgType: 'SUBSIDIARY',
    totalProjects: 4,
    submittedProjects: 3,
    pendingReviewProjects: 1,
    overallReadinessPercent: 86,
    brsrCoreReadinessPercent: 88,
    governanceAdherencePercent: 93,
    sectionAReadiness: 94,
    sectionBReadiness: 85,
    sectionCReadiness: 79,
    turnoverCr: 8200,
    turnoverMUsdPPP: 2865,
    environmentalSummary: {
      energyConsumptionGJ: 1020000,
      renewableEnergyPercent: 32.1,
      scope1GHG_tCO2e: 72400,
      scope2GHG_tCO2e: 21800,
      scope3GHG_tCO2e: 27600,
      totalGHG_tCO2e: 121800,
      ghgIntensityPerCrore: 1.48,
      ghgIntensityPPP: 18.6,
      waterConsumptionKL: 245000,
      waterIntensityKL: 29.87,
      wasteGeneratedMT: 48600,
      wasteRecycledPercent: 71.5
    },
    socialSummary: {
      totalWorkforce: 7850,
      contractualWorkforce: 8100,
      femaleRepresentationPercent: 16.2,
      femaleExecPercent: 19.5,
      wageParityRatio: '1.01 : 1',
      permanentEmployees: 7850,
      safetyIncidentsCount: 1,
      ltifr: 0.15,
      fatalities: 0,
      lostTimeInjuries: 1,
      highConsequenceInjuries: 0,
      trainingHoursPerEmployee: 26.2,
      wellbeingCoveragePercent: 95.8
    },
    governanceSummary: {
      ethicsTrainingPercent: 97.5,
      grievancesResolvedPercent: 92.5,
      msmeProcurementPercent: 28.2,
      dataBreachesCount: 0,
      ethicsComplaintsCount: 0,
      antiCorruptionCoveragePercent: 100,
      regulatoryFines: 0
    },
    dataQualitySummary: {
      measuredPercent: 85,
      estimatedPercent: 15,
      evidenceCoveragePercent: 90.1,
      assuranceStatus: 'Reasonable Assurance: Field Audits Active on Metro Sites',
      assurerName: 'Ernst & Young LLP (EY India)',
      assuranceStage: 'Metro Line Sampling',
      openFindingsCount: 1
    },
    workflowSummary: {
      draft: 2,
      submitted: 3,
      approved: 45,
      locked: 0
    },
    yoyTrends: [
      { year: 'FY 2023-24', energyGJ: 1150000, waterKL: 280000, ghgScope1_2: 108000, scope3_tco2e: 34500, wasteMT: 54000 },
      { year: 'FY 2024-25', energyGJ: 1090000, waterKL: 265000, ghgScope1_2: 101000, scope3_tco2e: 31200, wasteMT: 51500 },
      { year: 'FY 2025-26', energyGJ: 1050000, waterKL: 252000, ghgScope1_2: 96800, scope3_tco2e: 29400, wasteMT: 49800 },
      { year: 'FY 2026-27 YTD', energyGJ: 1020000, waterKL: 245000, ghgScope1_2: 94200, scope3_tco2e: 27600, wasteMT: 48600 }
    ]
  },

  // 4.3 SUBSIDIARY: MEIL Hydro & Water Corp
  'sub-water': {
    orgId: 'sub-water',
    orgName: 'MEIL Hydro & Water Corp',
    orgType: 'SUBSIDIARY',
    totalProjects: 4,
    submittedProjects: 3,
    pendingReviewProjects: 1,
    overallReadinessPercent: 84,
    brsrCoreReadinessPercent: 85,
    governanceAdherencePercent: 92,
    sectionAReadiness: 92,
    sectionBReadiness: 83,
    sectionCReadiness: 76,
    turnoverCr: 3950,
    turnoverMUsdPPP: 1380,
    environmentalSummary: {
      energyConsumptionGJ: 490000,
      renewableEnergyPercent: 28.4,
      scope1GHG_tCO2e: 31200,
      scope2GHG_tCO2e: 11400,
      scope3GHG_tCO2e: 12800,
      totalGHG_tCO2e: 55400,
      ghgIntensityPerCrore: 1.40,
      ghgIntensityPPP: 17.5,
      waterConsumptionKL: 118000,
      waterIntensityKL: 29.87,
      wasteGeneratedMT: 24600,
      wasteRecycledPercent: 69.8
    },
    socialSummary: {
      totalWorkforce: 3920,
      contractualWorkforce: 3850,
      femaleRepresentationPercent: 15.0,
      femaleExecPercent: 18.0,
      wageParityRatio: '1.00 : 1',
      permanentEmployees: 3920,
      safetyIncidentsCount: 0,
      ltifr: 0.10,
      fatalities: 0,
      lostTimeInjuries: 0,
      highConsequenceInjuries: 0,
      trainingHoursPerEmployee: 22.8,
      wellbeingCoveragePercent: 94.2
    },
    governanceSummary: {
      ethicsTrainingPercent: 96.0,
      grievancesResolvedPercent: 90.0,
      msmeProcurementPercent: 26.0,
      dataBreachesCount: 0,
      ethicsComplaintsCount: 0,
      antiCorruptionCoveragePercent: 100,
      regulatoryFines: 0
    },
    dataQualitySummary: {
      measuredPercent: 82,
      estimatedPercent: 18,
      evidenceCoveragePercent: 86.5,
      assuranceStatus: 'Sample Testing: 1 Clarification Requested on Lift Irrigation Pumps',
      assurerName: 'Ernst & Young LLP (EY India)',
      assuranceStage: 'Water Intake Sampling',
      openFindingsCount: 1
    },
    workflowSummary: {
      draft: 1,
      submitted: 3,
      approved: 38,
      locked: 0
    },
    yoyTrends: [
      { year: 'FY 2023-24', energyGJ: 540000, waterKL: 135000, ghgScope1_2: 48500, scope3_tco2e: 15400, wasteMT: 27500 },
      { year: 'FY 2024-25', energyGJ: 520000, waterKL: 128000, ghgScope1_2: 45800, scope3_tco2e: 14200, wasteMT: 26200 },
      { year: 'FY 2025-26', energyGJ: 505000, waterKL: 122000, ghgScope1_2: 43900, scope3_tco2e: 13500, wasteMT: 25300 },
      { year: 'FY 2026-27 YTD', energyGJ: 490000, waterKL: 118000, ghgScope1_2: 42600, scope3_tco2e: 12800, wasteMT: 24600 }
    ]
  },

  // 4.4 SUBSIDIARY: MEIL Clean Energy Ltd
  'sub-energy': {
    orgId: 'sub-energy',
    orgName: 'MEIL Clean Energy Ltd',
    orgType: 'SUBSIDIARY',
    totalProjects: 4,
    submittedProjects: 4,
    pendingReviewProjects: 0,
    overallReadinessPercent: 90,
    brsrCoreReadinessPercent: 92,
    governanceAdherencePercent: 96,
    sectionAReadiness: 98,
    sectionBReadiness: 92,
    sectionCReadiness: 88,
    turnoverCr: 2500,
    turnoverMUsdPPP: 875,
    environmentalSummary: {
      energyConsumptionGJ: 335200,
      renewableEnergyPercent: 84.5,
      scope1GHG_tCO2e: 21830,
      scope2GHG_tCO2e: 5720,
      scope3GHG_tCO2e: 7800,
      totalGHG_tCO2e: 35350,
      ghgIntensityPerCrore: 1.41,
      ghgIntensityPPP: 17.6,
      waterConsumptionKL: 49800,
      waterIntensityKL: 19.92,
      wasteGeneratedMT: 11000,
      wasteRecycledPercent: 85.0
    },
    socialSummary: {
      totalWorkforce: 2510,
      contractualWorkforce: 2220,
      femaleRepresentationPercent: 24.2,
      femaleExecPercent: 28.0,
      wageParityRatio: '1.03 : 1',
      permanentEmployees: 2510,
      safetyIncidentsCount: 0,
      ltifr: 0.05,
      fatalities: 0,
      lostTimeInjuries: 0,
      highConsequenceInjuries: 0,
      trainingHoursPerEmployee: 28.5,
      wellbeingCoveragePercent: 98.0
    },
    governanceSummary: {
      ethicsTrainingPercent: 99.1,
      grievancesResolvedPercent: 98.0,
      msmeProcurementPercent: 31.4,
      dataBreachesCount: 0,
      ethicsComplaintsCount: 0,
      antiCorruptionCoveragePercent: 100,
      regulatoryFines: 0
    },
    dataQualitySummary: {
      measuredPercent: 96,
      estimatedPercent: 4,
      evidenceCoveragePercent: 98.2,
      assuranceStatus: 'Field Verification Completed - Ready for Final Sign-Off',
      assurerName: 'Ernst & Young LLP (EY India)',
      assuranceStage: 'Solar & Wind Verification',
      openFindingsCount: 0
    },
    workflowSummary: {
      draft: 1,
      submitted: 2,
      approved: 29,
      locked: 0
    },
    yoyTrends: [
      { year: 'FY 2023-24', energyGJ: 410000, waterKL: 65000, ghgScope1_2: 35500, scope3_tco2e: 10700, wasteMT: 13500 },
      { year: 'FY 2024-25', energyGJ: 370000, waterKL: 58000, ghgScope1_2: 31800, scope3_tco2e: 9800, wasteMT: 12200 },
      { year: 'FY 2025-26', energyGJ: 350000, waterKL: 53500, ghgScope1_2: 29300, scope3_tco2e: 8900, wasteMT: 11600 },
      { year: 'FY 2026-27 YTD', energyGJ: 335200, waterKL: 49800, ghgScope1_2: 27550, scope3_tco2e: 7800, wasteMT: 11000 }
    ]
  },

  // 4.5 BUSINESS UNIT: Metro & Rail BU
  'bu-infra-metro': {
    orgId: 'bu-infra-metro',
    orgName: 'Metro & Rail Business Unit',
    orgType: 'BUSINESS_UNIT',
    totalProjects: 2,
    submittedProjects: 1,
    pendingReviewProjects: 1,
    overallReadinessPercent: 82,
    brsrCoreReadinessPercent: 84,
    governanceAdherencePercent: 91,
    sectionAReadiness: 90,
    sectionBReadiness: 81,
    sectionCReadiness: 75,
    turnoverCr: 4100,
    turnoverMUsdPPP: 1432,
    environmentalSummary: {
      energyConsumptionGJ: 540000,
      renewableEnergyPercent: 24.5,
      scope1GHG_tCO2e: 41200,
      scope2GHG_tCO2e: 12800,
      scope3GHG_tCO2e: 15400,
      totalGHG_tCO2e: 69400,
      ghgIntensityPerCrore: 1.69,
      ghgIntensityPPP: 21.2,
      waterConsumptionKL: 132000,
      waterIntensityKL: 32.2,
      wasteGeneratedMT: 27800,
      wasteRecycledPercent: 68.5
    },
    socialSummary: {
      totalWorkforce: 4100,
      contractualWorkforce: 4400,
      femaleRepresentationPercent: 14.8,
      femaleExecPercent: 17.0,
      wageParityRatio: '1.01 : 1',
      permanentEmployees: 4100,
      safetyIncidentsCount: 1,
      ltifr: 0.18,
      fatalities: 0,
      lostTimeInjuries: 1,
      highConsequenceInjuries: 0,
      trainingHoursPerEmployee: 24.0,
      wellbeingCoveragePercent: 94.0
    },
    governanceSummary: {
      ethicsTrainingPercent: 96.0,
      grievancesResolvedPercent: 91.0,
      msmeProcurementPercent: 27.0,
      dataBreachesCount: 0,
      ethicsComplaintsCount: 0,
      antiCorruptionCoveragePercent: 100,
      regulatoryFines: 0
    },
    dataQualitySummary: {
      measuredPercent: 81,
      estimatedPercent: 19,
      evidenceCoveragePercent: 87.0,
      assuranceStatus: 'Site Evidence Sampling In Progress',
      assurerName: 'Ernst & Young LLP (EY India)',
      assuranceStage: 'Metro Line Sampling',
      openFindingsCount: 1
    },
    workflowSummary: {
      draft: 1,
      submitted: 2,
      approved: 22,
      locked: 0
    },
    yoyTrends: [
      { year: 'FY 2023-24', energyGJ: 610000, waterKL: 152000, ghgScope1_2: 61000, scope3_tco2e: 19200, wasteMT: 31000 },
      { year: 'FY 2024-25', energyGJ: 580000, waterKL: 144000, ghgScope1_2: 57500, scope3_tco2e: 17400, wasteMT: 29500 },
      { year: 'FY 2025-26', energyGJ: 558000, waterKL: 137000, ghgScope1_2: 55400, scope3_tco2e: 16200, wasteMT: 28600 },
      { year: 'FY 2026-27 YTD', energyGJ: 540000, waterKL: 132000, ghgScope1_2: 54000, scope3_tco2e: 15400, wasteMT: 27800 }
    ]
  },

  // 4.6 PROJECT: Demo Project Beta (High-Speed Tunneling)
  'proj-beta': {
    orgId: 'proj-beta',
    orgName: 'Demo Project Beta (High-Speed Tunneling)',
    orgType: 'PROJECT',
    totalProjects: 1,
    submittedProjects: 0,
    pendingReviewProjects: 1,
    overallReadinessPercent: 78,
    brsrCoreReadinessPercent: 82,
    governanceAdherencePercent: 90,
    sectionAReadiness: 88,
    sectionBReadiness: 76,
    sectionCReadiness: 70,
    turnoverCr: 120,
    turnoverMUsdPPP: 42,
    environmentalSummary: {
      energyConsumptionGJ: 3240,
      renewableEnergyPercent: 12.0,
      scope1GHG_tCO2e: 450.25,
      scope2GHG_tCO2e: 179.00,
      scope3GHG_tCO2e: 210.00,
      totalGHG_tCO2e: 839.25,
      ghgIntensityPerCrore: 6.99,
      ghgIntensityPPP: 87.4,
      waterConsumptionKL: 12800,
      waterIntensityKL: 106.6,
      wasteGeneratedMT: 1450,
      wasteRecycledPercent: 68.0
    },
    socialSummary: {
      totalWorkforce: 240,
      contractualWorkforce: 320,
      femaleRepresentationPercent: 12.5,
      femaleExecPercent: 14.0,
      wageParityRatio: '1.00 : 1',
      permanentEmployees: 240,
      safetyIncidentsCount: 0,
      ltifr: 0.00,
      fatalities: 0,
      lostTimeInjuries: 0,
      highConsequenceInjuries: 0,
      trainingHoursPerEmployee: 32.0,
      wellbeingCoveragePercent: 92.0
    },
    governanceSummary: {
      ethicsTrainingPercent: 95.0,
      grievancesResolvedPercent: 88.0,
      msmeProcurementPercent: 25.8,
      dataBreachesCount: 0,
      ethicsComplaintsCount: 0,
      antiCorruptionCoveragePercent: 100,
      regulatoryFines: 0
    },
    dataQualitySummary: {
      measuredPercent: 75,
      estimatedPercent: 25,
      evidenceCoveragePercent: 81.0,
      assuranceStatus: 'Site Audit In Progress: CEMS calibration certificate clarification requested',
      assurerName: 'Ernst & Young LLP (EY India)',
      assuranceStage: 'Site Level Sample Testing',
      openFindingsCount: 1
    },
    workflowSummary: {
      draft: 1,
      submitted: 1,
      approved: 12,
      locked: 0
    },
    yoyTrends: [
      { year: 'FY 2023-24', energyGJ: 3900, waterKL: 15400, ghgScope1_2: 780, scope3_tco2e: 260, wasteMT: 1750 },
      { year: 'FY 2024-25', energyGJ: 3600, waterKL: 14200, ghgScope1_2: 710, scope3_tco2e: 240, wasteMT: 1620 },
      { year: 'FY 2025-26', energyGJ: 3450, waterKL: 13500, ghgScope1_2: 670, scope3_tco2e: 225, wasteMT: 1540 },
      { year: 'FY 2026-27 YTD', energyGJ: 3240, waterKL: 12800, ghgScope1_2: 629.25, scope3_tco2e: 210, wasteMT: 1450 }
    ]
  },

  // 4.7 PROJECT: Demo Project Alpha (250MW Solar Park)
  'proj-alpha': {
    orgId: 'proj-alpha',
    orgName: 'Demo Project Alpha (250MW Solar Park)',
    orgType: 'PROJECT',
    totalProjects: 1,
    submittedProjects: 1,
    pendingReviewProjects: 0,
    overallReadinessPercent: 94,
    brsrCoreReadinessPercent: 96,
    governanceAdherencePercent: 98,
    sectionAReadiness: 100,
    sectionBReadiness: 95,
    sectionCReadiness: 92,
    turnoverCr: 450,
    turnoverMUsdPPP: 157,
    environmentalSummary: {
      energyConsumptionGJ: 1850,
      renewableEnergyPercent: 98.2,
      scope1GHG_tCO2e: 82.5,
      scope2GHG_tCO2e: 14.2,
      scope3GHG_tCO2e: 38.0,
      totalGHG_tCO2e: 134.7,
      ghgIntensityPerCrore: 0.30,
      ghgIntensityPPP: 3.75,
      waterConsumptionKL: 3200,
      waterIntensityKL: 7.11,
      wasteGeneratedMT: 280,
      wasteRecycledPercent: 92.5
    },
    socialSummary: {
      totalWorkforce: 180,
      contractualWorkforce: 210,
      femaleRepresentationPercent: 26.5,
      femaleExecPercent: 30.0,
      wageParityRatio: '1.04 : 1',
      permanentEmployees: 180,
      safetyIncidentsCount: 0,
      ltifr: 0.00,
      fatalities: 0,
      lostTimeInjuries: 0,
      highConsequenceInjuries: 0,
      trainingHoursPerEmployee: 36.0,
      wellbeingCoveragePercent: 98.5
    },
    governanceSummary: {
      ethicsTrainingPercent: 100.0,
      grievancesResolvedPercent: 100.0,
      msmeProcurementPercent: 34.0,
      dataBreachesCount: 0,
      ethicsComplaintsCount: 0,
      antiCorruptionCoveragePercent: 100,
      regulatoryFines: 0
    },
    dataQualitySummary: {
      measuredPercent: 98,
      estimatedPercent: 2,
      evidenceCoveragePercent: 100.0,
      assuranceStatus: 'Assurance Complete: Fully Substantiated with SCADA & Invoices',
      assurerName: 'Ernst & Young LLP (EY India)',
      assuranceStage: 'Final Clearance',
      openFindingsCount: 0
    },
    workflowSummary: {
      draft: 0,
      submitted: 1,
      approved: 18,
      locked: 0
    },
    yoyTrends: [
      { year: 'FY 2023-24', energyGJ: 2200, waterKL: 4100, ghgScope1_2: 125, scope3_tco2e: 52, wasteMT: 340 },
      { year: 'FY 2024-25', energyGJ: 2050, waterKL: 3700, ghgScope1_2: 110, scope3_tco2e: 45, wasteMT: 310 },
      { year: 'FY 2025-26', energyGJ: 1950, waterKL: 3400, ghgScope1_2: 102, scope3_tco2e: 41, wasteMT: 295 },
      { year: 'FY 2026-27 YTD', energyGJ: 1850, waterKL: 3200, ghgScope1_2: 96.7, scope3_tco2e: 38, wasteMT: 280 }
    ]
  }
};

// 5. Getter function that resolves summary for ANY entity id with graceful hierarchical fallback
export const getEntityDashboardSummary = (orgId: string): DashboardSummary => {
  if (ENTITY_METRICS_MAP[orgId]) {
    return ENTITY_METRICS_MAP[orgId];
  }

  // Fallback heuristic if a non-mapped node is chosen:
  const base = ENTITY_METRICS_MAP['meil-group'];
  return {
    ...base,
    totalProjects: 1,
    submittedProjects: 1,
    pendingReviewProjects: 0,
    overallReadinessPercent: 85,
    brsrCoreReadinessPercent: 88,
    governanceAdherencePercent: 92
  };
};

// 6. Explicit Statutory Calculation Formula Definitions for hover / modal popups
export const READINESS_FORMULA_DEFINITIONS = {
  overall: {
    title: 'Overall BRSR Reporting Readiness (89%)',
    mandate: 'SEBI (LODR) Regulations 2015, Regulation 34(2)(f) - Comprehensive Disclosures',
    formula: 'Overall Readiness = (N_completed_disclosures / N_total_applicable_disclosures) × 100',
    explanation: 'Weighted aggregate across all 3 statutory BRSR sections based on validated data entries and approved primary documentation.',
    breakdown: [
      { label: 'Section A: General Disclosures', score: '96.0%', detail: '24 of 25 mandatory entity and boundary disclosures verified' },
      { label: 'Section B: Management & Process Disclosures', score: '88.0%', detail: '22 of 25 policy and governance commitments active' },
      { label: 'Section C: Principle-wise Performance (P1-P9)', score: '82.0%', detail: '74 of 90 essential indicator disclosures approved' }
    ],
    compositeScore: '89.0%'
  },
  brsrCore: {
    title: 'BRSR Core Assurance Readiness (91%)',
    mandate: 'SEBI Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122 (Reasonable Assurance Framework)',
    formula: 'BRSR Core Readiness = (N_assured_core_kpis / 9_mandatory_attributes) × 100',
    explanation: 'Measures readiness for external independent Reasonable Assurance. Requires primary evidentiary trail, zero unresolved audit anomalies, and activity data verification.',
    breakdown: [
      { label: 'Mandatory Core Attributes', score: '9 of 9', detail: 'Covered under SEBI standardized KPI parameters' },
      { label: 'Verified & Document-Substantiated', score: '8.2 / 9', detail: 'Primary utility bills, weighbridge slips & meter logs attached' },
      { label: 'External Assurer Status', score: 'In Progress', detail: 'Ernst & Young LLP (EY India) conducting Stage 2 sampling' }
    ],
    compositeScore: '91.1%'
  },
  governance: {
    title: 'Governance Adherence & Compliance Score (94%)',
    mandate: 'BRSR Principle 1 (Integrity & Ethics) & Principle 8 (Inclusive Growth)',
    formula: 'Governance Score = (Affirmative Statutory Compliances + Resolved Grievances) / Total Applicable Governance Enquiries × 100',
    explanation: 'Reflects measurable statutory compliance: ethics and bribery complaints, zero regulatory fines/penalties, and mandatory MSME procurement spend.',
    breakdown: [
      { label: 'Ethics & Bribery Complaints', score: '0 Received / 0 Pending', detail: '100% clean record across group operations' },
      { label: 'Regulatory Fines & Penalties', score: '₹0 / Nil Paid', detail: 'Zero monetary or non-monetary actions by SEBI, MCA, NGT or PCBs' },
      { label: 'Anti-Corruption Policy Coverage', score: '100% Operations', detail: 'All 14,280 personnel and tier-1 vendor contracts bound' },
      { label: 'MSME Procurement Share', score: '27.5% of Spend', detail: 'Exceeds statutory minimum threshold of 25.0%' }
    ],
    compositeScore: '94.0%'
  }
};

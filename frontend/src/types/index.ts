export type RoleType = 
  | 'ADMIN'
  | 'SITE_USER'
  | 'ESG_OFFICER'
  | 'GROUP_SUSTAINABILITY'
  | 'AUDITOR';

export interface Role {
  id: RoleType;
  name: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  roleId: RoleType;
  organisationId: string;
  organisationName: string;
  avatarUrl?: string;
}

export type OrgType = 'GROUP' | 'SUBSIDIARY' | 'BUSINESS_UNIT' | 'PROJECT';

export interface Organisation {
  id: string;
  code: string;
  name: string;
  type: OrgType;
  parentId: string | null;
  businessVertical?: string;
  country: string;
  state?: string;
  city?: string;
  completionRate?: number;
  status?: 'HEALTHY' | 'NEEDS_ATTENTION' | 'PENDING';
  children?: Organisation[];
}

export interface ReportingPeriod {
  id: string;
  financialYear: string;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'CLOSED' | 'ARCHIVED';
  isCurrent: boolean;
}

export type IndicatorCategoryCode = 'ENVIRONMENT' | 'SOCIAL' | 'GOVERNANCE';

export interface IndicatorCategory {
  id: string;
  code: IndicatorCategoryCode;
  name: string;
  colorCode: string;
}

export interface Indicator {
  id: string;
  code: string;
  name: string;
  description: string;
  categoryId: string;
  categoryCode: IndicatorCategoryCode;
  section: 'A' | 'B' | 'C';
  principleNumber?: number;
  isCore: boolean;
  dataType: 'numeric' | 'text' | 'boolean' | 'percentage' | 'json';
  unit?: string;
  aggregationType: 'SUM' | 'AVERAGE' | 'COUNT' | 'RATIO' | 'LATEST';
  isMandatory: boolean;
  requiresEvidence: boolean;
  validationRule?: {
    min?: number;
    max?: number;
    requiredCrossFields?: string[];
    logicalFormula?: string;
  };
  formula?: string;
  isActive: boolean;
}

export type EntryStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export interface DataEntry {
  id: string;
  organisationId: string;
  indicatorId: string;
  reportingPeriodId: string;
  numericValue?: number;
  textValue?: string;
  structuredValue?: Record<string, any>;
  unit?: string;
  sourceType: 'MANUAL' | 'AI_EXTRACTED' | 'SYSTEM_ROLLUP';
  status: EntryStatus;
  remarks?: string;
  evidenceCount?: number;
  evidenceFiles?: Evidence[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Computed fields for display
  indicator?: Indicator;
  organisation?: Organisation;
  previousYearValue?: number;
  yoyChangePercent?: number;
}

export interface Evidence {
  id: string;
  dataEntryId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number; // in KB or bytes
  fileHash: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  description?: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'FLAGGED';
  aiConfidence?: number;
}

export interface ApprovalAction {
  id: string;
  dataEntryId: string;
  action: 'SUBMIT' | 'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION';
  actionBy: string;
  actionByName: string;
  comments: string;
  actionAt: string;
}

export interface AuditLog {
  id: string;
  tableName: string;
  recordId: string;
  indicatorCode?: string;
  indicatorName?: string;
  organisationName?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'TRANSITION';
  oldValue?: any;
  newValue?: any;
  changedBy: string;
  changedByName: string;
  userRole: string;
  ipAddress?: string;
  timestamp: string;
  reason?: string;
}

export interface AnomalyAlert {
  id: string;
  organisationId: string;
  organisationName: string;
  indicatorId: string;
  indicatorCode: string;
  indicatorName: string;
  reportingPeriodId: string;
  alertType: 'MISSING_DATA' | 'ANOMALY' | 'MISSING_EVIDENCE' | 'VALIDATION_FAIL';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
}

export interface DashboardSummary {
  totalProjects: number;
  submittedProjects: number;
  pendingReviewProjects: number;
  overallReadinessPercent: number;
  brsrCoreReadinessPercent: number;
  sectionAReadiness: number;
  sectionBReadiness: number;
  sectionCReadiness: number;
  environmentalSummary: {
    energyConsumptionGJ: number;
    renewableEnergyPercent: number;
    scope1GHG_tCO2e: number;
    scope2GHG_tCO2e: number;
    waterConsumptionKL: number;
    wasteGeneratedMT: number;
    wasteRecycledPercent: number;
  };
  socialSummary: {
    totalWorkforce: number;
    femaleRepresentationPercent: number;
    permanentEmployees: number;
    safetyIncidentsCount: number;
    trainingHoursPerEmployee: number;
    wellbeingCoveragePercent: number;
  };
  governanceSummary: {
    ethicsTrainingPercent: number;
    grievancesResolvedPercent: number;
    msmeProcurementPercent: number;
    dataBreachesCount: number;
  };
  yoyTrends: {
    year: string;
    energyGJ: number;
    waterKL: number;
    ghgScope1_2: number;
    wasteMT: number;
  }[];
}

export interface TraceabilityNode {
  orgId: string;
  orgName: string;
  orgType: OrgType;
  value: number;
  unit: string;
  status: EntryStatus;
  enteredBy?: string;
  approvedBy?: string;
  evidenceFiles?: Evidence[];
  auditHistory?: AuditLog[];
  children?: TraceabilityNode[];
}

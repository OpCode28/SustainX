export type RoleType = 'ADMIN' | 'SITE_USER' | 'ESG_OFFICER' | 'GROUP_SUSTAINABILITY' | 'AUDITOR';
export type OrgType = 'GROUP' | 'SUBSIDIARY' | 'BUSINESS_UNIT' | 'PROJECT';
export type EntryStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
export type ScopeType = 'SCOPE_1' | 'SCOPE_2' | 'SCOPE_3' | 'WATER' | 'WASTE' | 'SOCIAL' | 'GOVERNANCE';
export interface EmissionFactor {
    id: string;
    name: string;
    category: ScopeType;
    fuelOrActivity: string;
    factorValue: string;
    unit: string;
    source: string;
    versionYear: number;
    isActive: boolean;
}
export interface ActivityDataRecord {
    id: string;
    organisationId: string;
    reportingPeriodId: string;
    attributeNumber: number;
    scopeType: ScopeType;
    subItem: string;
    quantity: string;
    unit: string;
    evidenceFileId?: string | null;
    status: EntryStatus;
    enteredBy: string;
    approvedBy?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface CalculationResult {
    id: string;
    organisationId: string;
    reportingPeriodId: string;
    scope1_tco2e: string;
    scope2_tco2e: string;
    scope3_tco2e: string;
    totalGhg_tco2e: string;
    turnoverInrCrores: string;
    ghgIntensityPerCrore: string;
    calculatedAt: string;
}
export interface AuditRecord {
    id: string;
    tableName: string;
    recordId: string;
    action: 'INSERT' | 'UPDATE' | 'DELETE';
    oldValue: Record<string, unknown> | null;
    newValue: Record<string, unknown> | null;
    changedBy: string;
    timestamp: string;
}
//# sourceMappingURL=types.d.ts.map
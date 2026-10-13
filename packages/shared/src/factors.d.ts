export interface PreseededEmissionFactor {
    id: string;
    name: string;
    category: 'SCOPE_1' | 'SCOPE_2' | 'SCOPE_3';
    fuelOrActivity: string;
    factorValue: string;
    unit: string;
    source: string;
    versionYear: number;
    description: string;
}
export declare const OFFICIAL_EMISSION_FACTORS: PreseededEmissionFactor[];
//# sourceMappingURL=factors.d.ts.map
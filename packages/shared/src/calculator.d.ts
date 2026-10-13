export interface ConversionInput {
    quantity: string | number;
    factorValue: string | number;
    /**
     * If the factor is per kg and we need metric tonnes (tCO2e), divide by 1000.
     * Default: true if unit contains kgCO2e
     */
    isKgToTonne?: boolean;
}
/**
 * Converts activity data into tCO2e using high-precision Decimal.js
 * Formula: (Quantity × Factor) / 1000 (if kg to tonnes)
 */
export declare function calculateEmissions_tco2e(input: ConversionInput): string;
/**
 * Calculates statutory GHG intensity against turnover in INR Crores
 * Formula: Total tCO2e ÷ Turnover (₹ Cr)
 * Safeguard: Returns '0.000000' if turnover is 0 or negative
 */
export declare function calculateIntensity(totalEmissions_tco2e: string | number, turnoverInrCrores: string | number): string | null;
/**
 * Sums an array of emission strings with Decimal.js
 */
export declare function sumEmissions(values: (string | number)[]): string;
/**
 * Computes Scope shares (percentage breakdown)
 */
export declare function calculateScopeShares(scope1: string | number, scope2: string | number, scope3: string | number): {
    scope1Percent: string;
    scope2Percent: string;
    scope3Percent: string;
    total: string;
};
//# sourceMappingURL=calculator.d.ts.map
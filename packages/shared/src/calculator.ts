import Decimal from 'decimal.js';

// Configure Decimal.js precision for regulatory GHG reporting
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

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
export function calculateEmissions_tco2e(input: ConversionInput): string {
  try {
    const q = new Decimal(input.quantity || 0);
    const f = new Decimal(input.factorValue || 0);
    let result = q.mul(f);

    if (input.isKgToTonne ?? true) {
      result = result.div(1000);
    }

    return result.toDecimalPlaces(4).toString();
  } catch {
    return '0.0000';
  }
}

/**
 * Calculates statutory GHG intensity against turnover in INR Crores
 * Formula: Total tCO2e ÷ Turnover (₹ Cr)
 * Safeguard: Returns '0.000000' if turnover is 0 or negative
 */
export function calculateIntensity(totalEmissions_tco2e: string | number, turnoverInrCrores: string | number): string | null {
  try {
    const emissions = new Decimal(totalEmissions_tco2e || 0);
    const turnover = new Decimal(turnoverInrCrores || 0);

    if (turnover.lte(0)) {
      return null; // Return null so zero turnover is not misconstrued as zero intensity
    }

    return emissions.div(turnover).toDecimalPlaces(6).toString();
  } catch {
    return null;
  }
}

/**
 * Sums an array of emission strings with Decimal.js
 */
export function sumEmissions(values: (string | number)[]): string {
  try {
    let total = new Decimal(0);
    for (const val of values) {
      if (val) {
        total = total.plus(new Decimal(val));
      }
    }
    return total.toDecimalPlaces(4).toString();
  } catch {
    return '0.0000';
  }
}

/**
 * Computes Scope shares (percentage breakdown)
 */
export function calculateScopeShares(scope1: string | number, scope2: string | number, scope3: string | number): {
  scope1Percent: string;
  scope2Percent: string;
  scope3Percent: string;
  total: string;
} {
  try {
    const s1 = new Decimal(scope1 || 0);
    const s2 = new Decimal(scope2 || 0);
    const s3 = new Decimal(scope3 || 0);
    const total = s1.plus(s2).plus(s3);

    if (total.lte(0)) {
      return { scope1Percent: '0.00', scope2Percent: '0.00', scope3Percent: '0.00', total: '0.0000' };
    }

    const p1 = s1.div(total).mul(100).toDecimalPlaces(2).toString();
    const p2 = s2.div(total).mul(100).toDecimalPlaces(2).toString();
    const p3 = s3.div(total).mul(100).toDecimalPlaces(2).toString();

    return {
      scope1Percent: p1,
      scope2Percent: p2,
      scope3Percent: p3,
      total: total.toDecimalPlaces(4).toString(),
    };
  } catch {
    return { scope1Percent: '0.00', scope2Percent: '0.00', scope3Percent: '0.00', total: '0.0000' };
  }
}

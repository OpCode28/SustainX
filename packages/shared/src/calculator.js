"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEmissions_tco2e = calculateEmissions_tco2e;
exports.calculateIntensity = calculateIntensity;
exports.sumEmissions = sumEmissions;
exports.calculateScopeShares = calculateScopeShares;
const decimal_js_1 = __importDefault(require("decimal.js"));
// Configure Decimal.js precision for regulatory GHG reporting
decimal_js_1.default.set({ precision: 20, rounding: decimal_js_1.default.ROUND_HALF_UP });
/**
 * Converts activity data into tCO2e using high-precision Decimal.js
 * Formula: (Quantity × Factor) / 1000 (if kg to tonnes)
 */
function calculateEmissions_tco2e(input) {
    try {
        const q = new decimal_js_1.default(input.quantity || 0);
        const f = new decimal_js_1.default(input.factorValue || 0);
        let result = q.mul(f);
        if (input.isKgToTonne ?? true) {
            result = result.div(1000);
        }
        return result.toDecimalPlaces(4).toString();
    }
    catch {
        return '0.0000';
    }
}
/**
 * Calculates statutory GHG intensity against turnover in INR Crores
 * Formula: Total tCO2e ÷ Turnover (₹ Cr)
 * Safeguard: Returns '0.000000' if turnover is 0 or negative
 */
function calculateIntensity(totalEmissions_tco2e, turnoverInrCrores) {
    try {
        const emissions = new decimal_js_1.default(totalEmissions_tco2e || 0);
        const turnover = new decimal_js_1.default(turnoverInrCrores || 0);
        if (turnover.lte(0)) {
            return null; // Return null so zero turnover is not misconstrued as zero intensity
        }
        return emissions.div(turnover).toDecimalPlaces(6).toString();
    }
    catch {
        return null;
    }
}
/**
 * Sums an array of emission strings with Decimal.js
 */
function sumEmissions(values) {
    try {
        let total = new decimal_js_1.default(0);
        for (const val of values) {
            if (val) {
                total = total.plus(new decimal_js_1.default(val));
            }
        }
        return total.toDecimalPlaces(4).toString();
    }
    catch {
        return '0.0000';
    }
}
/**
 * Computes Scope shares (percentage breakdown)
 */
function calculateScopeShares(scope1, scope2, scope3) {
    try {
        const s1 = new decimal_js_1.default(scope1 || 0);
        const s2 = new decimal_js_1.default(scope2 || 0);
        const s3 = new decimal_js_1.default(scope3 || 0);
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
    }
    catch {
        return { scope1Percent: '0.00', scope2Percent: '0.00', scope3Percent: '0.00', total: '0.0000' };
    }
}
//# sourceMappingURL=calculator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OFFICIAL_EMISSION_FACTORS = void 0;
exports.OFFICIAL_EMISSION_FACTORS = [
    // --- SCOPE 2 (Purchased Electricity) ---
    {
        id: 'factor-elec-cea-india',
        name: 'India National Grid Electricity Average',
        category: 'SCOPE_2',
        fuelOrActivity: 'grid_electricity',
        factorValue: '0.7160', // 0.716 kg CO2e / kWh (CEA CO2 Baseline Database v20.0)
        unit: 'kgCO2e/kWh',
        source: 'CEA_INDIA_V20',
        versionYear: 2024,
        description: 'Central Electricity Authority (CEA) of India, Version 20.0 Weighted Average Grid Emission Factor',
    },
    {
        id: 'factor-elec-solar-ppa',
        name: 'Renewable Solar / Wind PPA Generation',
        category: 'SCOPE_2',
        fuelOrActivity: 'renewable_electricity',
        factorValue: '0.0000',
        unit: 'kgCO2e/kWh',
        source: 'GHG_PROTOCOL_ZERO',
        versionYear: 2024,
        description: 'Zero emissions for verified solar/wind captive generation and PPA with Green Tariffs',
    },
    // --- SCOPE 1 (Direct Fuel Combustion) ---
    {
        id: 'factor-diesel-dg-sets',
        name: 'High Speed Diesel (DG Sets & Heavy Machinery)',
        category: 'SCOPE_1',
        fuelOrActivity: 'stationary_diesel',
        factorValue: '2.6865', // kg CO2e per liter (DEFRA 2024)
        unit: 'kgCO2e/liter',
        source: 'DEFRA_2024',
        versionYear: 2024,
        description: 'UK DEFRA / IPCC stationary combustion factor for 100% mineral diesel fuel',
    },
    {
        id: 'factor-petrol-fleet',
        name: 'Motor Gasoline / Petrol (Site Vehicles)',
        category: 'SCOPE_1',
        fuelOrActivity: 'mobile_petrol',
        factorValue: '2.3144', // kg CO2e per liter
        unit: 'kgCO2e/liter',
        source: 'DEFRA_2024',
        versionYear: 2024,
        description: 'UK DEFRA mobile combustion factor for petrol passenger and light utility vehicles',
    },
    {
        id: 'factor-natural-gas',
        name: 'Natural Gas (Piped / Industrial)',
        category: 'SCOPE_1',
        fuelOrActivity: 'natural_gas',
        factorValue: '2.0232', // kg CO2e per standard cubic meter (scm)
        unit: 'kgCO2e/scm',
        source: 'DEFRA_2024',
        versionYear: 2024,
        description: 'Industrial furnace and heating natural gas emission factor',
    },
    {
        id: 'factor-lpg',
        name: 'Liquefied Petroleum Gas (LPG)',
        category: 'SCOPE_1',
        fuelOrActivity: 'lpg',
        factorValue: '1.5126', // kg CO2e per kg
        unit: 'kgCO2e/kg',
        source: 'DEFRA_2024',
        versionYear: 2024,
        description: 'LPG combustion factor for labor camp kitchens and thermal processes',
    },
    // --- SCOPE 3 (Value Chain Sample Placeholders) ---
    {
        id: 'factor-air-travel-domestic',
        name: 'Domestic Air Travel (Short Haul)',
        category: 'SCOPE_3',
        fuelOrActivity: 'air_travel_domestic',
        factorValue: '0.1925', // kg CO2e per passenger-km
        unit: 'kgCO2e/pkm',
        source: 'DEFRA_2024',
        versionYear: 2024,
        description: 'Commercial passenger domestic air travel with radiative forcing',
    },
    {
        id: 'factor-freight-road',
        name: 'Road Freight Transportation (Heavy Goods Vehicles)',
        category: 'SCOPE_3',
        fuelOrActivity: 'freight_road',
        factorValue: '0.1042', // kg CO2e per tonne-km
        unit: 'kgCO2e/tkm',
        source: 'DEFRA_2024',
        versionYear: 2024,
        description: 'Logistics provider upstream and downstream road haulage',
    },
];
//# sourceMappingURL=factors.js.map
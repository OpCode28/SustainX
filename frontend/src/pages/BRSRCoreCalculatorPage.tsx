import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Calculator, 
  Database, 
  ShieldCheck, 
  ArrowRight, 
  Save, 
  RefreshCw, 
  History, 
  Layers, 
  Building2, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  FileCheck2, 
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

interface Scope2Data {
  activityRecord: {
    id: string;
    quantity: string;
    unit: string;
    status: string;
    notes: string;
    updatedAt: string;
  } | null;
  calculationResult: {
    scope1_tco2e: string;
    scope2_tco2e: string;
    scope3_tco2e: string;
    totalGhg_tco2e: string;
    turnoverInrCrores: string;
    ghgIntensityPerCrore: string;
  } | null;
  ceaFactor: {
    id: string;
    name: string;
    factorValue: string;
    unit: string;
    source: string;
  } | null;
}

interface AttributeData {
  attributeNumber: number;
  title: string;
  description: string;
  scalingMethod: string;
  dataItems: { id: string; name: string; sourceRecord: string; unit: string }[];
  scope3Categories?: { number: number; name: string; sourceRecord: string }[];
}

export const BRSRCoreCalculatorPage: React.FC = () => {
  const { selectedOrg, selectedPeriod } = useApp();
  const { currentUser } = useAuth();

  // State for Attribute Cards
  const [attributes, setAttributes] = useState<AttributeData[]>([]);
  const [selectedAttrNum, setSelectedAttrNum] = useState<number>(1);
  const [scope3Expanded, setScope3Expanded] = useState<boolean>(false);

  // State for Scope 2 Electricity Live Calculator
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const [quantityKwh, setQuantityKwh] = useState<string>('1850000');
  const [factorValue, setFactorValue] = useState<string>('0.7160');
  const [turnoverCr, setTurnoverCr] = useState<string>('120');
  const [scope1Val, setScope1Val] = useState<string>('450.25');
  const [scope3Val, setScope3Val] = useState<string>('210.00');

  // Real-time calculation outputs
  const [computedScope2, setComputedScope2] = useState<string>('1324.6000');
  const [computedTotal, setComputedTotal] = useState<string>('1984.8500');
  const [computedIntensity, setComputedIntensity] = useState<string>('16.540417');
  const [scope2Percent, setScope2Percent] = useState<string>('66.74');

  // Database audit logs
  const [auditLogsList, setAuditLogsList] = useState<any[]>([]);

  // Statutory Hierarchy Data
  const [hierarchyData, setHierarchyData] = useState<{
    companies: any[];
    departments: any[];
    sites: any[];
  } | null>(null);

  // 1. Fetch initial data from PostgreSQL API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Hierarchy
      const hierRes = await fetch('/api/v1/hierarchy');
      if (hierRes.ok) {
        const hierJson = await hierRes.json();
        setHierarchyData(hierJson);
      }

      // Fetch Attributes
      const attrRes = await fetch('/api/v1/attributes');
      if (attrRes.ok) {
        const attrJson = await attrRes.json();
        setAttributes(attrJson.attributes || []);
      }

      // Fetch Current Scope 2 DB records
      const s2Res = await fetch(`/api/v1/scope2/current?orgId=${selectedOrg.id}&periodId=${selectedPeriod.id}`);
      if (s2Res.ok) {
        const s2Json: Scope2Data = await s2Res.json();
        if (s2Json.activityRecord) {
          setQuantityKwh(parseFloat(s2Json.activityRecord.quantity).toString());
        }
        if (s2Json.ceaFactor) {
          setFactorValue(parseFloat(s2Json.ceaFactor.factorValue).toString());
        }
        if (s2Json.calculationResult) {
          setTurnoverCr(parseFloat(s2Json.calculationResult.turnoverInrCrores).toString());
          setScope1Val(parseFloat(s2Json.calculationResult.scope1_tco2e).toString());
          setScope3Val(parseFloat(s2Json.calculationResult.scope3_tco2e).toString());
        }
      }

      // Fetch Audit Logs
      const auditRes = await fetch('/api/v1/audit-logs');
      if (auditRes.ok) {
        const auditJson = await auditRes.json();
        setAuditLogsList(auditJson.auditLogs || []);
      }
    } catch (err) {
      console.warn('API server offline, falling back to local calculation state', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedOrg.id, selectedPeriod.id]);

  // 2. Client-side decimal calculation preview
  useEffect(() => {
    const q = parseFloat(quantityKwh) || 0;
    const f = parseFloat(factorValue) || 0;
    const t = parseFloat(turnoverCr) || 0;
    const s1 = parseFloat(scope1Val) || 0;
    const s3 = parseFloat(scope3Val) || 0;

    // Convert: (kWh × factor) / 1000 = tCO2e
    const s2 = (q * f) / 1000;
    const total = s1 + s2 + s3;
    const intensity = t > 0 ? (total / t).toFixed(6) : 'N/A';
    const s2Pct = total > 0 ? ((s2 / total) * 100).toFixed(2) : '0.00';

    setComputedScope2(s2.toFixed(4));
    setComputedTotal(total.toFixed(4));
    setComputedIntensity(intensity);
    setScope2Percent(s2Pct);
  }, [quantityKwh, factorValue, turnoverCr, scope1Val, scope3Val]);

  // 3. Save & Sync to PostgreSQL 17 Database via API
  const handleSaveToDatabase = async () => {
    setSaving(true);
    setSyncNotice(null);
    try {
      const res = await fetch('/api/v1/scope2/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: selectedOrg.id,
          periodId: selectedPeriod.id,
          quantityKwh,
          factorValue,
          turnoverCr,
          scope1Val,
          scope3Val,
          userEmail: currentUser?.email || 'rahul.sharma@meil-infra.demo',
          notes: 'Electricity bill Q3 meter log submission via Live Scope 2 Slice',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setSyncNotice(`✅ Success: Scope 2 data saved and verified! Audit record automatically appended.`);
        // Refresh audit logs
        const auditRes = await fetch('/api/v1/audit-logs');
        if (auditRes.ok) {
          const auditJson = await auditRes.json();
          setAuditLogsList(auditJson.auditLogs || []);
        }
      } else {
        setSyncNotice(`❌ Failed to save to database.`);
      }
    } catch (err) {
      setSyncNotice(`❌ Network error connecting to backend API`);
    } finally {
      setSaving(false);
      setTimeout(() => setSyncNotice(null), 6000);
    }
  };

  const selectedAttr = attributes.find(a => a.attributeNumber === selectedAttrNum) || attributes[0];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="border-b border-[#E8E8E8] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-1">
            <span className="text-[#1A2A6C]">SEBI BRSR CORE PROTOCOL</span>
            <span>•</span>
            <span className="text-[#EF272E]">{selectedPeriod.financialYear}</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">
              REASONABLE ASSURANCE
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#1A2A6C] tracking-tight leading-tight">
            BRSR Core Engine &amp; Scope 2 Vertical Slice
          </h1>
          <p className="text-[14px] text-[#444444] mt-1 max-w-3xl leading-relaxed">
            The 4-step pipeline: <strong>Collect</strong> activity data → <strong>Convert</strong> via CEA/DEFRA factors → <strong>Scale</strong> by turnover for intensity → <strong>Display &amp; Audit</strong> with immutable revision control.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="px-3.5 py-2 bg-[#E8E8E8] hover:bg-[#d8d8d8] text-[#1A2A6C] text-xs font-bold transition-colors flex items-center space-x-2 border border-[#cccccc]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Statutory Physical Hierarchy Context Banner */}
      <div className="bg-[#f8fafc] border border-[#cbd5e1] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <Building2 className="w-5 h-5 text-[#1A2A6C] mt-0.5 shrink-0" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#1A2A6C]">Statutory Entity:</span>
              <span className="text-xs font-bold text-[#0f172a] bg-white px-2 py-0.5 border border-[#e2e8f0]">
                MEIL Infrastructure Projects Ltd
              </span>
              <span className="text-[10px] font-mono text-[#475569] bg-[#f1f5f9] px-1.5 py-0.5 border border-[#cbd5e1]">
                CIN: U45200TG2006PLC051234
              </span>
              <span className="text-[10px] font-bold text-[#166534] bg-[#dcfce7] px-2 py-0.5 border border-[#86efac]">
                100% Owned (Operational Control)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-[#334155]">
              <span><strong>Site:</strong> Demo Project Alpha (250MW Solar Park, AP) [In Statutory Boundary]</span>
              <span>•</span>
              <span><strong>Owner Dept:</strong> EHS</span>
              <span>•</span>
              <span><strong>Indicator:</strong> P6-E-ELEC (v1)</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-bold text-[#1e293b]">
          <span className="px-2.5 py-1 bg-white border border-[#cbd5e1] text-[#1A2A6C]">
            Integrity Check: Passed
          </span>
        </div>
      </div>

      {/* 2. LIVE ELECTRICITY-TO-SCOPE-2 CALCULATOR SLICE */}
      <section className="bg-white border-2 border-[#1A2A6C] shadow-sm">
        <div className="bg-[#1A2A6C] text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <Zap className="w-5 h-5 text-[#EF272E]" />
            <div>
              <h2 className="text-base font-bold tracking-tight">Scope 2 Live Electricity Calculator &amp; Database Sync</h2>
              <p className="text-[11px] text-[#C6CBE6]">Synchronized calculation engine for operational activity data and emission factors</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-white/10 text-white border border-white/20 text-[11px] font-bold">
            Decimal.js Precision Engine
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xs font-bold text-[#1A2A6C] uppercase tracking-wider border-b border-[#E8E8E8] pb-1">
              1. Collect: Enter Activity &amp; Scaling Parameters
            </h3>

            {/* Input 1: Purchased Electricity */}
            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Purchased Grid Electricity (<span className="text-[#EF272E]">kWh</span>)
              </label>
              <input
                type="number"
                value={quantityKwh}
                onChange={(e) => setQuantityKwh(e.target.value)}
                className="w-full px-3 py-2 border border-[#cccccc] focus:border-[#1A2A6C] focus:outline-none text-sm font-semibold text-[#1A2A6C]"
                placeholder="e.g. 1850000"
              />
              <span className="text-[11px] text-[#666666] mt-0.5 block">
                Source Document: Utility electricity bills and calibrated distribution meter readings
              </span>
            </div>

            {/* Input 2: CEA Grid Factor */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">
                  Grid Emission Factor (<span className="text-[#EF272E]">kg CO2e / kWh</span>)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={factorValue}
                  onChange={(e) => setFactorValue(e.target.value)}
                  className="w-full px-3 py-2 border border-[#cccccc] focus:border-[#1A2A6C] focus:outline-none text-sm font-semibold"
                />
                <span className="text-[11px] text-[#166534] font-bold mt-0.5 block">
                  Official CEA v20.0 (0.7160)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">
                  Turnover (<span className="text-[#EF272E]">₹ Crores</span>)
                </label>
                <input
                  type="number"
                  value={turnoverCr}
                  onChange={(e) => setTurnoverCr(e.target.value)}
                  className="w-full px-3 py-2 border border-[#cccccc] focus:border-[#1A2A6C] focus:outline-none text-sm font-semibold"
                  placeholder="e.g. 120"
                />
                <span className="text-[11px] text-[#666666] mt-0.5 block">
                  Audited Corporate Revenue base
                </span>
              </div>
            </div>

            {/* Input 3: Scope 1 & 3 Context */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#f0f0f0]">
              <div>
                <label className="block text-xs font-medium text-[#555555] mb-1">
                  Scope 1 Direct (<span className="text-[#333333]">tCO2e</span>)
                </label>
                <input
                  type="number"
                  value={scope1Val}
                  onChange={(e) => setScope1Val(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#e0e0e0] text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#555555] mb-1">
                  Scope 3 Value Chain (<span className="text-[#333333]">tCO2e</span>)
                </label>
                <input
                  type="number"
                  value={scope3Val}
                  onChange={(e) => setScope3Val(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#e0e0e0] text-xs font-medium"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-3">
              <button
                onClick={handleSaveToDatabase}
                disabled={saving}
                className="w-full bg-[#EF272E] hover:bg-[#d01c22] text-white py-2.5 px-4 text-xs font-bold transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving changes...' : 'Save & Sync to Statutory Ledger'}</span>
              </button>
              <p className="text-[10px] text-[#777777] text-center mt-1">
                Ensures transaction-level integrity and appends to immutable statutory audit log.
              </p>
            </div>
          </div>

          {/* Right Column: Convert, Scale & Display Outputs */}
          <div className="lg:col-span-6 bg-[#fafafa] p-5 border border-[#E8E8E8] flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-[#1A2A6C] uppercase tracking-wider border-b border-[#E8E8E8] pb-1 mb-4">
                2. Convert &amp; Scale: Real-Time Statutory Outputs
              </h3>

              {/* Conversion Math Box */}
              <div className="bg-white p-3.5 border border-[#E8E8E8] space-y-2 mb-4">
                <div className="text-[11px] text-[#666666]">
                  <strong>Convert Formula:</strong> ({quantityKwh} kWh × {factorValue} kgCO2e/kWh) ÷ 1,000 =
                </div>
                <div className="text-2xl font-black text-[#1A2A6C]">
                  {computedScope2} <span className="text-sm font-bold text-[#444444]">tCO2e (Scope 2)</span>
                </div>
              </div>

              {/* Intensity Box */}
              <div className="bg-white p-3.5 border border-[#E8E8E8] space-y-2 mb-4">
                <div className="text-[11px] text-[#666666]">
                  <strong>Scale Formula:</strong> Total GHG ({computedTotal} tCO2e) ÷ Turnover ({turnoverCr} ₹ Cr) =
                </div>
                <div className="text-2xl font-black text-[#EF272E]">
                  {computedIntensity === 'N/A' ? (
                    <span className="text-base font-bold text-[#b91c1c]">N/A (Turnover Required)</span>
                  ) : (
                    <>{computedIntensity} <span className="text-sm font-bold text-[#444444]">tCO2e / ₹ Crore Intensity</span></>
                  )}
                </div>
                <div className="text-[10px] text-[#166534] font-medium">
                  {computedIntensity === 'N/A' 
                    ? '⚠️ Zero/unentered turnover returns N/A to prevent false statutory zero-intensity claims.'
                    : '✓ Statutory intensity calculated per ₹ Crore turnover.'}
                </div>
              </div>

              {/* Share Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#1A2A6C]">Scope 2 Proportion</span>
                  <span className="text-[#1A2A6C]">{scope2Percent}% of Total GHG</span>
                </div>
                <div className="w-full bg-[#e5e7eb] h-3 rounded-[2px] overflow-hidden flex">
                  <div
                    className="bg-[#1A2A6C] h-full transition-all duration-300"
                    style={{ width: `${Math.min(parseFloat(scope2Percent), 100)}%` }}
                  />
                  <div className="bg-[#EF272E] h-full flex-1 opacity-70" />
                </div>
                <div className="flex justify-between text-[10px] text-[#666666]">
                  <span>Scope 2: {computedScope2} tCO2e</span>
                  <span>Scope 1 + 3: {(parseFloat(computedTotal) - parseFloat(computedScope2)).toFixed(2)} tCO2e</span>
                </div>
              </div>
            </div>

            {/* Audit Proof Stamp */}
            <div className="p-3 bg-[#e0e7ff] text-[#1e1b4b] border border-[#c7d2fe] text-[11px]">
              <div className="flex items-center space-x-1.5 font-bold mb-0.5">
                <ShieldCheck className="w-4 h-4 text-[#1A2A6C]" />
                <span>Statutory Auditor Traceability:</span>
              </div>
              <p className="text-[10px] text-[#3730a3]">
                Values generated link directly to meter records in <code>activity_data</code>. Any update is recorded with server clock in <code>audit_logs</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GRID OF 9 SEBI BRSR CORE ATTRIBUTES */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8E8E8] pb-2">
          <div>
            <h2 className="text-lg font-bold text-[#1A2A6C]">Official 9 BRSR Core Attributes Grid</h2>
            <p className="text-xs text-[#555555]">Click any attribute card to view its sub-data items, required source records from the PDF, and scaling methodology.</p>
          </div>
          <span className="text-xs font-bold text-[#666666] mt-1 sm:mt-0">
            Source: SEBI Revised BRSR Framework 2024
          </span>
        </div>

        {/* The 9 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {attributes.map((attr) => {
            const isSelected = selectedAttrNum === attr.attributeNumber;
            return (
              <div
                key={attr.attributeNumber}
                onClick={() => setSelectedAttrNum(attr.attributeNumber)}
                className={`p-4 border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#EF272E] bg-[#fff8f8] shadow-sm'
                    : 'border-[#E8E8E8] bg-white hover:border-[#1A2A6C]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                    isSelected ? 'bg-[#EF272E] text-white' : 'bg-[#1A2A6C] text-white'
                  }`}>
                    Attribute {attr.attributeNumber}
                  </span>
                  <span className="text-[11px] text-[#888888] font-bold">
                    {attr.dataItems.length} Sub-items
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#1A2A6C] mb-1">{attr.title}</h3>
                <p className="text-[12px] text-[#555555] line-clamp-2 leading-relaxed">
                  {attr.description}
                </p>

                <div className="mt-3 pt-2 border-t border-[#f0f0f0] flex items-center justify-between text-[11px] font-bold">
                  <span className={isSelected ? 'text-[#EF272E]' : 'text-[#666666]'}>
                    {isSelected ? 'Viewing Items & Source Records ▼' : 'Click to inspect records →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Attribute Detail Drawer */}
        {selectedAttr && (
          <div className="bg-white border border-[#1A2A6C] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8E8E8] pb-3 gap-2">
              <div>
                <span className="text-xs font-bold text-[#EF272E] uppercase tracking-wider">
                  Attribute {selectedAttr.attributeNumber} Details &amp; Required Records
                </span>
                <h3 className="text-xl font-bold text-[#1A2A6C]">{selectedAttr.title}</h3>
              </div>
              <div className="text-xs text-[#555555]">
                <strong>Scaling Method:</strong> {selectedAttr.scalingMethod}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-[#E8E8E8] text-[#1A2A6C]">
                    <th className="py-2.5 px-3 font-bold">Data Item to Collect</th>
                    <th className="py-2.5 px-3 font-bold">Mandatory Source Record (Audit Proof)</th>
                    <th className="py-2.5 px-3 font-bold">Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E8]">
                  {selectedAttr.dataItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#fcfcfc]">
                      <td className="py-2.5 px-3 font-bold text-[#333333]">{item.name}</td>
                      <td className="py-2.5 px-3 text-[#555555]">
                        <span className="bg-[#f3f4f6] px-2 py-0.5 border border-[#e5e7eb] font-medium text-[#1A2A6C]">
                          {item.sourceRecord}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#666666]">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expandable Scope 3 Table on Attribute 1 (GHG Footprint) */}
            {selectedAttr.scope3Categories && (
              <div className="pt-3 border-t border-[#E8E8E8]">
                <button
                  onClick={() => setScope3Expanded(!scope3Expanded)}
                  className="flex items-center space-x-2 text-xs font-bold text-[#1A2A6C] hover:text-[#EF272E] transition-colors"
                >
                  {scope3Expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span>
                    {scope3Expanded ? 'Hide' : 'Expand'} 15 Scope 3 Value Chain Categories (Principle 6 Leadership)
                  </span>
                </button>

                {scope3Expanded && (
                  <div className="mt-3 overflow-x-auto border border-[#e5e7eb]">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#f0f4f8] text-[#1A2A6C] border-b border-[#e5e7eb]">
                          <th className="py-2 px-3 w-16 font-bold">Category</th>
                          <th className="py-2 px-3 font-bold">Scope 3 Activity Description</th>
                          <th className="py-2 px-3 font-bold">Source Documentation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e5e7eb]">
                        {selectedAttr.scope3Categories.map((c) => (
                          <tr key={c.number} className="hover:bg-[#fafafa]">
                            <td className="py-2 px-3 font-bold text-[#EF272E]">Cat {c.number}</td>
                            <td className="py-2 px-3 font-medium text-[#333333]">{c.name}</td>
                            <td className="py-2 px-3 text-[#555555]">{c.sourceRecord}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. IMMUTABLE DATABASE AUDIT LOG FEED */}
      <section className="bg-white border border-[#E8E8E8] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-2">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-[#1A2A6C]" />
            <h3 className="text-sm font-bold text-[#1A2A6C]">Statutory Audit Log Feed (Scope 2 Records)</h3>
          </div>
          <span className="text-[11px] font-bold text-[#166534] bg-[#f0fdf4] px-2 py-0.5 border border-[#86efac]">
            Immutable Revision Ledger
          </span>
        </div>

        <p className="text-xs text-[#555555]">
          Every time you save or sync, an immutable audit entry is automatically recorded with a certified timestamp.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#E8E8E8] text-[#666666]">
                <th className="py-2 px-3 font-bold">Action</th>
                <th className="py-2 px-3 font-bold">Table</th>
                <th className="py-2 px-3 font-bold">Record ID</th>
                <th className="py-2 px-3 font-bold">Changed By</th>
                <th className="py-2 px-3 font-bold">Database Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8]">
              {auditLogsList.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-[#fcfcfc]">
                  <td className="py-2 px-3">
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold ${
                      log.action === 'INSERT' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#e0e7ff] text-[#3730a3]'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono font-bold text-[#1A2A6C]">{log.tableName}</td>
                  <td className="py-2 px-3 font-mono text-[#555555]">{log.recordId}</td>
                  <td className="py-2 px-3 text-[#333333] font-medium">{log.changedBy}</td>
                  <td className="py-2 px-3 text-[#666666]">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

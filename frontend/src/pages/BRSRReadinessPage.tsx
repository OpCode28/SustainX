import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ListCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ProgressBar } from '../components/common/ProgressBar';

export const BRSRReadinessPage: React.FC = () => {
  const navigate = useNavigate();
  const { dashboardSummary, selectedOrg, selectedPeriod } = useApp();

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header (Section 19) */}
      <div className="border-b border-[#E8E8E8] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-1">
            <span className="text-[#1A2A6C]">{selectedOrg.name}</span>
            <span>•</span>
            <span className="text-[#EF272E]">{selectedPeriod.financialYear}</span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#1A2A6C] tracking-tight leading-tight">
            BRSR Readiness &amp; Core Assurance
          </h1>
          <p className="text-[14px] text-[#444444] mt-1 max-w-3xl leading-relaxed">
            Statutory readiness audit across Section A (General), Section B (Management), Section C (Principles 1–9) and SEBI-mandated BRSR Core KPIs.
          </p>
        </div>

        <button
          onClick={() => navigate('/reports')}
          className="bg-[#1A2A6C] hover:bg-[#EF272E] text-white px-4 py-2 text-xs font-bold transition-colors flex items-center space-x-1.5"
        >
          <FileText className="w-4 h-4" />
          <span>Export BRSR Annexure I</span>
        </button>
      </div>

      {/* 2. Large Readiness Score Block (Section 19: 89% Overall) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Score */}
        <div className="lg:col-span-4 bg-[#1A2A6C] text-white p-6 border-l-4 border-[#EF272E] flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C6CBE6]">
              Statutory Readiness
            </span>
            <h3 className="text-lg font-bold text-white">Overall BRSR Score</h3>
            <p className="text-xs text-[#C6CBE6]">Consolidated across all MEIL operating entities</p>
          </div>

          <div className="text-center py-4">
            <span className="text-6xl font-black text-white block">
              {dashboardSummary.overallReadinessPercent}%
            </span>
            <p className="text-xs font-bold text-[#EF272E] mt-2 flex items-center justify-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Compliant for Statutory Submission</span>
            </p>
          </div>

          <div className="p-3 bg-[#121c4a] border border-white/20 text-xs flex items-center justify-between">
            <span className="font-bold text-[#C6CBE6]">BRSR Core Assurance</span>
            <span className="font-black text-white text-sm">
              {dashboardSummary.brsrCoreReadinessPercent}%
            </span>
          </div>
        </div>

        {/* Section Cards: Section A (96%), Section B (88%), Section C (82%), BRSR Core (91%) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Section A */}
          <div className="bg-white border border-[#E8E8E8] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#666666] uppercase">Section A</span>
              <span className="text-xs font-bold bg-[#E8E8E8] text-[#1A2A6C] px-2 py-0.5 border border-[#d1d5db]">
                96% Ready
              </span>
            </div>
            <h4 className="text-base font-bold text-[#1A2A6C]">General Disclosures</h4>
            <p className="text-xs text-[#555555] leading-relaxed">
              Company details, operational scope, workforce demographics, CSR investments.
            </p>
            <ProgressBar value={dashboardSummary.sectionAReadiness} size="sm" color="navy" />
          </div>

          {/* Section B */}
          <div className="bg-white border border-[#E8E8E8] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#666666] uppercase">Section B</span>
              <span className="text-xs font-bold bg-[#E8E8E8] text-[#1A2A6C] px-2 py-0.5 border border-[#d1d5db]">
                88% Ready
              </span>
            </div>
            <h4 className="text-base font-bold text-[#1A2A6C]">Management &amp; Process</h4>
            <p className="text-xs text-[#555555] leading-relaxed">
              Governance policies, board oversight, whistle-blower hotline, compliance declarations.
            </p>
            <ProgressBar value={dashboardSummary.sectionBReadiness} size="sm" color="navy" />
          </div>

          {/* Section C */}
          <div className="bg-white border border-[#E8E8E8] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#666666] uppercase">Section C</span>
              <span className="text-xs font-bold bg-[#E8E8E8] text-[#1A2A6C] px-2 py-0.5 border border-[#d1d5db]">
                82% Ready
              </span>
            </div>
            <h4 className="text-base font-bold text-[#1A2A6C]">Principle-wise Performance</h4>
            <p className="text-xs text-[#555555] leading-relaxed">
              Principles 1–9 disclosures covering GHG emissions, water, energy, safety, and supply chain.
            </p>
            <ProgressBar value={dashboardSummary.sectionCReadiness} size="sm" color="red" />
          </div>

          {/* BRSR Core */}
          <div className="bg-white border border-[#E8E8E8] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#EF272E] uppercase">Mandatory Assurance</span>
              <span className="text-xs font-bold bg-[#EF272E] text-white px-2 py-0.5">
                91% Ready
              </span>
            </div>
            <h4 className="text-base font-bold text-[#1A2A6C]">BRSR Core Indicators</h4>
            <p className="text-xs text-[#555555] leading-relaxed">
              SEBI reasonable assurance KPIs subject to statutory third-party audit verification.
            </p>
            <ProgressBar value={dashboardSummary.brsrCoreReadinessPercent} size="sm" color="navy" />
          </div>
        </div>
      </div>

      {/* 3. Areas Requiring Attention (Section 19) */}
      <div className="bg-white border border-[#E8E8E8] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
          <div>
            <h3 className="text-base font-bold text-[#1A2A6C] flex items-center space-x-2">
              <ListCheck className="w-4 h-4 text-[#EF272E]" />
              <span>Areas Requiring Attention</span>
            </h3>
            <p className="text-xs text-[#666666]">Actionable gap list before generating statutory filing dossier</p>
          </div>
          <span className="text-xs font-bold text-[#EF272E]">3 Action Items</span>
        </div>

        <div className="divide-y divide-[#E8E8E8] text-xs">
          <div className="py-3 flex items-center justify-between hover:bg-[#fafafa] px-2 transition-colors">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-4 h-4 text-[#EF272E] shrink-0" />
              <div>
                <strong className="text-[#1A2A6C] block">Project Beta: Missing Waste Recycling Dispatch Manifest</strong>
                <span className="text-[#666666]">Principle 6 (P6-E4-REC) requires certified weighbridge receipt.</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/data-entry')}
              className="px-3 py-1.5 border border-[#1A2A6C] text-[#1A2A6C] hover:bg-[#1A2A6C] hover:text-white font-bold transition-colors"
            >
              Attach Proof →
            </button>
          </div>

          <div className="py-3 flex items-center justify-between hover:bg-[#fafafa] px-2 transition-colors">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0" />
              <div>
                <strong className="text-[#1A2A6C] block">Project Beta: Dewatering Water Volume Anomaly (+41.8% YoY)</strong>
                <span className="text-[#666666]">ESG Officer justification note required for audit approval.</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/review')}
              className="px-3 py-1.5 border border-[#1A2A6C] text-[#1A2A6C] hover:bg-[#1A2A6C] hover:text-white font-bold transition-colors"
            >
              Review Queue →
            </button>
          </div>

          <div className="py-3 flex items-center justify-between hover:bg-[#fafafa] px-2 transition-colors">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-4 h-4 text-[#1A2A6C] shrink-0" />
              <div>
                <strong className="text-[#1A2A6C] block">Project Gamma: Q3 Safety Induction Training Hours</strong>
                <span className="text-[#666666]">Draft saved, pending final site submission.</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/data-entry')}
              className="px-3 py-1.5 border border-[#1A2A6C] text-[#1A2A6C] hover:bg-[#1A2A6C] hover:text-white font-bold transition-colors"
            >
              Submit Draft →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

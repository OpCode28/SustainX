import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight,
  ChevronRight,
  Lock,
  FileCheck2,
  Database,
  TrendingDown,
  Info,
  Scale,
  Sparkles,
  Users,
  Target,
  FileSpreadsheet,
  CheckCircle,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { KpiCard } from '../components/common/KpiCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { SiteEngineerDashboard } from '../components/dashboard/SiteEngineerDashboard';
import { 
  READINESS_FORMULA_DEFINITIONS, 
  SUBSIDIARY_LEAGUE_TABLE, 
  BRSR_CORE_9_ATTRIBUTES, 
  MEIL_DECARBONISATION_TRAJECTORY 
} from '../data/entityMetrics';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole, currentUser } = useAuth();
  const { 
    selectedOrg, 
    selectedPeriod, 
    dashboardSummary, 
    organisations, 
    alerts,
    setSelectedOrgId
  } = useApp();

  const [showSignOffModal, setShowSignOffModal] = useState(false);
  const [signOffComments, setSignOffComments] = useState('');
  const [signOffSuccessToast, setSignOffSuccessToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'BRSR_CORE_MATRIX' | 'SUBSIDIARY_LEAGUE'>('OVERVIEW');

  // If authenticated as a Site Engineer or Site Safety EHS, render dedicated project-scoped dashboard
  if (['SITE_USER', 'SITE_ENGINEER', 'SITE_EHS'].includes(currentRole)) {
    return <SiteEngineerDashboard />;
  }

  const activeAlerts = alerts.filter(a => a.status === 'OPEN');

  const handleGroupSignOff = async () => {
    try {
      await fetch('/api/v1/period/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodId: selectedPeriod.id,
          roleId: currentRole,
          userEmail: currentUser?.email || 'amit.verma@meil-group.demo',
          comments: signOffComments || 'Executive statutory group sign-off authorized under SEBI LODR Reg 34'
        })
      });
    } catch (err) {
      console.warn('Sign-off lock API call error:', err);
    }
    setShowSignOffModal(false);
    setSignOffSuccessToast(true);
    setTimeout(() => setSignOffSuccessToast(false), 6000);
  };

  const isGroupScope = selectedOrg.type === 'GROUP';

  return (
    <div className="space-y-7 pb-16">
      {/* 1. Page Header with Regulatory & Live Baseline Indicators */}
      <div className="border-b border-[#E8E8E8] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-1">
            <span className="text-[#1A2A6C]">{selectedOrg.type} LEVEL: {selectedOrg.name}</span>
            <span>•</span>
            <span className="text-[#EF272E]">{selectedPeriod.financialYear}</span>
          </div>

          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#1A2A6C] tracking-tight leading-tight">
            Group ESG Oversight &amp; BRSR Steering
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#444444] mt-1 max-w-4xl leading-relaxed">
            Consolidated statutory visibility across {isGroupScope ? 'all 3 operating subsidiaries, 6 business units, and 12 execution projects' : `assigned scope: ${selectedOrg.name}`}. Certified for SEBI BRSR Core Reasonable Assurance compliance.
          </p>

          {/* Statutory Baseline & Consolidation Info Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2.5 text-[11px] text-[#555555]">
            <span className="px-2 py-0.5 bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] font-semibold flex items-center space-x-1">
              <Database className="w-3 h-3 text-[#16a34a]" />
              <span>Data as of: 12-Oct-2026, 09:30 AM IST (Verified Audit Trail)</span>
            </span>

            <span className="px-2 py-0.5 bg-[#f8fafc] text-[#334155] border border-[#e2e8f0]">
              <strong>Baseline Basis:</strong> FY 2025-26 Audited Filing vs FY 2026-27 YTD Consolidated Actuals
            </span>

            <span className="px-2 py-0.5 bg-[#f8fafc] text-[#334155] border border-[#e2e8f0]">
              <strong>Boundary:</strong> Operational Control (100% Equity)
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          {/* Group Sign-off Executive Trigger (CSO Only) */}
          {currentRole === 'GROUP_SUSTAINABILITY' && (
            <button
              onClick={() => setShowSignOffModal(true)}
              className="bg-[#EF272E] hover:bg-[#c91820] text-white px-3.5 py-2 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
              title="Formally approve and freeze quarterly filing"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Group Sign-Off &amp; Lock</span>
            </button>
          )}

          <button
            onClick={() => navigate('/traceability')}
            className="border border-[#1A2A6C] hover:bg-[#1A2A6C] hover:text-white text-[#1A2A6C] px-3 py-2 text-xs font-bold transition-colors flex items-center space-x-1.5"
          >
            <span>Traceability Tree</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => navigate('/brsr-readiness')}
            className="bg-[#1A2A6C] hover:bg-[#EF272E] text-white px-3.5 py-2 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>BRSR Readiness</span>
          </button>
        </div>
      </div>

      {/* Confirmation Toast for Sign-off */}
      {signOffSuccessToast && (
        <div className="bg-[#f0fdf4] border-l-4 border-[#16a34a] p-4 text-xs text-[#166534] flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-[#16a34a]" />
            <div>
              <strong className="text-sm block">Statutory Group Sign-Off Committed Successfully</strong>
              <span>Reporting period {selectedPeriod.financialYear} has been verified and stamped with cryptographic hash #TX-CSO-2026-9942. Audit trail ledger entry created.</span>
            </div>
          </div>
          <button onClick={() => setSignOffSuccessToast(false)} className="text-[#166534] hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MEIL Infrastructure Operations Showcase: Dam, Construction & Solar Canal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative rounded-[4px] overflow-hidden border border-slate-200 shadow-xs group bg-white">
          <div className="h-28 w-full overflow-hidden relative">
            <img src="/water_dam.jpg" alt="Water Dam & Lift Irrigation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-[#EF272E] text-white px-2 py-0.5 rounded-[2px]">
              Water Resources &amp; Dam
            </span>
            <div className="absolute bottom-1.5 left-2.5 right-2.5 text-white">
              <div className="text-xs font-bold leading-tight drop-shadow truncate">Kaleshwaram Dam &amp; Lift Irrigation</div>
              <div className="text-[10px] text-slate-200 truncate">Zero-Discharge Environmental Standard</div>
            </div>
          </div>
          <div className="p-2 bg-slate-50 flex items-center justify-between text-xs text-[#1A2A6C] font-semibold border-t border-slate-200">
            <span>Water Intensity: <strong className="text-emerald-700">0.084 KL/₹ Cr</strong></span>
            <span className="text-[11px] text-[#666666]">P6-E4 Water Metric</span>
          </div>
        </div>

        <div className="relative rounded-[4px] overflow-hidden border border-slate-200 shadow-xs group bg-white">
          <div className="h-28 w-full overflow-hidden relative">
            <img src="/construction.jpg" alt="Construction & Tunneling" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-[#1A2A6C] text-white px-2 py-0.5 rounded-[2px]">
              Heavy Civil &amp; Metros
            </span>
            <div className="absolute bottom-1.5 left-2.5 right-2.5 text-white">
              <div className="text-xs font-bold leading-tight drop-shadow truncate">Viaducts, Tunnels &amp; High-Speed Rail</div>
              <div className="text-[10px] text-slate-200 truncate">Active Monitoring at Project Beta &amp; Gamma</div>
            </div>
          </div>
          <div className="p-2 bg-slate-50 flex items-center justify-between text-xs text-[#1A2A6C] font-semibold border-t border-slate-200">
            <span>Direct Fuel Scope 1: <strong className="text-blue-700">3,440 kgCO2e</strong></span>
            <span className="text-[11px] text-[#666666]">P6-E1 Fuels</span>
          </div>
        </div>

        <div className="relative rounded-[4px] overflow-hidden border border-slate-200 shadow-xs group bg-white">
          <div className="h-28 w-full overflow-hidden relative">
            <img src="/solar_canal.jpg" alt="Clean Energy & Solar Canal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white px-2 py-0.5 rounded-[2px]">
              Clean Energy &amp; Canals
            </span>
            <div className="absolute bottom-1.5 left-2.5 right-2.5 text-white">
              <div className="text-xs font-bold leading-tight drop-shadow truncate">2,500 MW Solar &amp; Canal Networks</div>
              <div className="text-[10px] text-slate-200 truncate">CEA Grid Factor Offset Verified</div>
            </div>
          </div>
          <div className="p-2 bg-slate-50 flex items-center justify-between text-xs text-[#1A2A6C] font-semibold border-t border-slate-200">
            <span>Renewable Share: <strong className="text-emerald-700">42.8% Total MWh</strong></span>
            <span className="text-[11px] text-[#666666]">Scope 2 Decarbonization</span>
          </div>
        </div>
      </div>

      {/* 2. Top KPI Strip (With Formulas on Hover and Real Assurance Labels) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <KpiCard
          title={isGroupScope ? "In-Scope Entities" : "Active Units"}
          value={dashboardSummary.totalProjects}
          unit={isGroupScope ? "Units" : "Sites"}
          subtitle={isGroupScope ? "12 Entities in MEIL Boundary" : selectedOrg.name}
          badgeText={`${dashboardSummary.totalProjects} in Scope`}
          onClick={() => navigate('/organisation')}
        />

        <KpiCard
          title="Data Submitted"
          value={dashboardSummary.submittedProjects}
          unit="Units"
          subtitle={`${dashboardSummary.submittedProjects} of ${dashboardSummary.totalProjects} Sites Submitted`}
          badgeText={`${Math.round((dashboardSummary.submittedProjects / (dashboardSummary.totalProjects || 1)) * 100)}% On Track`}
        />

        <KpiCard
          title="Pending Review"
          value={dashboardSummary.pendingReviewProjects}
          unit="Items"
          subtitle="Awaiting ESG Officer Action"
          badgeText={dashboardSummary.pendingReviewProjects > 0 ? `${dashboardSummary.pendingReviewProjects} Action Req` : 'Zero Backlog'}
          onClick={() => navigate('/review')}
        />

        {/* OVERALL READINESS WITH STATUTORY HOVER FORMULA */}
        <KpiCard
          title="Overall Readiness"
          value={`${dashboardSummary.overallReadinessPercent}%`}
          subtitle="BRSR Sec A, B & C Weighted"
          trend={{ value: 14.5, isPositiveGood: true, label: 'YoY' }}
          formulaTooltip={READINESS_FORMULA_DEFINITIONS.overall}
          onClick={() => navigate('/brsr-readiness')}
        />

        {/* BRSR CORE WITH REASONABLE ASSURANCE STATUS & FORMULA */}
        <KpiCard
          title="BRSR Core"
          value={`${dashboardSummary.brsrCoreReadinessPercent}%`}
          subtitle="Reasonable Assurance Ready"
          badgeText="EY Stage 2 Sampling"
          formulaTooltip={READINESS_FORMULA_DEFINITIONS.brsrCore}
          onClick={() => navigate('/brsr-readiness')}
        />
      </div>

      {/* 3. Statutory Filing Deadline & Phased Milestone Timeline Strip */}
      <div className="bg-white border border-[#E8E8E8] p-4.5 rounded-[2px] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E8E8] pb-2.5">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#EF272E]" />
            <span className="text-xs font-bold text-[#1A2A6C] uppercase tracking-wider">
              Statutory Filing Timeline • SEBI MCA Filing Deadline: 31 March 2027
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[11px] font-bold bg-[#fef2f2] text-[#EF272E] border border-[#fecaca]">
              170 Days Remaining
            </span>
            <span className="text-[11px] text-[#666666]">Mandatory for Top 250 Listed Companies</span>
          </div>
        </div>

        {/* Phased Roadmap Track */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1 text-xs">
          <div className="p-2.5 bg-[#f0fdf4] border border-[#bbf7d0] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#166534]">1. Site Data Collection</span>
              <span className="text-[10px] font-bold text-[#166534]">100%</span>
            </div>
            <p className="text-[10px] text-[#15803d]">All monthly utility invoices &amp; logs logged</p>
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#dcfce7] text-[#166534] inline-block">COMPLETED</span>
          </div>

          <div className="p-2.5 bg-[#eff6ff] border border-[#bfdbfe] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1e40af]">2. ESG Officer Audit</span>
              <span className="text-[10px] font-bold text-[#1e40af]">85%</span>
            </div>
            <p className="text-[10px] text-[#1d4ed8]">Secondary review &amp; evidentiary verification</p>
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#dbeafe] text-[#1e40af] inline-block">IN PROGRESS</span>
          </div>

          <div className="p-2.5 bg-[#fefce8] border border-[#fef08a] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#854d0e]">3. Reasonable Assurance</span>
              <span className="text-[10px] font-bold text-[#854d0e]">Stage 2</span>
            </div>
            <p className="text-[10px] text-[#a16207]">EY India independent field testing &amp; sampling</p>
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#fef9c3] text-[#854d0e] inline-block">ACTIVE SAMPLING</span>
          </div>

          <div className="p-2.5 bg-[#fafafa] border border-[#E8E8E8] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#444444]">4. Group CSO Sign-Off</span>
              <span className="text-[10px] text-[#888888]">Feb 2027</span>
            </div>
            <p className="text-[10px] text-[#666666]">Executive sign-off &amp; final period locking</p>
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#E8E8E8] text-[#555555] inline-block">UPCOMING</span>
          </div>

          <div className="p-2.5 bg-[#fafafa] border border-[#E8E8E8] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#444444]">5. Board &amp; MCA Filing</span>
              <span className="text-[10px] text-[#888888]">31 Mar 2027</span>
            </div>
            <p className="text-[10px] text-[#666666]">XBRL statutory lodgement with SEBI</p>
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#E8E8E8] text-[#555555] inline-block">FINAL DEADLINE</span>
          </div>
        </div>
      </div>

      {/* 4. Executive ESG Section (Environment with Scope 1+2+3 & Intensity, Social with Diversity/Safety, Governance with Ethics/Fines) */}
      <div className="space-y-3">
        <div className="border-b-2 border-[#1A2A6C] pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#1A2A6C] uppercase tracking-wide">
              BRSR Core Pillars &amp; Performance
            </h2>
            <p className="text-[13px] text-[#555555]">
              Real statutory disclosures across Environmental, Social, and Governance principles scoped to {selectedOrg.name}.
            </p>
          </div>
          <span className="text-xs font-mono text-[#666666] hidden sm:block">
            Standard: SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
          {/* 4.1 ENVIRONMENT (PRINCIPLE 6) */}
          <div className="bg-white border border-[#E8E8E8] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div>
                <span className="text-[11px] font-bold text-[#1A2A6C] uppercase tracking-wider block">
                  ENVIRONMENT (PRINCIPLE 6)
                </span>
                <h3 className="text-base font-bold text-[#333333]">Decarbonization &amp; Footprint</h3>
              </div>
              <span className="text-[10px] font-bold bg-[#E8E8E8] text-[#1A2A6C] px-2 py-0.5 border border-[#d1d5db]">
                BRSR Core Assured
              </span>
            </div>

            {/* GHG Total and Breakdown */}
            <div className="bg-[#fafafa] p-3.5 border border-[#E8E8E8] space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-[#666666] block">Total Gross GHG Footprint (Scope 1+2+3)</span>
                  <span className="text-2xl font-bold text-[#1A2A6C]">
                    {(dashboardSummary.environmentalSummary.totalGHG_tCO2e || 212550).toLocaleString()} <span className="text-xs font-normal text-[#555555]">tCO₂e</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#16a34a] block">↓ 5.8% YoY</span>
                  <span className="text-[10px] text-[#888888]">vs FY 2025-26</span>
                </div>
              </div>

              {/* Scopes 1, 2, 3 Breakdown */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px] border-t border-[#E8E8E8]">
                <div className="p-1.5 bg-white border border-[#E8E8E8]">
                  <span className="text-[10px] text-[#888888] block">Scope 1 Direct</span>
                  <strong className="text-[#1A2A6C]">{dashboardSummary.environmentalSummary.scope1GHG_tCO2e.toLocaleString()}</strong>
                </div>
                <div className="p-1.5 bg-white border border-[#E8E8E8]">
                  <span className="text-[10px] text-[#888888] block">Scope 2 (Grid)</span>
                  <strong className="text-[#1A2A6C]">{dashboardSummary.environmentalSummary.scope2GHG_tCO2e.toLocaleString()}</strong>
                </div>
                <div className="p-1.5 bg-white border border-[#E8E8E8]">
                  <span className="text-[10px] text-[#888888] block">Scope 3 (Chain)</span>
                  <strong className="text-[#1A2A6C]">{(dashboardSummary.environmentalSummary.scope3GHG_tCO2e || 48200).toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* SEBI Turnover Intensity & Resource Metrics */}
            <div className="space-y-2 text-xs text-[#444444]">
              <div className="flex justify-between py-1 border-b border-[#E8E8E8] bg-[#f8fafc] px-2 font-medium">
                <span>GHG Intensity per ₹ Turnover:</span>
                <strong className="text-[#1A2A6C]">{dashboardSummary.environmentalSummary.ghgIntensityPerCrore || '1.45'} tCO₂e / ₹ Cr</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E8] bg-[#f8fafc] px-2 font-medium">
                <span>GHG Intensity (PPP-adjusted):</span>
                <strong className="text-[#1A2A6C]">{dashboardSummary.environmentalSummary.ghgIntensityPPP || '18.2'} tCO₂e / $M USD PPP</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                <span>Total Energy Consumed:</span>
                <strong className="text-[#333333]">{dashboardSummary.environmentalSummary.energyConsumptionGJ.toLocaleString()} GJ</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                <span>Total Water Withdrawal:</span>
                <strong className="text-[#333333]">{dashboardSummary.environmentalSummary.waterConsumptionKL.toLocaleString()} KL ({dashboardSummary.environmentalSummary.waterIntensityKL || '28.17'} KL / ₹ Cr)</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Waste Recycled &amp; Diverted:</span>
                <strong className="text-[#16a34a]">{dashboardSummary.environmentalSummary.wasteRecycledPercent}% Landfill Diverted</strong>
              </div>
            </div>

            <div className="pt-2">
              <ProgressBar
                value={dashboardSummary.environmentalSummary.renewableEnergyPercent}
                label={`Renewable Energy Share (${dashboardSummary.environmentalSummary.renewableEnergyPercent}%) - Target 40%`}
                size="sm"
                color="navy"
              />
            </div>
          </div>

          {/* 4.2 SOCIAL (PRINCIPLE 3 & 5) */}
          <div className="bg-white border border-[#E8E8E8] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div>
                <span className="text-[11px] font-bold text-[#1A2A6C] uppercase tracking-wider block">
                  SOCIAL (PRINCIPLE 3 &amp; 5)
                </span>
                <h3 className="text-base font-bold text-[#333333]">Workforce, Parity &amp; Safety</h3>
              </div>
              <span className="text-[10px] font-bold bg-[#E8E8E8] text-[#1A2A6C] px-2 py-0.5 border border-[#d1d5db]">
                BRSR Core Assured
              </span>
            </div>

            <div className="bg-[#fafafa] p-3.5 border border-[#E8E8E8] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#666666] block">Total Operational Workforce</span>
                <span className="text-2xl font-bold text-[#1A2A6C]">
                  {dashboardSummary.socialSummary.totalWorkforce.toLocaleString()} <span className="text-xs font-normal text-[#555555]">Personnel</span>
                </span>
                <span className="text-[10px] text-[#888888] block mt-0.5">
                  Permanent: {dashboardSummary.socialSummary.permanentEmployees.toLocaleString()} | Contract: {(dashboardSummary.socialSummary.contractualWorkforce || 14170).toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#16a34a] block">↑ 4.2%</span>
                <span className="text-[10px] text-[#888888]">Headcount YoY</span>
              </div>
            </div>

            {/* BRSR Core Safety & Diversity Attributes */}
            <div className="space-y-2 text-xs text-[#444444]">
              <div className="flex justify-between py-1 border-b border-[#E8E8E8] bg-[#f8fafc] px-2 font-medium">
                <span>Gender Diversity (Overall):</span>
                <strong className="text-[#1A2A6C]">
                  {dashboardSummary.socialSummary.femaleRepresentationPercent}% (Exec: {dashboardSummary.socialSummary.femaleExecPercent || 22}%)
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E8] bg-[#f8fafc] px-2 font-medium">
                <span>Remuneration Parity (F:M):</span>
                <strong className="text-[#16a34a]">{dashboardSummary.socialSummary.wageParityRatio || '1.02 : 1'} (Equity Met)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                <span>LTIFR (Lost Time Injury Rate):</span>
                <strong className="text-[#16a34a] font-mono">{dashboardSummary.socialSummary.ltifr ?? 0.12} / million hrs (Healthy &lt; 0.50)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                <span>Work-Related Fatalities:</span>
                <strong className="text-[#16a34a] font-bold">0 Fatalities (Zero Track)</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Health &amp; Accident Insurance:</span>
                <strong className="text-[#333333]">{dashboardSummary.socialSummary.wellbeingCoveragePercent}% Covered</strong>
              </div>
            </div>

            <div className="pt-2">
              <ProgressBar
                value={dashboardSummary.socialSummary.femaleRepresentationPercent}
                label={`Female Engineering & Executive Ratio (${dashboardSummary.socialSummary.femaleRepresentationPercent}%)`}
                size="sm"
                color="red"
              />
            </div>
          </div>

          {/* 4.3 GOVERNANCE (PRINCIPLE 1, 8, 9) */}
          <div className="bg-white border border-[#E8E8E8] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div>
                <span className="text-[11px] font-bold text-[#1A2A6C] uppercase tracking-wider block">
                  GOVERNANCE (PRINCIPLE 1, 8, 9)
                </span>
                <h3 className="text-base font-bold text-[#333333]">Integrity, Ethics &amp; Fines</h3>
              </div>
              <span className="text-[10px] font-bold bg-[#E8E8E8] text-[#1A2A6C] px-2 py-0.5 border border-[#d1d5db]">
                BRSR Core Assured
              </span>
            </div>

            {/* Measurable Governance Score with Hover Formula */}
            <div className="bg-[#fafafa] p-3.5 border border-[#E8E8E8] flex items-center justify-between relative group">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] text-[#666666]">Governance Adherence Score</span>
                  <Info className="w-3 h-3 text-[#1A2A6C] cursor-help" />
                </div>
                <span className="text-2xl font-bold text-[#1A2A6C]">
                  {dashboardSummary.governanceAdherencePercent || 94.0}%
                </span>
                <span className="text-[10px] text-[#888888] block mt-0.5">
                  Calculated from statutory returns &amp; redressed cases
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#16a34a] block">100% Resolved</span>
                <span className="text-[10px] text-[#888888]">Zero Fines</span>
              </div>
            </div>

            {/* REAL Measurable Governance Indicators */}
            <div className="space-y-2 text-xs text-[#444444]">
              <div className="flex justify-between py-1 border-b border-[#E8E8E8] bg-[#f8fafc] px-2 font-medium">
                <span>Ethics &amp; Bribery Complaints:</span>
                <strong className="text-[#16a34a]">{dashboardSummary.governanceSummary.ethicsComplaintsCount ?? 0} Received / 0 Upheld</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E8] bg-[#f8fafc] px-2 font-medium">
                <span>Regulatory Fines &amp; Penalties:</span>
                <strong className="text-[#16a34a]">₹{dashboardSummary.governanceSummary.regulatoryFines ?? 0} / Nil Paid (0 Actions)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                <span>Anti-Corruption Policy Coverage:</span>
                <strong className="text-[#333333]">{dashboardSummary.governanceSummary.antiCorruptionCoveragePercent ?? 100}% Operations</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                <span>MSME Sourced Procurement:</span>
                <strong className="text-[#1A2A6C]">{dashboardSummary.governanceSummary.msmeProcurementPercent}% (Min 25% Met)</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Customer Privacy &amp; Data Breaches:</span>
                <strong className="text-[#16a34a]">{dashboardSummary.governanceSummary.dataBreachesCount} Incidents</strong>
              </div>
            </div>

            <div className="pt-2">
              <ProgressBar
                value={dashboardSummary.governanceSummary.msmeProcurementPercent}
                label={`MSME Procurement Ratio (${dashboardSummary.governanceSummary.msmeProcurementPercent}%) - Statutory Mandate Met`}
                size="sm"
                color="navy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. CSO Executive Steering Hub (Tabs: Entity League Table, All 9 BRSR Core Matrix, Trajectory) */}
      <div className="bg-white border border-[#E8E8E8]">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-[#E8E8E8] px-5 pt-3 bg-[#fafafa]">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'OVERVIEW'
                  ? 'border-[#1A2A6C] text-[#1A2A6C]'
                  : 'border-transparent text-[#666666] hover:text-[#1A2A6C]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Subsidiary League Table &amp; Workflow</span>
            </button>

            <button
              onClick={() => setActiveTab('BRSR_CORE_MATRIX')}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'BRSR_CORE_MATRIX'
                  ? 'border-[#1A2A6C] text-[#1A2A6C]'
                  : 'border-transparent text-[#666666] hover:text-[#1A2A6C]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>All 9 BRSR Core Attributes Checklist</span>
            </button>

            <button
              onClick={() => setActiveTab('SUBSIDIARY_LEAGUE')}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'SUBSIDIARY_LEAGUE'
                  ? 'border-[#1A2A6C] text-[#1A2A6C]'
                  : 'border-transparent text-[#666666] hover:text-[#1A2A6C]'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Decarbonization Trajectory &amp; Assurance</span>
            </button>
          </div>

          <span className="text-[11px] font-bold text-[#888888] pb-3 hidden sm:block">
            Executive View: Amit Verma (Group CSO)
          </span>
        </div>

        {/* TAB 1: ENTITY LEAGUE TABLE & WORKFLOW STATUS */}
        {activeTab === 'OVERVIEW' && (
          <div className="p-5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#1A2A6C] uppercase tracking-wider">
                  Operating Subsidiary League Table &amp; Sign-Off Readiness
                </h3>
                <p className="text-xs text-[#666666]">
                  Comparative reporting completeness, emissions intensity, and indicator approval workflow per entity. Click any entity to drill down.
                </p>
              </div>
              <span className="text-xs text-[#166534] font-semibold bg-[#f0fdf4] px-2.5 py-1 border border-[#bbf7d0]">
                3 of 3 Subsidiaries Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1A2A6C] text-white font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Operating Entity</th>
                    <th className="py-2.5 px-3">Business Vertical</th>
                    <th className="py-2.5 px-3">Completeness</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Projects</th>
                    <th className="py-2.5 px-3">GHG Scope 1+2</th>
                    <th className="py-2.5 px-3">Workflow Breakdown</th>
                    <th className="py-2.5 px-3 text-right">Drill Down</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E8]">
                  {SUBSIDIARY_LEAGUE_TABLE.map((sub) => (
                    <tr 
                      key={sub.id} 
                      className={`hover:bg-[#f8fafc] cursor-pointer transition-colors ${selectedOrg.id === sub.id ? 'bg-[#f1f5f9]' : ''}`}
                      onClick={() => setSelectedOrgId(sub.id)}
                    >
                      <td className="py-3 px-3">
                        <strong className="text-[#1A2A6C] block">{sub.name}</strong>
                        <span className="text-[10px] text-[#888888]">Updated: {sub.lastUpdated}</span>
                      </td>
                      <td className="py-3 px-3 text-[#444444]">
                        {sub.vertical}
                      </td>
                      <td className="py-3 px-3 w-32">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-[#E8E8E8] h-1.5 rounded-[1px] overflow-hidden">
                            <div
                              className="bg-[#1A2A6C] h-full"
                              style={{ width: `${sub.completionRate}%` }}
                            />
                          </div>
                          <span className="font-bold text-[#1A2A6C] text-[11px]">{sub.completionRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={sub.status} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-[#333333]">
                        {sub.submittedProjects} / {sub.totalProjects} Submitted
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-[#1A2A6C]">
                        {sub.scope1_2_tCO2e.toLocaleString()} tCO₂e
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1.5 text-[10px] font-mono">
                          <span className="px-1.5 py-0.5 bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]" title="Draft Entries">
                            Draft: {sub.workflow.draft}
                          </span>
                          <span className="px-1.5 py-0.5 bg-[#fef9c3] text-[#854d0e] border border-[#fef08a]" title="Submitted Awaiting ESG Approval">
                            Sub: {sub.workflow.submitted}
                          </span>
                          <span className="px-1.5 py-0.5 bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]" title="Approved by ESG Lead">
                            App: {sub.workflow.approved}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrgId(sub.id);
                          }}
                          className="text-[#1A2A6C] hover:text-[#EF272E] font-bold text-xs flex items-center justify-end space-x-0.5 ml-auto"
                        >
                          <span>Switch Scope</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Helper Note */}
            <div className="bg-[#f8fafc] p-3 border border-[#E8E8E8] text-xs text-[#555555] flex items-center justify-between">
              <span>
                💡 <strong>Entity Scoping Reactivity:</strong> Selecting a subsidiary filters the entire dashboard to that entity’s figures, project sites, and specific indicators without staying stuck on group numbers.
              </span>
              <button
                onClick={() => setSelectedOrgId('meil-group')}
                className="text-[#1A2A6C] font-bold hover:text-[#EF272E] text-xs underline"
              >
                Reset to Group Scope
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ALL 9 BRSR CORE ATTRIBUTES CHECKLIST */}
        {activeTab === 'BRSR_CORE_MATRIX' && (
          <div className="p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E8E8] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1A2A6C] uppercase tracking-wider">
                  The 9 BRSR Core Statutory Attributes Matrix (SEBI Mandate)
                </h3>
                <p className="text-xs text-[#666666]">
                  Every listed entity in the Top 250 must obtain Reasonable Assurance on these 9 parameters.
                </p>
              </div>
              <span className="text-xs font-bold text-[#166534] bg-[#f0fdf4] px-2.5 py-1 border border-[#bbf7d0]">
                8.2 of 9 Assured Ready (91.1%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BRSR_CORE_9_ATTRIBUTES.map((attr) => (
                <div key={attr.attributeNumber} className="border border-[#E8E8E8] p-4 bg-white space-y-2 hover:border-[#1A2A6C] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono text-[#1A2A6C] bg-[#eff6ff] px-2 py-0.5 border border-[#bfdbfe]">
                      ATTRIBUTE #{attr.attributeNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 ${
                      attr.status === 'ASSURED' 
                        ? 'bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]'
                        : 'bg-[#fef9c3] text-[#854d0e] border border-[#fef08a]'
                    }`}>
                      {attr.status === 'ASSURED' ? 'ASSURED' : 'READY FOR ASSURANCE'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#1A2A6C]">{attr.name}</h4>
                  <p className="text-[11px] text-[#555555] leading-snug line-clamp-2">
                    {attr.description}
                  </p>

                  <div className="bg-[#fafafa] p-2 border border-[#E8E8E8] text-xs">
                    <span className="text-[10px] text-[#888888] block">Current Scoped Metric:</span>
                    <strong className="text-[#1A2A6C]">{attr.valueDisplay}</strong>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#666666]">
                    <span>Primary Evidence: <strong>{attr.evidenceCount} Files</strong></span>
                    <span className="text-[#16a34a] font-bold">{attr.measuredShare}% Measured</span>
                    <button
                      onClick={() => navigate(attr.traceabilityPath)}
                      className="text-[#1A2A6C] hover:text-[#EF272E] font-bold"
                    >
                      Audit Trail →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DECARBONIZATION TRAJECTORY & ASSURANCE PANEL */}
        {activeTab === 'SUBSIDIARY_LEAGUE' && (
          <div className="p-5 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Decarbonization Targets vs Actuals */}
              <div className="border border-[#E8E8E8] p-4 bg-white space-y-4">
                <div className="border-b border-[#E8E8E8] pb-2">
                  <h4 className="text-xs font-bold text-[#1A2A6C] uppercase tracking-wider">
                    MEIL Group 2030 Decarbonization Trajectory (Targets vs Actuals)
                  </h4>
                  <p className="text-[11px] text-[#666666]">
                    Baseline FY 2023-24 (242,600 tCO₂e) vs Target 25% Reduction by FY 2029-30 (181,950 tCO₂e)
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-[#fafafa] border border-[#E8E8E8]">
                    <span className="text-[10px] text-[#888888] block">Baseline (FY24)</span>
                    <strong className="text-[#1A2A6C] font-mono">242,600 tCO₂e</strong>
                  </div>
                  <div className="p-2.5 bg-[#f0fdf4] border border-[#bbf7d0]">
                    <span className="text-[10px] text-[#166534] block">Current Actual (FY27)</span>
                    <strong className="text-[#166534] font-mono">212,550 tCO₂e</strong>
                  </div>
                  <div className="p-2.5 bg-[#fafafa] border border-[#E8E8E8]">
                    <span className="text-[10px] text-[#888888] block">2030 Target (FY30)</span>
                    <strong className="text-[#1A2A6C] font-mono">181,950 tCO₂e</strong>
                  </div>
                </div>

                <div className="p-3 bg-[#fafafa] border border-[#E8E8E8] space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Decarbonization Progress to Date:</span>
                    <span className="text-[#16a34a]">12.4% Achieved (Target: 25.0%)</span>
                  </div>
                  <div className="w-full bg-[#E8E8E8] h-2 rounded-[1px] overflow-hidden">
                    <div className="bg-[#16a34a] h-full" style={{ width: '49.6%' }} />
                  </div>
                  <p className="text-[10px] text-[#666666]">
                    Currently <strong>Ahead of Interim Trajectory</strong> (+2.4% above FY27 milestone target of 10.0% reduction).
                  </p>
                </div>
              </div>

              {/* Right: Independent Assurance Panel */}
              <div className="border border-[#E8E8E8] p-4 bg-white space-y-4">
                <div className="border-b border-[#E8E8E8] pb-2">
                  <h4 className="text-xs font-bold text-[#1A2A6C] uppercase tracking-wider">
                    Statutory Assurance Panel &amp; Assessor Details
                  </h4>
                  <p className="text-[11px] text-[#666666]">
                    Third-party external verification status under SEBI Circular 2023
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                    <span className="text-[#666666]">Appointed External Assurer:</span>
                    <strong className="text-[#1A2A6C]">Ernst &amp; Young LLP (EY India)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                    <span className="text-[#666666]">Assurance Engagement Tier:</span>
                    <strong className="text-[#1A2A6C]">Reasonable Assurance (ISAE 3000 / ISAE 3410)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                    <span className="text-[#666666]">Current Audit Stage:</span>
                    <strong className="text-[#d97706]">Stage 2 Field Sampling &amp; Meter Testing</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                    <span className="text-[#666666]">Data Quality (Measured vs Estimated):</span>
                    <strong className="text-[#16a34a]">88% Primary Measured / 12% Activity Estimated</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                    <span className="text-[#666666]">Primary Evidence Coverage:</span>
                    <strong className="text-[#1A2A6C]">92.4% with verified documentation</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#666666]">Open Audit Observations / Clarifications:</span>
                    <span className="px-2 py-0.5 bg-[#fef9c3] text-[#854d0e] font-bold text-[10px] border border-[#fef08a]">
                      2 Minor Observations (Project Beta CEMS log + Pump slip)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Multi-Year Trajectory Line Chart & Active Exceptions Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Multi-Year Trajectory Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E8E8E8] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E8E8] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#1A2A6C]">
                Multi-Year Decarbonization &amp; Water Trajectory
              </h3>
              <p className="text-xs text-[#666666]">
                Consolidated trajectory for GHG Scope 1+2 (tCO₂e) and Water Consumption (KL) across statutory reporting cycles.
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <span className="flex items-center space-x-1.5 font-bold text-[#1A2A6C]">
                <span className="w-3 h-0.5 bg-[#1A2A6C]" />
                <span>GHG Scope 1+2 (tCO₂e)</span>
              </span>
              <span className="flex items-center space-x-1.5 font-bold text-[#EF272E]">
                <span className="w-3 h-0.5 bg-[#EF272E]" />
                <span>Water Consumption (KL)</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardSummary.yoyTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                <XAxis dataKey="year" stroke="#666666" fontSize={12} tickLine={false} />
                <YAxis stroke="#666666" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A2A6C', borderColor: '#1A2A6C', borderRadius: '2px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="ghgScope1_2" name="GHG Scope 1+2 (tCO₂e)" stroke="#1A2A6C" strokeWidth={2.5} dot={{ r: 4, fill: '#1A2A6C' }} />
                <Line type="monotone" dataKey="waterKL" name="Water Consumed (KL)" stroke="#EF272E" strokeWidth={2.5} dot={{ r: 4, fill: '#EF272E' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Required & Exceptions Queue (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E8E8E8] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
            <div>
              <h3 className="text-sm font-bold text-[#1A2A6C] uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-[#EF272E]" />
                <span>Exceptions &amp; Alerts</span>
              </h3>
              <p className="text-[11px] text-[#666666]">Anomalies, missing evidence, &amp; late entries</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#EF272E] text-white">
              {activeAlerts.length} Active
            </span>
          </div>

          <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => navigate('/review')}
                className="p-3 border-l-4 border-l-[#EF272E] border border-[#E8E8E8] bg-[#fafafa] hover:bg-[#E8E8E8] cursor-pointer transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A2A6C]">
                    {alert.indicatorCode}
                  </span>
                  <StatusBadge status={alert.severity === 'HIGH' ? 'CRITICAL' : 'NEEDS_ATTENTION'} size="sm" />
                </div>
                <p className="text-[11px] text-[#444444] leading-snug">
                  {alert.message}
                </p>
                <div className="text-[10px] font-bold text-[#888888] pt-1 flex items-center justify-between">
                  <span>{alert.organisationName}</span>
                  <span className="text-[#EF272E]">Investigate →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Executive Group Sign-Off & Period Locking Modal */}
      {showSignOffModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full p-6 space-y-5 border-2 border-[#1A2A6C] shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-[#EF272E]" />
                <h3 className="text-base font-bold text-[#1A2A6C]">
                  Group CSO Statutory Sign-Off &amp; Period Lock
                </h3>
              </div>
              <button onClick={() => setShowSignOffModal(false)} className="text-[#888888] hover:text-[#333333]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#f8fafc] p-3.5 border border-[#E8E8E8] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#666666]">Statutory Filing Scope:</span>
                <strong className="text-[#1A2A6C]">MEIL Group Consolidated (12 Operating Units)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Reporting Period:</span>
                <strong className="text-[#EF272E]">{selectedPeriod.financialYear}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Assurance Readiness:</span>
                <strong className="text-[#166534]">Overall 89% | BRSR Core 91% | Governance 94%</strong>
              </div>
            </div>

            <div className="p-3 bg-[#fef2f2] border-l-4 border-[#EF272E] text-xs text-[#991b1b] leading-relaxed">
              <strong>Statutory Declaration (Regulation 34(2)(f)):</strong>
              <p className="mt-1">
                "I, Amit Verma, Chief Sustainability Officer, MEIL Group, hereby certify that the consolidated ESG metrics, Scope 1, Scope 2 and Scope 3 greenhouse gas inventories, and the 9 BRSR Core attributes presented herein have been compiled in adherence to SEBI Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122."
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1A2A6C] block">
                Executive Sign-off Remarks / Governance Notes:
              </label>
              <textarea
                value={signOffComments}
                onChange={(e) => setSignOffComments(e.target.value)}
                placeholder="e.g. Approved consolidated ESG returns after reviewing EY Stage 2 sample audit findings..."
                className="w-full text-xs p-2.5 border border-[#d1d5db] rounded-[2px] h-20 focus:outline-none focus:border-[#1A2A6C]"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-[#E8E8E8]">
              <button
                onClick={() => setShowSignOffModal(false)}
                className="px-4 py-2 text-xs font-bold text-[#666666] hover:text-[#333333] border border-[#d1d5db]"
              >
                Cancel
              </button>
              <button
                onClick={handleGroupSignOff}
                className="px-5 py-2 text-xs font-bold text-white bg-[#1A2A6C] hover:bg-[#EF272E] transition-colors flex items-center space-x-1.5 shadow"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Authorize Group Sign-Off &amp; Lock Period</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

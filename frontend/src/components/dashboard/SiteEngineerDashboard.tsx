import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileEdit, 
  Upload, 
  ArrowRight, 
  FileText, 
  MessageSquare, 
  XCircle, 
  ShieldAlert, 
  ChevronRight,
  Info,
  CheckCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { FIELDS_CONFIG, getCurrentIndianFinancialYear } from '../../config/fields.config';

export const SiteEngineerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { selectedOrg, selectedPeriod, dataEntries } = useApp();

  const currentFy = getCurrentIndianFinancialYear();

  // Aggregate entry statuses for this specific site and reporting period
  const siteEntries = dataEntries.filter(
    e => e.organisationId === selectedOrg.id && e.reportingPeriodId === selectedPeriod.id
  );

  const totalFields = FIELDS_CONFIG.length;
  
  // Counts
  const approvedCount = siteEntries.filter(e => ['PROJECT_APPROVED', 'BU_APPROVED', 'SUBSIDIARY_APPROVED', 'GROUP_APPROVED', 'LOCKED', 'APPROVED'].includes(e.status)).length;
  const underReviewCount = siteEntries.filter(e => e.status === 'UNDER_REVIEW' || e.status === 'SUBMITTED').length;
  const rejectedCount = siteEntries.filter(e => e.status === 'REJECTED').length;
  const draftCount = siteEntries.filter(e => e.status === 'DRAFT' || !e.status).length + Math.max(0, totalFields - siteEntries.length);

  // Section Progress calculations
  const sections = [
    { name: 'Energy', topic: 'Energy' as const, color: '#1A2A6C' },
    { name: 'Emissions', topic: 'Emissions' as const, color: '#EF272E' },
    { name: 'Water', topic: 'Water' as const, color: '#0284c7' },
    { name: 'Waste', topic: 'Waste' as const, color: '#16a34a' },
    { name: 'Workforce', topic: 'Workforce' as const, color: '#9333ea' },
    { name: 'Safety', topic: 'Safety' as const, color: '#ea580c' },
    { name: 'Ethics', topic: 'Ethics' as const, color: '#0d9488' }
  ];

  const sectionStats = sections.map(sec => {
    const fieldsInSec = FIELDS_CONFIG.filter(f => f.topic === sec.topic);
    const count = fieldsInSec.length;
    const completed = fieldsInSec.filter(f => {
      const entry = siteEntries.find(e => e.indicatorId === f.id);
      return entry && ['PROJECT_APPROVED', 'BU_APPROVED', 'SUBSIDIARY_APPROVED', 'GROUP_APPROVED', 'LOCKED', 'APPROVED', 'SUBMITTED', 'UNDER_REVIEW'].includes(entry.status);
    }).length;
    const pct = count > 0 ? Math.round((completed / count) * 100) : 0;
    return { ...sec, count, completed, pct };
  });

  // Pending Actions
  const pendingActions = [
    {
      id: 'act-1',
      type: 'REJECTED' as const,
      fieldCode: 'P6-E3-WAT',
      fieldName: 'Total Water Consumption',
      reason: 'Flow meter log discrepancy: Reviewer commented "Please attach meter calibration certificate and reconcile with tanker gate register."',
      severity: 'HIGH',
      deadline: '18 Oct 2026'
    },
    {
      id: 'act-2',
      type: 'MISSING_PROOF' as const,
      fieldCode: 'P6-E1-S2',
      fieldName: 'Scope 2 Indirect Grid Emissions',
      reason: 'Electricity consumption (250,000 kWh) requires DISCOM HT utility bill invoice attachment.',
      severity: 'HIGH',
      deadline: '20 Oct 2026'
    },
    {
      id: 'act-3',
      type: 'MISSING_PROOF' as const,
      fieldCode: 'P3-E2-SAFE-FAT',
      fieldName: 'Fatalities at Project Sites',
      reason: 'Reported value is 0. Mandatory requirement: Checked "Confirm zero incidents" plus attach EHS Zero Accident certification.',
      severity: 'MEDIUM',
      deadline: '25 Oct 2026'
    }
  ];

  // Helper for circular progress ring
  const renderProgressRing = (pct: number, color: string) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (pct / 100) * circumference;

    return (
      <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
        <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 54 54">
          <circle
            cx="27"
            cy="27"
            r={radius}
            stroke="#E8E8E8"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="27"
            cy="27"
            r={radius}
            stroke={color}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <span className="absolute text-[11px] font-bold font-mono text-[#333333]">
          {pct}%
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Project-Scoped Header with FY Read-Only Badge */}
      <div className="border-b border-[#E8E8E8] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-1">
            <span className="text-[#1A2A6C]">SITE OPERATIONS DASHBOARD</span>
            <span>•</span>
            <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-300">
              🔒 SCOPED TO: {selectedOrg.name} ({selectedOrg.code})
            </span>
            <span>•</span>
            <span className="text-blue-800 font-mono bg-blue-50 px-2 py-0.5 border border-blue-200">
              {currentFy.financialYear} (CURRENT FY LOCKED)
            </span>
          </div>

          <h1 className="text-page-title font-bold text-[#1A2A6C] tracking-tight leading-tight clamp-title">
            Site ESG Reporting &amp; Compliance Queue
          </h1>
          <p className="text-label-base text-[#444444] mt-1 max-w-3xl leading-relaxed">
            Direct operational workspace for <strong>{selectedOrg.name}</strong>. Track pending indicator entries, address returned submissions, attach utility evidence, and ensure reporting compliance.
          </p>
        </div>

        {/* Action Button to Data Entry with 44px min tap target */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => navigate('/data-entry')}
            className="min-h-[44px] min-w-[44px] bg-[#1A2A6C] hover:bg-[#EF272E] text-white px-5 py-2.5 text-label-base font-bold transition-colors flex items-center space-x-2 shadow-sm rounded-[2px]"
          >
            <FileEdit className="w-4 h-4" />
            <span>Go to Data Entry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Site Project Hero Card with Construction Photo */}
      <div className="relative rounded-[4px] overflow-hidden border border-slate-200 shadow-xs bg-[#1A2A6C] text-white flex flex-col md:flex-row items-stretch justify-between">
        <div className="p-5 md:p-6 space-y-2 z-10 max-w-xl">
          <span className="bg-[#EF272E] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] uppercase tracking-wider inline-block">
            Operational Project Site Execution
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {selectedOrg.name}
          </h2>
          <p className="text-xs text-slate-200 leading-relaxed">
            Direct telemetry logging for Scope 1 Diesel/LPG fuels, Scope 2 Grid electricity, water abstraction, and worker health metrics. Automatically aggregated to parent Business Unit &amp; Subsidiary.
          </p>
        </div>
        <div className="w-full md:w-72 h-36 md:h-auto min-h-[140px] relative overflow-hidden shrink-0">
          <img src="/construction.jpg" alt="Site Project Execution" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A2A6C] via-transparent to-transparent hidden md:block" />
        </div>
      </div>

      {/* 2. Top Row: 4 Summary Cards with Circular Progress Rings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Fields */}
        <div className="bg-white border border-[#E8E8E8] p-5 rounded-[4px] flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-helper-meta font-bold uppercase tracking-wider text-[#666666] block">
              Total Applicable Fields
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#1A2A6C] font-mono clamp-kpi-val">
              {totalFields}
            </div>
            <span className="text-helper-meta text-[#666666] block">
              Configured in BRSR Matrix
            </span>
          </div>
          {renderProgressRing(Math.round(((approvedCount + underReviewCount) / totalFields) * 100), '#1A2A6C')}
        </div>

        {/* Card 2: Draft Fields */}
        <div className="bg-white border border-[#E8E8E8] p-5 rounded-[4px] flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-helper-meta font-bold uppercase tracking-wider text-[#666666] block">
              Draft / Unsubmitted
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#64748b] font-mono clamp-kpi-val">
              {draftCount}
            </div>
            <span className="text-helper-meta text-[#64748b] block">
              Requires Value &amp; Proof
            </span>
          </div>
          {renderProgressRing(Math.round((draftCount / totalFields) * 100), '#94a3b8')}
        </div>

        {/* Card 3: Under Review / Submitted */}
        <div className="bg-white border border-[#E8E8E8] p-5 rounded-[4px] flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-helper-meta font-bold uppercase tracking-wider text-[#666666] block">
              Under Review
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#d97706] font-mono clamp-kpi-val">
              {underReviewCount}
            </div>
            <span className="text-helper-meta text-[#d97706] block">
              Awaiting ESG Lead Sign-off
            </span>
          </div>
          {renderProgressRing(Math.round((underReviewCount / totalFields) * 100), '#d97706')}
        </div>

        {/* Card 4: Approved */}
        <div className="bg-white border border-[#E8E8E8] p-5 rounded-[4px] flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-helper-meta font-bold uppercase tracking-wider text-[#666666] block">
              Approved
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#16a34a] font-mono clamp-kpi-val">
              {approvedCount}
            </div>
            <span className="text-helper-meta text-[#16a34a] block">
              Certified into Group Rollup
            </span>
          </div>
          {renderProgressRing(Math.round((approvedCount / totalFields) * 100), '#16a34a')}
        </div>
      </div>

      {/* 3. Section Progress Bars Grid (Energy, Emissions, Water, Waste, Workforce, Safety, Ethics) */}
      <div className="bg-white border border-[#E8E8E8] p-5 rounded-[4px] space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
          <div>
            <h3 className="text-field-title font-bold text-[#1A2A6C] uppercase tracking-wide">
              Section Completion Progress
            </h3>
            <p className="text-helper-meta text-[#666666]">
              Real-time submission status across the 7 operational ESG reporting domains
            </p>
          </div>
          <span className="text-helper-meta font-bold text-[#1A2A6C] bg-[#eff6ff] px-2.5 py-1 border border-[#bfdbfe]">
            {approvedCount + underReviewCount} of {totalFields} Fields Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {sectionStats.map(sec => (
            <div key={sec.name} className="p-3 bg-[#fafafa] border border-[#E8E8E8] rounded-[2px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-label-base font-bold text-[#1A2A6C]">{sec.name}</span>
                <span className="text-helper-meta font-mono font-bold text-[#333333]">
                  {sec.completed} / {sec.count} ({sec.pct}%)
                </span>
              </div>
              <div className="w-full bg-[#E8E8E8] h-2 rounded-[1px] overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${sec.pct}%`, backgroundColor: sec.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Pending Actions List (Missing proof, rejected entries with reviewer comment, nearest deadline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-[#E8E8E8] p-5 rounded-[4px] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
            <div>
              <h3 className="text-field-title font-bold text-[#1A2A6C] uppercase tracking-wide flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-[#EF272E]" />
                <span>Pending Actions &amp; Compliance Queue</span>
              </h3>
              <p className="text-helper-meta text-[#666666]">
                Items requiring immediate resolution before period lock
              </p>
            </div>
            <span className="text-helper-meta font-bold bg-[#fef2f2] text-[#EF272E] px-2.5 py-1 border border-[#fecaca]">
              {pendingActions.length} Action Items
            </span>
          </div>

          <div className="space-y-3">
            {pendingActions.map(action => (
              <div 
                key={action.id}
                className="p-4 border-l-4 border-l-[#EF272E] border border-[#E8E8E8] bg-[#fafafa] hover:bg-white transition-colors rounded-[2px] space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-[#1A2A6C] text-white px-2 py-0.5">
                      {action.fieldCode}
                    </span>
                    <strong className="text-label-base text-[#1A2A6C]">{action.fieldName}</strong>
                  </div>

                  <div className="flex items-center space-x-2">
                    {action.type === 'REJECTED' ? (
                      <span className="px-2 py-0.5 text-[11px] font-bold uppercase bg-[#fef2f2] text-[#991b1b] border border-[#fecaca] rounded-[2px]">
                        Returned by Reviewer
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[11px] font-bold uppercase bg-[#fffbeb] text-[#92400e] border border-[#fde68a] rounded-[2px]">
                        Missing Proof
                      </span>
                    )}

                    <span className="text-helper-meta text-[#888888] font-mono">
                      Due: {action.deadline}
                    </span>
                  </div>
                </div>

                <p className="text-helper-meta text-[#444444] leading-relaxed bg-white p-2.5 border border-[#E8E8E8] rounded-[2px]">
                  {action.reason}
                </p>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => navigate('/data-entry')}
                    className="min-h-[44px] min-w-[44px] px-4 py-2 bg-[#1A2A6C] hover:bg-[#EF272E] text-white text-helper-meta font-bold transition-colors flex items-center space-x-1 rounded-[2px]"
                  >
                    <span>Resolve in Data Entry</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Nearest Statutory Deadline & Status Chips Guide (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Statutory Deadline Box */}
          <div className="bg-[#1A2A6C] text-white p-5 rounded-[4px] space-y-3 shadow-sm border border-[#0f1b4c]">
            <div className="flex items-center space-x-2 border-b border-white/20 pb-2.5">
              <Calendar className="w-5 h-5 text-[#38bdf8]" />
              <h4 className="text-label-base font-bold uppercase tracking-wider text-white">
                Statutory Timeline
              </h4>
            </div>

            <div className="space-y-1">
              <span className="text-helper-meta text-[#C6CBE6] block">
                Reporting Financial Period:
              </span>
              <div className="text-lg font-bold text-white font-mono">
                {currentFy.financialYear}
              </div>
              <span className="text-helper-meta text-emerald-300 block">
                Locked to Current System Year (Apr 1 - Mar 31)
              </span>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-1">
              <span className="text-helper-meta text-[#C6CBE6] block">
                Statutory Lodgement Deadline:
              </span>
              <div className="text-base font-bold text-amber-300">
                31 March 2027
              </div>
              <span className="text-helper-meta text-amber-200 block">
                ⏳ 170 Days Remaining in Period
              </span>
            </div>
          </div>

          {/* Status Color Chips Legend */}
          <div className="bg-white border border-[#E8E8E8] p-5 rounded-[4px] space-y-3 shadow-sm">
            <h4 className="text-label-base font-bold text-[#1A2A6C] uppercase tracking-wider border-b border-[#E8E8E8] pb-2">
              Workflow Status Chips
            </h4>
            <div className="space-y-2 text-helper-meta">
              <div className="flex items-center justify-between p-2 bg-[#f3f4f6] border border-[#e5e7eb] rounded-[2px]">
                <strong className="text-[#4b5563]">Draft</strong>
                <span className="text-[11px] text-[#6b7280]">Grey • Editable by site user</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#eff6ff] border border-[#bfdbfe] rounded-[2px]">
                <strong className="text-[#1d4ed8]">Submitted</strong>
                <span className="text-[11px] text-[#3b82f6]">Blue • Locked, awaiting review</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#fffbeb] border border-[#fde68a] rounded-[2px]">
                <strong className="text-[#92400e]">Under Review</strong>
                <span className="text-[11px] text-[#d97706]">Amber • ESG auditor evaluating</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-[2px]">
                <strong className="text-[#166534]">Approved</strong>
                <span className="text-[11px] text-[#16a34a]">Green • Certified in group roll-up</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#fef2f2] border border-[#fecaca] rounded-[2px]">
                <strong className="text-[#991b1b]">Rejected</strong>
                <span className="text-[11px] text-[#ef4444]">Red • Returned for correction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

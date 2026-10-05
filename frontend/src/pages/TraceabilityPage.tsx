import React, { useState } from 'react';
import { 
  GitFork, 
  Building2, 
  FileText, 
  CheckCircle2, 
  History, 
  UserCheck, 
  ShieldCheck,
  Flame,
  Droplets,
  Zap,
  ArrowDown
} from 'lucide-react';
import { DEMO_TRACEABILITY_GHG_TREE, DEMO_EVIDENCE, DEMO_AUDIT_LOGS } from '../data/demoData';
import { TraceabilityNode } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

export const TraceabilityPage: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'GHG' | 'WATER' | 'ENERGY'>('GHG');
  const [activeDrillNode, setActiveDrillNode] = useState<TraceabilityNode>(
    DEMO_TRACEABILITY_GHG_TREE.children![0].children![0].children![0] // Project Alpha by default
  );

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header (Section 20) */}
      <div className="border-b border-[#E8E8E8] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-1">
            <span className="text-[#1A2A6C]">STATUTORY AUDIT CHAIN</span>
            <span>•</span>
            <span className="text-[#EF272E]">SEBI BRSR CORE ASSURANCE</span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#1A2A6C] tracking-tight leading-tight">
            Traceability Explorer
          </h1>
          <p className="text-[14px] text-[#444444] mt-1 max-w-3xl leading-relaxed">
            Decompose statutory group metrics down to project-level meter logs, telematics receipts, approver signatures, and immutable audit trails.
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center space-x-1 bg-[#fafafa] p-1 border border-[#E8E8E8] text-xs">
          <button
            onClick={() => setSelectedMetric('GHG')}
            className={`px-3 py-1.5 font-bold transition-colors ${
              selectedMetric === 'GHG' ? 'bg-[#1A2A6C] text-white' : 'text-[#333333] hover:bg-[#E8E8E8]'
            }`}
          >
            Scope 1 GHG
          </button>
          <button
            onClick={() => setSelectedMetric('WATER')}
            className={`px-3 py-1.5 font-bold transition-colors ${
              selectedMetric === 'WATER' ? 'bg-[#1A2A6C] text-white' : 'text-[#333333] hover:bg-[#E8E8E8]'
            }`}
          >
            Water Consumption
          </button>
          <button
            onClick={() => setSelectedMetric('ENERGY')}
            className={`px-3 py-1.5 font-bold transition-colors ${
              selectedMetric === 'ENERGY' ? 'bg-[#1A2A6C] text-white' : 'text-[#333333] hover:bg-[#E8E8E8]'
            }`}
          >
            Total Energy
          </button>
        </div>
      </div>

      {/* 2. Flagship Decomposition Strip (Section 20) */}
      <div className="bg-[#1A2A6C] text-white p-6 border-l-4 border-[#EF272E] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/20">
          <div className="flex items-center space-x-2">
            <GitFork className="w-5 h-5 text-[#EF272E]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Metric Traceability Chain: Group → Subsidiary → BU → Project
            </h3>
          </div>
          <span className="text-[11px] font-bold text-[#C6CBE6]">
            One Number → Source → Evidence → Approval → Report
          </span>
        </div>

        {/* 4 Hierarchical Drilldown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          {/* Level 1: Group */}
          <div
            onClick={() => setActiveDrillNode(DEMO_TRACEABILITY_GHG_TREE)}
            className="p-4 bg-[#121c4a] border border-white/20 hover:border-[#EF272E] cursor-pointer transition-colors space-y-1"
          >
            <span className="text-[10px] font-bold text-[#C6CBE6] uppercase block">1. Group Metric</span>
            <h4 className="text-sm font-bold text-white">MEIL Group HQ</h4>
            <div className="text-xl font-bold text-white">
              125,430 <span className="text-xs font-normal text-[#C6CBE6]">tCO₂e</span>
            </div>
            <p className="text-[10px] text-[#C6CBE6]">Consolidated Group Aggregate</p>
          </div>

          {/* Level 2: Subsidiary */}
          <div
            onClick={() => setActiveDrillNode(DEMO_TRACEABILITY_GHG_TREE.children![0])}
            className="p-4 bg-[#121c4a] border border-white/20 hover:border-[#EF272E] cursor-pointer transition-colors space-y-1"
          >
            <span className="text-[10px] font-bold text-[#C6CBE6] uppercase block">2. Subsidiary</span>
            <h4 className="text-sm font-bold text-white">MEIL Infra Projects Ltd</h4>
            <div className="text-xl font-bold text-white">
              72,400 <span className="text-xs font-normal text-[#C6CBE6]">tCO₂e</span>
            </div>
            <p className="text-[10px] text-[#C6CBE6]">57.7% of Group Total</p>
          </div>

          {/* Level 3: Business Unit */}
          <div
            onClick={() => setActiveDrillNode(DEMO_TRACEABILITY_GHG_TREE.children![0].children![0])}
            className="p-4 bg-[#121c4a] border border-white/20 hover:border-[#EF272E] cursor-pointer transition-colors space-y-1"
          >
            <span className="text-[10px] font-bold text-[#C6CBE6] uppercase block">3. Business Unit</span>
            <h4 className="text-sm font-bold text-white">Metro &amp; Rail BU</h4>
            <div className="text-xl font-bold text-white">
              41,200 <span className="text-xs font-normal text-[#C6CBE6]">tCO₂e</span>
            </div>
            <p className="text-[10px] text-[#C6CBE6]">Urban Transit Projects</p>
          </div>

          {/* Level 4: Project Site */}
          <div
            onClick={() => setActiveDrillNode(DEMO_TRACEABILITY_GHG_TREE.children![0].children![0].children![0])}
            className="p-4 bg-white text-[#1A2A6C] border-2 border-[#EF272E] cursor-pointer transition-colors space-y-1"
          >
            <span className="text-[10px] font-bold text-[#EF272E] uppercase block">4. Source Project (Selected)</span>
            <h4 className="text-sm font-bold text-[#1A2A6C]">Demo Project Alpha</h4>
            <div className="text-xl font-bold text-[#1A2A6C]">
              18,500 <span className="text-xs font-normal text-[#666666]">tCO₂e</span>
            </div>
            <p className="text-[10px] font-bold text-[#16a34a]">✓ Verified Evidence Attached</p>
          </div>
        </div>
      </div>

      {/* 3. Deep Source Record & Evidence Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Source Record & Authorization (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E8E8E8] p-6 space-y-4">
          <div className="border-b border-[#E8E8E8] pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1A2A6C] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
              <span>Source Record &amp; Authorization Chain</span>
            </h3>
            <StatusBadge status={activeDrillNode.status} size="sm" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-[#E8E8E8]">
              <span className="text-[#666666] font-medium">Reporting Entity:</span>
              <strong className="text-[#1A2A6C]">{activeDrillNode.orgName}</strong>
            </div>

            <div className="flex justify-between py-2 border-b border-[#E8E8E8]">
              <span className="text-[#666666] font-medium">Reported Scope 1 Value:</span>
              <span className="font-bold text-[#1A2A6C] text-sm">
                {activeDrillNode.value.toLocaleString()} {activeDrillNode.unit}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-[#E8E8E8]">
              <span className="text-[#666666] font-medium">Entered By (Site User):</span>
              <strong className="text-[#333333] flex items-center space-x-1">
                <UserCheck className="w-3.5 h-3.5 text-[#1A2A6C]" />
                <span>{activeDrillNode.enteredBy || 'Rahul Sharma (Site Engg)'}</span>
              </strong>
            </div>

            <div className="flex justify-between py-2 border-b border-[#E8E8E8]">
              <span className="text-[#666666] font-medium">Verified &amp; Approved By:</span>
              <strong className="text-[#16a34a] flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>{activeDrillNode.approvedBy || 'Priya Nair (ESG Lead)'}</span>
              </strong>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-[#666666] font-medium">Audit Trail Status:</span>
              <span className="font-bold text-[#1A2A6C] bg-[#E8E8E8] px-2 py-0.5 border border-[#d1d5db]">
                SEBI Reasonable Assurance Verified
              </span>
            </div>
          </div>
        </div>

        {/* Attached Proof Documents & Audit Timeline (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E8E8E8] p-6 space-y-4">
          <div className="border-b border-[#E8E8E8] pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1A2A6C] flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#1A2A6C]" />
              <span>Supporting Proof &amp; Timestamped Logs</span>
            </h3>
            <span className="text-xs font-bold text-[#888888]">2 Files Attached</span>
          </div>

          <div className="space-y-2">
            {DEMO_EVIDENCE.slice(0, 2).map((ev) => (
              <div key={ev.id} className="p-3 bg-[#fafafa] border border-[#E8E8E8] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5 truncate">
                  <FileText className="w-4 h-4 text-[#1A2A6C] shrink-0" />
                  <div className="truncate">
                    <strong className="text-[#333333] block truncate">{ev.fileName}</strong>
                    <span className="text-[10px] text-[#888888] font-mono truncate">{ev.fileHash}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] shrink-0">
                  ✓ Verified
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E8E8E8] space-y-2 text-xs">
            <span className="font-bold text-[#1A2A6C] flex items-center space-x-1">
              <History className="w-3.5 h-3.5" />
              <span>Revision History</span>
            </span>
            <div className="space-y-1 text-[#444444]">
              <div className="p-2 bg-[#fafafa] border border-[#E8E8E8] flex justify-between">
                <span>15 Sep 2026: Created by Rahul Sharma (Site Engg)</span>
                <strong>18,500 tCO₂e</strong>
              </div>
              <div className="p-2 bg-[#fafafa] border border-[#E8E8E8] flex justify-between">
                <span>20 Sep 2026: Approved by Priya Nair (ESG Lead)</span>
                <strong className="text-[#16a34a]">APPROVED</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

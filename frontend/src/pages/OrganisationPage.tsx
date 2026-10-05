import React, { useState } from 'react';
import { 
  Building2, 
  ChevronDown, 
  ChevronRight, 
  FolderTree, 
  MapPin, 
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Organisation } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';

export const OrganisationPage: React.FC = () => {
  const { organisationTree, selectedOrgId, setSelectedOrgId } = useApp();
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'meil-group': true,
    'sub-infra': true,
    'sub-water': true,
    'sub-energy': true,
    'bu-infra-metro': true,
  });

  const [activeOrgDetail, setActiveOrgDetail] = useState<Organisation>(organisationTree);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectNode = (org: Organisation) => {
    setActiveOrgDetail(org);
    setSelectedOrgId(org.id);
  };

  const renderTree = (node: Organisation, depth: number = 0) => {
    const isExpanded = !!expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = activeOrgDetail.id === node.id;

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => handleSelectNode(node)}
          className={`flex items-center justify-between py-2 px-3 my-0.5 rounded-[2px] cursor-pointer transition-colors border-l-4 ${
            isSelected
              ? 'bg-[#E8E8E8] text-[#1A2A6C] font-bold border-[#EF272E]'
              : 'hover:bg-[#fafafa] text-[#333333] border-transparent'
          }`}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
        >
          <div className="flex items-center space-x-2 truncate">
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(node.id, e)}
                className="p-1 text-[#666666] hover:text-[#1A2A6C]"
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <span className="w-5" />
            )}

            <span className="text-xs">
              {node.type === 'GROUP' ? '🏢' : node.type === 'SUBSIDIARY' ? '🏛️' : node.type === 'BUSINESS_UNIT' ? '📁' : '📍'}
            </span>

            <span className="text-xs truncate">{node.name}</span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#E8E8E8] text-[#333333] border border-[#d1d5db]">
              {node.type}
            </span>
            <StatusBadge status={node.status || 'HEALTHY'} size="sm" />
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l border-[#E8E8E8] ml-5">
            {node.children!.map((child) => renderTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header (Section 16) */}
      <div className="border-b border-[#E8E8E8] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-1">
            <span className="text-[#1A2A6C]">ENTERPRISE STRUCTURE</span>
            <span>•</span>
            <span className="text-[#EF272E]">4-TIER HIERARCHY</span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#1A2A6C] tracking-tight leading-tight">
            Organisation Explorer &amp; Hierarchy
          </h1>
          <p className="text-[14px] text-[#444444] mt-1 max-w-3xl leading-relaxed">
            Interactive self-referencing organisational hierarchy: MEIL Group → Operating Subsidiaries → Business Units → Execution Sites &amp; Projects.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Tree View (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E8E8E8] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
            <h3 className="text-sm font-bold text-[#1A2A6C] uppercase tracking-wider flex items-center space-x-2">
              <FolderTree className="w-4 h-4 text-[#1A2A6C]" />
              <span>Hierarchical Tree Decomposition</span>
            </h3>
            <span className="text-[11px] text-[#888888]">Click node to inspect profile</span>
          </div>

          <div className="max-h-[560px] overflow-y-auto pr-2">
            {renderTree(organisationTree)}
          </div>
        </div>

        {/* Right: Selected Node Detail (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E8E8E8] p-6 space-y-5">
          <div className="border-b border-[#E8E8E8] pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#1A2A6C] text-white uppercase">
                {activeOrgDetail.type} NODE
              </span>
              <StatusBadge status={activeOrgDetail.status || 'HEALTHY'} />
            </div>
            <h2 className="text-lg font-bold text-[#1A2A6C]">{activeOrgDetail.name}</h2>
            <p className="text-xs font-mono text-[#888888] mt-0.5">Code: {activeOrgDetail.code}</p>
          </div>

          {/* Node Metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#fafafa] border border-[#E8E8E8]">
              <span className="text-[#888888] text-[10px] font-bold uppercase block">Business Vertical</span>
              <strong className="text-[#333333] mt-0.5 block truncate">
                {activeOrgDetail.businessVertical || 'Diversified Infra'}
              </strong>
            </div>

            <div className="p-3 bg-[#fafafa] border border-[#E8E8E8]">
              <span className="text-[#888888] text-[10px] font-bold uppercase block">Geographic Location</span>
              <strong className="text-[#333333] mt-0.5 block truncate flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#EF272E]" />
                <span>{activeOrgDetail.city}, {activeOrgDetail.state}</span>
              </strong>
            </div>
          </div>

          {/* Completeness Gauge */}
          <div className="space-y-3 p-4 bg-[#fafafa] border border-[#E8E8E8]">
            <h4 className="text-xs font-bold text-[#1A2A6C] uppercase tracking-wider">
              ESG Reporting &amp; Data Completeness
            </h4>
            <ProgressBar
              value={activeOrgDetail.completionRate || 85}
              label="Validated Indicators Progress"
              size="md"
              color="navy"
            />
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-2 bg-white border border-[#E8E8E8]">
                <span className="text-[10px] text-[#888888] block uppercase">Section A</span>
                <strong className="text-[#1A2A6C]">100%</strong>
              </div>
              <div className="p-2 bg-white border border-[#E8E8E8]">
                <span className="text-[10px] text-[#888888] block uppercase">Section B</span>
                <strong className="text-[#1A2A6C]">92%</strong>
              </div>
              <div className="p-2 bg-white border border-[#E8E8E8]">
                <span className="text-[10px] text-[#888888] block uppercase">Section C</span>
                <strong className="text-[#1A2A6C]">84%</strong>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="pt-2">
            <button
              onClick={() => setSelectedOrgId(activeOrgDetail.id)}
              className="w-full py-2.5 px-4 bg-[#1A2A6C] hover:bg-[#EF272E] text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Set as Active Reporting Scope</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Building2, 
  ChevronDown, 
  ChevronRight, 
  FolderTree, 
  MapPin, 
  ArrowUpRight, 
  ShieldCheck, 
  Lock,
  Plus,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Organisation, OrgType } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';

export const OrganisationPage: React.FC = () => {
  const { currentRole } = useAuth();
  const { organisations, organisationTree, selectedOrgId, setSelectedOrgId, addOrganisation } = useApp();
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'meil-group': true,
    'sub-infra': true,
    'sub-water': true,
    'sub-energy': true,
    'bu-infra-metro': true,
  });

  const [activeOrgDetail, setActiveOrgDetail] = useState<Organisation>(organisationTree);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State for Adding an Entity
  const [entityType, setEntityType] = useState<OrgType>('PROJECT');
  const [entityName, setEntityName] = useState('');
  const [entityCode, setEntityCode] = useState('');
  const [parentOrgId, setParentOrgId] = useState('bu-infra-metro');
  const [businessVertical, setBusinessVertical] = useState('Heavy Civil & Metros');
  const [stateName, setStateName] = useState('Telangana');
  const [cityName, setCityName] = useState('Hyderabad');
  const [cin, setCin] = useState('U45200TG2026PLC088999');
  const [ownershipPct, setOwnershipPct] = useState(100);
  const [consolidationMethod, setConsolidationMethod] = useState('OPERATIONAL_CONTROL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSysAdmin = currentRole === 'SYS_ADMIN' || currentRole === 'ADMIN';

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectNode = (org: Organisation) => {
    setActiveOrgDetail(org);
    setSelectedOrgId(org.id);
  };

  const handleOpenAddModal = (defaultType: OrgType = 'PROJECT') => {
    setEntityType(defaultType);
    if (defaultType === 'SUBSIDIARY') {
      setParentOrgId('meil-group');
      setBusinessVertical('Clean Energy & Infrastructure');
    } else if (defaultType === 'BUSINESS_UNIT') {
      const firstSub = organisations.find(o => o.type === 'SUBSIDIARY');
      setParentOrgId(firstSub?.id || 'sub-infra');
      setBusinessVertical('Transportation & Rail');
    } else {
      const firstBu = organisations.find(o => o.type === 'BUSINESS_UNIT');
      setParentOrgId(firstBu?.id || 'bu-infra-metro');
      setBusinessVertical('Lift Irrigation & Hydro');
    }
    setEntityName('');
    setEntityCode('');
    setIsAddModalOpen(true);
  };

  const handleSubmitEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityName.trim() || !entityCode.trim()) return;

    setIsSubmitting(true);
    const newId = `${entityType.toLowerCase().slice(0, 4)}-${Date.now()}`;

    try {
      await addOrganisation({
        id: newId,
        name: entityName.trim(),
        code: entityCode.trim().toUpperCase(),
        type: entityType,
        parentId: entityType === 'SUBSIDIARY' ? 'meil-group' : parentOrgId,
        businessVertical,
        country: 'India',
        state: stateName,
        city: cityName,
        cin: entityType === 'SUBSIDIARY' ? cin : undefined,
        ownershipPct,
        consolidationMethod,
        inBoundary: true,
        isFilingEntity: entityType === 'SUBSIDIARY',
        completionRate: 0,
        status: 'HEALTHY'
      });

      // Expand parent node so user immediately sees the added entity in tree
      setExpandedNodes(prev => ({
        ...prev,
        [parentOrgId]: true,
        'meil-group': true
      }));

      setSuccessMessage(`✅ Successfully registered new ${entityType}: "${entityName}" under MEIL hierarchy.`);
      setIsAddModalOpen(false);
      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err) {
      console.error('Failed to create entity:', err);
    } finally {
      setIsSubmitting(false);
    }
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

        {isSysAdmin ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleOpenAddModal('SUBSIDIARY')}
              className="bg-[#1A2A6C] hover:bg-[#121c4a] text-white px-3.5 py-2 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
              title="Add a new subsidiary directly under MEIL Group"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Subsidiary</span>
            </button>
            <button
              onClick={() => handleOpenAddModal('PROJECT')}
              className="bg-[#EF272E] hover:bg-[#c91820] text-white px-3.5 py-2 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
              title="Add a new execution site/project under a Business Unit"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Project</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] text-xs font-bold flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Read-Only Oversight Mode</span>
            </span>
          </div>
        )}
      </div>

      {successMessage && (
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-3 text-xs text-[#166534] font-bold flex items-center space-x-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Role Notice for non-admin personas */}
      {!isSysAdmin && (
        <div className="bg-[#f0f9ff] border-l-4 border-[#0284c7] p-3 text-xs text-[#0369a1] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#0284c7] shrink-0" />
            <span>
              <strong>Read-Only Oversight:</strong> As {currentRole}, you have enterprise visibility across assigned subsidiaries and projects. Entity modifications, additions and corporate restructuring are restricted to System Administrators (SYS_ADMIN).
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold bg-[#e0f2fe] text-[#0284c7] px-2 py-0.5 border border-[#bae6fd] shrink-0">
            Read-Only Scope
          </span>
        </div>
      )}

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

      {/* Statutory Entity Registration Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-xl w-full border border-[#1A2A6C] overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#1A2A6C] px-5 py-3.5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#EF272E]" />
                <h3 className="font-bold text-sm tracking-wide">
                  Register Statutory {entityType === 'SUBSIDIARY' ? 'Subsidiary Entity' : entityType === 'BUSINESS_UNIT' ? 'Business Unit' : 'Site / Project'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#C6CBE6] hover:text-white p-1 rounded-[2px]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitEntity} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-bold text-[#1A2A6C] uppercase mb-1.5">
                  Entity Classification Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenAddModal('SUBSIDIARY')}
                    className={`py-2 px-3 text-xs font-bold border rounded-[2px] transition-colors ${
                      entityType === 'SUBSIDIARY' 
                        ? 'bg-[#1A2A6C] text-white border-[#1A2A6C]' 
                        : 'bg-[#fafafa] text-[#444444] border-[#d1d5db] hover:bg-[#E8E8E8]'
                    }`}
                  >
                    Subsidiary
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenAddModal('BUSINESS_UNIT')}
                    className={`py-2 px-3 text-xs font-bold border rounded-[2px] transition-colors ${
                      entityType === 'BUSINESS_UNIT' 
                        ? 'bg-[#1A2A6C] text-white border-[#1A2A6C]' 
                        : 'bg-[#fafafa] text-[#444444] border-[#d1d5db] hover:bg-[#E8E8E8]'
                    }`}
                  >
                    Business Unit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenAddModal('PROJECT')}
                    className={`py-2 px-3 text-xs font-bold border rounded-[2px] transition-colors ${
                      entityType === 'PROJECT' 
                        ? 'bg-[#1A2A6C] text-white border-[#1A2A6C]' 
                        : 'bg-[#fafafa] text-[#444444] border-[#d1d5db] hover:bg-[#E8E8E8]'
                    }`}
                  >
                    Site / Project
                  </button>
                </div>
              </div>

              {/* Parent Node Selector */}
              <div>
                <label className="block text-xs font-bold text-[#1A2A6C] uppercase mb-1">
                  Parent Hierarchical Node
                </label>
                {entityType === 'SUBSIDIARY' ? (
                  <input
                    type="text"
                    disabled
                    value="MEIL Group (Corporate HQ) [MEIL-GRP]"
                    className="w-full text-xs p-2.5 bg-[#f1f5f9] border border-[#cbd5e1] text-[#334155] font-semibold rounded-[2px] cursor-not-allowed"
                  />
                ) : (
                  <select
                    value={parentOrgId}
                    onChange={(e) => setParentOrgId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#cbd5e1] text-[#1e293b] font-medium rounded-[2px] focus:outline-none focus:border-[#1A2A6C]"
                  >
                    {organisations
                      .filter(o => entityType === 'BUSINESS_UNIT' ? o.type === 'SUBSIDIARY' : (o.type === 'BUSINESS_UNIT' || o.type === 'SUBSIDIARY'))
                      .map(o => (
                        <option key={o.id} value={o.id}>
                          {o.name} ({o.code}) [{o.type}]
                        </option>
                      ))}
                  </select>
                )}
              </div>

              {/* Name & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1A2A6C] uppercase mb-1">
                    {entityType === 'PROJECT' ? 'Project / Site Name' : 'Entity Legal Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={entityType === 'PROJECT' ? 'e.g. Zojila Tunnel Construction' : 'e.g. MEIL Clean Mobility Ltd'}
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#cbd5e1] text-[#1e293b] rounded-[2px] focus:outline-none focus:border-[#1A2A6C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A2A6C] uppercase mb-1">
                    Entity / Project Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={entityType === 'PROJECT' ? 'PRJ-ZOJILA-01' : 'MEIL-MOBILITY'}
                    value={entityCode}
                    onChange={(e) => setEntityCode(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#cbd5e1] text-[#1e293b] font-mono rounded-[2px] focus:outline-none focus:border-[#1A2A6C]"
                  />
                </div>
              </div>

              {/* Business Vertical */}
              <div>
                <label className="block text-xs font-bold text-[#1A2A6C] uppercase mb-1">
                  Business Vertical / Domain
                </label>
                <select
                  value={businessVertical}
                  onChange={(e) => setBusinessVertical(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#cbd5e1] text-[#1e293b] rounded-[2px] focus:outline-none focus:border-[#1A2A6C]"
                >
                  <option value="Heavy Civil & Metros">Heavy Civil, Elevated Metros & Rail</option>
                  <option value="Lift Irrigation & Hydro">Lift Irrigation, Water Supply & Dams</option>
                  <option value="Renewable Power & EPC">Renewable Energy, Solar Canal & Wind EPC</option>
                  <option value="Hydrocarbons & City Gas">Hydrocarbons, Drilling & Oil Rigs</option>
                  <option value="Electric Mobility & Green Hydrogen">Electric Buses, EV Mobility & Green Hydrogen</option>
                  <option value="Industrial Infrastructure">Industrial Infrastructure & Defense EPC</option>
                </select>
              </div>

              {/* Geographic Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1A2A6C] uppercase mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#cbd5e1] text-[#1e293b] rounded-[2px] focus:outline-none focus:border-[#1A2A6C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A2A6C] uppercase mb-1">
                    City / Site District
                  </label>
                  <input
                    type="text"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#cbd5e1] text-[#1e293b] rounded-[2px] focus:outline-none focus:border-[#1A2A6C]"
                  />
                </div>
              </div>

              {/* Subsidiary Specific Statutory Controls (SEBI BRSR Compliance) */}
              {entityType === 'SUBSIDIARY' && (
                <div className="p-3.5 bg-[#f8fafc] border border-[#cbd5e1] space-y-3 rounded-[2px]">
                  <div className="text-[11px] font-bold text-[#1A2A6C] uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" />
                    <span>SEBI BRSR Statutory Boundary Controls</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                        Corporate ID Number (CIN) *
                      </label>
                      <input
                        type="text"
                        value={cin}
                        onChange={(e) => setCin(e.target.value)}
                        placeholder="U45200TG2006PLC051234"
                        className="w-full text-xs p-2 bg-white border border-[#cbd5e1] font-mono text-[#0f172a] rounded-[2px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                        Ownership Equity %
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={ownershipPct}
                        onChange={(e) => setOwnershipPct(Number(e.target.value))}
                        className="w-full text-xs p-2 bg-white border border-[#cbd5e1] font-mono text-[#0f172a] rounded-[2px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                      Consolidation Standard
                    </label>
                    <select
                      value={consolidationMethod}
                      onChange={(e) => setConsolidationMethod(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-[#cbd5e1] text-[#0f172a] rounded-[2px]"
                    >
                      <option value="OPERATIONAL_CONTROL">Operational Control (100% statutory roll-up)</option>
                      <option value="FINANCIAL_CONTROL">Financial Control (Pro-rata equity share)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Statutory Notice */}
              <div className="text-[11px] text-[#64748b] bg-[#f8fafc] p-2.5 border border-[#e2e8f0] flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-[#0284c7] shrink-0 mt-0.5" />
                <span>
                  Adding this entity automatically inserts a cryptographic row into the immutable audit trail and includes it in MEIL's multi-tier BRSR consolidation queue.
                </span>
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-[#E8E8E8]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-[#cbd5e1] text-[#475569] text-xs font-bold hover:bg-[#f1f5f9] transition-colors rounded-[2px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#1A2A6C] hover:bg-[#EF272E] text-white text-xs font-bold transition-colors shadow-sm flex items-center space-x-1.5 rounded-[2px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Registering...' : `Register ${entityType}`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

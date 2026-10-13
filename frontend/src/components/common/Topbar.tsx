import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  Bell, 
  LogOut, 
  ChevronDown, 
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  KeyRound,
  Power,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  Smartphone,
  Laptop,
  ShieldAlert,
  RefreshCw,
  Users,
  Database
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { getCurrentIndianFinancialYear } from '../../config/fields.config';
import { CollapsibleOrgSelector } from './CollapsibleOrgSelector';

export const STATUTORY_PERSONAS = [
  { key: 'SITE_ENGINEER', name: 'Rahul Sharma', email: 'rahul@meil-infra.demo', role: 'Site Engineer', node: 'Demo Project Beta', tier: 'Tier 0: Data Entry (P6)' },
  { key: 'SITE_EHS', name: 'Vikram Joshi', email: 'ehs.beta@meil-infra.demo', role: 'Site Safety & EHS', node: 'Demo Project Beta', tier: 'Tier 0: Safety Entry (P3)' },
  { key: 'PROJECT_MANAGER', name: 'Rajesh Nair', email: 'pm.beta@meil-infra.demo', role: 'Project Manager', node: 'Demo Project Beta', tier: 'Tier 1 Approver' },
  { key: 'BU_COORDINATOR', name: 'Ananya Roy', email: 'bu.metro@meil-infra.demo', role: 'BU Coordinator', node: 'Metro & Rail BU', tier: 'Tier 2 Approver' },
  { key: 'BU_COORDINATOR_LIFT', name: 'Suresh Rao', email: 'bu.lift@meil-water.demo', role: 'BU Coordinator', node: 'Lift Irrigation BU', tier: 'Tier 2 Approver' },
  { key: 'SUB_ESG_MANAGER', name: 'Priya Nair', email: 'esg.infra@meil-infra.demo', role: 'Sub ESG Manager', node: 'MEIL Infra Projects Ltd', tier: 'Tier 3 Approver' },
  { key: 'SUB_ESG_MANAGER_HYDRO', name: 'Ramesh Patel', email: 'esg.hydro@meil-water.demo', role: 'Sub ESG Manager', node: 'MEIL Hydro & Water Corp', tier: 'Tier 3 Approver' },
  { key: 'GROUP_ESG_HEAD', name: 'Amit Verma', email: 'cso@meil-group.demo', role: 'Group CSO', node: 'MEIL Group HQ', tier: 'Tier 4 Approver (Section B)' },
  { key: 'GROUP_FUNCTION', name: 'Sunita Rao', email: 'hr@meil-group.demo', role: 'Group HR Head', node: 'MEIL Group HQ', tier: 'Group Function (Section A, P5)' },
  { key: 'GROUP_FUNCTION_FINANCE', name: 'Deepak Singhal', email: 'finance@meil-group.demo', role: 'Group Finance & CS', node: 'MEIL Group HQ', tier: 'Group Function (Section A, P8, P9)' },
  { key: 'BOARD_APPROVER', name: 'Justice (Retd.) K. Murthy', email: 'board@meil-group.demo', role: 'Board Approver', node: 'Board of Directors', tier: 'Tier 5 Final Lock' },
  { key: 'AUDITOR', name: 'Sarah Jenkins', email: 'auditor@meil-group.demo', role: 'Statutory Auditor', node: 'Global Scope', tier: 'External Assurance' },
  { key: 'SYS_ADMIN', name: 'Kiran Reddy', email: 'admin@meil.demo', role: 'Global IT Admin', node: 'Global Enterprise', tier: 'System Governance' },
];

export const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    currentRole, 
    logout, 
    terminateSession, 
    terminateDevice,
    changePassword,
    switchPersona,
    activeDevices,
    refreshActiveDevices,
    currentDeviceId 
  } = useAuth();
  const { 
    organisations, 
    selectedOrgId, 
    setSelectedOrgId, 
    reportingPeriods, 
    selectedPeriodId, 
    setSelectedPeriodId, 
    alerts,
    isDbConnected,
    isLoadingData,
    refreshData 
  } = useApp();

  const [alertsMenuOpen, setAlertsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);
  
  // Change Password Modal State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);

  // Terminate session loading state
  const [isTerminating, setIsTerminating] = useState(false);

  // Active Devices Modal State
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState(false);
  const [deviceActionLoading, setDeviceActionLoading] = useState(false);

  const activeAlerts = alerts.filter(a => a.status === 'OPEN');

  const roleBadgeNames: Record<string, string> = {
    SITE_ENGINEER: 'Site Engg',
    SITE_USER: 'Site Engg',
    SITE_EHS: 'Site EHS',
    PROJECT_MANAGER: 'Project Mgr',
    BU_COORDINATOR: 'BU Coord',
    SUB_ESG_MANAGER: 'Sub ESG Mgr',
    GROUP_ESG_HEAD: 'Group CSO',
    GROUP_SUSTAINABILITY: 'Group CSO',
    GROUP_FUNCTION: 'Group Function',
    BOARD_APPROVER: 'Board Approver',
    AUDITOR: 'Statutory Auditor',
    SYS_ADMIN: 'IT Admin',
    ADMIN: 'IT Admin',
  };

  const handleSignOut = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/login');
  };

  const handleTerminateSession = async () => {
    setUserMenuOpen(false);
    setIsTerminating(true);
    try {
      await terminateSession();
      navigate('/login');
    } finally {
      setIsTerminating(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters in length.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New password and confirmation do not match.');
      return;
    }

    setPwdLoading(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        setPwdSuccess(res.message || 'Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setIsChangePasswordOpen(false);
          setPwdSuccess(null);
        }, 2000);
      } else {
        setPwdError(res.error || 'Failed to update password.');
      }
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <>
      <header className="h-14 bg-[#1A2A6C] text-white flex items-center justify-between px-4 sm:px-6 z-40 relative shadow-sm border-b border-[#0f1b4c]">
        {/* Left: MEIL OneSource Logo + Org & Reporting Period Selector */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link to="/dashboard" className="flex items-center space-x-2 bg-white px-2.5 py-1 rounded-[3px] shadow-sm hover:opacity-95 transition-opacity shrink-0" title="MEIL OneSource - Central Source for ESG and BRSR Reporting Ease">
            <img 
              src="/MEIL_FULL_LOGO.jpg" 
              alt="MEIL OneSource Logo" 
              className="h-6 sm:h-7 w-auto object-contain block" 
            />
            <div className="hidden xl:flex flex-col border-l border-slate-300 pl-2">
              <span className="text-[12px] font-black text-[#1A2A6C] tracking-tight leading-none">
                OneSource
              </span>
              <span className="text-[8.5px] font-bold text-[#EF272E] tracking-tight leading-none">
                ESG &amp; BRSR EASE
              </span>
            </div>
          </Link>

          {/* Scoped Org Selector: Static Badge for single-unit scope (e.g. Site Engineer), Collapsible Tree Selector for Admin, CSO, & Oversight */}
          {organisations.length <= 1 ? (
            <div className="flex items-center space-x-2 bg-[#121c4a] px-3 py-1.5 rounded-[2px] border border-white/10" title="Assigned Unit Scope Boundary">
              <Building2 className="w-4 h-4 text-[#38bdf8]" />
              <span className="text-xs font-bold text-white truncate max-w-[280px]">
                {organisations[0]?.name || currentUser?.organisationName || 'Assigned Project'}
              </span>
              <span className="text-[10px] uppercase font-bold bg-[#EF272E] text-white px-1.5 py-0.5 rounded-[2px]">
                {organisations[0]?.type || 'PROJECT'}
              </span>
            </div>
          ) : (
            <CollapsibleOrgSelector
              organisations={organisations}
              selectedOrgId={selectedOrgId}
              onSelectOrg={setSelectedOrgId}
              userRole={currentRole}
            />
          )}

          {/* Period Selector: Locked for Site Engineer, Dropdown for Oversight */}
          {currentRole === 'SITE_USER' ? (
            <div className="flex items-center space-x-2 bg-[#121c4a] px-3 py-1.5 rounded-[2px] border border-emerald-400/30" title="Financial Year Locked: Site Engineers can only submit to the active reporting period.">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white font-mono">
                {getCurrentIndianFinancialYear().financialYear}
              </span>
              <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-[2px] border border-emerald-400/40">
                ACTIVE FY (LOCKED)
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-2 bg-[#121c4a] px-3 py-1.5 rounded-[2px] border border-white/10">
              <Calendar className="w-4 h-4 text-[#C6CBE6]" />
              <select
                value={selectedPeriodId}
                onChange={(e) => setSelectedPeriodId(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                {reportingPeriods.map((period) => (
                  <option key={period.id} value={period.id} className="bg-[#1A2A6C] text-white">
                    {period.financialYear} {period.isCurrent ? '(Current Filing)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quick sync trigger */}
          <button
            onClick={() => refreshData()}
            disabled={isLoadingData}
            className="p-1.5 text-[#C6CBE6] hover:text-white hover:bg-white/10 rounded-[2px] transition-colors"
            title="Sync & refresh data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin text-white' : ''}`} />
          </button>
        </div>

        {/* Right: Notifications, Persona Switcher & User Menu */}
        <div className="flex items-center space-x-2.5">
          {/* 1-Click Statutory Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setPersonaMenuOpen(!personaMenuOpen);
                setUserMenuOpen(false);
                setAlertsMenuOpen(false);
              }}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/40 text-amber-200 rounded-[2px] transition-all text-xs font-bold"
              title="Switch Statutory Persona (Test End-to-End Governance Pipeline)"
            >
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden lg:inline text-amber-200/90 font-medium text-[11px]">Persona:</span>
              <span className="text-white max-w-[130px] truncate">
                {currentUser?.fullName?.split(' ')[0] || 'User'} ({roleBadgeNames[currentRole] || currentRole})
              </span>
              <ChevronDown className="w-3 h-3 text-amber-300" />
            </button>

            {personaMenuOpen && (
              <div className="absolute right-0 mt-1 w-80 bg-white text-[#333333] border border-[#d1d5db] shadow-2xl py-2 z-50 rounded-[2px]">
                <div className="px-3 py-2 border-b border-[#E8E8E8] bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#1A2A6C] block">Statutory Persona Switcher</span>
                    <span className="text-[10px] text-[#64748b]">Test full 7-stage approval pipeline end-to-end</span>
                  </div>
                  <button 
                    onClick={() => setPersonaMenuOpen(false)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[#f1f5f9]">
                  {STATUTORY_PERSONAS.map(p => {
                    const isSelected = p.key === currentRole || (p.key === 'SITE_ENGINEER' && currentRole === 'SITE_USER');
                    return (
                      <button
                        key={p.key}
                        onClick={() => {
                          switchPersona(p.key);
                          setPersonaMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                          isSelected ? 'bg-blue-50/80 border-l-4 border-[#1A2A6C]' : ''
                        }`}
                      >
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-[#1A2A6C]">{p.name}</span>
                            {isSelected && (
                              <span className="text-[9px] font-bold bg-[#1A2A6C] text-white px-1.5 py-0.2 rounded-[2px]">ACTIVE</span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#475569]">{p.role} • <span className="font-medium text-[#64748b]">{p.node}</span></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-[2px] whitespace-nowrap">
                          {p.tier}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Alerts / Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setAlertsMenuOpen(!alertsMenuOpen);
                setPersonaMenuOpen(false);
                setUserMenuOpen(false);
              }}
              className="p-1.5 hover:bg-[#121c4a] rounded-[2px] transition-colors relative"
              title="System Alerts & Discrepancies"
            >
              <Bell className="w-4 h-4 text-[#C6CBE6]" />
              {activeAlerts.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF272E] rounded-full"></span>
              )}
            </button>

            {alertsMenuOpen && (
              <div className="absolute right-0 mt-1 w-80 bg-white text-[#333333] border border-[#d1d5db] shadow-lg py-2 z-50 rounded-[2px]">
                <div className="px-3 py-1.5 border-b border-[#E8E8E8] flex items-center justify-between text-xs font-bold text-[#1A2A6C]">
                  <span>Action Items &amp; Anomaly Alerts</span>
                  <span className="text-[10px] bg-[#EF272E] text-white px-1.5 py-0.5">
                    {activeAlerts.length} Pending
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-[#E8E8E8]">
                  {activeAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 hover:bg-[#fafafa] text-xs">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#EF272E] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[#1A2A6C] block">{alert.indicatorCode}</span>
                          <p className="text-[11px] text-[#444444] mt-0.5">{alert.message}</p>
                          <span className="text-[10px] text-[#888888] mt-1 block">{alert.organisationName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Security Options */}
          <div className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setPersonaMenuOpen(false);
                setAlertsMenuOpen(false);
              }}
              className="flex items-center space-x-2 px-2.5 py-1.5 bg-[#121c4a] hover:bg-[#18255e] border border-white/20 rounded-[2px] transition-colors"
              title="User Account & Security"
            >
              <div className="w-6 h-6 rounded-full bg-[#EF272E] text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser?.fullName ? currentUser.fullName.charAt(0) : 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="font-bold text-white text-xs block leading-none">
                  {currentUser?.fullName.split(' ')[0] || 'User'}
                </span>
                <span className="text-[10px] text-[#C6CBE6] leading-none">
                  {roleBadgeNames[currentRole] || currentRole}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#C6CBE6]" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white text-[#333333] border border-[#d1d5db] shadow-xl py-2 z-50 rounded-[2px]">
                <div className="px-3 py-2 border-b border-[#E8E8E8]">
                  <span className="font-bold text-xs text-[#1A2A6C] block">{currentUser?.fullName}</span>
                  <span className="text-[11px] text-[#666666] block font-mono">{currentUser?.email}</span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] font-bold bg-[#1A2A6C] text-white px-1.5 py-0.5">
                      {roleBadgeNames[currentRole] || currentRole}
                    </span>
                    <span className="text-[10px] text-[#888888] truncate">
                      {currentUser?.organisationName}
                    </span>
                  </div>
                  {/* Explicit Scope Boundary Display */}
                  <div className="mt-2 pt-2 border-t border-[#f0f0f0] text-[11px]">
                    <span className="text-[9px] font-bold text-[#888888] uppercase tracking-wider block">Assigned Scope Boundary</span>
                    <span className="text-[#1A2A6C] font-semibold block text-[11px] truncate mt-0.5">
                      📍 {currentUser?.organisationName || 'Demo Project Beta'}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 mt-1 inline-block border border-emerald-200">
                      {['SITE_ENGINEER', 'SITE_USER', 'SITE_EHS'].includes(currentRole)
                        ? '🔒 Project Boundary Only (Restricted)' 
                        : currentRole === 'PROJECT_MANAGER'
                        ? '🏗️ Project Boundary & Verification Scope'
                        : currentRole === 'BU_COORDINATOR'
                        ? '🚊 Business Unit Scope & Project Consolidation'
                        : currentRole === 'SUB_ESG_MANAGER' 
                        ? '🏛️ Subsidiary & Downward Sites' 
                        : '🌐 Enterprise Group Oversight'}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to="/corporate"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full text-left px-3 py-2 text-xs text-[#1A2A6C] hover:bg-[#f3f4f6] flex items-center gap-2 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#666666]" />
                    MEIL Public Website
                  </Link>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setIsChangePasswordOpen(true);
                      setPwdError(null);
                      setPwdSuccess(null);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#333333] hover:bg-[#f3f4f6] flex items-center gap-2 font-medium"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#1A2A6C]" />
                    Change Password
                  </button>

                  <button
                    onClick={async () => {
                      setUserMenuOpen(false);
                      await refreshActiveDevices();
                      setIsDevicesModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#333333] hover:bg-[#f3f4f6] flex items-center justify-between font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-3.5 h-3.5 text-[#1A2A6C]" />
                      <span>Active Devices</span>
                    </div>
                    <span className="text-[10px] font-bold bg-[#1A2A6C]/10 text-[#1A2A6C] px-1.5 py-0.5 rounded">
                      Max 2
                    </span>
                  </button>

                  <button
                    onClick={handleTerminateSession}
                    disabled={isTerminating}
                    className="w-full text-left px-3 py-2 text-xs text-[#b91c1c] hover:bg-[#fef2f2] flex items-center gap-2 font-medium border-t border-[#E8E8E8]"
                  >
                    <Power className="w-3.5 h-3.5 text-[#b91c1c]" />
                    {isTerminating ? 'Terminating...' : 'Terminate Session'}
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-xs text-[#555555] hover:bg-[#f3f4f6] flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 text-[#666666]" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full border border-[#1A2A6C] overflow-hidden">
            <div className="bg-[#1A2A6C] px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-[#EF272E]" />
                <h3 className="font-bold text-sm tracking-wide">Change Account Password</h3>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                className="text-[#C6CBE6] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="p-5 space-y-4">
              <div className="text-xs text-[#555555]">
                Changing security credentials for{' '}
                <span className="font-bold text-[#1A2A6C]">{currentUser?.email}</span>.
              </div>

              {pwdError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[2px]">
                  {pwdError}
                </div>
              )}

              {pwdSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[2px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pwdSuccess}</span>
                </div>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="w-full border border-[#d1d5db] rounded-[2px] px-3 py-2 text-xs text-[#333333] pr-9 focus:outline-none focus:border-[#1A2A6C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-2.5 top-2.5 text-[#888888] hover:text-[#333333]"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">
                  New Password (min 6 characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    className="w-full border border-[#d1d5db] rounded-[2px] px-3 py-2 text-xs text-[#333333] pr-9 focus:outline-none focus:border-[#1A2A6C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-2.5 text-[#888888] hover:text-[#333333]"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-type new password"
                  className="w-full border border-[#d1d5db] rounded-[2px] px-3 py-2 text-xs text-[#333333] focus:outline-none focus:border-[#1A2A6C]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-[#E8E8E8]">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-3 py-1.5 text-xs font-bold text-[#666666] hover:bg-[#E8E8E8] rounded-[2px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#1A2A6C] hover:bg-[#EF272E] rounded-[2px] transition-colors disabled:opacity-50"
                >
                  {pwdLoading ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Devices Management Modal */}
      {isDevicesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full border border-[#1A2A6C] overflow-hidden">
            <div className="bg-[#1A2A6C] px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-[#EF272E]" />
                <span className="font-bold text-xs uppercase tracking-wider">
                  Active Devices &amp; Concurrent Sessions
                </span>
              </div>
              <button onClick={() => setIsDevicesModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#475569] space-y-1">
                <div className="flex items-center justify-between font-bold text-[#1A2A6C]">
                  <span>Device Policy</span>
                  <span className="bg-[#1A2A6C] text-white px-1.5 py-0.5 text-[10px]">
                    Max 2 Devices
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  To satisfy statutory SEBI assurance standards, accounts can be actively signed in on at most 2 devices concurrently.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#333333] uppercase block">
                  Connected Devices ({activeDevices.length} / 2)
                </span>

                {activeDevices.length === 0 ? (
                  <p className="text-xs text-[#888888] italic py-2">
                    Loading active devices...
                  </p>
                ) : (
                  activeDevices.map((dev) => {
                    const isThisDevice = dev.deviceId === currentDeviceId;
                    const isMobile = dev.deviceName?.toLowerCase().includes('phone') || dev.deviceName?.toLowerCase().includes('android');

                    return (
                      <div
                        key={dev.deviceId}
                        className={`p-3 border flex items-center justify-between gap-3 ${
                          isThisDevice ? 'border-emerald-300 bg-emerald-50/50' : 'border-[#E8E8E8] bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                            isThisDevice ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {isMobile ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-[#1A2A6C]">
                                {dev.deviceName}
                              </span>
                              {isThisDevice && (
                                <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded-full uppercase">
                                  This Device
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#666666] block font-mono">
                              IP: {dev.ipAddress} • Connected: {new Date(dev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {!isThisDevice && (
                          <button
                            onClick={async () => {
                              setDeviceActionLoading(true);
                              try {
                                await terminateDevice(dev.deviceId);
                                await refreshActiveDevices();
                              } finally {
                                setDeviceActionLoading(false);
                              }
                            }}
                            disabled={deviceActionLoading}
                            className="px-2.5 py-1 text-[11px] font-bold text-red-700 hover:bg-red-50 border border-red-200 transition-colors disabled:opacity-50"
                          >
                            Log Out
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-3 border-t border-[#E8E8E8] flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDevicesModalOpen(false)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#1A2A6C] hover:bg-[#EF272E] rounded-[2px] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

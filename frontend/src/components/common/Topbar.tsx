import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  Bell, 
  LogOut, 
  ChevronDown, 
  Check, 
  AlertTriangle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { RoleType } from '../../types';
import { DEMO_USERS } from '../../data/demoData';

export const Topbar: React.FC = () => {
  const { currentUser, currentRole, switchRole, logout } = useAuth();
  const { 
    organisations, 
    selectedOrgId, 
    setSelectedOrgId, 
    reportingPeriods, 
    selectedPeriodId, 
    setSelectedPeriodId,
    alerts 
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [alertsMenuOpen, setAlertsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const activeAlerts = alerts.filter(a => a.status === 'OPEN');

  const roleLabels: Record<RoleType, { label: string; badgeColor: string }> = {
    SITE_USER: { label: 'Site Engineer (Project Level)', badgeColor: 'bg-[#E8E8E8] text-[#1A2A6C]' },
    ESG_OFFICER: { label: 'ESG Officer (Reviewer)', badgeColor: 'bg-[#E8E8E8] text-[#1A2A6C]' },
    GROUP_SUSTAINABILITY: { label: 'Group Sustainability (HQ)', badgeColor: 'bg-[#EF272E] text-white' },
    AUDITOR: { label: 'Statutory Auditor (Assurance)', badgeColor: 'bg-[#E8E8E8] text-[#1A2A6C]' },
    ADMIN: { label: 'System Administrator', badgeColor: 'bg-[#E8E8E8] text-[#1A2A6C]' },
  };

  return (
    <header className="bg-[#1A2A6C] text-white border-b-2 border-[#EF272E] px-4 sm:px-6 h-16 flex items-center justify-between z-30 select-none">
      {/* Left: MEIL Branding */}
      <div className="flex items-center space-x-3.5">
        <Link to="/corporate" className="flex items-center space-x-2.5 group" title="Return to MEIL Corporate Website">
          <div className="w-9 h-9 bg-white border-2 border-[#EF272E] flex items-center justify-center text-[#1A2A6C] font-black text-lg">
            <span className="text-[#EF272E] mr-0.5">M</span>EIL
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-normal leading-tight">
              MEGHA ENGINEERING &amp; INFRASTRUCTURES LIMITED
            </span>
            <span className="text-[10px] font-bold text-[#EF272E] tracking-wider uppercase leading-tight">
              ESG / BRSR REPORTING PORTAL
            </span>
          </div>
        </Link>
      </div>

      {/* Right side: Selectors, Alerts, User, Role Switcher */}
      <div className="flex items-center space-x-3 text-xs">
        {/* Organisation Selector */}
        <div className="hidden md:flex items-center space-x-1.5 bg-[#121c4a] border border-white/20 px-2.5 py-1.5 rounded-[2px]">
          <Building2 className="w-3.5 h-3.5 text-[#C6CBE6]" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase font-bold text-[#C6CBE6] leading-none">
              Entity
            </span>
            <select
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
            >
              {organisations.map((org) => (
                <option key={org.id} value={org.id} className="text-[#333333] bg-white">
                  {org.name} ({org.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reporting Period */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-[#121c4a] border border-white/20 px-2.5 py-1.5 rounded-[2px]">
          <Calendar className="w-3.5 h-3.5 text-[#EF272E]" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase font-bold text-[#C6CBE6] leading-none">
              Period
            </span>
            <select
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
            >
              {reportingPeriods.map((p) => (
                <option key={p.id} value={p.id} className="text-[#333333] bg-white">
                  {p.financialYear}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications / Alerts */}
        <div className="relative">
          <button
            onClick={() => setAlertsMenuOpen(!alertsMenuOpen)}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-[#121c4a] hover:bg-[#EF272E] border border-white/20 rounded-[2px] transition-colors font-bold text-[11px]"
            title="Active Action Items & Anomaly Alerts"
          >
            <span className="text-[#EF272E] text-xs">●</span>
            <span>{activeAlerts.length} Alerts</span>
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

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-[#121c4a] hover:bg-[#18255e] border border-white/20 rounded-[2px] transition-colors"
            title="Switch Demo Role for Live Assessment"
          >
            <span className="text-[#C6CBE6] text-[11px]">Role:</span>
            <span className="font-bold text-white text-[11px]">{currentRole}</span>
            <ChevronDown className="w-3 h-3 text-[#C6CBE6]" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white text-[#333333] border border-[#d1d5db] shadow-lg py-1.5 z-50 rounded-[2px]">
              <div className="px-3 py-1 border-b border-[#E8E8E8] text-[10px] font-bold text-[#888888] uppercase">
                Switch Role Persona (RBAC)
              </div>
              {Object.keys(DEMO_USERS).map((roleKey) => {
                const r = roleKey as RoleType;
                const isSelected = currentRole === r;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-[#E8E8E8] transition-colors ${
                      isSelected ? 'bg-[#E8E8E8] font-bold text-[#1A2A6C]' : 'text-[#333333]'
                    }`}
                  >
                    <div>
                      <span className="block font-bold">{DEMO_USERS[r].fullName.split(' ')[0]}</span>
                      <span className="text-[10px] text-[#666666]">{roleLabels[r].label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#EF272E]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-1 px-2 py-1.5 hover:bg-[#121c4a] rounded-[2px] transition-colors"
          >
            <span className="font-bold text-white text-xs uppercase">
              {currentUser?.fullName.split(' ')[0] || 'USER'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#C6CBE6]" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-1 w-52 bg-white text-[#333333] border border-[#d1d5db] shadow-lg py-1.5 z-50 rounded-[2px]">
              <div className="px-3 py-2 border-b border-[#E8E8E8]">
                <span className="font-bold text-xs text-[#1A2A6C] block">{currentUser?.fullName}</span>
                <span className="text-[10px] text-[#666666] block">{currentUser?.organisationName}</span>
              </div>
              <Link
                to="/corporate"
                onClick={() => setUserMenuOpen(false)}
                className="w-full text-left px-3 py-2 text-xs text-[#1A2A6C] hover:bg-[#E8E8E8] flex items-center gap-1.5 font-bold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                MEIL Public Website
              </Link>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#EF272E] hover:bg-[#fef2f2] flex items-center gap-1.5 font-bold border-t border-[#E8E8E8]"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

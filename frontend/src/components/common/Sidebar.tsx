import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileEdit,
  CheckSquare,
  Gauge,
  GitFork,
  History,
  FileText,
  SlidersHorizontal,
  Settings,
  Network,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calculator
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { RoleType } from '../../types';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavSection {
  sectionTitle: string;
  items: {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    allowedRoles: RoleType[];
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { currentRole } = useAuth();

  const navSections: NavSection[] = [
    {
      sectionTitle: 'OVERVIEW',
      items: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: LayoutDashboard,
          allowedRoles: [
            'SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 'SUB_ESG_MANAGER',
            'BU_COORDINATOR', 'PROJECT_MANAGER', 'SITE_ENGINEER', 'SITE_EHS', 'GROUP_FUNCTION',
            'AUDITOR', 'SITE_USER', 'ESG_OFFICER', 'GROUP_SUSTAINABILITY'
          ]
        }
      ]
    },
    {
      sectionTitle: 'REPORTING',
      items: [
        {
          name: 'Data Entry',
          path: '/data-entry',
          icon: FileEdit,
          allowedRoles: [
            'SYS_ADMIN', 'ADMIN', 'SITE_ENGINEER', 'SITE_EHS', 'GROUP_FUNCTION',
            'PROJECT_MANAGER', 'BU_COORDINATOR', 'SUB_ESG_MANAGER', 'GROUP_ESG_HEAD',
            'SITE_USER', 'ESG_OFFICER'
          ]
        },
        {
          name: (currentRole === 'GROUP_ESG_HEAD' || currentRole === 'GROUP_SUSTAINABILITY') 
            ? 'Group CSO Sign-Off' 
            : currentRole === 'BOARD_APPROVER' 
            ? 'Board Sign-Off' 
            : 'Review & Approval',
          path: '/review',
          icon: CheckSquare,
          allowedRoles: [
            'SYS_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'BU_COORDINATOR', 
            'SUB_ESG_MANAGER', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 'AUDITOR',
            'ESG_OFFICER', 'GROUP_SUSTAINABILITY'
          ],
          badge: (currentRole === 'GROUP_ESG_HEAD' || currentRole === 'BOARD_APPROVER') ? 'Sign-Off' : undefined
        },
        {
          name: 'BRSR Readiness',
          path: '/brsr-readiness',
          icon: Gauge,
          allowedRoles: [
            'SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 
            'SUB_ESG_MANAGER', 'BU_COORDINATOR', 'PROJECT_MANAGER', 'GROUP_FUNCTION', 'AUDITOR',
            'ESG_OFFICER', 'GROUP_SUSTAINABILITY'
          ]
        },
        {
          name: 'BRSR Core & Scope 2',
          path: '/brsr-core',
          icon: Calculator,
          allowedRoles: [
            'SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 
            'SUB_ESG_MANAGER', 'BU_COORDINATOR', 'PROJECT_MANAGER', 'SITE_ENGINEER', 'AUDITOR',
            'ESG_OFFICER', 'GROUP_SUSTAINABILITY'
          ]
        },
        {
          name: 'Reports & Filings',
          path: '/reports',
          icon: FileText,
          allowedRoles: [
            'SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 
            'SUB_ESG_MANAGER', 'BU_COORDINATOR', 'PROJECT_MANAGER', 'GROUP_FUNCTION', 'AUDITOR',
            'ESG_OFFICER', 'GROUP_SUSTAINABILITY'
          ]
        }
      ]
    },
    {
      sectionTitle: 'ANALYTICS & GOVERNANCE',
      items: [
        {
          name: 'Traceability',
          path: '/traceability',
          icon: GitFork,
          allowedRoles: [
            'SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 
            'SUB_ESG_MANAGER', 'BU_COORDINATOR', 'PROJECT_MANAGER', 'AUDITOR',
            'ESG_OFFICER', 'GROUP_SUSTAINABILITY'
          ]
        },
        {
          name: 'Statutory Audit Trail',
          path: '/audit-trail',
          icon: History,
          allowedRoles: [
            'SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 
            'SUB_ESG_MANAGER', 'BU_COORDINATOR', 'PROJECT_MANAGER', 'AUDITOR',
            'ESG_OFFICER', 'GROUP_SUSTAINABILITY'
          ]
        }
      ]
    },
    {
      sectionTitle: 'ADMINISTRATION',
      items: [
        {
          name: 'Indicators Registry',
          path: '/indicators',
          icon: SlidersHorizontal,
          allowedRoles: [
            'SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 
            'SUB_ESG_MANAGER', 'BU_COORDINATOR', 'PROJECT_MANAGER', 'SITE_ENGINEER', 'SITE_EHS', 'AUDITOR',
            'ESG_OFFICER', 'GROUP_SUSTAINABILITY', 'SITE_USER'
          ]
        },
        {
          name: 'Organisation Tree',
          path: '/organisation',
          icon: Network,
          allowedRoles: [
            'SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 
            'SUB_ESG_MANAGER', 'BU_COORDINATOR', 'AUDITOR', 'GROUP_SUSTAINABILITY'
          ]
        },
        {
          name: 'Presentation Deck',
          path: '/presentation',
          icon: ShieldCheck,
          allowedRoles: ['ADMIN', 'ESG_OFFICER', 'GROUP_SUSTAINABILITY', 'AUDITOR', 'SITE_USER'],
          badge: '20'
        },
        {
          name: 'Settings',
          path: '/settings',
          icon: Settings,
          allowedRoles: ['SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'GROUP_SUSTAINABILITY']
        }
      ]
    }
  ];

  return (
    <aside
      className={`bg-white text-[#333333] border-r border-[#E8E8E8] transition-all duration-200 flex flex-col z-20 select-none ${collapsed ? 'w-16' : 'w-60'
        }`}
    >
      {/* Sidebar Header / Menu & Toggle */}
      <div className="h-12 border-b border-[#E8E8E8] px-3.5 flex items-center justify-between bg-[#fafafa]">
        {!collapsed ? (
          <span className="text-[11px] font-bold text-[#666666] tracking-wider uppercase">
            Navigation
          </span>
        ) : (
          <div className="w-full flex justify-center">
            <span className="w-2 h-2 rounded-full bg-[#1A2A6C]" />
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 text-[#666666] hover:text-[#1A2A6C] rounded-[2px] hover:bg-[#E8E8E8] transition-colors shrink-0"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List with Clean Sectioning */}
      <div className="flex-1 overflow-y-auto py-2 space-y-4">
        {navSections.map((section, sIdx) => {
          const visibleItems = section.items.filter(item => item.allowedRoles.includes(currentRole));
          if (visibleItems.length === 0) return null;

          return (
            <div key={sIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-4 py-1 text-[10px] font-bold text-[#888888] tracking-wider uppercase">
                  {section.sectionTitle}
                </div>
              )}

              {visibleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-[13px] font-medium transition-colors border-l-4 ${isActive
                        ? 'bg-[#E8E8E8] text-[#1A2A6C] font-bold border-[#EF272E]'
                        : 'text-[#444444] hover:bg-[#fafafa] hover:text-[#1A2A6C] border-transparent'
                      }`
                    }
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-[#1A2A6C]" />
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1 ml-3 truncate">
                        <span className="truncate">{item.name}</span>
                        {item.badge && (
                          <span className="ml-2 px-1.5 py-0.2 text-[10px] font-bold bg-[#EF272E] text-white rounded-[2px]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-[#E8E8E8] bg-[#fafafa] text-[11px] text-[#666666]">
        {!collapsed ? (
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#16a34a] shrink-0" />
            <span className="font-semibold text-[#1A2A6C]">SEBI BRSR 2024 Core</span>
          </div>
        ) : (
          <div className="flex justify-center" title="SEBI BRSR 2024 Core">
            <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
          </div>
        )}
      </div>
    </aside>
  );
};

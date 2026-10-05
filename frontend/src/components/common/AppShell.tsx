import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useApp } from '../../contexts/AppContext';

export const AppShell: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { selectedOrg } = useApp();
  const location = useLocation();

  // Dynamic Breadcrumb computation
  const getBreadcrumb = () => {
    const path = location.pathname;
    let pageName = 'Dashboard';
    if (path.includes('data-entry')) pageName = 'Data Entry';
    else if (path.includes('review')) pageName = 'Review & Approval';
    else if (path.includes('brsr-readiness')) pageName = 'BRSR Readiness';
    else if (path.includes('traceability')) pageName = 'Traceability Explorer';
    else if (path.includes('audit-trail')) pageName = 'Audit Trail';
    else if (path.includes('reports')) pageName = 'Reports & Disclosures';
    else if (path.includes('indicators')) pageName = 'Indicator Registry';
    else if (path.includes('organisation')) pageName = 'Organisation Tree';
    else if (path.includes('settings')) pageName = 'Settings';

    return (
      <div className="bg-[#fafafa] border-b border-[#E8E8E8] px-6 py-2 text-xs text-[#666666] flex items-center space-x-1.5 select-none">
        <span className="font-bold text-[#1A2A6C]">MEIL ESG</span>
        <span>/</span>
        <span className="font-medium text-[#444444]">{selectedOrg.name}</span>
        <span>/</span>
        <span className="font-bold text-[#EF272E]">{pageName}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white text-[#333333] font-sans overflow-hidden">
      {/* Top Brand Bar */}
      <Topbar />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
          {/* Breadcrumb strip */}
          {getBreadcrumb()}

          <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 bg-white">
            <div className="max-w-7xl mx-auto space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Settings, 
  Users, 
  ShieldCheck, 
  Database, 
  Calendar, 
  Layers,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const SettingsPage: React.FC = () => {
  const { reportingPeriods, selectedPeriod } = useApp();

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 uppercase">
              System Administration
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Platform Configuration & Reporting Cycles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage active financial years, RBAC permissions, assurance parameters, and security policies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reporting Cycles */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Calendar className="w-5 h-5 text-meil-navy-700" />
            <h3 className="text-sm font-bold text-slate-900">Configured Reporting Periods</h3>
          </div>

          <div className="space-y-2 text-xs">
            {reportingPeriods.map((p) => (
              <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">{p.financialYear}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{p.startDate} to {p.endDate}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  p.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RBAC Roles Matrix */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-meil-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">RBAC Permission Matrix</h3>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <span className="font-semibold">SITE_USER</span>
              <span className="text-[11px] text-slate-500">Project data input & evidence upload</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <span className="font-semibold">ESG_OFFICER</span>
              <span className="text-[11px] text-slate-500">Review queue, approve/reject workflow</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <span className="font-semibold">GROUP_SUSTAINABILITY</span>
              <span className="text-[11px] text-slate-500">Consolidated analytics & SEBI reporting</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <span className="font-semibold">AUDITOR</span>
              <span className="text-[11px] text-slate-500">Read-only assurance & full traceability</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

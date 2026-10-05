import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  Gauge, 
  ShieldCheck, 
  Leaf, 
  Users, 
  Landmark, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight,
  Zap,
  Droplets,
  Flame,
  Trash2,
  HardHat,
  HeartPulse,
  Scale,
  FileCheck2,
  ChevronRight
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

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole } = useAuth();
  const { 
    selectedOrg, 
    selectedPeriod, 
    dashboardSummary, 
    organisations, 
    alerts 
  } = useApp();

  const activeAlerts = alerts.filter(a => a.status === 'OPEN');

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Page Header (Editorial style) */}
      <div className="border-b border-[#E8E8E8] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-1">
            <span className="text-[#1A2A6C]">{selectedOrg.type} LEVEL</span>
            <span>•</span>
            <span className="text-[#EF272E]">{selectedPeriod.financialYear}</span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#1A2A6C] tracking-tight leading-tight">
            ESG Reporting Overview
          </h1>
          <p className="text-[14px] text-[#444444] mt-1 max-w-3xl leading-relaxed">
            Centralized visibility into ESG performance, reporting completeness, compliance readiness and source-level traceability across the MEIL Group.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => navigate('/traceability')}
            className="border border-[#1A2A6C] hover:bg-[#1A2A6C] hover:text-white text-[#1A2A6C] px-3.5 py-2 text-xs font-bold transition-colors flex items-center space-x-1.5"
          >
            <span>Traceability Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => navigate('/brsr-readiness')}
            className="bg-[#1A2A6C] hover:bg-[#EF272E] text-white px-4 py-2 text-xs font-bold transition-colors flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>BRSR Readiness</span>
          </button>
        </div>
      </div>

      {/* 2. Top KPI Strip (Flat rectangular blocks) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <KpiCard
          title="Total Projects"
          value={dashboardSummary.totalProjects}
          subtitle="Across MEIL Subsidiaries"
          badgeText="All Active"
          onClick={() => navigate('/organisation')}
        />

        <KpiCard
          title="Data Submitted"
          value={dashboardSummary.submittedProjects}
          unit="Projects"
          subtitle="10 of 12 Submitted"
          badgeText="83% Reported"
        />

        <KpiCard
          title="Pending Review"
          value={dashboardSummary.pendingReviewProjects}
          unit="Sites"
          subtitle="Action Required"
          badgeText="2 Pending"
          onClick={() => navigate('/review')}
        />

        <KpiCard
          title="Overall Readiness"
          value={`${dashboardSummary.overallReadinessPercent}%`}
          subtitle="BRSR Sec A, B & C"
          trend={{ value: 14.5, isPositiveGood: true, label: 'YoY' }}
          onClick={() => navigate('/brsr-readiness')}
        />

        <KpiCard
          title="BRSR Core"
          value={`${dashboardSummary.brsrCoreReadinessPercent}%`}
          subtitle="Reasonable Assurance"
          badgeText="High Priority"
          onClick={() => navigate('/brsr-readiness')}
        />
      </div>

      {/* 3. Executive ESG Section (3 Horizontal Areas: Environment, Social, Governance) */}
      <div className="space-y-3">
        <div className="border-b-2 border-[#1A2A6C] pb-2">
          <h2 className="text-[20px] font-bold text-[#1A2A6C] uppercase tracking-wide">
            Our ESG Performance
          </h2>
          <p className="text-[13px] text-[#555555]">
            Tracking environmental, social and governance performance across projects, business units and subsidiaries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
          {/* ENVIRONMENT */}
          <div className="bg-white border border-[#E8E8E8] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div>
                <span className="text-[11px] font-bold text-[#1A2A6C] uppercase tracking-wider block">
                  ENVIRONMENT (PRINCIPLE 6)
                </span>
                <h3 className="text-base font-bold text-[#333333]">Decarbonization &amp; Footprint</h3>
              </div>
              <span className="text-[10px] font-bold bg-[#E8E8E8] text-[#1A2A6C] px-2 py-0.5 border border-[#d1d5db]">
                BRSR Core
              </span>
            </div>

            <div className="bg-[#fafafa] p-3.5 border border-[#E8E8E8] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#666666] block">GHG Footprint (Scope 1+2)</span>
                <span className="text-xl font-bold text-[#1A2A6C]">125,430 <span className="text-xs font-normal text-[#555555]">tCO₂e</span></span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#16a34a] block">↓ 5.8%</span>
                <span className="text-[10px] text-[#888888]">vs FY 2025-26</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-[#444444]">
              <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                <span>Total Energy Consumed:</span>
                <strong className="text-[#333333]">1,845,200 GJ</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                <span>Total Water Withdrawal:</span>
                <strong className="text-[#333333]">412,800 KL</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Waste Recycled Ratio:</span>
                <strong className="text-[#333333]">74.2% Diverted</strong>
              </div>
            </div>

            <div className="pt-2">
              <ProgressBar
                value={dashboardSummary.environmentalSummary.renewableEnergyPercent}
                label="Renewable Energy Share (Target 40%)"
                size="sm"
                color="navy"
              />
            </div>
          </div>

          {/* SOCIAL */}
          <div className="bg-white border border-[#E8E8E8] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div>
                <span className="text-[11px] font-bold text-[#1A2A6C] uppercase tracking-wider block">
                  SOCIAL (PRINCIPLE 3 &amp; 5)
                </span>
                <h3 className="text-base font-bold text-[#333333]">Workforce &amp; Human Capital</h3>
              </div>
              <span className="text-[10px] font-bold bg-[#E8E8E8] text-[#1A2A6C] px-2 py-0.5 border border-[#d1d5db]">
                BRSR Core
              </span>
            </div>

            <div className="bg-[#fafafa] p-3.5 border border-[#E8E8E8] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#666666] block">Total Workforce</span>
                <span className="text-xl font-bold text-[#1A2A6C]">14,280 <span className="text-xs font-normal text-[#555555]">Personnel</span></span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#16a34a] block">↑ 4.2%</span>
                <span className="text-[10px] text-[#888888]">Headcount YoY</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-[#444444]">
              <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                <span>Safety Incidents / Fatalities:</span>
                <strong className="text-[#16a34a]">0 Fatalities (Healthy)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                <span>Wellbeing &amp; Health Insurance:</span>
                <strong className="text-[#333333]">96.5% Covered</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Avg Safety Training Hours:</span>
                <strong className="text-[#333333]">24.6 hrs / emp</strong>
              </div>
            </div>

            <div className="pt-2">
              <ProgressBar
                value={dashboardSummary.socialSummary.femaleRepresentationPercent}
                label="Female Engineering Representation"
                size="sm"
                color="red"
              />
            </div>
          </div>

          {/* GOVERNANCE */}
          <div className="bg-white border border-[#E8E8E8] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div>
                <span className="text-[11px] font-bold text-[#1A2A6C] uppercase tracking-wider block">
                  GOVERNANCE (PRINCIPLE 1, 8, 9)
                </span>
                <h3 className="text-base font-bold text-[#333333]">Integrity &amp; Responsibility</h3>
              </div>
              <span className="text-[10px] font-bold bg-[#E8E8E8] text-[#1A2A6C] px-2 py-0.5 border border-[#d1d5db]">
                BRSR Core
              </span>
            </div>

            <div className="bg-[#fafafa] p-3.5 border border-[#E8E8E8] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#666666] block">Compliance Readiness</span>
                <span className="text-xl font-bold text-[#1A2A6C]">94.0%</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#16a34a] block">↑ 2.1%</span>
                <span className="text-[10px] text-[#888888]">Assurance Score</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-[#444444]">
              <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                <span>Anti-Corruption Training:</span>
                <strong className="text-[#333333]">98.2% Completed</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E8]">
                <span>MSME Sourced Procurement:</span>
                <strong className="text-[#1A2A6C]">27.5% (Min 25% Met)</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Customer Privacy &amp; Data Breaches:</span>
                <strong className="text-[#16a34a]">0 Incidents</strong>
              </div>
            </div>

            <div className="pt-2">
              <ProgressBar
                value={dashboardSummary.governanceSummary.msmeProcurementPercent}
                label="MSME Procurement Spend Ratio"
                size="sm"
                color="navy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Multi-Year Trajectory Line Chart (Navy & Red) */}
      <div className="bg-white border border-[#E8E8E8] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E8E8] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#1A2A6C]">
              Multi-Year Decarbonization &amp; Resource Trajectory
            </h3>
            <p className="text-xs text-[#666666]">
              Consolidated trend for GHG Scope 1+2 (tCO₂e) and Water Consumption (KL) across reporting financial years.
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

      {/* 5. Subsidiary Hierarchy Performance & Action Required Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subsidiary Rollup Status Table (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E8E8E8] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
            <div>
              <h3 className="text-sm font-bold text-[#1A2A6C] uppercase tracking-wider">
                Organisation Hierarchy Performance
              </h3>
              <p className="text-[12px] text-[#666666]">Rollup readiness and status across subsidiaries and business units</p>
            </div>
            <button
              onClick={() => navigate('/organisation')}
              className="text-xs font-bold text-[#1A2A6C] hover:text-[#EF272E] flex items-center space-x-1"
            >
              <span>View Full Tree</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1A2A6C] text-white font-bold">
                <tr>
                  <th className="py-2.5 px-3">Entity Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Vertical</th>
                  <th className="py-2.5 px-3">Completeness</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8]">
                {organisations
                  .filter(o => o.type === 'SUBSIDIARY' || o.type === 'PROJECT')
                  .slice(0, 5)
                  .map((org) => (
                    <tr key={org.id} className="hover:bg-[#fafafa]">
                      <td className="py-3 px-3 font-bold text-[#1A2A6C]">
                        {org.name}
                      </td>
                      <td className="py-3 px-3 text-[#666666]">
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#E8E8E8] text-[#333333] border border-[#d1d5db]">
                          {org.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#444444] truncate max-w-[150px]">
                        {org.businessVertical || 'Heavy Infrastructure'}
                      </td>
                      <td className="py-3 px-3 w-32">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-[#E8E8E8] h-1.5 rounded-[1px] overflow-hidden">
                            <div
                              className="bg-[#1A2A6C] h-full"
                              style={{ width: `${org.completionRate || 80}%` }}
                            />
                          </div>
                          <span className="font-bold text-[#1A2A6C] text-[11px]">{org.completionRate || 80}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={org.status || 'HEALTHY'} size="sm" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Required Queue (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E8E8E8] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
            <div>
              <h3 className="text-sm font-bold text-[#1A2A6C] uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-[#EF272E]" />
                <span>Action Required</span>
              </h3>
              <p className="text-[11px] text-[#666666]">Outstanding items requiring review</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#EF272E] text-white">
              {activeAlerts.length}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
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
    </div>
  );
};

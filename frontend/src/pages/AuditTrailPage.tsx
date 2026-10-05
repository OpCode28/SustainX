import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Clock, 
  FileText, 
  X
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { AuditLog } from '../types';

export const AuditTrailPage: React.FC = () => {
  const { auditLogs, selectedPeriod } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [inspectedLog, setInspectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = auditLogs.filter(log => {
    if (filterAction !== 'ALL' && log.action !== filterAction) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const codeMatch = log.indicatorCode?.toLowerCase().includes(term);
      const nameMatch = log.indicatorName?.toLowerCase().includes(term);
      const userMatch = log.changedByName?.toLowerCase().includes(term);
      const orgMatch = log.organisationName?.toLowerCase().includes(term);
      return codeMatch || nameMatch || userMatch || orgMatch;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header (Section 24) */}
      <div className="border-b border-[#E8E8E8] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-1">
            <span className="text-[#1A2A6C]">TAMPER-EVIDENT REVISION LOG</span>
            <span>•</span>
            <span className="text-[#EF272E]">{selectedPeriod.financialYear}</span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#1A2A6C] tracking-tight leading-tight">
            Immutable Audit Trail
          </h1>
          <p className="text-[14px] text-[#444444] mt-1 max-w-3xl leading-relaxed">
            Chronological audit timeline recording all metric creations, modifications, evidence attachments, and statutory approvals.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 bg-[#E8E8E8] text-[#1A2A6C] border border-[#d1d5db] text-xs font-bold">
            {auditLogs.length} Events Recorded
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#fafafa] p-3 border border-[#E8E8E8]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#888888] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search indicator, user, or project..."
            className="w-full bg-white border border-[#d1d5db] pl-9 pr-3 py-1.5 text-xs text-[#333333] focus:outline-none focus:border-[#1A2A6C]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto text-xs">
          <span className="text-[#666666] font-bold">Action:</span>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-white border border-[#d1d5db] px-2.5 py-1.5 text-xs font-bold text-[#1A2A6C] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="TRANSITION">TRANSITION</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
      </div>

      {/* Vertical Corporate Timeline (Section 24) */}
      <div className="bg-white border border-[#E8E8E8] p-6">
        <div className="relative border-l-2 border-[#1A2A6C] ml-4 space-y-6">
          {filteredLogs.map((log) => {
            const isApproved = log.newValue?.status === 'APPROVED';
            const isSubmitted = log.newValue?.status === 'SUBMITTED';

            return (
              <div key={log.id} className="relative pl-6">
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-2 top-1.5 w-4 h-4 rounded-full border-2 border-white ${
                    isApproved
                      ? 'bg-[#16a34a]'
                      : isSubmitted
                      ? 'bg-[#EF272E]'
                      : 'bg-[#1A2A6C]'
                  }`}
                />

                {/* Event Card */}
                <div
                  onClick={() => setInspectedLog(log)}
                  className="p-4 bg-[#fafafa] border border-[#E8E8E8] hover:border-[#1A2A6C] hover:bg-white cursor-pointer transition-colors space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="font-bold text-xs bg-[#1A2A6C] text-white px-2 py-0.5">
                        {log.indicatorCode || log.tableName}
                      </span>
                      <strong className="text-xs text-[#1A2A6C]">{log.indicatorName || 'System Table'}</strong>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-[#E8E8E8] text-[#333333] border border-[#d1d5db]">
                        {log.action}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-xs text-[#666666]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#444444]">{log.reason || 'Operational update'}</p>

                  <div className="flex items-center justify-between text-[11px] text-[#666666] pt-2 border-t border-[#E8E8E8]">
                    <div className="flex items-center space-x-3">
                      <span>User: <strong className="text-[#1A2A6C]">{log.changedByName}</strong> ({log.userRole})</span>
                      <span>Entity: <strong className="text-[#333333]">{log.organisationName}</strong></span>
                    </div>
                    <span className="font-mono text-[10px] text-[#888888]">IP: {log.ipAddress || '10.14.88.22'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inspection Modal */}
      {inspectedLog && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full p-6 border-2 border-[#1A2A6C] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div>
                <span className="text-xs font-bold text-[#1A2A6C] block">
                  {inspectedLog.indicatorCode}
                </span>
                <h3 className="text-base font-bold text-[#1A2A6C]">Audit Event Record Inspection</h3>
              </div>
              <button
                onClick={() => setInspectedLog(null)}
                className="text-[#666666] hover:text-[#EF272E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#fafafa] border border-[#E8E8E8]">
                <span className="text-[#888888] font-bold uppercase block text-[10px]">Justification / Reason</span>
                <p className="text-[#333333] mt-0.5">{inspectedLog.reason || 'System operational lifecycle event'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#fafafa] border border-[#E8E8E8]">
                  <span className="text-[#EF272E] font-bold block mb-1 uppercase text-[10px]">Previous State</span>
                  <pre className="text-[11px] font-mono text-[#444444] whitespace-pre-wrap">
                    {JSON.stringify(inspectedLog.oldValue, null, 2) || 'None (Initial Creation)'}
                  </pre>
                </div>

                <div className="p-3 bg-[#fafafa] border border-[#E8E8E8]">
                  <span className="text-[#16a34a] font-bold block mb-1 uppercase text-[10px]">New State</span>
                  <pre className="text-[11px] font-mono text-[#444444] whitespace-pre-wrap">
                    {JSON.stringify(inspectedLog.newValue, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E8E8E8]">
              <button
                onClick={() => setInspectedLog(null)}
                className="px-4 py-2 bg-[#1A2A6C] text-white text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

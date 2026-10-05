import React, { useState } from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  AlertTriangle,
  Building2,
  Calendar,
  X
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { DataEntry } from '../types';
import { INDICATORS, ORGANISATIONS } from '../data/demoData';
import { StatusBadge } from '../components/common/StatusBadge';

export const ReviewApprovalPage: React.FC = () => {
  const { 
    dataEntries, 
    approveDataEntry, 
    rejectDataEntry, 
    selectedPeriod 
  } = useApp();

  const [selectedEntryForReview, setSelectedEntryForReview] = useState<DataEntry | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const reviewQueue = dataEntries.map(entry => {
    const indicator = INDICATORS.find(i => i.id === entry.indicatorId);
    const org = ORGANISATIONS.find(o => o.id === entry.organisationId);
    return { ...entry, indicator, organisation: org };
  });

  const pendingCount = reviewQueue.filter(e => e.status === 'SUBMITTED' || e.status === 'UNDER_REVIEW').length;

  const handleApprove = () => {
    if (!selectedEntryForReview) return;
    approveDataEntry(selectedEntryForReview.id, reviewComments || 'Approved by ESG Officer after data & evidence verification.');
    setSelectedEntryForReview(null);
    setReviewComments('');
    showToast('Metric approved! Group roll-up updated and logged to audit trail.');
  };

  const handleReject = () => {
    if (!selectedEntryForReview) return;
    rejectDataEntry(selectedEntryForReview.id, reviewComments || 'Returned for correction. Discrepancy observed.');
    setSelectedEntryForReview(null);
    setReviewComments('');
    showToast('Submission returned for correction.');
  };

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header */}
      <div className="border-b border-[#E8E8E8] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-1">
            <span className="text-[#1A2A6C]">ESG OFFICER ASSURANCE QUEUE</span>
            <span>•</span>
            <span className="text-[#EF272E]">{selectedPeriod.financialYear}</span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#1A2A6C] tracking-tight leading-tight">
            Review &amp; Approval Center
          </h1>
          <p className="text-[14px] text-[#444444] mt-1 max-w-3xl leading-relaxed">
            Validate submitted project site metrics, verify supporting invoices and logs, and authorize group aggregation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 bg-[#E8E8E8] text-[#1A2A6C] border border-[#d1d5db] text-xs font-bold flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-[#EF272E]" />
            <span>{pendingCount} Pending Reviews</span>
          </span>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Review Queue Table (Section 27) */}
      <div className="bg-white border border-[#E8E8E8] overflow-hidden">
        <div className="p-4 border-b border-[#E8E8E8] bg-[#fafafa] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1A2A6C] uppercase tracking-wider">Submitted Metrics Queue</h3>
          <span className="text-xs text-[#666666]">{reviewQueue.length} Total Indicators</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A2A6C] text-white font-bold">
              <tr>
                <th className="py-2.5 px-3">Reporting Project</th>
                <th className="py-2.5 px-3">Indicator Code &amp; Name</th>
                <th className="py-2.5 px-3">Reported Value</th>
                <th className="py-2.5 px-3">YoY Trajectory</th>
                <th className="py-2.5 px-3">Evidence</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8]">
              {reviewQueue.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#fafafa]">
                  <td className="py-3 px-3 font-bold text-[#1A2A6C]">
                    <div className="flex items-center space-x-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#888888]" />
                      <span>{entry.organisation?.name || 'Project Site'}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-bold text-[#1A2A6C] block">{entry.indicator?.code}</span>
                    <span className="text-[#555555] truncate max-w-[200px] block">{entry.indicator?.name}</span>
                  </td>

                  <td className="py-3 px-3 font-bold text-[#1A2A6C]">
                    {entry.numericValue !== undefined ? entry.numericValue.toLocaleString() : '—'} {entry.unit}
                  </td>

                  <td className="py-3 px-3">
                    {entry.yoyChangePercent !== undefined ? (
                      <span className={`font-bold ${entry.yoyChangePercent > 20 ? 'text-[#EF272E]' : 'text-[#333333]'}`}>
                        {entry.yoyChangePercent > 0 ? `+${entry.yoyChangePercent}%` : `${entry.yoyChangePercent}%`}
                      </span>
                    ) : (
                      <span className="text-[#888888]">—</span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#1A2A6C] bg-[#E8E8E8] px-2 py-0.5 border border-[#d1d5db]">
                      <FileText className="w-3 h-3 text-[#1A2A6C]" />
                      <span>{entry.evidenceCount || 0} Docs</span>
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <StatusBadge status={entry.status} size="sm" />
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedEntryForReview(entry)}
                      className="px-3 py-1.5 bg-[#1A2A6C] hover:bg-[#EF272E] text-white font-bold text-xs transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Drawer / Modal */}
      {selectedEntryForReview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full p-6 border-2 border-[#1A2A6C] space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div>
                <span className="text-[10px] font-bold bg-[#1A2A6C] text-white px-2 py-0.5 uppercase">
                  {selectedEntryForReview.indicator?.code}
                </span>
                <h3 className="text-lg font-bold text-[#1A2A6C] mt-1">
                  {selectedEntryForReview.indicator?.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEntryForReview(null)}
                className="text-[#666666] hover:text-[#EF272E]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Comparison Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#fafafa] border border-[#E8E8E8]">
                <span className="text-[10px] text-[#888888] font-bold uppercase block">Submitted Value</span>
                <span className="text-lg font-bold text-[#1A2A6C] mt-1 block">
                  {selectedEntryForReview.numericValue?.toLocaleString()} {selectedEntryForReview.unit}
                </span>
              </div>

              <div className="p-3 bg-[#fafafa] border border-[#E8E8E8]">
                <span className="text-[10px] text-[#888888] font-bold uppercase block">Prior Year Value</span>
                <span className="text-lg font-bold text-[#555555] mt-1 block">
                  {selectedEntryForReview.previousYearValue?.toLocaleString() || '19,800'} {selectedEntryForReview.unit}
                </span>
              </div>

              <div className="p-3 bg-[#fafafa] border border-[#E8E8E8]">
                <span className="text-[10px] text-[#888888] font-bold uppercase block">Site Location</span>
                <span className="font-bold text-[#333333] mt-1 block truncate">
                  {selectedEntryForReview.organisation?.name}
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="p-3 bg-[#fafafa] border border-[#E8E8E8] text-xs space-y-1">
              <span className="font-bold text-[#1A2A6C] block">Site User Notes:</span>
              <p className="text-[#444444]">
                {selectedEntryForReview.remarks || 'Standard telematics and calibrated fuel receipts attached.'}
              </p>
            </div>

            {/* Proof Documents */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#1A2A6C] block uppercase tracking-wider">
                Attached Proof Documents ({selectedEntryForReview.evidenceFiles?.length || 0})
              </span>
              <div className="space-y-1.5">
                {selectedEntryForReview.evidenceFiles && selectedEntryForReview.evidenceFiles.length > 0 ? (
                  selectedEntryForReview.evidenceFiles.map((ev) => (
                    <div key={ev.id} className="p-2.5 bg-[#fafafa] border border-[#E8E8E8] flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-[#1A2A6C]" />
                        <div>
                          <strong className="text-[#333333] block">{ev.fileName}</strong>
                          <span className="text-[10px] text-[#888888]">{ev.description}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]">
                        Verified
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#888888] italic">No evidence attached.</p>
                )}
              </div>
            </div>

            {/* Comments Box */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#333333]">
                Auditor / ESG Officer Justification Comments (Logged to Audit Trail)
              </label>
              <textarea
                rows={2}
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Enter justification or correction instructions..."
                className="w-full bg-white border border-[#d1d5db] p-2 text-xs text-[#333333] focus:outline-none focus:border-[#1A2A6C]"
              />
            </div>

            {/* Action Buttons (Section 28) */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E8E8E8]">
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 bg-white border border-[#EF272E] text-[#EF272E] hover:bg-[#EF272E] hover:text-white text-xs font-bold transition-colors flex items-center space-x-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Request Correction</span>
              </button>

              <button
                type="button"
                onClick={handleApprove}
                className="px-5 py-2 bg-[#1A2A6C] hover:bg-[#EF272E] text-white text-xs font-bold transition-colors flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve &amp; Rollup to Group</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

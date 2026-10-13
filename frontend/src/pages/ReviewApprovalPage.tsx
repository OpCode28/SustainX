import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  AlertTriangle,
  Building2,
  Calendar,
  X,
  Lock,
  Unlock,
  Clock,
  History as HistoryIcon,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { DataEntry, EntryStatus } from '../types';
import { INDICATORS, ORGANISATIONS } from '../data/demoData';
import { StatusBadge } from '../components/common/StatusBadge';

export const ReviewApprovalPage: React.FC = () => {
  const { 
    dataEntries, 
    approveDataEntry, 
    rejectDataEntry, 
    unlockDataEntry,
    selectedPeriod 
  } = useApp();

  const { currentUser, currentRole, token } = useAuth();

  const [selectedEntryForReview, setSelectedEntryForReview] = useState<DataEntry | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Unlock modal state
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockReason, setUnlockReason] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);

  // Approval history trail for selected entry
  const [approvalHistory, setApprovalHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Status Filter Tab
  const [selectedTab, setSelectedTab] = useState<'ALL' | 'ACTIONABLE' | 'APPROVED' | 'REJECTED' | 'LOCKED'>('ALL');

  // Filter entries according to caller's allowed node boundary
  const scopedEntries = useMemo(() => {
    return dataEntries.filter(entry => {
      // If user has allowedOrgIds restriction, respect it
      if (currentUser?.allowedOrgIds && currentUser.allowedOrgIds.length > 0) {
        return currentUser.allowedOrgIds.includes(entry.organisationId);
      }
      return true;
    });
  }, [dataEntries, currentUser]);

  const reviewQueue = useMemo(() => {
    return scopedEntries.map(entry => {
      const indicator = INDICATORS.find(i => i.id === entry.indicatorId);
      const org = ORGANISATIONS.find(o => o.id === entry.organisationId);
      return { ...entry, indicator, organisation: org };
    });
  }, [scopedEntries]);

  // Determine which entries require action from current user's role
  const isActionableForMe = (status: EntryStatus): boolean => {
    if (currentRole === 'SYS_ADMIN' || currentRole === 'ADMIN') return true;
    if (status === 'SUBMITTED' && currentRole === 'PROJECT_MANAGER') return true;
    if (status === 'PROJECT_APPROVED' && currentRole === 'BU_COORDINATOR') return true;
    if (status === 'BU_APPROVED' && currentRole === 'SUB_ESG_MANAGER') return true;
    if (status === 'SUBSIDIARY_APPROVED' && currentRole === 'GROUP_ESG_HEAD') return true;
    if (status === 'GROUP_APPROVED' && currentRole === 'BOARD_APPROVER') return true;
    return false;
  };

  const actionableCount = reviewQueue.filter(e => isActionableForMe(e.status)).length;

  const filteredQueue = useMemo(() => {
    switch (selectedTab) {
      case 'ACTIONABLE':
        return reviewQueue.filter(e => isActionableForMe(e.status));
      case 'APPROVED':
        return reviewQueue.filter(e => ['PROJECT_APPROVED', 'BU_APPROVED', 'SUBSIDIARY_APPROVED', 'GROUP_APPROVED', 'APPROVED'].includes(e.status));
      case 'REJECTED':
        return reviewQueue.filter(e => e.status === 'REJECTED');
      case 'LOCKED':
        return reviewQueue.filter(e => e.status === 'LOCKED');
      default:
        return reviewQueue;
    }
  }, [reviewQueue, selectedTab, currentRole]);

  // Load approval trail whenever an entry is opened
  useEffect(() => {
    if (!selectedEntryForReview) {
      setApprovalHistory([]);
      return;
    }

    setIsLoadingHistory(true);
    fetch(`/api/v1/entries/${selectedEntryForReview.id}/approvals`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.approvals) {
          setApprovalHistory(data.approvals);
        } else {
          setApprovalHistory([]);
        }
      })
      .catch(() => setApprovalHistory([]))
      .finally(() => setIsLoadingHistory(false));
  }, [selectedEntryForReview, token]);

  const getNextApprovalRole = (status: EntryStatus): { role: string; label: string; action: string } => {
    switch (status) {
      case 'SUBMITTED':
        return { role: 'PROJECT_MANAGER', label: 'Project Manager', action: 'Approve as Project Manager' };
      case 'PROJECT_APPROVED':
        return { role: 'BU_COORDINATOR', label: 'BU Coordinator', action: 'Approve as BU Coordinator' };
      case 'BU_APPROVED':
        return { role: 'SUB_ESG_MANAGER', label: 'Subsidiary ESG Manager', action: 'Approve as Sub ESG Manager' };
      case 'SUBSIDIARY_APPROVED':
        return { role: 'GROUP_ESG_HEAD', label: 'Group ESG Head (CSO)', action: 'Approve as Group CSO' };
      case 'GROUP_APPROVED':
        return { role: 'BOARD_APPROVER', label: 'Board Approver', action: 'Sign Off as Board Approver (Lock Metric)' };
      default:
        return { role: 'SYS_ADMIN', label: 'System Administrator', action: 'Approve Metric' };
    }
  };

  const handleApprove = async () => {
    if (!selectedEntryForReview) return;
    const next = getNextApprovalRole(selectedEntryForReview.status);
    const comment = reviewComments.trim() || `Approved by ${currentUser?.fullName || currentRole} for ${next.label} tier.`;

    await approveDataEntry(selectedEntryForReview.id, comment);
    setSelectedEntryForReview(null);
    setReviewComments('');
    setCommentError(null);
    showToast(`Metric successfully advanced to next statutory tier!`);
  };

  const handleReject = async () => {
    if (!selectedEntryForReview) return;
    if (!reviewComments || reviewComments.trim().length < 5) {
      setCommentError('Mandatory feedback comment (min 5 characters) is required explaining why this metric is returned for correction.');
      return;
    }

    await rejectDataEntry(selectedEntryForReview.id, reviewComments.trim());
    setSelectedEntryForReview(null);
    setReviewComments('');
    setCommentError(null);
    showToast(`Metric returned for correction with feedback logged in statutory audit ledger.`);
  };

  const handleUnlock = async () => {
    if (!selectedEntryForReview) return;
    if (!unlockReason || unlockReason.trim().length < 10) {
      setUnlockError('Mandatory audit justification reason (minimum 10 characters) is required to unlock.');
      return;
    }

    await unlockDataEntry(selectedEntryForReview.id, unlockReason.trim());
    setIsUnlockModalOpen(false);
    setSelectedEntryForReview(null);
    setUnlockReason('');
    setUnlockError(null);
    showToast(`Metric unlocked to DRAFT by Governance Administrator. Action stamped in audit log.`);
  };

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  const canCurrentUserUnlock = currentRole === 'SYS_ADMIN' || currentRole === 'ADMIN' || currentRole === 'GROUP_ESG_HEAD';

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header */}
      <div className="border-b border-[#E8E8E8] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-1">
            <span className="text-[#1A2A6C]">STATUTORY 5-TIER ASSURANCE QUEUE</span>
            <span>•</span>
            <span className="text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 border border-emerald-200">
              ROLE: {currentRole}
            </span>
            <span>•</span>
            <span className="text-[#EF272E] font-bold">{selectedPeriod.financialYear}</span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#1A2A6C] tracking-tight leading-tight">
            Review &amp; Approval Governance Center
          </h1>
          <p className="text-[14px] text-[#444444] mt-1 max-w-3xl leading-relaxed">
            Validate submitted unit metrics, verify supporting invoices, and authorize progressive bottom-up consolidation (Project → BU → Subsidiary → Group → Board Lock).
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="px-3 py-1.5 bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] text-xs font-bold flex items-center space-x-1.5 rounded-[2px]">
            <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
            <span>{actionableCount} Actionable For Your Role</span>
          </span>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] text-xs font-bold flex items-center space-x-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E8E8E8] pb-2 text-xs">
        <button
          onClick={() => setSelectedTab('ALL')}
          className={`px-3 py-1.5 font-bold rounded-[2px] transition-colors ${selectedTab === 'ALL' ? 'bg-[#1A2A6C] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All Scope Entries ({reviewQueue.length})
        </button>
        <button
          onClick={() => setSelectedTab('ACTIONABLE')}
          className={`px-3 py-1.5 font-bold rounded-[2px] transition-colors flex items-center space-x-1.5 ${selectedTab === 'ACTIONABLE' ? 'bg-[#2563eb] text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'}`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Pending My Approval ({actionableCount})</span>
        </button>
        <button
          onClick={() => setSelectedTab('APPROVED')}
          className={`px-3 py-1.5 font-bold rounded-[2px] transition-colors ${selectedTab === 'APPROVED' ? 'bg-[#16a34a] text-white' : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'}`}
        >
          Approved Tiers
        </button>
        <button
          onClick={() => setSelectedTab('REJECTED')}
          className={`px-3 py-1.5 font-bold rounded-[2px] transition-colors ${selectedTab === 'REJECTED' ? 'bg-[#EF272E] text-white' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'}`}
        >
          Returned / Correction Needed
        </button>
        <button
          onClick={() => setSelectedTab('LOCKED')}
          className={`px-3 py-1.5 font-bold rounded-[2px] transition-colors ${selectedTab === 'LOCKED' ? 'bg-slate-900 text-amber-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          🔒 Board Locked
        </button>
      </div>

      {/* Review Queue Table */}
      <div className="bg-white border border-[#E8E8E8] shadow-sm overflow-hidden rounded-[2px]">
        <div className="p-3.5 border-b border-[#E8E8E8] bg-[#fafafa] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#1A2A6C]" />
            <h3 className="text-xs font-bold text-[#1A2A6C] uppercase tracking-wider">Metrics Verification Queue</h3>
          </div>
          <span className="text-xs text-[#666666] font-medium">{filteredQueue.length} Indicators Listed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A2A6C] text-white font-bold">
              <tr>
                <th className="py-2.5 px-3">Reporting Entity</th>
                <th className="py-2.5 px-3">Indicator Code &amp; Topic</th>
                <th className="py-2.5 px-3">Reported Quantity</th>
                <th className="py-2.5 px-3">Statutory Evidence</th>
                <th className="py-2.5 px-3">Approval Workflow Status</th>
                <th className="py-2.5 px-3">Assigned Approver Tier</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8]">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#888888] italic">
                    No metric submissions found matching this filter criteria.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((entry) => {
                  const actionable = isActionableForMe(entry.status);
                  const nextTier = getNextApprovalRole(entry.status);

                  return (
                    <tr key={entry.id} className={`hover:bg-[#fafafa] transition-colors ${actionable ? 'bg-blue-50/30' : ''}`}>
                      <td className="py-3 px-3 font-bold text-[#1A2A6C]">
                        <div className="flex items-center space-x-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#888888] shrink-0" />
                          <span>{entry.organisation?.name || entry.organisationId}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-bold text-[#1A2A6C] block">{entry.indicator?.code || 'IND'}</span>
                        <span className="text-[#555555] truncate max-w-[220px] block">{entry.indicator?.name || 'Indicator'}</span>
                      </td>

                      <td className="py-3 px-3 font-bold text-[#1A2A6C]">
                        {entry.numericValue !== undefined ? Number(entry.numericValue).toLocaleString() : '—'} {entry.unit}
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#1A2A6C] bg-[#E8E8E8] px-2 py-0.5 border border-[#d1d5db]">
                          <FileText className="w-3 h-3 text-[#1A2A6C]" />
                          <span>{entry.evidenceFiles?.length || entry.evidenceCount || 0} Docs Attached</span>
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <StatusBadge status={entry.status} size="sm" />
                      </td>

                      <td className="py-3 px-3">
                        {entry.status === 'LOCKED' ? (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                            🔒 Completed &amp; Locked
                          </span>
                        ) : entry.status === 'REJECTED' ? (
                          <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 border border-red-200">
                            Returned to Site
                          </span>
                        ) : (
                          <span className={`text-[11px] font-bold px-2 py-0.5 border ${actionable ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                            {nextTier.label}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedEntryForReview(entry);
                            setCommentError(null);
                            setReviewComments('');
                          }}
                          className={`px-3 py-1.5 font-bold text-xs transition-colors rounded-[2px] ${actionable ? 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-sm' : 'bg-[#1A2A6C] hover:bg-[#EF272E] text-white'}`}
                        >
                          {actionable ? 'Review & Sign' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Review & Sign-Off Modal */}
      {selectedEntryForReview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full p-6 border-2 border-[#1A2A6C] space-y-5 max-h-[90vh] overflow-y-auto rounded-[2px] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold bg-[#1A2A6C] text-white px-2 py-0.5 uppercase">
                    {selectedEntryForReview.indicator?.code || 'METRIC'}
                  </span>
                  <StatusBadge status={selectedEntryForReview.status} size="sm" />
                </div>
                <h3 className="text-lg font-bold text-[#1A2A6C] mt-1">
                  {selectedEntryForReview.indicator?.name || 'Indicator Review'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEntryForReview(null)}
                className="text-[#666666] hover:text-[#EF272E] p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Comparison Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#fafafa] border border-[#E8E8E8]">
                <span className="text-[10px] text-[#888888] font-bold uppercase block">Reported Metric Value</span>
                <span className="text-lg font-bold text-[#1A2A6C] mt-1 block">
                  {selectedEntryForReview.numericValue !== undefined ? Number(selectedEntryForReview.numericValue).toLocaleString() : '—'} {selectedEntryForReview.unit}
                </span>
              </div>

              <div className="p-3 bg-[#fafafa] border border-[#E8E8E8]">
                <span className="text-[10px] text-[#888888] font-bold uppercase block">Reporting Entity</span>
                <span className="font-bold text-[#333333] mt-1 block truncate">
                  {selectedEntryForReview.organisation?.name}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">[{selectedEntryForReview.organisationId}]</span>
              </div>

              <div className="p-3 bg-[#fafafa] border border-[#E8E8E8]">
                <span className="text-[10px] text-[#888888] font-bold uppercase block">Reporting Period</span>
                <span className="font-bold text-[#333333] mt-1 block">
                  {selectedPeriod.financialYear}
                </span>
              </div>
            </div>

            {/* Rejection comment notification if returned */}
            {selectedEntryForReview.rejectionComment && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs rounded-[2px]">
                <span className="font-bold text-red-800 block flex items-center space-x-1 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>Latest Rejection Feedback from Approver:</span>
                </span>
                <p className="text-red-700 italic">"{selectedEntryForReview.rejectionComment}"</p>
              </div>
            )}

            {/* Site Engineer Notes */}
            <div className="p-3 bg-[#fafafa] border border-[#E8E8E8] text-xs space-y-1">
              <span className="font-bold text-[#1A2A6C] block">Site Engineer Methodology &amp; Meter Notes:</span>
              <p className="text-[#444444]">
                {selectedEntryForReview.remarks || 'Standard telematics and calibrated fuel receipts attached.'}
              </p>
            </div>

            {/* Attached Proof Documents */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#1A2A6C] block uppercase tracking-wider">
                Attached Statutory Evidence ({selectedEntryForReview.evidenceFiles?.length || 0})
              </span>
              <div className="space-y-1.5">
                {selectedEntryForReview.evidenceFiles && selectedEntryForReview.evidenceFiles.length > 0 ? (
                  selectedEntryForReview.evidenceFiles.map((ev) => (
                    <div key={ev.id} className="p-2.5 bg-[#fafafa] border border-[#E8E8E8] flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-[#1A2A6C]" />
                        <div>
                          <strong className="text-[#333333] block">{ev.fileName}</strong>
                          <span className="text-[10px] text-[#888888]">{ev.description || 'Verified source document'}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]">
                        Verified
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#888888] italic">No evidence document attached to this entry.</p>
                )}
              </div>
            </div>

            {/* Statutory Multi-Tier Audit Trail / Timeline */}
            <div className="p-3 bg-slate-50 border border-slate-200 text-xs space-y-2 rounded-[2px]">
              <span className="font-bold text-[#1A2A6C] flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
                <HistoryIcon className="w-3.5 h-3.5 text-[#1A2A6C]" />
                <span>Statutory Approval History Trail</span>
              </span>

              {isLoadingHistory ? (
                <div className="text-gray-500 text-xs italic">Loading audit trail...</div>
              ) : approvalHistory.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {approvalHistory.map((h: any, idx: number) => (
                    <div key={h.id || idx} className="flex items-start space-x-2 text-[11px] pb-1.5 border-b border-gray-200 last:border-b-0">
                      <span className="px-1.5 py-0.5 font-bold uppercase rounded text-[9px] bg-slate-200 text-slate-800 shrink-0">
                        {h.level || 'REVIEW'}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{h.action} by {h.byName || h.by}</span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {h.at ? new Date(h.at).toLocaleDateString() : ''}
                          </span>
                        </div>
                        {h.comment && <p className="text-gray-600 italic mt-0.5">"{h.comment}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-[11px] italic">No prior approvals recorded yet. Entry is awaiting Tier 1 review.</p>
              )}
            </div>

            {/* Justification Comments Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#333333]">
                Approver / Auditor Feedback Comments (Mandatory for rejection, logged to audit ledger)
              </label>
              <textarea
                rows={2}
                value={reviewComments}
                onChange={(e) => {
                  setReviewComments(e.target.value);
                  if (commentError) setCommentError(null);
                }}
                placeholder="Enter justification or return correction instructions..."
                className={`w-full bg-white border p-2 text-xs text-[#333333] focus:outline-none focus:border-[#1A2A6C] ${commentError ? 'border-red-500 bg-red-50/20' : 'border-[#d1d5db]'}`}
              />
              {commentError && (
                <p className="text-[11px] text-red-600 font-bold flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>{commentError}</span>
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E8E8E8]">
              {/* Governance Unlock Option */}
              {canCurrentUserUnlock && ['PROJECT_APPROVED', 'BU_APPROVED', 'SUBSIDIARY_APPROVED', 'GROUP_APPROVED', 'LOCKED'].includes(selectedEntryForReview.status) && (
                <button
                  type="button"
                  onClick={() => setIsUnlockModalOpen(true)}
                  className="px-3 py-2 bg-amber-50 border border-amber-400 text-amber-800 hover:bg-amber-100 text-xs font-bold flex items-center space-x-1.5 rounded-[2px]"
                >
                  <Unlock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Unlock Metric</span>
                </button>
              )}

              <div className="flex items-center space-x-2 ml-auto">
                {/* Return for correction / Reject */}
                {selectedEntryForReview.status !== 'LOCKED' && (
                  <button
                    type="button"
                    onClick={handleReject}
                    className="px-4 py-2 bg-white border border-[#EF272E] text-[#EF272E] hover:bg-[#EF272E] hover:text-white text-xs font-bold transition-colors flex items-center space-x-1.5 rounded-[2px]"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Return for Correction</span>
                  </button>
                )}

                {/* Approve button */}
                {selectedEntryForReview.status !== 'LOCKED' && (
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="px-5 py-2 bg-[#1A2A6C] hover:bg-[#2563eb] text-white text-xs font-bold transition-colors flex items-center space-x-1.5 rounded-[2px] shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{getNextApprovalRole(selectedEntryForReview.status).action}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Governance Unlock Reason Modal */}
      {isUnlockModalOpen && selectedEntryForReview && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 border-2 border-amber-600 space-y-4 rounded-[2px] shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="text-base font-bold text-amber-800 flex items-center space-x-2">
                <Unlock className="w-5 h-5 text-amber-600" />
                <span>Statutory Governance Unlock</span>
              </h3>
              <button onClick={() => setIsUnlockModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed">
              Unlocking will reset this metric to <strong>DRAFT</strong> status, allowing the Site Engineer to edit and re-upload supporting documentation. A mandatory audit reason is required for SEBI statutory traceability.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800">
                Statutory Justification Reason (Minimum 10 characters)
              </label>
              <textarea
                rows={3}
                value={unlockReason}
                onChange={(e) => {
                  setUnlockReason(e.target.value);
                  if (unlockError) setUnlockError(null);
                }}
                placeholder="e.g. Recalibration certificate received from HPCL, reopening for revised entry."
                className={`w-full bg-white border p-2 text-xs text-gray-800 focus:outline-none focus:border-amber-600 ${unlockError ? 'border-red-500 bg-red-50/20' : 'border-gray-300'}`}
              />
              {unlockError && (
                <p className="text-[11px] text-red-600 font-bold">{unlockError}</p>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsUnlockModalOpen(false)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-[2px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUnlock}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-1.5 rounded-[2px]"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Confirm Unlock &amp; Reopen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

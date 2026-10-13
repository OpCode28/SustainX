import React from 'react';
import { EntryStatus } from '../../types';

interface StatusBadgeProps {
  status: EntryStatus | 'OPEN' | 'CLOSED' | 'HEALTHY' | 'NEEDS_ATTENTION' | 'CRITICAL' | 'VERIFIED' | 'PENDING' | 'FLAGGED' | 'ON_TRACK';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  let badgeStyle = 'bg-[#E8E8E8] text-[#333333] border-[#d1d5db]';
  let dotColor = 'bg-[#666666]';
  let label: string = status;

  switch (status) {
    case 'PROJECT_APPROVED':
      badgeStyle = 'bg-blue-50 text-blue-800 border-blue-200';
      dotColor = 'bg-blue-600';
      label = 'Project Approved';
      break;

    case 'BU_APPROVED':
      badgeStyle = 'bg-indigo-50 text-indigo-800 border-indigo-200';
      dotColor = 'bg-indigo-600';
      label = 'BU Approved';
      break;

    case 'SUBSIDIARY_APPROVED':
      badgeStyle = 'bg-teal-50 text-teal-800 border-teal-200';
      dotColor = 'bg-teal-600';
      label = 'Sub Approved';
      break;

    case 'GROUP_APPROVED':
      badgeStyle = 'bg-purple-50 text-purple-800 border-purple-200';
      dotColor = 'bg-purple-600';
      label = 'Group Approved';
      break;

    case 'LOCKED':
      badgeStyle = 'bg-slate-900 text-amber-300 border-amber-400';
      dotColor = 'bg-amber-400';
      label = '🔒 Locked & Signed';
      break;

    case 'APPROVED':
    case 'HEALTHY':
    case 'VERIFIED':
    case 'ON_TRACK':
      badgeStyle = 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]';
      dotColor = 'bg-[#16a34a]';
      label = status === 'APPROVED' ? 'Approved' : status === 'HEALTHY' ? 'Healthy' : status === 'ON_TRACK' ? 'On Track' : 'Verified';
      break;

    case 'SUBMITTED':
    case 'UNDER_REVIEW':
    case 'PENDING':
    case 'OPEN':
      badgeStyle = 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]';
      dotColor = 'bg-[#d97706]';
      label = status === 'SUBMITTED' ? 'Submitted' : status === 'UNDER_REVIEW' ? 'Under Review' : status === 'OPEN' ? 'Open' : 'Pending';
      break;

    case 'REJECTED':
    case 'NEEDS_ATTENTION':
    case 'CRITICAL':
    case 'FLAGGED':
      badgeStyle = 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]';
      dotColor = 'bg-[#EF272E]';
      label = status === 'REJECTED' ? 'Correction Req.' : status === 'NEEDS_ATTENTION' ? 'Needs Attention' : status === 'FLAGGED' ? 'Flagged' : 'Critical';
      break;

    case 'DRAFT':
    case 'CLOSED':
      badgeStyle = 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]';
      dotColor = 'bg-[#9ca3af]';
      label = status === 'DRAFT' ? 'Draft' : 'Closed';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold rounded-[3px] border ${badgeStyle} ${sizeClasses} uppercase tracking-wider`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
};

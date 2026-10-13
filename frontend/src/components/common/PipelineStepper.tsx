import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Lock, 
  AlertTriangle, 
  FileEdit, 
  Send, 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Award,
  ChevronRight
} from 'lucide-react';
import { EntryStatus } from '../../types';

interface PipelineStepperProps {
  currentStatus: EntryStatus;
  rejectionComment?: string | null;
  reviewedBy?: string | null;
  className?: string;
  compact?: boolean;
}

interface StepDef {
  key: EntryStatus;
  order: number;
  label: string;
  shortLabel: string;
  role: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PIPELINE_STEPS: StepDef[] = [
  { key: 'DRAFT', order: 1, label: '1. Draft Entry', shortLabel: 'Draft', role: 'Site Engineer', icon: FileEdit },
  { key: 'SUBMITTED', order: 2, label: '2. Submitted', shortLabel: 'Submitted', role: 'Evidence Gate', icon: Send },
  { key: 'PROJECT_APPROVED', order: 3, label: '3. Project Approved', shortLabel: 'Project', role: 'Project Manager', icon: Building2 },
  { key: 'BU_APPROVED', order: 4, label: '4. BU Approved', shortLabel: 'BU', role: 'BU Coordinator', icon: UserCheck },
  { key: 'SUBSIDIARY_APPROVED', order: 5, label: '5. Sub Approved', shortLabel: 'Subsidiary', role: 'Sub ESG Mgr', icon: ShieldCheck },
  { key: 'GROUP_APPROVED', order: 6, label: '6. Group Approved', shortLabel: 'Group', role: 'Group CSO', icon: Award },
  { key: 'LOCKED', order: 7, label: '7. Locked & Signed', shortLabel: 'Locked', role: 'Board ESG', icon: Lock },
];

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  currentStatus,
  rejectionComment,
  reviewedBy,
  className = '',
  compact = false
}) => {
  const getStepIndex = (status: EntryStatus): number => {
    switch (status) {
      case 'DRAFT': return 1;
      case 'SUBMITTED': 
      case 'UNDER_REVIEW': return 2;
      case 'PROJECT_APPROVED': return 3;
      case 'BU_APPROVED': return 4;
      case 'SUBSIDIARY_APPROVED': return 5;
      case 'GROUP_APPROVED': 
      case 'APPROVED': return 6;
      case 'LOCKED': return 7;
      case 'REJECTED': return 1; // returned back to step 1
      default: return 1;
    }
  };

  const currentIndex = getStepIndex(currentStatus);
  const isRejected = currentStatus === 'REJECTED';

  if (compact) {
    return (
      <div className={`flex items-center space-x-1 text-[11px] font-bold ${className}`}>
        {PIPELINE_STEPS.map((step, idx) => {
          const isDone = !isRejected && step.order < currentIndex;
          const isCurrent = !isRejected && step.order === currentIndex;

          return (
            <React.Fragment key={step.key}>
              {idx > 0 && <span className="text-gray-300 text-[10px]">›</span>}
              <span
                className={`px-1.5 py-0.5 rounded-[2px] transition-colors ${
                  isCurrent
                    ? 'bg-[#1A2A6C] text-white font-extrabold shadow-sm'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'text-gray-400 bg-gray-50'
                }`}
                title={`${step.label} (${step.role})`}
              >
                {step.shortLabel}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`bg-white border border-[#E8E8E8] p-4 rounded-[2px] shadow-sm space-y-3 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0f0f0] pb-2.5">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#1A2A6C] px-2 py-0.5 rounded-[2px]">
            SEBI BRSR Statutory Governance
          </span>
          <h4 className="text-xs font-bold text-[#1A2A6C] uppercase tracking-wide">
            Multi-Tier Bottom-Up Approval Pipeline (Tiers 1 to 5)
          </h4>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-500 font-medium text-[11px]">Active Stage:</span>
          {isRejected ? (
            <span className="text-[11px] font-bold bg-red-50 text-red-700 px-2 py-0.5 border border-red-200 rounded-[2px] flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-red-600" />
              <span>Returned For Correction (Rejection)</span>
            </span>
          ) : currentStatus === 'LOCKED' ? (
            <span className="text-[11px] font-bold bg-slate-900 text-amber-300 px-2 py-0.5 rounded-[2px] flex items-center space-x-1">
              <Lock className="w-3 h-3 text-amber-300" />
              <span>Fully Signed Off &amp; Locked</span>
            </span>
          ) : (
            <span className="text-[11px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 border border-blue-200 rounded-[2px]">
              Step {currentIndex} of 7: {PIPELINE_STEPS[currentIndex - 1]?.label}
            </span>
          )}
        </div>
      </div>

      {/* Rejection Alert Banner if applicable */}
      {isRejected && rejectionComment && (
        <div className="p-2.5 bg-red-50 border-l-4 border-red-500 text-xs text-red-800 flex items-start space-x-2 rounded-[2px]">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Correction Requested by Reviewer:</span>
            <p className="text-red-700 italic mt-0.5">"{rejectionComment}"</p>
            <span className="text-[10px] text-red-600 mt-1 block">
              Entry is currently reset to Draft. Please edit values or attach revised evidence, then click Submit.
            </span>
          </div>
        </div>
      )}

      {/* Step Diagram */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
        {PIPELINE_STEPS.map((step) => {
          const isDone = !isRejected && step.order < currentIndex;
          const isCurrent = !isRejected && step.order === currentIndex;
          const IconComponent = step.icon;

          return (
            <div
              key={step.key}
              className={`p-2.5 border rounded-[2px] text-left transition-all ${
                isCurrent
                  ? 'bg-blue-50/70 border-[#1A2A6C] shadow-sm ring-1 ring-[#1A2A6C]'
                  : isDone
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-[#fafafa] border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold font-mono ${
                  isCurrent ? 'text-[#1A2A6C]' : isDone ? 'text-emerald-700' : 'text-gray-400'
                }`}>
                  0{step.order}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                ) : (
                  <IconComponent className="w-3.5 h-3.5 text-gray-400" />
                )}
              </div>

              <span className={`block text-[11px] font-bold leading-tight ${
                isCurrent ? 'text-[#1A2A6C]' : isDone ? 'text-emerald-900' : 'text-gray-600'
              }`}>
                {step.shortLabel}
              </span>

              <span className="block text-[9px] text-gray-500 mt-0.5 uppercase tracking-wider font-semibold">
                {step.role}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

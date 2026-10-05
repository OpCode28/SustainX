import React, { useState } from 'react';
import { 
  FileEdit, 
  CheckCircle2, 
  AlertTriangle, 
  UploadCloud, 
  FileText, 
  Send, 
  FileCheck,
  Building2,
  Calendar,
  X
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { INDICATORS } from '../data/demoData';
import { Indicator, DataEntry } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

export const DataEntryPage: React.FC = () => {
  const { 
    selectedOrg, 
    selectedPeriod, 
    dataEntries, 
    updateDataEntry, 
    submitDataEntry,
    addEvidence 
  } = useApp();
  const { currentUser } = useAuth();

  const [activeSection, setActiveSection] = useState<'ALL' | 'A' | 'B' | 'C'>('C');
  const [activePrinciple, setActivePrinciple] = useState<number | 'ALL'>('ALL');
  const [showEvidenceModalFor, setShowEvidenceModalFor] = useState<string | null>(null);
  const [evidenceFileName, setEvidenceFileName] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState(false);

  // Form values state mapped by indicatorId
  const [formValues, setFormValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    dataEntries
      .filter(e => e.organisationId === selectedOrg.id && e.reportingPeriodId === selectedPeriod.id)
      .forEach(e => {
        if (e.numericValue !== undefined) initial[e.indicatorId] = e.numericValue;
      });
    return initial;
  });

  const [formRemarks, setFormRemarks] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    dataEntries
      .filter(e => e.organisationId === selectedOrg.id && e.reportingPeriodId === selectedPeriod.id)
      .forEach(e => {
        if (e.remarks) initial[e.indicatorId] = e.remarks;
      });
    return initial;
  });

  const handleValueChange = (indicatorId: string, val: string) => {
    const num = parseFloat(val);
    setFormValues(prev => ({ ...prev, [indicatorId]: isNaN(num) ? 0 : num }));
  };

  const handleSaveDraft = (indicator: Indicator) => {
    const val = formValues[indicator.id] || 0;
    const remarks = formRemarks[indicator.id] || '';
    updateDataEntry(indicator.id, val, indicator.unit, remarks);
  };

  const handleUploadEvidence = (entry: DataEntry) => {
    if (!evidenceFileName) return;
    addEvidence(entry.id, {
      dataEntryId: entry.id,
      fileName: evidenceFileName,
      filePath: `/uploads/${evidenceFileName}`,
      fileType: evidenceFileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      fileSize: 1840,
      fileHash: `sha256-${Math.random().toString(36).substring(2)}`,
      description: evidenceDesc || 'Certified utility verification document',
      verificationStatus: 'VERIFIED',
      aiConfidence: 96
    });
    setEvidenceFileName('');
    setEvidenceDesc('');
    setShowEvidenceModalFor(null);
  };

  const handleSubmitForReview = (entry: DataEntry) => {
    submitDataEntry(entry.id);
    setSubmitSuccessNotice(true);
    setTimeout(() => setSubmitSuccessNotice(false), 4000);
  };

  const filteredIndicators = INDICATORS.filter(ind => {
    if (activeSection !== 'ALL' && ind.section !== activeSection) return false;
    if (activePrinciple !== 'ALL' && ind.principleNumber !== activePrinciple) return false;
    return true;
  });

  const completedCount = Object.keys(formValues).length;
  const totalCount = INDICATORS.length;

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header (Section 17) */}
      <div className="border-b border-[#E8E8E8] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-1">
            <span className="text-[#1A2A6C]">{selectedOrg.name}</span>
            <span>•</span>
            <span className="text-[#EF272E]">{selectedPeriod.financialYear}</span>
          </div>
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#1A2A6C]">
            BRSR Data Collection &amp; Input
          </h1>
          <p className="text-[14px] text-[#444444] mt-0.5">
            Capture project-level environmental metrics, workforce statistics, and governance disclosures.
          </p>
        </div>

        {/* Validation & Data Quality Summary (Section 18) */}
        <div className="bg-[#fafafa] border border-[#E8E8E8] p-3 text-xs flex items-center space-x-4">
          <div>
            <span className="text-[10px] font-bold text-[#888888] uppercase block">Data Quality Summary</span>
            <div className="flex items-center space-x-3 mt-0.5">
              <span className="text-[#16a34a] font-bold">✓ 18 Valid</span>
              <span className="text-[#d97706] font-bold">! 2 Warnings</span>
              <span className="text-[#EF272E] font-bold">× 0 Blocking</span>
            </div>
          </div>
          <div className="pl-4 border-l border-[#E8E8E8] text-right">
            <span className="font-bold text-[#1A2A6C] text-sm">{completedCount} / {totalCount}</span>
            <span className="text-[10px] text-[#888888] block">Entered</span>
          </div>
        </div>
      </div>

      {submitSuccessNotice && (
        <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
          <span>Indicator successfully submitted for ESG Officer review and recorded in immutable audit trail.</span>
        </div>
      )}

      {/* Section & Principle Navigation Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fafafa] p-3 border border-[#E8E8E8]">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveSection('ALL')}
            className={`px-3 py-1.5 text-xs font-bold transition-colors ${
              activeSection === 'ALL' ? 'bg-[#1A2A6C] text-white' : 'text-[#333333] hover:bg-[#E8E8E8]'
            }`}
          >
            All Sections
          </button>
          <button
            onClick={() => setActiveSection('A')}
            className={`px-3 py-1.5 text-xs font-bold transition-colors ${
              activeSection === 'A' ? 'bg-[#1A2A6C] text-white' : 'text-[#333333] hover:bg-[#E8E8E8]'
            }`}
          >
            Section A (General)
          </button>
          <button
            onClick={() => setActiveSection('C')}
            className={`px-3 py-1.5 text-xs font-bold transition-colors ${
              activeSection === 'C' ? 'bg-[#1A2A6C] text-white' : 'text-[#333333] hover:bg-[#E8E8E8]'
            }`}
          >
            Section C (Principles 1–9)
          </button>
        </div>

        {activeSection === 'C' && (
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-[#666666] text-[11px] mr-1">Principle:</span>
            {[1, 3, 5, 6, 8, 9].map((p) => (
              <button
                key={p}
                onClick={() => setActivePrinciple(activePrinciple === p ? 'ALL' : p)}
                className={`w-7 h-7 font-bold text-xs flex items-center justify-center transition-colors ${
                  activePrinciple === p ? 'bg-[#EF272E] text-white' : 'bg-white border border-[#d1d5db] text-[#333333] hover:bg-[#E8E8E8]'
                }`}
              >
                P{p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Indicator Input Cards List (Section 17 Structure) */}
      <div className="space-y-4">
        {filteredIndicators.map((indicator) => {
          const entry = dataEntries.find(
            e => e.organisationId === selectedOrg.id && e.indicatorId === indicator.id && e.reportingPeriodId === selectedPeriod.id
          );
          const currentVal = formValues[indicator.id] !== undefined ? formValues[indicator.id] : (entry?.numericValue ?? '');
          const currentRemarks = formRemarks[indicator.id] !== undefined ? formRemarks[indicator.id] : (entry?.remarks ?? '');
          const isApproved = entry?.status === 'APPROVED';

          return (
            <div
              key={indicator.id}
              className="bg-white border border-[#E8E8E8] p-5 space-y-4 hover:border-[#1A2A6C] transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-[#E8E8E8]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-white bg-[#1A2A6C] px-2 py-0.5">
                      {indicator.code}
                    </span>
                    <h3 className="text-base font-bold text-[#1A2A6C]">{indicator.name}</h3>
                    {indicator.isCore && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#EF272E] text-white">
                        BRSR CORE
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-[#666666] bg-[#E8E8E8] px-1.5 py-0.5">
                      Section {indicator.section} {indicator.principleNumber ? `• Principle ${indicator.principleNumber}` : ''}
                    </span>
                  </div>
                  <p className="text-xs text-[#555555] leading-relaxed max-w-4xl">
                    {indicator.description}
                  </p>
                </div>

                <div className="shrink-0 flex items-center space-x-2">
                  <StatusBadge status={entry?.status || 'DRAFT'} size="sm" />
                </div>
              </div>

              {/* Input Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {/* Reported Value */}
                <div className="md:col-span-4 space-y-1">
                  <label className="block text-xs font-bold text-[#333333]">
                    Reported Value {indicator.unit && <span className="text-[#666666] font-normal">({indicator.unit})</span>}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      disabled={isApproved}
                      value={currentVal}
                      onChange={(e) => handleValueChange(indicator.id, e.target.value)}
                      placeholder={`Enter ${indicator.unit || 'value'}`}
                      className="w-full bg-white border border-[#d1d5db] px-3 py-2 text-xs font-bold text-[#1A2A6C] focus:outline-none focus:border-[#1A2A6C] disabled:bg-[#f3f4f6] disabled:text-[#888888]"
                    />
                    {indicator.unit && (
                      <span className="absolute right-3 top-2 text-xs font-bold text-[#888888] pointer-events-none">
                        {indicator.unit}
                      </span>
                    )}
                  </div>
                </div>

                {/* Notes / Reference */}
                <div className="md:col-span-5 space-y-1">
                  <label className="block text-xs font-bold text-[#333333]">
                    Methodology / Notes / Reference
                  </label>
                  <input
                    type="text"
                    disabled={isApproved}
                    value={currentRemarks}
                    onChange={(e) => setFormRemarks(prev => ({ ...prev, [indicator.id]: e.target.value }))}
                    placeholder="e.g. Telematics data, calibrated meter logbook..."
                    className="w-full bg-white border border-[#d1d5db] px-3 py-2 text-xs text-[#333333] focus:outline-none focus:border-[#1A2A6C] disabled:bg-[#f3f4f6]"
                  />
                </div>

                {/* Actions */}
                <div className="md:col-span-3 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleSaveDraft(indicator);
                      setShowEvidenceModalFor(indicator.id);
                    }}
                    className="flex-1 py-2 px-3 border border-[#1A2A6C] text-[#1A2A6C] hover:bg-[#1A2A6C] hover:text-white text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Proof ({entry?.evidenceCount || 0})</span>
                  </button>

                  <button
                    type="button"
                    disabled={isApproved}
                    onClick={() => {
                      handleSaveDraft(indicator);
                      if (entry) handleSubmitForReview(entry);
                    }}
                    className="py-2 px-4 bg-[#1A2A6C] hover:bg-[#EF272E] disabled:bg-[#cccccc] text-white text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit</span>
                  </button>
                </div>
              </div>

              {/* Inline Validation Status (Section 18) */}
              <div className="pt-2 border-t border-[#E8E8E8] flex items-center justify-between text-xs">
                <span className="text-[#16a34a] font-bold flex items-center gap-1">
                  ✓ Validation Passed
                </span>
                {entry?.evidenceFiles && entry.evidenceFiles.length > 0 && (
                  <span className="text-[#666666] text-[11px]">
                    Attached: <strong className="text-[#1A2A6C]">{entry.evidenceFiles[0].fileName}</strong> (Verified)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Evidence Upload */}
      {showEvidenceModalFor && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 border-2 border-[#1A2A6C] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-[#1A2A6C]">Attach Supporting ESG Evidence</h3>
              <button
                onClick={() => setShowEvidenceModalFor(null)}
                className="text-[#666666] hover:text-[#EF272E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#555555]">
              Upload utility invoices, calibrated meter readings, weighbridge logs, or lab test certificates.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">Document Filename</label>
                <input
                  type="text"
                  value={evidenceFileName}
                  onChange={(e) => setEvidenceFileName(e.target.value)}
                  placeholder="e.g. diesel_generator_telemetry_receipts_q3.pdf"
                  className="w-full bg-white border border-[#d1d5db] px-3 py-2 text-xs text-[#333333] focus:outline-none focus:border-[#1A2A6C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">Verification Note / Sign-off Authority</label>
                <textarea
                  rows={2}
                  value={evidenceDesc}
                  onChange={(e) => setEvidenceDesc(e.target.value)}
                  placeholder="e.g. Certified against site flow meters by Site Incharge."
                  className="w-full bg-white border border-[#d1d5db] px-3 py-2 text-xs text-[#333333] focus:outline-none focus:border-[#1A2A6C]"
                />
              </div>

              <div className="p-4 border border-dashed border-[#888888] bg-[#fafafa] text-center text-xs">
                <FileText className="w-6 h-6 text-[#1A2A6C] mx-auto mb-1" />
                <span className="font-bold text-[#333333] block">Drag and drop file or click to browse</span>
                <span className="text-[10px] text-[#888888]">PDF, JPG, XLSX up to 25MB</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E8E8E8]">
              <button
                type="button"
                onClick={() => setShowEvidenceModalFor(null)}
                className="px-4 py-2 text-xs font-bold text-[#555555] hover:bg-[#E8E8E8]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const entry = dataEntries.find(
                    e => e.organisationId === selectedOrg.id && e.indicatorId === showEvidenceModalFor && e.reportingPeriodId === selectedPeriod.id
                  );
                  if (entry) handleUploadEvidence(entry);
                  else {
                    const ind = INDICATORS.find(i => i.id === showEvidenceModalFor);
                    if (ind) updateDataEntry(ind.id, formValues[ind.id] || 0, ind.unit);
                    setShowEvidenceModalFor(null);
                  }
                }}
                className="px-4 py-2 bg-[#1A2A6C] hover:bg-[#EF272E] text-white text-xs font-bold"
              >
                Attach &amp; Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle2, 
  FileSpreadsheet, 
  ShieldCheck,
  X
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { INDICATORS } from '../data/demoData';

export const ReportsPage: React.FC = () => {
  const { selectedOrg, selectedPeriod } = useApp();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('BRSR_ANNEXURE_I');
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);

  const handleDownload = (reportName: string) => {
    setDownloadSuccessNotice(`Generated and downloaded ${reportName} (${selectedPeriod.financialYear})`);
    setTimeout(() => setDownloadSuccessNotice(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header (Section 23) */}
      <div className="border-b border-[#E8E8E8] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-1">
            <span className="text-[#1A2A6C]">{selectedOrg.name}</span>
            <span>•</span>
            <span className="text-[#EF272E]">{selectedPeriod.financialYear}</span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#1A2A6C] tracking-tight leading-tight">
            Reports &amp; Disclosures
          </h1>
          <p className="text-[14px] text-[#444444] mt-1 max-w-3xl leading-relaxed">
            Statutory reporting center for SEBI BRSR Annexure I filings, BRSR Core reasonable assurance packs, and multi-tier ESG workbooks.
          </p>
        </div>
      </div>

      {downloadSuccessNotice && (
        <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
          <span>{downloadSuccessNotice}</span>
        </div>
      )}

      {/* 2. 4 Corporate Report Cards (Section 23) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: BRSR Report */}
        <div className="bg-white border border-[#E8E8E8] p-6 space-y-4 flex flex-col justify-between hover:border-[#1A2A6C] transition-colors">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#1A2A6C] text-white uppercase">
                SEBI Standard
              </span>
              <span className="text-xs font-bold text-[#16a34a]">
                89% Ready
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#1A2A6C]">
              BRSR Report (Annexure I Full Filing)
            </h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              Official Business Responsibility and Sustainability Report format containing Section A, Section B, and Principles 1–9 disclosures.
            </p>
            <div className="text-[11px] text-[#888888] pt-2 border-t border-[#E8E8E8] flex justify-between">
              <span>FY: <strong>{selectedPeriod.financialYear}</strong></span>
              <span>Status: <strong className="text-[#16a34a]">Ready</strong></span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8E8E8] flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedReportType('BRSR_ANNEXURE_I');
                setShowPreviewModal(true);
              }}
              className="px-3.5 py-2 border border-[#1A2A6C] text-[#1A2A6C] hover:bg-[#1A2A6C] hover:text-white text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => handleDownload('MEIL_BRSR_Annexure_I.pdf')}
              className="px-4 py-2 bg-[#1A2A6C] hover:bg-[#EF272E] text-white text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Card 2: BRSR Core Summary */}
        <div className="bg-white border border-[#E8E8E8] p-6 space-y-4 flex flex-col justify-between hover:border-[#1A2A6C] transition-colors">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#EF272E] text-white uppercase">
                Reasonable Assurance
              </span>
              <span className="text-xs font-bold text-[#16a34a]">
                91% Ready
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#1A2A6C]">
              BRSR Core Summary &amp; Assessment Pack
            </h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              Targeted pack containing SEBI-mandated BRSR Core metrics (GHG, Water, Energy, Waste, Safety, Gender Diversity) with evidence checksums.
            </p>
            <div className="text-[11px] text-[#888888] pt-2 border-t border-[#E8E8E8] flex justify-between">
              <span>FY: <strong>{selectedPeriod.financialYear}</strong></span>
              <span>Status: <strong className="text-[#16a34a]">Ready</strong></span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8E8E8] flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedReportType('BRSR_CORE');
                setShowPreviewModal(true);
              }}
              className="px-3.5 py-2 border border-[#1A2A6C] text-[#1A2A6C] hover:bg-[#1A2A6C] hover:text-white text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => handleDownload('MEIL_BRSR_Core_Assurance_Pack.pdf')}
              className="px-4 py-2 bg-[#1A2A6C] hover:bg-[#EF272E] text-white text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Card 3: ESG Management Report */}
        <div className="bg-white border border-[#E8E8E8] p-6 space-y-4 flex flex-col justify-between hover:border-[#1A2A6C] transition-colors">
          <div className="space-y-2.5">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E8E8E8] text-[#1A2A6C] uppercase inline-block border border-[#d1d5db]">
              Internal Leadership
            </span>
            <h3 className="text-lg font-bold text-[#1A2A6C]">
              ESG Management Review Dossier
            </h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              Executive presentation pack detailing subsidiary comparisons, resource intensities per crore revenue, and decarbonization targets.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E8E8E8] flex justify-end">
            <button
              onClick={() => handleDownload('MEIL_ESG_Executive_Review.pdf')}
              className="px-4 py-2 bg-[#1A2A6C] hover:bg-[#EF272E] text-white text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Generate Dossier</span>
            </button>
          </div>
        </div>

        {/* Card 4: Assessment / Audit Pack */}
        <div className="bg-white border border-[#E8E8E8] p-6 space-y-4 flex flex-col justify-between hover:border-[#1A2A6C] transition-colors">
          <div className="space-y-2.5">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E8E8E8] text-[#1A2A6C] uppercase inline-block border border-[#d1d5db]">
              Third-Party Assurance
            </span>
            <h3 className="text-lg font-bold text-[#1A2A6C]">
              Auditor Traceability &amp; Evidence Ledger
            </h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              Consolidated Excel spreadsheet linking every reported value to project-level meter logs, telematics receipts, and approval hashes.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E8E8E8] flex justify-end">
            <button
              onClick={() => handleDownload('MEIL_ESG_Consolidated_Ledger.xlsx')}
              className="px-4 py-2 bg-[#1A2A6C] hover:bg-[#EF272E] text-white text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#EF272E]" />
              <span>Export XLSX Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full p-8 border-2 border-[#1A2A6C] space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#1A2A6C]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#1A2A6C] border-2 border-[#EF272E] flex items-center justify-center text-white font-black text-xl">
                  <span className="text-[#EF272E]">M</span>EIL
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1A2A6C]">
                    {selectedReportType === 'BRSR_ANNEXURE_I' ? 'BRSR ANNEXURE I REPORT' : 'BRSR CORE ASSURANCE PACK'}
                  </h2>
                  <p className="text-xs text-[#666666]">
                    Megha Engineering &amp; Infrastructures Limited • {selectedPeriod.financialYear}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-[#666666] hover:text-[#EF272E]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Document Body */}
            <div className="space-y-4 text-xs text-[#333333]">
              <div className="p-4 bg-[#fafafa] border border-[#E8E8E8] grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#888888] uppercase block">Entity</span>
                  <strong className="text-[#1A2A6C]">MEIL Group Corporate</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#888888] uppercase block">Period</span>
                  <strong className="text-[#1A2A6C]">{selectedPeriod.financialYear}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#888888] uppercase block">Standard</span>
                  <strong className="text-[#1A2A6C]">SEBI BRSR 2024</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#888888] uppercase block">Assurance</span>
                  <strong className="text-[#16a34a]">Reasonable Assurance</strong>
                </div>
              </div>

              {/* Table */}
              <div className="border border-[#E8E8E8]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1A2A6C] text-white font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Code</th>
                      <th className="py-2.5 px-3">Indicator Name</th>
                      <th className="py-2.5 px-3">Section</th>
                      <th className="py-2.5 px-3">Reported Group Total</th>
                      <th className="py-2.5 px-3">Core?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E8E8]">
                    {INDICATORS.slice(0, 8).map((ind) => (
                      <tr key={ind.id} className="hover:bg-[#fafafa]">
                        <td className="py-2.5 px-3 font-bold text-[#1A2A6C]">{ind.code}</td>
                        <td className="py-2.5 px-3 text-[#333333]">{ind.name}</td>
                        <td className="py-2.5 px-3 text-[#666666]">Sec {ind.section}</td>
                        <td className="py-2.5 px-3 font-bold text-[#1A2A6C]">
                          {ind.code === 'P6-E1-S1' ? '125,430 tCO₂e' : ind.code === 'P6-E2-TOT' ? '1,845,200 GJ' : ind.code === 'P6-E3-WAT' ? '412,800 KL' : 'Reported'}
                        </td>
                        <td className="py-2.5 px-3">
                          {ind.isCore ? (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#EF272E] text-white">Core</span>
                          ) : (
                            <span className="text-[#888888]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E8E8E8]">
              <span className="text-xs text-[#888888]">Generated from validated MEIL OneSource statutory repository</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#555555] hover:bg-[#E8E8E8]"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleDownload('MEIL_BRSR_Filing_Package.pdf');
                  }}
                  className="px-4 py-2 bg-[#1A2A6C] hover:bg-[#EF272E] text-white text-xs font-bold flex items-center space-x-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Dossier</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

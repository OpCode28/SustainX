import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Search, 
  ShieldCheck, 
  X
} from 'lucide-react';
import { INDICATORS } from '../data/demoData';
import { Indicator } from '../types';

export const IndicatorsRegistryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [onlyCore, setOnlyCore] = useState(false);
  const [inspectedIndicator, setInspectedIndicator] = useState<Indicator | null>(null);

  const filtered = INDICATORS.filter(ind => {
    if (selectedCategory !== 'ALL' && ind.categoryCode !== selectedCategory) return false;
    if (selectedSection !== 'ALL' && ind.section !== selectedSection) return false;
    if (onlyCore && !ind.isCore) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return ind.code.toLowerCase().includes(term) || ind.name.toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-[#E8E8E8] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-1">
            <span className="text-[#1A2A6C]">INDICATOR METADATA ENGINE</span>
            <span>•</span>
            <span className="text-[#EF272E]">DYNAMIC BRSR REGISTRY</span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#1A2A6C] tracking-tight leading-tight">
            BRSR Indicator Registry
          </h1>
          <p className="text-[14px] text-[#444444] mt-1 max-w-3xl leading-relaxed">
            Centralized registry of SEBI-mandated BRSR indicators, units, aggregation formulas, and validation constraints.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 bg-[#E8E8E8] text-[#1A2A6C] border border-[#d1d5db] text-xs font-bold">
            {INDICATORS.length} Configured Indicators
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fafafa] p-3 border border-[#E8E8E8]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#888888] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search indicator code or title..."
            className="w-full bg-white border border-[#d1d5db] pl-9 pr-3 py-1.5 text-xs text-[#333333] focus:outline-none focus:border-[#1A2A6C]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-[#d1d5db] px-2.5 py-1.5 font-bold text-[#1A2A6C] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Pillars (E, S, G)</option>
            <option value="ENVIRONMENT">Environmental</option>
            <option value="SOCIAL">Social</option>
            <option value="GOVERNANCE">Governance</option>
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="bg-white border border-[#d1d5db] px-2.5 py-1.5 font-bold text-[#1A2A6C] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Sections</option>
            <option value="A">Section A (General)</option>
            <option value="C">Section C (Principles)</option>
          </select>

          <label className="flex items-center space-x-1.5 font-bold text-[#1A2A6C] ml-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyCore}
              onChange={(e) => setOnlyCore(e.target.checked)}
              className="accent-[#1A2A6C]"
            />
            <span>BRSR Core Only</span>
          </label>
        </div>
      </div>

      {/* Table (Section 27) */}
      <div className="bg-white border border-[#E8E8E8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A2A6C] text-white font-bold">
              <tr>
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Indicator Name</th>
                <th className="py-2.5 px-3">Section / Pillar</th>
                <th className="py-2.5 px-3">Data Type &amp; Unit</th>
                <th className="py-2.5 px-3">Core?</th>
                <th className="py-2.5 px-3">Proof Req.?</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8]">
              {filtered.map((ind) => (
                <tr key={ind.id} className="hover:bg-[#fafafa]">
                  <td className="py-3 px-3 font-bold text-[#1A2A6C]">
                    {ind.code}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#333333]">
                    <span className="truncate max-w-sm block">{ind.name}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#E8E8E8] text-[#333333] border border-[#d1d5db]">
                      Sec {ind.section} {ind.principleNumber ? `• P${ind.principleNumber}` : ''}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#555555]">
                    {ind.dataType} {ind.unit ? `(${ind.unit})` : ''}
                  </td>
                  <td className="py-3 px-3">
                    {ind.isCore ? (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#EF272E] text-white">
                        BRSR Core
                      </span>
                    ) : (
                      <span className="text-[#888888]">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {ind.requiresEvidence ? (
                      <span className="text-[#16a34a] font-bold">Mandatory</span>
                    ) : (
                      <span className="text-[#888888]">Optional</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setInspectedIndicator(ind)}
                      className="px-2.5 py-1 bg-[#1A2A6C] hover:bg-[#EF272E] text-white font-bold transition-colors text-xs"
                    >
                      Config
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspector Modal */}
      {inspectedIndicator && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full p-6 border-2 border-[#1A2A6C] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div>
                <span className="text-xs font-bold text-[#1A2A6C] block">
                  {inspectedIndicator.code}
                </span>
                <h3 className="text-base font-bold text-[#1A2A6C] mt-0.5">{inspectedIndicator.name}</h3>
              </div>
              <button
                onClick={() => setInspectedIndicator(null)}
                className="text-[#666666] hover:text-[#EF272E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#fafafa] border border-[#E8E8E8]">
                <span className="text-[#888888] font-bold uppercase block text-[10px]">Regulatory Description</span>
                <p className="text-[#333333] mt-0.5 leading-relaxed">{inspectedIndicator.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#fafafa] border border-[#E8E8E8]">
                  <span className="text-[#888888] font-bold uppercase block text-[10px]">Aggregation Formula</span>
                  <span className="font-bold text-[#1A2A6C] mt-1 block">{inspectedIndicator.aggregationType}</span>
                </div>
                <div className="p-3 bg-[#fafafa] border border-[#E8E8E8]">
                  <span className="text-[#888888] font-bold uppercase block text-[10px]">Validation Constraints</span>
                  <pre className="font-mono text-[11px] text-[#444444] mt-1">
                    {JSON.stringify(inspectedIndicator.validationRule || { min: 0 }, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E8E8E8]">
              <button
                onClick={() => setInspectedIndicator(null)}
                className="px-4 py-2 bg-[#1A2A6C] text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

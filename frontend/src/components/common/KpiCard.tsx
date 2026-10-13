import React, { useState } from 'react';
import { LucideIcon, Info, HelpCircle } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number; // positive or negative percent
    isPositiveGood?: boolean;
    label?: string;
  };
  badgeText?: string;
  formulaTooltip?: {
    title: string;
    mandate?: string;
    formula: string;
    explanation?: string;
    breakdown?: { label: string; score: string; detail?: string }[];
  };
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  trend,
  badgeText,
  formulaTooltip,
  onClick
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-[4px] border border-[#E8E8E8] p-5 transition-colors ${
        onClick ? 'cursor-pointer hover:border-[#1A2A6C] hover:bg-[#fafafa]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <p className="text-[11px] font-bold tracking-wider text-[#666666] uppercase">
              {title}
            </p>
            {formulaTooltip && (
              <div 
                className="relative inline-block"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(!showTooltip);
                }}
              >
                <button
                  type="button"
                  aria-label="View calculation formula"
                  className="text-[#888888] hover:text-[#1A2A6C] transition-colors p-0.5"
                >
                  <Info className="w-3.5 h-3.5 text-[#1A2A6C]" />
                </button>

                {showTooltip && (
                  <div 
                    className="absolute left-0 bottom-full mb-2 w-72 sm:w-80 bg-[#1A2A6C] text-white text-xs rounded-[4px] p-3 shadow-xl z-50 border border-white/20 text-left cursor-default pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="font-bold text-[12px] text-white border-b border-white/20 pb-1.5 mb-1.5 flex items-center justify-between">
                      <span>{formulaTooltip.title}</span>
                      <span className="text-[10px] text-[#38bdf8] font-mono">SEBI FORMULA</span>
                    </div>

                    {formulaTooltip.mandate && (
                      <p className="text-[10px] text-[#C6CBE6] mb-1.5 leading-snug">
                        <strong>Mandate:</strong> {formulaTooltip.mandate}
                      </p>
                    )}

                    <div className="bg-[#121c4a] p-2 rounded-[2px] font-mono text-[10px] text-[#38bdf8] border border-white/10 mb-2 whitespace-normal break-words">
                      {formulaTooltip.formula}
                    </div>

                    {formulaTooltip.explanation && (
                      <p className="text-[11px] text-[#e2e8f0] mb-2 leading-relaxed">
                        {formulaTooltip.explanation}
                      </p>
                    )}

                    {formulaTooltip.breakdown && formulaTooltip.breakdown.length > 0 && (
                      <div className="space-y-1 pt-1.5 border-t border-white/20 text-[10px]">
                        {formulaTooltip.breakdown.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-0.5 border-b border-white/10 last:border-0">
                            <span className="text-[#C6CBE6]">{item.label}</span>
                            <span className="font-bold text-white ml-2">{item.score}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-2xl font-bold tracking-tight text-[#1A2A6C]">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && (
              <span className="text-xs font-semibold text-[#666666]">
                {unit}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className="p-2 rounded-[3px] bg-[#E8E8E8] text-[#1A2A6C]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#E8E8E8] flex items-center justify-between text-xs">
        {trend ? (
          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={`font-bold ${
                trend.value < 0 
                  ? (trend.isPositiveGood === false ? 'text-[#16a34a]' : 'text-[#EF272E]') 
                  : (trend.isPositiveGood === false ? 'text-[#EF272E]' : 'text-[#16a34a]')
              }`}
            >
              {trend.value > 0 ? `↑ +${trend.value}%` : `↓ ${trend.value}%`}
            </span>
            <span className="text-[#666666]">{trend.label || 'YoY'}</span>
          </div>
        ) : subtitle ? (
          <span className="text-[#666666] text-[11px]">{subtitle}</span>
        ) : (
          <span className="text-[#888888] text-[11px]">BRSR Verified</span>
        )}

        {badgeText && (
          <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase bg-[#E8E8E8] text-[#1A2A6C] border border-[#d1d5db]">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

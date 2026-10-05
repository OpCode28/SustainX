import React from 'react';
import { LucideIcon } from 'lucide-react';

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
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[4px] border border-[#E8E8E8] p-5 transition-colors ${
        onClick ? 'cursor-pointer hover:border-[#1A2A6C] hover:bg-[#fafafa]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold tracking-wider text-[#666666] uppercase">
            {title}
          </p>
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

import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  color?: 'navy' | 'red' | 'neutral';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  sublabel,
  size = 'md',
  showPercentage = true,
  color = 'navy'
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }[size];

  const barColor = {
    navy: 'bg-[#1A2A6C]',
    red: 'bg-[#EF272E]',
    neutral: 'bg-[#333333]'
  }[color];

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1 text-xs">
          <div>
            {label && <span className="font-bold text-[#333333]">{label}</span>}
            {sublabel && <span className="text-[#666666] ml-1.5">{sublabel}</span>}
          </div>
          {showPercentage && (
            <span className="font-bold text-[#1A2A6C]">{clampedValue}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-[#E8E8E8] rounded-[2px] overflow-hidden border border-[#d1d5db] ${heightClass}`}>
        <div
          className={`h-full rounded-[1px] transition-all duration-300 ${barColor}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

import React from 'react';

export const CorporateHeroBanner: React.FC = () => {
  return (
    <div className="w-full bg-[#1A2A6C] overflow-hidden relative">
      <div className="w-full h-[360px] sm:h-[460px] md:h-[540px] relative">
        <img
          src="/water_dam.jpg"
          alt="MEIL Multi-Stage Lift Irrigation & Hydro Dam Project"
          className="w-full h-full object-cover object-center block"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="text-white space-y-1">
              <span className="bg-[#EF272E] text-white text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider inline-block">
                Engineering Marvel • Lift Irrigation &amp; Hydro Dam
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                Kaleshwaram Multistage Lift Irrigation &amp; Reservoir System
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl drop-shadow">
                MEIL OneSource: Central Source for ESG and BRSR Reporting Ease across all 250+ project sites.
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-xs p-3 rounded-[3px] border border-white/40 shadow-lg text-[#1A2A6C] shrink-0 hidden md:block">
              <div className="text-xs font-bold uppercase tracking-wider text-[#EF272E]">World Record EPC</div>
              <div className="text-lg font-black">2,500+ MW &amp; 3 TMC/Day</div>
              <div className="text-[10px] text-slate-600">Zero-Discharge Environmental Standard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

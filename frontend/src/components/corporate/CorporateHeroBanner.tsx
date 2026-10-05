import React from 'react';

export const CorporateHeroBanner: React.FC = () => {
  return (
    <div className="w-full bg-black overflow-hidden">
      {/* Single full-width industrial/factory photograph, no text overlay, no carousel */}
      <div className="w-full h-[360px] sm:h-[460px] md:h-[540px] relative">
        <img
          src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=2000&q=85"
          alt="MEIL Heavy Infrastructure and Industrial Engineering Project"
          className="w-full h-full object-cover object-center block"
          loading="eager"
        />
      </div>
    </div>
  );
};

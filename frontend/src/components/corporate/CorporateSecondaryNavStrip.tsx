import React from 'react';

export const CorporateSecondaryNavStrip: React.FC = () => {
  const segments = [
    { title: 'About Us', href: '#about', bg: 'bg-[#1A2A6C]', hoverBg: 'hover:bg-[#121c4a]' },
    { title: 'Latest News', href: '#news', bg: 'bg-[#EF272E]', hoverBg: 'hover:bg-[#cc1e24]' },
    { title: 'Business Units', href: '#verticals', bg: 'bg-[#1A2A6C]', hoverBg: 'hover:bg-[#121c4a]' },
    { title: 'Success Stories', href: '#stories', bg: 'bg-[#EF272E]', hoverBg: 'hover:bg-[#cc1e24]' },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 w-full">
        {segments.map((segment, index) => (
          <a
            key={index}
            href={segment.href}
            className={`${segment.bg} ${segment.hoverBg} text-white font-bold text-center py-3.5 px-4 text-[14px] sm:text-[15px] transition-colors border-r border-white/20 last:border-r-0 flex items-center justify-center`}
          >
            <span>{segment.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

import React from 'react';

export const CorporateContentSection: React.FC = () => {
  return (
    <section id="about" className="bg-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Editorial Text (Left/Primary Column) */}
          <div className="lg:col-span-8 space-y-5">
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#1A2A6C] leading-snug">
              Pioneering Nation-Building Infrastructure and Industrial Engineering
            </h1>

            <div className="space-y-4 text-[14px] sm:text-[15px] text-[#444444] leading-[1.7]">
              <p>
                Megha Engineering &amp; Infrastructures Limited (MEIL) is a diversified infrastructure conglomerate headquartered in Hyderabad, India. Founded in 1989, MEIL has grown into one of the country&apos;s foremost engineering, procurement, and construction (EPC) institutions, delivering complex mega-projects across water management, lift irrigation, transport, renewable energy, hydrocarbons, and urban modernization.
              </p>

              <p>
                With operations spanning 18 Indian states and global footprints across Europe, the Middle East, and South America through subsidiaries including DRILLMEC, Petreven, and Olectra Greentech, MEIL combines indigenous heavy fabrication with state-of-the-art global technology. From the world&apos;s largest multi-stage lift irrigation system at Kaleshwaram to high-speed railway tunneling and electric mobility fleets, MEIL drives engineering solutions that empower communities and accelerate economic progress.
              </p>
            </div>

            {/* Supporting Photo — Flat layout, no cards, no shadows, no rounded corners */}
            <div className="pt-4">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=80"
                alt="MEIL Heavy Industrial Engineering Operations and Fabrication"
                className="w-full h-[280px] sm:h-[360px] object-cover object-center block border border-[#E8E8E8]"
                loading="lazy"
              />
            </div>
          </div>

          {/* More Verticals Style List Block (Right Column) */}
          <div id="verticals" className="lg:col-span-4">
            <div className="bg-[#E8E8E8] p-6 border border-[#d8d8d8]">
              <h2 className="text-[20px] font-bold text-[#1A2A6C] mb-4 pb-2 border-b border-[#cccccc]">
                More Verticals
              </h2>

              <ul className="space-y-2.5 text-[14px] text-[#333333]">
                <li>
                  <a href="#water" className="hover:text-[#EF272E] flex items-start transition-colors">
                    <span className="text-[#EF272E] font-bold mr-2">→</span>
                    <span>Water Management &amp; Lift Irrigation</span>
                  </a>
                </li>
                <li>
                  <a href="#highways" className="hover:text-[#EF272E] flex items-start transition-colors">
                    <span className="text-[#EF272E] font-bold mr-2">→</span>
                    <span>Highways, Roads &amp; Bridges</span>
                  </a>
                </li>
                <li>
                  <a href="#energy" className="hover:text-[#EF272E] flex items-start transition-colors">
                    <span className="text-[#EF272E] font-bold mr-2">→</span>
                    <span>Renewable &amp; Clean Energy (Solar &amp; Wind)</span>
                  </a>
                </li>
                <li>
                  <a href="#power" className="hover:text-[#EF272E] flex items-start transition-colors">
                    <span className="text-[#EF272E] font-bold mr-2">→</span>
                    <span>Power Transmission &amp; Substations</span>
                  </a>
                </li>
                <li>
                  <a href="#hydrocarbons" className="hover:text-[#EF272E] flex items-start transition-colors">
                    <span className="text-[#EF272E] font-bold mr-2">→</span>
                    <span>Hydrocarbons, Rigs &amp; City Gas (DRILLMEC)</span>
                  </a>
                </li>
                <li>
                  <a href="#mobility" className="hover:text-[#EF272E] flex items-start transition-colors">
                    <span className="text-[#EF272E] font-bold mr-2">→</span>
                    <span>Electric Mobility &amp; Pure Electric Buses (Olectra)</span>
                  </a>
                </li>
                <li>
                  <a href="#tunnels" className="hover:text-[#EF272E] flex items-start transition-colors">
                    <span className="text-[#EF272E] font-bold mr-2">→</span>
                    <span>Railways, Metros &amp; Underground Tunneling</span>
                  </a>
                </li>
                <li>
                  <a href="#manufacturing" className="hover:text-[#EF272E] flex items-start transition-colors">
                    <span className="text-[#EF272E] font-bold mr-2">→</span>
                    <span>Defense Equipment &amp; Telecom Infra</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick ESG & Sustainability Callout in MEIL Style */}
            <div className="mt-6 p-5 border border-[#1A2A6C] bg-white text-[#333333]">
              <h3 className="text-[17px] font-bold text-[#1A2A6C] mb-2">
                ESG &amp; Sustainability Portal
              </h3>
              <p className="text-[13px] text-[#444444] leading-[1.6] mb-3">
                Access official SEBI BRSR Core disclosures, carbon emission registries, and project-level traceability across all 250+ project sites.
              </p>
              <a
                href="/dashboard"
                className="inline-block bg-[#1A2A6C] hover:bg-[#EF272E] text-white font-bold text-[13px] px-4 py-2 transition-colors"
              >
                Launch BRSR Reporting System →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

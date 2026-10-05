import React from 'react';
import { CorporateTopUtilityBar } from '../components/corporate/CorporateTopUtilityBar';
import { CorporateHeader } from '../components/corporate/CorporateHeader';
import { CorporateSecondaryNavStrip } from '../components/corporate/CorporateSecondaryNavStrip';
import { CorporateHeroBanner } from '../components/corporate/CorporateHeroBanner';
import { CorporateContentSection } from '../components/corporate/CorporateContentSection';
import { CorporateFooter } from '../components/corporate/CorporateFooter';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const CorporateHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-[#333333] font-sans flex flex-col">
      {/* 1. Top utility bar */}
      <CorporateTopUtilityBar />

      {/* 2. Main header */}
      <CorporateHeader />

      {/* 3. Secondary nav strip */}
      <CorporateSecondaryNavStrip />

      {/* 4. Hero banner */}
      <CorporateHeroBanner />

      {/* 5. Main content section + More Verticals list block */}
      <main className="flex-1">
        <CorporateContentSection />

        {/* Additional MEIL Corporate Section: Key Landmark Projects */}
        <section id="projects" className="bg-[#E8E8E8] py-10 sm:py-14 border-t border-b border-[#d8d8d8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-[24px] sm:text-[26px] font-bold text-[#1A2A6C] mb-6 pb-2 border-b-2 border-[#1A2A6C] inline-block">
              Landmark Engineering Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Project 1 */}
              <div className="bg-white border border-[#cccccc]">
                <img
                  src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80"
                  alt="Kaleshwaram Lift Irrigation Project"
                  className="w-full h-48 object-cover block border-b border-[#E8E8E8]"
                />
                <div className="p-5">
                  <h3 className="text-[17px] font-bold text-[#1A2A6C] mb-2">
                    Kaleshwaram Lift Irrigation Scheme
                  </h3>
                  <p className="text-[14px] text-[#444444] leading-[1.6]">
                    World&apos;s largest multi-stage lift irrigation project on the Godavari River, featuring Asia&apos;s most powerful surge pools and underground pump houses.
                  </p>
                </div>
              </div>

              {/* Project 2 */}
              <div className="bg-white border border-[#cccccc]">
                <img
                  src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80"
                  alt="Solar & Clean Energy Parks"
                  className="w-full h-48 object-cover block border-b border-[#E8E8E8]"
                />
                <div className="p-5">
                  <h3 className="text-[17px] font-bold text-[#1A2A6C] mb-2">
                    Clean Energy &amp; Solar Parks
                  </h3>
                  <p className="text-[14px] text-[#444444] leading-[1.6]">
                    Over 2,500 MW of utility-scale solar photovoltaic parks, wind turbine grids, and 765 kV green energy evacuation substations across Western and Southern India.
                  </p>
                </div>
              </div>

              {/* Project 3 */}
              <div className="bg-white border border-[#cccccc]">
                <img
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
                  alt="Olectra Electric Mobility Fleet"
                  className="w-full h-48 object-cover block border-b border-[#E8E8E8]"
                />
                <div className="p-5">
                  <h3 className="text-[17px] font-bold text-[#1A2A6C] mb-2">
                    Olectra Pure Electric Mobility
                  </h3>
                  <p className="text-[14px] text-[#444444] leading-[1.6]">
                    Pioneering India&apos;s zero-emission public transport with over 10,000 commercial electric buses deployed across Mumbai, Pune, Hyderabad, and Delhi NCR.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRSR / ESG Compliance Banner Strip */}
        <section className="bg-white py-10 border-b border-[#E8E8E8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-[#1A2A6C] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-[#EF272E]">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#EF272E]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C6CBE6]">
                    Regulatory Transparency &amp; Governance
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  MEIL ESG &amp; BRSR Online Reporting Portal
                </h3>
                <p className="text-sm text-[#C6CBE6] max-w-2xl leading-relaxed">
                  Explore corporate sustainability disclosures, carbon accounting, water intensity indicators, and audit-grade project traceability conforming to SEBI BRSR 2024 standards.
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <Link
                  to="/dashboard"
                  className="bg-[#EF272E] hover:bg-white hover:text-[#EF272E] text-white font-bold text-[14px] px-5 py-2.5 transition-colors flex items-center space-x-2"
                >
                  <span>Enter Reporting Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <CorporateFooter />
    </div>
  );
};

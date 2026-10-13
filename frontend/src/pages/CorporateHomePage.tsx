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
              {/* Project 1: Dam & Lift Irrigation */}
              <div className="bg-white border border-[#cccccc] shadow-sm hover:shadow-md transition-shadow">
                <img
                  src="/water_dam.jpg"
                  alt="Kaleshwaram Multistage Lift Irrigation and Dam"
                  className="w-full h-48 object-cover block border-b border-[#E8E8E8]"
                />
                <div className="p-5">
                  <div className="text-[11px] font-bold text-[#EF272E] uppercase tracking-wider mb-1">
                    Water Resources &amp; Dam Engineering
                  </div>
                  <h3 className="text-[17px] font-bold text-[#1A2A6C] mb-2">
                    Kaleshwaram Lift Irrigation &amp; Dam Scheme
                  </h3>
                  <p className="text-[14px] text-[#444444] leading-[1.6]">
                    World&apos;s largest multi-stage lift irrigation and reservoir project on the Godavari River, featuring Asia&apos;s most powerful surge pools and underground pump houses.
                  </p>
                </div>
              </div>

              {/* Project 2: Clean Energy & Canal Network */}
              <div className="bg-white border border-[#cccccc] shadow-sm hover:shadow-md transition-shadow">
                <img
                  src="/solar_canal.jpg"
                  alt="Solar & Clean Energy Parks with Irrigation Canal Network"
                  className="w-full h-48 object-cover block border-b border-[#E8E8E8]"
                />
                <div className="p-5">
                  <div className="text-[11px] font-bold text-[#16a34a] uppercase tracking-wider mb-1">
                    Clean Energy &amp; Water Distribution
                  </div>
                  <h3 className="text-[17px] font-bold text-[#1A2A6C] mb-2">
                    Clean Energy &amp; Solar Canal Grids
                  </h3>
                  <p className="text-[14px] text-[#444444] leading-[1.6]">
                    Over 2,500 MW of utility-scale solar photovoltaic parks, wind turbine grids, and sustainable canal water networks feeding agrarian transformation across India.
                  </p>
                </div>
              </div>

              {/* Project 3: Heavy Construction & Metro Tunneling */}
              <div className="bg-white border border-[#cccccc] shadow-sm hover:shadow-md transition-shadow">
                <img
                  src="/construction.jpg"
                  alt="Heavy Construction, Elevated Metro Viaduct & Tunnel Boring"
                  className="w-full h-48 object-cover block border-b border-[#E8E8E8]"
                />
                <div className="p-5">
                  <div className="text-[11px] font-bold text-[#1A2A6C] uppercase tracking-wider mb-1">
                    Heavy Civil &amp; Underground Transit
                  </div>
                  <h3 className="text-[17px] font-bold text-[#1A2A6C] mb-2">
                    Metro Viaducts, Highways &amp; Tunnels
                  </h3>
                  <p className="text-[14px] text-[#444444] leading-[1.6]">
                    State-of-the-art elevated metro rail viaducts, mountain tunnel boring, multi-lane expressways, and urban transit engineering executed with strict statutory ESG controls.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRSR / ESG Compliance Banner Strip: MEIL OneSource */}
        <section className="bg-white py-10 border-b border-[#E8E8E8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-[#1A2A6C] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-[#EF272E] shadow-sm">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#EF272E]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C6CBE6]">
                    Statutory Corporate ESG &amp; Assurance Directorate
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                  <span>MEIL OneSource</span>
                  <span className="text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-400/40 px-2 py-0.5 rounded-[2px]">SEBI BRSR 2024</span>
                </h3>
                <p className="text-sm text-[#EF272E] font-semibold">
                  Central Source for ESG and BRSR Reporting Ease
                </p>
                <p className="text-sm text-[#C6CBE6] max-w-2xl leading-relaxed">
                  Automated multi-tier rollups across 250+ project sites, rigid tamper-evident audit trails, and certified Reasonable Assurance indicators conforming to SEBI guidelines.
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <Link
                  to="/dashboard"
                  className="bg-[#EF272E] hover:bg-white hover:text-[#EF272E] text-white font-bold text-[14px] px-5 py-2.5 transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <span>Enter MEIL OneSource</span>
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

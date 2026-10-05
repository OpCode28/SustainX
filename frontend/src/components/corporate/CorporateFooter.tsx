import React from 'react';
import { Link } from 'react-router-dom';

const XIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
  </svg>
);

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const CorporateFooter: React.FC = () => {
  return (
    <footer className="bg-[#1A2A6C] text-white pt-12 pb-8 border-t-4 border-[#EF272E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Section: Logo, Centered Social Icons, Outlined CTA Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8">
          {/* Logo Top-Left */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-white border-2 border-[#EF272E] flex items-center justify-center text-[#1A2A6C] font-black text-xl">
              <span className="text-[#EF272E] mr-0.5">M</span>EIL
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight block">MEIL</span>
              <span className="text-[11px] text-[#C6CBE6] block">
                Megha Engineering &amp; Infrastructures Ltd.
              </span>
            </div>
          </div>

          {/* Social Icons Centered */}
          <div className="flex items-center space-x-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-none border border-white/30 flex items-center justify-center text-white hover:bg-[#EF272E] hover:border-[#EF272E] transition-colors"
              title="X"
            >
              <XIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-none border border-white/30 flex items-center justify-center text-white hover:bg-[#EF272E] hover:border-[#EF272E] transition-colors"
              title="LinkedIn"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-none border border-white/30 flex items-center justify-center text-white hover:bg-[#EF272E] hover:border-[#EF272E] transition-colors"
              title="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-none border border-white/30 flex items-center justify-center text-white hover:bg-[#EF272E] hover:border-[#EF272E] transition-colors"
              title="Facebook"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-none border border-white/30 flex items-center justify-center text-white hover:bg-[#EF272E] hover:border-[#EF272E] transition-colors"
              title="YouTube"
            >
              <YoutubeIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Two Outlined White CTA Buttons Top-Right */}
          <div className="flex items-center space-x-3">
            <a
              href="#careers"
              className="border border-white hover:bg-white hover:text-[#1A2A6C] text-white text-[13px] font-bold px-4 py-2 transition-colors inline-block"
            >
              Careers
            </a>
            <a
              href="#contact"
              className="border border-white hover:bg-white hover:text-[#1A2A6C] text-white text-[13px] font-bold px-4 py-2 transition-colors inline-block"
            >
              Contact Us
            </a>
            <Link
              to="/dashboard"
              className="bg-[#EF272E] hover:bg-white hover:text-[#EF272E] text-white border border-[#EF272E] text-[13px] font-bold px-4 py-2 transition-colors inline-block"
            >
              BRSR Portal
            </Link>
          </div>
        </div>

        {/* Thin Divider Line */}
        <div className="border-t border-white/20 my-6" />

        {/* 4-Column Plain-Text Link List */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-[13px] pt-2">
          {/* Column 1: Corporate */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-[15px] border-b border-white/20 pb-1.5 inline-block">
              Corporate
            </h4>
            <ul className="space-y-2 text-[#C6CBE6]">
              <li><a href="#about" className="hover:text-white transition-colors">About MEIL</a></li>
              <li><a href="#leadership" className="hover:text-white transition-colors">Leadership &amp; Board</a></li>
              <li><a href="#vision" className="hover:text-white transition-colors">Vision &amp; Values</a></li>
              <li><a href="#history" className="hover:text-white transition-colors">Milestones &amp; History</a></li>
              <li><a href="#governance" className="hover:text-white transition-colors">Corporate Governance</a></li>
              <li><Link to="/brsr-readiness" className="text-[#EF272E] hover:text-white font-bold transition-colors">BRSR &amp; ESG Reports</Link></li>
            </ul>
          </div>

          {/* Column 2: Business Units */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-[15px] border-b border-white/20 pb-1.5 inline-block">
              Business Units
            </h4>
            <ul className="space-y-2 text-[#C6CBE6]">
              <li><a href="#verticals" className="hover:text-white transition-colors">Hydro &amp; Water Management</a></li>
              <li><a href="#verticals" className="hover:text-white transition-colors">Transportation &amp; Highways</a></li>
              <li><a href="#verticals" className="hover:text-white transition-colors">Clean Energy &amp; Power</a></li>
              <li><a href="#verticals" className="hover:text-white transition-colors">Hydrocarbons &amp; Petrochemicals</a></li>
              <li><a href="#verticals" className="hover:text-white transition-colors">Electric Mobility (Olectra)</a></li>
              <li><a href="#verticals" className="hover:text-white transition-colors">Oil Rigs &amp; Drilling (DRILLMEC)</a></li>
            </ul>
          </div>

          {/* Column 3: Sectors */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-[15px] border-b border-white/20 pb-1.5 inline-block">
              Sectors &amp; Expertise
            </h4>
            <ul className="space-y-2 text-[#C6CBE6]">
              <li><a href="#projects" className="hover:text-white transition-colors">Mega Lift Irrigation Schemes</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">Underground Tunneling Projects</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">Ultra High Voltage Substations</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">Solar Photovoltaic Parks</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">City Gas Distribution Networks</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">Heavy Industrial Fabrication</a></li>
            </ul>
          </div>

          {/* Column 4: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-[15px] border-b border-white/20 pb-1.5 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2 text-[#C6CBE6]">
              <li><a href="#news" className="hover:text-white transition-colors">Media &amp; Press Releases</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">Project Photo Gallery</a></li>
              <li><a href="#csr" className="hover:text-white transition-colors">Corporate Social Responsibility</a></li>
              <li><a href="#careers" className="hover:text-white transition-colors">Job Openings &amp; Recruitment</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Corporate Office</a></li>
              <li><Link to="/login" className="text-white hover:text-[#EF272E] font-bold transition-colors">Employee ESG Login</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="border-t border-white/10 mt-10 pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#C6CBE6]">
          <p>© {new Date().getFullYear()} Megha Engineering &amp; Infrastructures Limited (MEIL). All Rights Reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Use</a>
            <span>|</span>
            <a href="#disclaimer" className="hover:text-white transition-colors">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

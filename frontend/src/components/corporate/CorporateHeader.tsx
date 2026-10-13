import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Menu, X, ShieldCheck } from 'lucide-react';

export const CorporateHeader: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'Human Capital', href: '#human-capital' },
    { name: 'Careers', href: '#careers' },
    { name: 'CSR', href: '#csr' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact Us', href: '#contact' },
  ];

  return (
    <header className="bg-white border-b border-[#E8E8E8] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Company Logo Top-Left: Official Full MEIL Logo */}
        <Link to="/corporate" className="flex items-center space-x-3 group">
          <img
            src="/MEIL_FULL_LOGO.jpg"
            alt="MEIL Official Logo"
            className="h-11 sm:h-12 w-auto object-contain block"
          />
          <div className="flex flex-col border-l-2 border-[#1A2A6C]/20 pl-3">
            <span className="text-xl font-black text-[#1A2A6C] tracking-tight leading-tight">
              MEIL OneSource
            </span>
            <span className="text-[11px] text-[#EF272E] font-bold tracking-normal leading-tight">
              Central Source for ESG &amp; BRSR Reporting Ease
            </span>
          </div>
        </Link>

        {/* Desktop Horizontal Nav Menu Top-Right */}
        <nav className="hidden lg:flex items-center space-x-6 text-[14px] text-[#333333] font-normal">
          <Link
            to="/corporate"
            className="flex items-center space-x-1 text-[#1A2A6C] hover:text-[#EF272E] font-bold transition-colors py-1"
            title="Home"
          >
            <Home className="w-4 h-4 text-[#1A2A6C]" />
            <span>Home</span>
          </Link>

          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[#333333] hover:text-[#EF272E] transition-colors py-1"
            >
              {link.name}
            </a>
          ))}

          {/* ESG / BRSR Portal Access Button */}
          <Link
            to="/dashboard"
            className="ml-3 bg-[#EF272E] hover:bg-[#1A2A6C] text-white px-4 py-2 text-[13px] font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Enter MEIL OneSource</span>
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center space-x-2">
          <Link
            to="/dashboard"
            className="bg-[#EF272E] text-white px-2.5 py-1 text-xs font-bold"
          >
            ESG Portal
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#1A2A6C] hover:text-[#EF272E]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E8E8E8] px-4 py-3 space-y-2 text-sm text-[#333333]">
          <Link
            to="/corporate"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-[#1A2A6C] font-bold border-b border-[#E8E8E8]"
          >
            Home
          </Link>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-[#333333] hover:text-[#EF272E] border-b border-[#E8E8E8]"
            >
              {link.name}
            </a>
          ))}
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#EF272E] font-bold"
          >
            → Enter MEIL OneSource (ESG &amp; BRSR)
          </Link>
        </div>
      )}
    </header>
  );
};

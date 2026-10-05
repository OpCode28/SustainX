import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Layers, 
  GitFork, 
  FileCheck2,
  Building2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DEMO_USERS } from '../data/demoData';
import { RoleType } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('amit.verma@meil-group.demo');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<RoleType>('GROUP_SUSTAINABILITY');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
    navigate('/dashboard');
  };

  const handleQuickSelect = (role: RoleType) => {
    const user = DEMO_USERS[role];
    if (user) {
      setEmail(user.email);
      setSelectedRole(role);
      login(user.email, role);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      {/* LEFT: Large MEIL Infrastructure Photograph (Section 25) */}
      <div className="lg:w-7/12 bg-[#1A2A6C] relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 text-white border-r-4 border-[#EF272E]">
        {/* Background Project Photograph with subtle corporate overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1800&q=80"
            alt="MEIL Heavy Engineering & Lift Irrigation Project"
            className="w-full h-full object-cover object-center opacity-30 block"
          />
        </div>

        {/* Top: MEIL Official Corporate Header */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-12 h-12 bg-white border-2 border-[#EF272E] flex items-center justify-center text-[#1A2A6C] font-black text-2xl">
            <span className="text-[#EF272E] mr-0.5">M</span>EIL
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
              MEGHA ENGINEERING &amp; INFRASTRUCTURES LIMITED
            </h1>
            <p className="text-[11px] text-[#EF272E] font-bold tracking-wider uppercase">
              Corporate Sustainability &amp; Assurance Directorate
            </p>
          </div>
        </div>

        {/* Middle: Editorial Statement */}
        <div className="relative z-10 my-10 space-y-4 max-w-xl">
          <div className="inline-block bg-[#EF272E] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
            SEBI BRSR 2024 &amp; BRSR Core Standard
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
            Corporate ESG Reporting &amp; Regulatory Assurance Portal
          </h2>

          <p className="text-sm text-[#C6CBE6] leading-[1.7]">
            Automated multi-tier rollups across 250+ project sites, rigid audit trails, 
            and evidence-backed data extraction for statutory Business Responsibility 
            and Sustainability Reporting.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-4 text-xs">
            <div className="p-3 bg-[#121c4a]/90 border border-white/20">
              <span className="font-bold text-white block">4-Tier Rollup</span>
              <span className="text-[11px] text-[#C6CBE6]">Project → BU → Sub → Group</span>
            </div>
            <div className="p-3 bg-[#121c4a]/90 border border-white/20">
              <span className="font-bold text-white block">Traceability</span>
              <span className="text-[11px] text-[#C6CBE6]">Source meters &amp; invoices</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-xs text-[#C6CBE6] border-t border-white/20 pt-4 flex items-center justify-between">
          <span>Touching Lives Through Engineering</span>
          <span>MEIL Portal v2.4 (Enterprise Edition)</span>
        </div>
      </div>

      {/* RIGHT: Clean White Login Panel (Section 25) */}
      <div className="lg:w-5/12 bg-white p-8 sm:p-14 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-[#1A2A6C]">
              Enterprise Sign In
            </h3>
            <p className="text-xs text-[#555555]">
              Centralized ESG reporting and BRSR readiness across the MEIL Group.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#888888] absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#d1d5db] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#333333] focus:outline-none focus:border-[#1A2A6C] focus:ring-1 focus:ring-[#1A2A6C]"
                  placeholder="name@meil-infra.demo"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Password / SSO Token
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#888888] absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-[#d1d5db] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#333333] focus:outline-none focus:border-[#1A2A6C] focus:ring-1 focus:ring-[#1A2A6C]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A2A6C] hover:bg-[#EF272E] text-white font-bold py-2.5 px-4 rounded-[2px] text-xs transition-colors flex items-center justify-center space-x-2"
            >
              <span>SIGN IN TO PORTAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Role Presets for Live Judging & Evaluation */}
          <div className="pt-4 border-t border-[#E8E8E8] space-y-2.5">
            <span className="text-[11px] font-bold text-[#1A2A6C] uppercase tracking-wider block">
              1-Click Assessment Personas:
            </span>

            <div className="grid grid-cols-1 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickSelect('GROUP_SUSTAINABILITY')}
                className="w-full text-left p-2 bg-[#fafafa] hover:bg-[#E8E8E8] border border-[#E8E8E8] hover:border-[#1A2A6C] flex items-center justify-between rounded-[2px] transition-colors"
              >
                <div>
                  <span className="font-bold text-[#1A2A6C]">Amit Verma (CSO)</span>
                  <span className="text-[10px] text-[#666666] block">Group Sustainability • Executive Dashboard &amp; Rollup</span>
                </div>
                <span className="text-[10px] font-bold bg-[#EF272E] text-white px-1.5 py-0.5">GROUP</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('SITE_USER')}
                className="w-full text-left p-2 bg-[#fafafa] hover:bg-[#E8E8E8] border border-[#E8E8E8] hover:border-[#1A2A6C] flex items-center justify-between rounded-[2px] transition-colors"
              >
                <div>
                  <span className="font-bold text-[#1A2A6C]">Rahul Sharma (Site Engg)</span>
                  <span className="text-[10px] text-[#666666] block">Project Alpha (Solar) • Data Entry &amp; Proof Upload</span>
                </div>
                <span className="text-[10px] font-bold bg-[#1A2A6C] text-white px-1.5 py-0.5">SITE</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('ESG_OFFICER')}
                className="w-full text-left p-2 bg-[#fafafa] hover:bg-[#E8E8E8] border border-[#E8E8E8] hover:border-[#1A2A6C] flex items-center justify-between rounded-[2px] transition-colors"
              >
                <div>
                  <span className="font-bold text-[#1A2A6C]">Priya Nair (ESG Lead)</span>
                  <span className="text-[10px] text-[#666666] block">MEIL Infra Projects • Review Queue &amp; Approvals</span>
                </div>
                <span className="text-[10px] font-bold bg-[#1A2A6C] text-white px-1.5 py-0.5">OFFICER</span>
              </button>
            </div>
          </div>

          {/* Trust Footer */}
          <div className="pt-2 border-t border-[#E8E8E8] text-[11px] text-[#888888] flex items-center justify-between">
            <span>Secure Enterprise Reporting</span>
            <span>•</span>
            <span>Role-Based Access</span>
            <span>•</span>
            <span>Traceable ESG Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

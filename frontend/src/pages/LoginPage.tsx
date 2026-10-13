import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  X,
  UserCheck,
  Building2,
  Smartphone,
  Laptop,
  Monitor,
  ShieldAlert
} from 'lucide-react';
import { useAuth, ActiveDevice } from '../contexts/AuthContext';

interface PresentCredential {
  name: string;
  role: string;
  email: string;
  org: string;
  badgeColor: string;
  category: 'Project' | 'BU' | 'Subsidiary' | 'Group HQ' | 'Assurance/IT';
}

const PRESENT_CREDENTIALS: PresentCredential[] = [
  // 1. Project Execution (Demo Project Beta)
  {
    name: 'Rahul Sharma',
    role: 'Site Engineer (P6 Data Entry)',
    email: 'rahul@meil-infra.demo',
    org: 'Demo Project Beta (High-Speed Tunneling)',
    badgeColor: 'bg-[#1A2A6C]',
    category: 'Project',
  },
  {
    name: 'Vikram Joshi',
    role: 'Site Safety & EHS (P3 Safety Entry)',
    email: 'ehs.beta@meil-infra.demo',
    org: 'Demo Project Beta (High-Speed Tunneling)',
    badgeColor: 'bg-emerald-700',
    category: 'Project',
  },
  {
    name: 'Rajesh Nair',
    role: 'Project Manager (Gate 1 Approver)',
    email: 'pm.beta@meil-infra.demo',
    org: 'Demo Project Beta (High-Speed Tunneling)',
    badgeColor: 'bg-indigo-700',
    category: 'Project',
  },

  // 2. Business Unit Level
  {
    name: 'Ananya Roy',
    role: 'Metro BU Coordinator (Gate 2 Approver)',
    email: 'bu.metro@meil-infra.demo',
    org: 'Metro & Rail Business Unit',
    badgeColor: 'bg-purple-700',
    category: 'BU',
  },
  {
    name: 'Suresh Rao',
    role: 'Irrigation BU Coordinator (Gate 2 Approver)',
    email: 'bu.lift@meil-water.demo',
    org: 'Lift Irrigation Business Unit',
    badgeColor: 'bg-purple-800',
    category: 'BU',
  },

  // 3. Subsidiary Level
  {
    name: 'Priya Nair',
    role: 'Sub ESG Mgr - Infra (Gate 3 Approver)',
    email: 'esg.infra@meil-infra.demo',
    org: 'MEIL Infrastructure Projects Ltd',
    badgeColor: 'bg-teal-700',
    category: 'Subsidiary',
  },
  {
    name: 'Ramesh Patel',
    role: 'Sub ESG Mgr - Hydro (Gate 3 Approver)',
    email: 'esg.hydro@meil-water.demo',
    org: 'MEIL Hydro & Water Corp',
    badgeColor: 'bg-teal-800',
    category: 'Subsidiary',
  },

  // 4. Group HQ Corporate Level
  {
    name: 'Amit Verma',
    role: 'Group CSO (Gate 4 Approver & Sec B)',
    email: 'cso@meil-group.demo',
    org: 'MEIL Group (Corporate HQ)',
    badgeColor: 'bg-[#EF272E]',
    category: 'Group HQ',
  },
  {
    name: 'Sunita Rao',
    role: 'Group HR Head (Sec A & P5)',
    email: 'hr@meil-group.demo',
    org: 'MEIL Group (Corporate HQ)',
    badgeColor: 'bg-pink-700',
    category: 'Group HQ',
  },
  {
    name: 'Deepak Singhal',
    role: 'Group Finance & CS (Sec A, P8, P9)',
    email: 'finance@meil-group.demo',
    org: 'MEIL Group (Corporate HQ)',
    badgeColor: 'bg-blue-800',
    category: 'Group HQ',
  },
  {
    name: 'Justice (Retd.) K. Murthy',
    role: 'Board Approver (Gate 5 Final Lock)',
    email: 'board@meil-group.demo',
    org: 'MEIL Group Board of Directors',
    badgeColor: 'bg-amber-700',
    category: 'Group HQ',
  },

  // 5. Global Assurance & System Governance
  {
    name: 'Sarah Jenkins',
    role: 'Statutory Auditor (Assurance Scope)',
    email: 'auditor@meil-group.demo',
    org: 'Independent Assurance Scope',
    badgeColor: 'bg-cyan-700',
    category: 'Assurance/IT',
  },
  {
    name: 'Kiran Reddy',
    role: 'Global IT Admin (System Governance)',
    email: 'admin@meil.demo',
    org: 'MEIL Enterprise IT & Governance',
    badgeColor: 'bg-[#059669]',
    category: 'Assurance/IT',
  },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Selected Category filter for quick fill list
  const [activeCredCategory, setActiveCredCategory] = useState<string>('ALL');

  // Form State
  const [email, setEmail] = useState('rahul@meil-infra.demo');
  const [password, setPassword] = useState('Meil@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot Password / OTP Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [otpStep, setOtpStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newOtpPassword, setNewOtpPassword] = useState('');
  const [confirmOtpPassword, setConfirmOtpPassword] = useState('');
  const [showNewOtpPassword, setShowNewOtpPassword] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const { login, sessionRevokedNotice, clearSessionNotice } = useAuth();
  const [deviceLimitModalOpen, setDeviceLimitModalOpen] = useState(false);
  const [conflictDevices, setConflictDevices] = useState<ActiveDevice[]>([]);
  const [evictLoading, setEvictLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else if (res.isDeviceLimitExceeded) {
        setConflictDevices(res.activeDevices || []);
        setDeviceLimitModalOpen(true);
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setErrorMessage('Could not connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvictAndLogin = async (targetDeviceId?: string) => {
    setEvictLoading(true);
    setErrorMessage(null);
    try {
      const res = await login(email, password, true, targetDeviceId);
      if (res.success) {
        setDeviceLimitModalOpen(false);
        navigate('/dashboard');
      } else {
        setErrorMessage(res.error || 'Failed to terminate older device session.');
      }
    } catch (e) {
      setErrorMessage('Network error during session eviction.');
    } finally {
      setEvictLoading(false);
    }
  };

  const handleFillCredential = (cred: PresentCredential) => {
    setEmail(cred.email);
    setPassword('Meil@2026');
    setErrorMessage(null);
  };

  const handleOpenForgotPassword = () => {
    setForgotEmail(email);
    setOtpStep(1);
    setGeneratedOtp(null);
    setEnteredOtp('');
    setNewOtpPassword('');
    setConfirmOtpPassword('');
    setOtpError(null);
    setIsForgotModalOpen(true);
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setOtpLoading(true);

    try {
      const res = await fetch('/api/v1/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setOtpError(data.error || 'Failed to generate OTP for this email.');
        return;
      }

      setGeneratedOtp(data.dummyOtp);
      setEnteredOtp(data.dummyOtp); // Auto-fill for testing convenience
      setOtpStep(2);
    } catch (err) {
      setOtpError('Failed to connect to authentication server.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtpAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (newOtpPassword.length < 6) {
      setOtpError('Password must be at least 6 characters.');
      return;
    }
    if (newOtpPassword !== confirmOtpPassword) {
      setOtpError('Passwords do not match.');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch('/api/v1/auth/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          otp: enteredOtp.trim(),
          newPassword: newOtpPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setOtpError(data.error || 'Invalid OTP code.');
        return;
      }

      // Password successfully reset
      setEmail(forgotEmail);
      setPassword(newOtpPassword);
      setIsForgotModalOpen(false);
      setSuccessMessage('Password reset successfully! You can now sign in with your new credentials.');
    } catch (err) {
      setOtpError('Failed to verify OTP with server.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      {/* LEFT: Large MEIL Infrastructure Photograph & Branding */}
      <div className="lg:w-7/12 bg-[#1A2A6C] relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 text-white border-r-4 border-[#EF272E]">
        {/* Background Project Photograph: Authentic Water Dam with subtle corporate overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/water_dam.jpg"
            alt="MEIL Hydro Dam & Lift Irrigation Engineering"
            className="w-full h-full object-cover object-center opacity-40 block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2A6C] via-[#1A2A6C]/75 to-[#1A2A6C]/50" />
        </div>

        {/* Top: MEIL Official Corporate Header */}
        <div className="relative z-10 flex items-center space-x-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-[4px] shadow-md max-w-fit border border-white/60">
          <img
            src="/MEIL_FULL_LOGO.jpg"
            alt="MEIL Official Full Logo"
            className="h-10 sm:h-11 w-auto object-contain block"
          />
          <div className="border-l-2 border-[#1A2A6C]/20 pl-3">
            <h1 className="text-base font-extrabold tracking-tight text-[#1A2A6C] leading-tight">
              MEIL OneSource
            </h1>
            <p className="text-[10px] text-[#EF272E] font-bold tracking-wider uppercase">
              Central Source for ESG &amp; BRSR Reporting Ease
            </p>
          </div>
        </div>

        {/* Middle: Editorial Statement */}
        <div className="relative z-10 my-8 space-y-4 max-w-xl">
          <div className="inline-block bg-[#EF272E] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-xs">
            SEBI BRSR 2024 &amp; BRSR Core Reasonable Assurance
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
            MEIL OneSource
          </h2>

          <p className="text-base sm:text-lg font-bold text-[#EF272E] tracking-normal drop-shadow">
            Central Source for ESG and BRSR Reporting Ease
          </p>

          <p className="text-sm text-[#E2E8F0] leading-[1.7] drop-shadow">
            Automated multi-tier rollups across 250+ project sites, rigid tamper-evident statutory audit trails, 
            and evidence-backed data extraction for statutory Business Responsibility 
            and Sustainability Reporting.
          </p>

          {/* Infrastructure Domains Grid */}
          <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
            <div className="p-3 bg-[#121c4a]/90 border border-white/20 rounded-[2px] backdrop-blur-xs">
              <span className="font-bold text-white block">Lift Irrigation &amp; Dams</span>
              <span className="text-[11px] text-[#C6CBE6]">World-record hydro &amp; canal networks</span>
            </div>
            <div className="p-3 bg-[#121c4a]/90 border border-white/20 rounded-[2px] backdrop-blur-xs">
              <span className="font-bold text-white block">Metros, Tunnels &amp; Rail</span>
              <span className="text-[11px] text-[#C6CBE6]">Heavy civil engineering execution</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-xs text-[#C6CBE6] border-t border-white/20 pt-4 flex items-center justify-between">
          <span>Touching Lives Through Engineering</span>
          <span className="font-semibold text-white">MEIL OneSource v2.6 Enterprise</span>
        </div>
      </div>

      {/* RIGHT: Clean White Login Panel */}
      <div className="lg:w-5/12 bg-white p-8 sm:p-14 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-[#1A2A6C]">
              Enterprise Sign In
            </h3>
            <p className="text-xs text-[#EF272E] font-semibold">
              Central Source for ESG and BRSR Reporting Ease
            </p>
            <p className="text-xs text-[#666666]">
              Authenticate with your registered MEIL Group corporate credentials.
            </p>
          </div>

          {/* Session Revoked Notice */}
          {sessionRevokedNotice && (
            <div className="p-3 bg-amber-50 border-l-4 border-amber-600 text-amber-900 text-xs rounded-[2px] flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{sessionRevokedNotice}</span>
              </div>
              <button onClick={clearSessionNotice} className="text-amber-700 hover:text-amber-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[2px] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[2px] flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
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
                  placeholder="name@meil-group.demo"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#333333]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleOpenForgotPassword}
                  className="text-[11px] font-semibold text-[#1A2A6C] hover:text-[#EF272E] hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#888888] absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-[#d1d5db] rounded-[2px] pl-9 pr-10 py-2 text-xs text-[#333333] focus:outline-none focus:border-[#1A2A6C] focus:ring-1 focus:ring-[#1A2A6C]"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#888888] hover:text-[#333333] transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1A2A6C] hover:bg-[#EF272E] text-white font-bold py-2.5 px-4 rounded-[2px] text-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'VERIFYING CREDENTIALS...' : 'SIGN IN TO PORTAL'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Present Credentials Quick-Fill List */}
          <div className="pt-4 border-t border-[#E8E8E8] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#1A2A6C] uppercase tracking-wider">
                Table 9 Demo Directory (1-Click Fill):
              </span>
              <span className="text-[10px] text-[#666666] font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                Password: <strong className="text-[#1A2A6C]">Meil@2026</strong>
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 text-[10px]">
              {(['ALL', 'Project', 'BU', 'Subsidiary', 'Group HQ', 'Assurance/IT'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCredCategory(cat)}
                  className={`px-2 py-0.5 rounded-[2px] font-bold transition-colors ${
                    activeCredCategory === cat
                      ? 'bg-[#1A2A6C] text-white'
                      : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                  }`}
                >
                  {cat === 'ALL' ? 'All (12)' : cat}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 max-h-[260px] overflow-y-auto pr-1">
              {PRESENT_CREDENTIALS
                .filter(cred => activeCredCategory === 'ALL' || cred.category === activeCredCategory)
                .map((cred) => {
                  const isCurrent = email.toLowerCase() === cred.email.toLowerCase();
                  return (
                    <button
                      key={cred.email}
                      type="button"
                      onClick={() => handleFillCredential(cred)}
                      className={`w-full text-left p-2 rounded-[2px] border transition-colors flex items-center justify-between ${
                        isCurrent
                          ? 'bg-blue-50/80 border-[#1A2A6C] ring-1 ring-[#1A2A6C]'
                          : 'bg-[#fafafa] hover:bg-[#f3f4f6] border-[#E8E8E8]'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-xs font-bold text-[#1A2A6C]">{cred.name}</span>
                          <span className="text-[10px] text-[#666666] font-mono truncate">{cred.email}</span>
                        </div>
                        <span className="text-[10px] text-[#888888] block truncate">{cred.org}</span>
                      </div>
                      <span className={`text-[9px] font-bold text-white px-2 py-0.5 rounded-[2px] shrink-0 ${cred.badgeColor}`}>
                        {cred.role}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Trust Footer */}
          <div className="pt-2 border-t border-[#E8E8E8] text-[11px] text-[#888888] flex items-center justify-between">
            <span>Secure Enterprise Login</span>
            <span>•</span>
            <span>Statutory RBAC</span>
            <span>•</span>
            <span>Tamper-Evident Ledger</span>
          </div>
        </div>
      </div>

      {/* Forgot Password / Dummy OTP Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full border border-[#1A2A6C] overflow-hidden">
            <div className="bg-[#1A2A6C] px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-[#EF272E]" />
                <h3 className="font-bold text-sm tracking-wide">
                  Password Reset • OTP Authentication
                </h3>
              </div>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="text-[#C6CBE6] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {otpError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[2px]">
                  {otpError}
                </div>
              )}

              {otpStep === 1 ? (
                /* Step 1: Request OTP */
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <p className="text-xs text-[#555555]">
                    Enter your registered corporate email to receive a 6-digit dummy verification OTP for password recovery.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">
                      Registered Corporate Email
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      placeholder="e.g. amit.verma@meil-group.demo"
                      className="w-full border border-[#d1d5db] rounded-[2px] px-3 py-2 text-xs text-[#333333] focus:outline-none focus:border-[#1A2A6C]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end space-x-2 border-t border-[#E8E8E8]">
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(false)}
                      className="px-3 py-1.5 text-xs font-bold text-[#666666] hover:bg-[#E8E8E8] rounded-[2px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={otpLoading}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-[#1A2A6C] hover:bg-[#EF272E] rounded-[2px] transition-colors disabled:opacity-50"
                    >
                      {otpLoading ? 'Generating OTP...' : 'Send Verification OTP'}
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: Verify OTP & Reset Password */
                <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
                  {/* Generated OTP Alert Box */}
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-[2px] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A2A6C]">Dummy OTP Generated:</span>
                      <span className="text-sm font-mono font-bold tracking-widest bg-white border border-amber-300 px-2 py-0.5 rounded text-[#EF272E]">
                        {generatedOtp}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#666666]">
                      (Master bypass code: <span className="font-mono font-bold">123456</span> is also valid)
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">
                      Enter 6-Digit Verification OTP
                    </label>
                    <input
                      type="text"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      required
                      maxLength={6}
                      placeholder="6-digit code"
                      className="w-full border border-[#d1d5db] rounded-[2px] px-3 py-2 text-xs text-[#333333] font-mono tracking-widest text-center focus:outline-none focus:border-[#1A2A6C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">
                      New Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <input
                        type={showNewOtpPassword ? 'text' : 'password'}
                        value={newOtpPassword}
                        onChange={(e) => setNewOtpPassword(e.target.value)}
                        required
                        placeholder="Enter new password"
                        className="w-full border border-[#d1d5db] rounded-[2px] px-3 py-2 text-xs text-[#333333] pr-9 focus:outline-none focus:border-[#1A2A6C]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewOtpPassword(!showNewOtpPassword)}
                        className="absolute right-2.5 top-2.5 text-[#888888] hover:text-[#333333]"
                      >
                        {showNewOtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmOtpPassword}
                      onChange={(e) => setConfirmOtpPassword(e.target.value)}
                      required
                      placeholder="Re-enter new password"
                      className="w-full border border-[#d1d5db] rounded-[2px] px-3 py-2 text-xs text-[#333333] focus:outline-none focus:border-[#1A2A6C]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#E8E8E8]">
                    <button
                      type="button"
                      onClick={() => setOtpStep(1)}
                      className="text-xs text-[#666666] hover:text-[#1A2A6C] font-semibold"
                    >
                      ← Back to Email
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsForgotModalOpen(false)}
                        className="px-3 py-1.5 text-xs font-bold text-[#666666] hover:bg-[#E8E8E8] rounded-[2px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={otpLoading}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#1A2A6C] hover:bg-[#EF272E] rounded-[2px] transition-colors disabled:opacity-50"
                      >
                        {otpLoading ? 'Resetting...' : 'Reset Password & Save'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 2-DEVICE LIMIT CONFLICT MODAL */}
      {deviceLimitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border-2 border-[#EF272E] max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-[#E8E8E8] pb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-6 h-6 text-[#EF272E]" />
                <div>
                  <h3 className="text-base font-bold text-[#1A2A6C]">
                    Concurrent Device Limit Reached
                  </h3>
                  <span className="text-[11px] font-bold text-[#EF272E] uppercase">
                    Security Policy: Maximum 2 Active Devices
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setDeviceLimitModalOpen(false)}
                className="text-[#666666] hover:text-[#333333]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#555555] leading-relaxed">
              Your corporate account (<strong className="text-[#1A2A6C]">{email}</strong>) is currently signed in on the maximum allowable limit of <strong>2 devices</strong>. To access the portal from this device, choose an existing session to log out.
            </p>

            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-[#333333] uppercase block">
                Currently Active Devices (2 / 2)
              </span>

              {conflictDevices.map((dev, idx) => (
                <div 
                  key={dev.deviceId || idx} 
                  className="p-3 border border-[#E8E8E8] bg-[#f9fafb] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-[#1A2A6C]/10 text-[#1A2A6C] flex items-center justify-center shrink-0">
                      {dev.deviceName?.toLowerCase().includes('phone') || dev.deviceName?.toLowerCase().includes('android') || dev.deviceName?.toLowerCase().includes('iphone') ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Laptop className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#1A2A6C] block">
                        {dev.deviceName || `Device ${idx + 1}`}
                      </span>
                      <span className="text-[10px] text-[#666666] block font-mono">
                        IP: {dev.ipAddress} • Logged in: {new Date(dev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEvictAndLogin(dev.deviceId)}
                    disabled={evictLoading}
                    className="px-3 py-1.5 bg-[#1A2A6C] hover:bg-[#EF272E] text-white text-[11px] font-bold transition-colors whitespace-nowrap disabled:opacity-50"
                  >
                    {evictLoading ? 'Switching...' : 'Log Out & Enter'}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8E8E8] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setDeviceLimitModalOpen(false)}
                className="text-xs text-[#666666] hover:text-[#333333] font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleEvictAndLogin()}
                disabled={evictLoading}
                className="px-4 py-2 border border-[#EF272E] text-[#EF272E] hover:bg-[#EF272E] hover:text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {evictLoading ? 'Processing...' : 'Log Out All Other Devices & Enter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

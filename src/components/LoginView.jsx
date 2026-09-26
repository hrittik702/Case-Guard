import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  UserCheck,
  Building2,
  Scale
} from 'lucide-react';
import { DEMO_USERS, authenticateDemoUser } from '../data/demoUsers';

export default function LoginView({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide officer credentials and security passkey.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = authenticateDemoUser(email, password);
      setIsSubmitting(false);

      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Authentication rejected. Verify credentials.');
      }
    }, 200);
  };

  const handleQuickLogin = (demoUser) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(demoUser);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans antialiased">
      
      {/* Top Government / Institutional Banner */}
      <header className="border-b border-slate-200 bg-white/95 px-6 py-3.5 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight font-mono text-slate-900">
                  CASEGUARD
                </span>
                <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  SECURE GOV PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Judicial & Law Enforcement Evidence Vault (BSA Section 63 & BNSS 2023)
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Digital Integrity Protection Active
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">Authorized Personnel Only</span>
          </div>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Form & Access Control */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="mb-6">
                <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-2">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Role-Based Authentication (PoLP)</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Officer Authentication
                </h1>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Authenticate your institutional credentials to decrypt and access case evidence dossiers.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2.5 animate-in fade-in">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Authentication Failed</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Official Email / Officer Badge ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. investigator@caseguard.gov"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-mono font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Security Passkey / Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In to Evidence Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Trust Multi-Tenant Boundary Enforcement</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Authentication events are recorded into the persistent Section 63 BSA audit ledger with officer badge ID and origin IP.
              </p>
            </div>
          </div>

          {/* Right Column: Instant Role-Based Demo Selection */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  Institutional Demo Profiles
                </h2>
                <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  Click to 1-Click Login
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3.5">
                Select an officer persona below to automatically authenticate and evaluate role-based access control (RBAC):
              </p>

              <div className="space-y-2.5">
                {DEMO_USERS.map((u) => {
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleQuickLogin(u)}
                      className="group bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-blue-400 p-3.5 rounded-xl cursor-pointer transition-all duration-150 shadow-2xs hover:shadow-xs relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 border border-slate-200 group-hover:border-blue-200 flex items-center justify-center text-base shrink-0 transition-colors">
                            {u.role.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                {u.name}
                              </h3>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase border ${
                                u.clearance === 'Top Secret' ? 'bg-red-50 text-red-700 border-red-200' :
                                u.clearance === 'Secret' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {u.clearance}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                              {u.designation}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                              {u.description}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="shrink-0 text-[10px] font-semibold text-blue-700 group-hover:text-white bg-blue-50 group-hover:bg-blue-600 border border-blue-200 group-hover:border-blue-600 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          Sign In
                        </button>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-mono text-slate-600">{u.email}</span>
                        <span className="font-medium text-slate-600">
                          {u.assignedCases.includes('*') ? 'All Cases (Wildcard)' : `${u.assignedCases.length} Assigned ${u.assignedCases.length === 1 ? 'Case' : 'Cases'}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-[11px] text-amber-900 leading-relaxed shadow-2xs">
              <span className="font-bold text-amber-950">PoLP Test Matrix:</span> Legal Officer (Advocate R. K. Shrivastava) cannot view Homicide Case INV-2026-0189 unless an investigator explicitly delegates access via the document sharing interface.
            </div>
          </div>

        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-6 text-center text-xs text-slate-500">
        <p>
          CASEGUARD Digital Evidence Vault — Compliant with Section 63 BSA & Section 173 BNSS 2023 Digital Custody Standard.
        </p>
      </footer>
    </div>
  );
}

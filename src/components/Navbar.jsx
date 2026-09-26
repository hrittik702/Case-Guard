import React from 'react';
import { ROLES } from '../data/roles';
import { Shield, FileText, Database, Package, History, UserCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentRole, setCurrentRole, blockchainHealth, blockCount, auditAlertCount }) {
  const rolesList = Object.values(ROLES);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('cases')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-900 border border-blue-500/40 flex items-center justify-center shadow-lg shadow-blue-900/30">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-200 bg-clip-text text-transparent">
                  NyayaSetu <span className="text-blue-400 font-mono text-sm uppercase px-1.5 py-0.5 rounded bg-blue-950/70 border border-blue-800">DMS</span>
                </span>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                  Govt. of India / CCTNS
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Secure Digital Document & Case Asset Management System
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('cases')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'cases'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Case Dossiers</span>
            </button>

            <button
              onClick={() => setActiveTab('assets')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'assets'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Evidence & Malkhana</span>
            </button>

            <button
              onClick={() => setActiveTab('blockchain')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'blockchain'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Blockchain Ledger</span>
              <span className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                #{blockCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'audit'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Audit & Sec 65B</span>
              {auditAlertCount > 0 && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>
          </nav>

          {/* Right Status & Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Blockchain Health Indicator */}
            <div className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              blockchainHealth.valid
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-red-950/60 border-red-800 text-red-300 animate-pulse'
            }`}>
              {blockchainHealth.valid ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ledger: Intact</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>Tamper Flagged</span>
                </>
              )}
            </div>

            {/* Role Switcher Dropdown */}
            <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700 rounded-lg p-1.5">
              <div className="hidden sm:block text-left pr-1 pl-1">
                <div className="text-xs font-semibold leading-tight text-white flex items-center gap-1.5">
                  <span>{currentRole.name}</span>
                  <span className={`text-[10px] px-1 py-0.2 rounded font-mono uppercase ${
                    currentRole.clearance === 'Top Secret' ? 'bg-red-900/60 text-red-300 border border-red-700/50' :
                    currentRole.clearance === 'Secret' ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50' :
                    'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                  }`}>
                    {currentRole.clearance}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                  {currentRole.designation}
                </div>
              </div>

              <select
                aria-label="Switch Role"
                value={currentRole.id}
                onChange={(e) => {
                  const roleKey = Object.keys(ROLES).find(k => ROLES[k].id === e.target.value);
                  if (roleKey) setCurrentRole(ROLES[roleKey]);
                }}
                className="bg-slate-900 text-slate-200 text-xs rounded border border-slate-700 py-1 px-2 focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                {rolesList.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.designation.split(',')[0]})
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 bg-slate-900/80 py-2">
        <button
          onClick={() => setActiveTab('cases')}
          className={`flex flex-col items-center text-xs font-medium ${activeTab === 'cases' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          Cases
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`flex flex-col items-center text-xs font-medium ${activeTab === 'assets' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <Package className="w-4 h-4 mb-0.5" />
          Malkhana
        </button>
        <button
          onClick={() => setActiveTab('blockchain')}
          className={`flex flex-col items-center text-xs font-medium ${activeTab === 'blockchain' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <Database className="w-4 h-4 mb-0.5" />
          Blockchain
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex flex-col items-center text-xs font-medium ${activeTab === 'audit' ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <History className="w-4 h-4 mb-0.5" />
          Audit
        </button>
      </div>
    </header>
  );
}

import React from 'react';
import { Menu, Search, AlertTriangle, ChevronRight, LogOut, Shield } from 'lucide-react';

export default function TopHeader({
  currentView,
  selectedCase,
  onOpenMobileMenu,
  onOpenSearch,
  integrityAlertCount,
  currentUser,
  currentRole,
  onLogout
}) {
  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Overview';
      case 'cases': return 'Cases';
      case 'documents': return 'Documents';
      case 'integrity': return 'Integrity';
      case 'audit': return 'Audit Trail';
      case 'search': return 'Search';
      case 'access': return 'Access Control';
      default: return currentView;
    }
  };

  const displayName = currentUser?.name || currentRole?.name || 'Officer';
  const displayClearance = currentUser?.clearance || currentRole?.clearance || 'Confidential';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6">
      
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Hierarchy */}
        <nav className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium overflow-hidden">
          <span className="text-slate-900 font-semibold font-mono">CASEGUARD</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          
          <span className="text-slate-700">
            {currentView === 'cases' && selectedCase ? selectedCase.caseNumber : getViewTitle()}
          </span>

          {currentView === 'cases' && selectedCase && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-blue-600 font-medium truncate max-w-[150px] sm:max-w-xs">
                {selectedCase.title}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Right: Quick Search, Alerts, User Profile, and Sign Out */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        
        {/* Quick Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center space-x-2 bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Search cases or documents...</span>
          <kbd className="bg-white border border-slate-300 text-[10px] px-1.5 py-0.5 rounded text-slate-500 font-mono">⌘K</kbd>
        </button>

        {/* Integrity Alert Pill */}
        {integrityAlertCount > 0 && (
          <div className="flex items-center space-x-1 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-lg text-xs font-semibold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>{integrityAlertCount} Mismatch</span>
          </div>
        )}

        {/* Active Officer Identity Badge */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">
            {currentRole?.avatar || '👮'}
          </div>
          <div className="text-left">
            <div className="text-[11px] font-bold text-slate-900 leading-none truncate max-w-[130px]">
              {displayName}
            </div>
            <div className="text-[9px] font-mono text-slate-500 uppercase mt-0.5 leading-none">
              {displayClearance}
            </div>
          </div>
        </div>

        {/* Sign Out Action */}
        {onLogout && (
          <button
            onClick={onLogout}
            title="Sign out of active session"
            className="flex items-center space-x-1.5 text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 hover:border-red-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-600" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        )}

      </div>
    </header>
  );
}

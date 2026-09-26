import React from 'react';
import { 
  LayoutDashboard, 
  FolderGit2, 
  FileText, 
  ShieldCheck, 
  History, 
  Search, 
  ShieldAlert, 
  X,
  Lock,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { ROLES } from '../data/roles';
import { DEMO_USERS } from '../data/demoUsers';

export default function SidebarNav({ 
  currentView, 
  setCurrentView, 
  currentUser,
  currentRole, 
  setCurrentRole,
  onSwitchUser,
  integrityAlertCount = 0,
  casesCount = 0,
  documentsCount = 0,
  mobileOpen,
  setMobileOpen
}) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'cases', label: 'Cases', icon: FolderGit2, badge: casesCount > 0 ? `${casesCount}` : null },
    { id: 'documents', label: 'Documents', icon: FileText, badge: documentsCount > 0 ? `${documentsCount}` : null },
    { id: 'integrity', label: 'Integrity', icon: ShieldCheck, badge: integrityAlertCount > 0 ? `${integrityAlertCount} Alert` : null, alert: integrityAlertCount > 0 },
    { id: 'audit', label: 'Audit Trail', icon: History, badge: null },
    { id: 'search', label: 'Search', icon: Search, badge: null },
    { id: 'access', label: 'Access Control', icon: Lock, badge: null }
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    if (setMobileOpen) setMobileOpen(false);
  };

  const activeName = currentUser?.name || currentRole?.name || 'Officer';
  const activeDesignation = currentUser?.designation || currentRole?.designation || 'Investigation Officer';
  const activeClearance = currentUser?.clearance || currentRole?.clearance || 'Confidential';
  const activeAvatar = currentRole?.avatar || '👮';

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Branding Section */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-base tracking-tight text-slate-900 font-mono">
                    CASEGUARD
                  </span>
                  <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                    DMS
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                  Secure Legal & Case Vault
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      item.alert
                        ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                        : isActive
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Role Section */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Active Session (RBAC)
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="text-xl">{activeAvatar}</span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {activeName}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {activeDesignation}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
              <span className="text-slate-500">Clearance:</span>
              <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] uppercase border ${
                activeClearance === 'Top Secret' ? 'bg-red-50 text-red-700 border-red-200' :
                activeClearance === 'Secret' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {activeClearance}
              </span>
            </div>

            {/* Switch Active User / Persona Dropdown */}
            <div className="mt-2.5">
              <label className="text-[10px] text-slate-500 block mb-1">Active Officer Persona:</label>
              <select
                aria-label="Switch User Persona"
                value={currentUser?.email || DEMO_USERS[0].email}
                onChange={(e) => {
                  const target = DEMO_USERS.find(u => u.email === e.target.value);
                  if (target) {
                    if (onSwitchUser) onSwitchUser(target);
                    else if (setCurrentRole) setCurrentRole(target.role);
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
              >
                {DEMO_USERS.map(u => (
                  <option key={u.id} value={u.email}>
                    {u.role.avatar} {u.name} ({u.clearance})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

import React, { useState, useMemo } from 'react';
import { 
  FolderGit2, 
  FileText, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2, 
  ChevronRight, 
  Upload, 
  FolderPlus,
  AlertCircle,
  Search,
  User,
  Shield,
  ExternalLink
} from 'lucide-react';
import { SharingService } from '../services/sharingService.js';

export default function Dashboard({ 
  cases = [], 
  documents = [], 
  auditLogs = [],
  onSelectCase, 
  onOpenCreateCase,
  onOpenUpload, 
  onQuickVerify, 
  integrityAlertCount = 0,
  currentUser = null,
  currentRole = null,
  onNavigate = null,
  onViewDocument = null
}) {
  const [caseSearch, setCaseSearch] = useState('');
  const effectiveUser = currentUser || currentRole;

  // 1. Role-aware accessible cases filtering
  const accessibleCases = useMemo(() => {
    return cases.filter(c => SharingService.canUserAccessCase(effectiveUser, c));
  }, [cases, effectiveUser]);

  // 2. Role-aware accessible documents filtering
  const accessibleDocuments = useMemo(() => {
    return documents.filter(d => {
      if (d.caseId && !SharingService.canUserAccessCase(effectiveUser, d.caseId)) {
        return false;
      }
      const check = SharingService.checkDocumentAccess(effectiveUser, d);
      return check.allowed;
    });
  }, [documents, effectiveUser]);

  // 3. Role-aware accessible audit logs filtering
  const accessibleAuditLogs = useMemo(() => {
    const isSuperuser = effectiveUser?.role?.id === 'administrator' || effectiveUser?.assignedCases?.includes('*');
    if (isSuperuser) return auditLogs;
    const accessibleCaseIds = new Set(accessibleCases.map(c => c.caseNumber || c.id));
    return auditLogs.filter(log => {
      if (!log.caseId || log.caseId === 'GENERAL') return true;
      return accessibleCaseIds.has(log.caseId);
    });
  }, [auditLogs, accessibleCases, effectiveUser]);

  // Operational metrics
  const tamperedDocs = useMemo(() => {
    return accessibleDocuments.filter(d => d.isTampered);
  }, [accessibleDocuments]);

  const effectiveAlerts = Math.max(integrityAlertCount, tamperedDocs.length);

  const pendingActionsCount = useMemo(() => {
    const unverified = accessibleDocuments.filter(d => !d.isTampered && d.integrityStatus !== 'VERIFIED').length;
    return tamperedDocs.length + (effectiveAlerts > 0 ? 1 : 0) + (unverified > 0 ? 1 : 0);
  }, [accessibleDocuments, tamperedDocs, effectiveAlerts]);

  // 4 compact operational KPIs
  const isSuper = effectiveUser?.role?.id === 'administrator' || effectiveUser?.assignedCases?.includes('*');
  const kpis = [
    {
      label: 'ACTIVE CASES',
      value: accessibleCases.length,
      sub: isSuper ? 'All jurisdiction dockets' : `${accessibleCases.length} assigned to officer`,
      icon: FolderGit2,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-100'
    },
    {
      label: 'DOCUMENTS',
      value: accessibleDocuments.length,
      sub: 'Across accessible case dockets',
      icon: FileText,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100'
    },
    {
      label: 'PENDING ACTIONS',
      value: pendingActionsCount,
      sub: pendingActionsCount > 0 ? 'Requires attention / review' : 'All dockets up to date',
      icon: AlertCircle,
      color: pendingActionsCount > 0 ? 'text-amber-600' : 'text-slate-600',
      bg: pendingActionsCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'
    },
    {
      label: 'INTEGRITY ALERTS',
      value: effectiveAlerts > 0 ? `${effectiveAlerts} Alert${effectiveAlerts > 1 ? 's' : ''}` : '0',
      sub: effectiveAlerts > 0 ? 'Integrity seal mismatch' : 'All digital seals verified',
      icon: effectiveAlerts > 0 ? AlertTriangle : ShieldCheck,
      color: effectiveAlerts > 0 ? 'text-red-600' : 'text-emerald-600',
      bg: effectiveAlerts > 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-100'
    }
  ];

  // Filtered cases for the table view
  const displayedCases = useMemo(() => {
    if (!caseSearch.trim()) return accessibleCases;
    const q = caseSearch.toLowerCase();
    return accessibleCases.filter(c => 
      (c.caseNumber || '').toLowerCase().includes(q) ||
      (c.title || '').toLowerCase().includes(q) ||
      (c.type || '').toLowerCase().includes(q) ||
      (c.priority || '').toLowerCase().includes(q) ||
      (c.status || '').toLowerCase().includes(q) ||
      (Array.isArray(c.assignedOfficers) && c.assignedOfficers.some(o => o.toLowerCase().includes(q)))
    );
  }, [accessibleCases, caseSearch]);

  const formatAuditAction = (action) => {
    if (!action) return 'Action Logged';
    return action
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const formatEventTime = (isoString) => {
    if (!isoString) return '--:--';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '--:--';
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return isToday ? timeStr : `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${timeStr}`;
  };

  return (
    <div className="space-y-5">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cases, documents and recent activity.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenCreateCase && onOpenCreateCase()}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create Case</span>
          </button>
          
          <button
            onClick={() => onOpenUpload && onOpenUpload()}
            className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-500 tracking-wider">
                  {kpi.label}
                </span>
                <div className={`w-7 h-7 rounded-md flex items-center justify-center border ${kpi.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                </div>
              </div>
              <div className="text-2xl font-semibold font-mono text-slate-900 tracking-tight">
                {kpi.value}
              </div>
              <div className="text-[13px] text-slate-500 mt-0.5 truncate font-normal">
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Conditional Attention Required Section */}
      {effectiveAlerts > 0 || tamperedDocs.length > 0 ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-200 text-red-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-900 tracking-tight">
                Attention Required: Digital Integrity Mismatch Detected
              </h4>
              <p className="text-[13px] text-red-700 mt-0.5 font-normal">
                {tamperedDocs.length > 0 
                  ? `${tamperedDocs.length} evidence file(s) failed hash verification against the registered digital fingerprint.`
                  : `${effectiveAlerts} integrity verification alert(s) pending evidentiary audit review.`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
            {onNavigate && (
              <button
                onClick={() => onNavigate('integrity')}
                className="inline-flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify in Integrity Tab</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium text-xs text-slate-700">All digital seals intact • 0 alerts pending</span>
          </div>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline font-normal">Section 63 BSA Compliant</span>
        </div>
      )}

      {/* Main 2-Column Split: Active Cases (65-70%) + Recent Activity (30-35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Active Cases Table (~67% / 8 of 12 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg shadow-2xs flex flex-col overflow-hidden">
          
          {/* Header & Quick Filter */}
          <div className="p-3.5 sm:px-4 sm:py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Active Cases
              </h2>
              <span className="font-mono text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {accessibleCases.length} {accessibleCases.length === 1 ? 'Docket' : 'Dockets'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter cases..."
                  value={caseSearch}
                  onChange={(e) => setCaseSearch(e.target.value)}
                  className="pl-8 pr-2.5 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400 w-44 sm:w-56 font-normal"
                />
              </div>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('cases')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  View all →
                </button>
              )}
            </div>
          </div>

          {/* Cases List */}
          <div className="divide-y divide-slate-100 flex-1 overflow-x-auto">
            {displayedCases.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center mx-auto">
                  <FolderGit2 className="w-5 h-5 stroke-1" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-slate-800">
                    {caseSearch.trim() ? 'No Matching Cases Found' : 'No Active Cases Assigned'}
                  </div>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto font-normal">
                    {caseSearch.trim() 
                      ? 'Try clearing the filter to view all assigned investigation dockets.'
                      : 'Create a new case docket or request assignment from your supervisory administrator.'}
                  </p>
                </div>
                {!caseSearch.trim() && (
                  <button
                    onClick={() => onOpenCreateCase && onOpenCreateCase()}
                    className="inline-flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Create First Case</span>
                  </button>
                )}
              </div>
            ) : (
              displayedCases.map((c) => {
                const docCount = documents.filter(d => d.caseId === c.caseNumber).length;
                const leadOfficer = Array.isArray(c.assignedOfficers) && c.assignedOfficers.length > 0 
                  ? c.assignedOfficers[0] 
                  : (c.assignedUsers && c.assignedUsers[0]?.name) || 'Investigation Officer';

                return (
                  <div 
                    key={c.id || c.caseNumber}
                    onClick={() => onSelectCase(c)}
                    className="p-3.5 sm:px-4 hover:bg-slate-50 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                          #{c.caseNumber}
                        </span>
                        
                        <span className="text-xs font-normal text-slate-600">
                          {c.type}
                        </span>

                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                          c.priority === 'Critical' || c.priority === 'High' 
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {c.priority}
                        </span>

                        <span className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full font-medium">
                          {c.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {c.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-500 font-normal">
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{leadOfficer}</span>
                        </span>
                        <span>•</span>
                        <span>Created: {c.createdDate || (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[13px] font-medium text-slate-800">
                          {docCount} {docCount === 1 ? 'Document' : 'Documents'}
                        </span>
                        <div className="text-xs text-emerald-600 flex items-center sm:justify-end gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Anchored</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(c);
                        }}
                        className="inline-flex items-center space-x-1 bg-slate-100 group-hover:bg-blue-600 text-slate-700 group-hover:text-white px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors"
                      >
                        <span>Open Case</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity Timeline (~33% / 4 of 12 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg shadow-2xs p-3.5 sm:p-4 flex flex-col space-y-3">
          
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Activity
              </h2>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('audit')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                View all →
              </button>
            )}
          </div>

          {/* Activity items list */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[460px] pr-1">
            {accessibleAuditLogs.slice(0, 8).map((evt) => (
              <div key={evt.id} className="flex items-start space-x-2.5 text-xs pb-2.5 border-b border-slate-50 last:border-b-0 last:pb-0">
                <span className="font-mono text-xs text-slate-400 font-normal shrink-0 pt-0.5 w-12">
                  {formatEventTime(evt.timestamp)}
                </span>
                
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-medium text-slate-800 text-xs truncate">
                      {formatAuditAction(evt.action)}
                    </span>
                    {evt.caseId && evt.caseId !== 'GENERAL' && (
                      <span className="font-mono text-xs text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100 shrink-0 font-medium">
                        #{evt.caseId}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-[13px] text-slate-500 truncate leading-snug font-normal">
                    {evt.details}
                  </p>

                  <div className="text-xs text-slate-400 flex items-center gap-1 truncate pt-0.5 font-normal">
                    <span>by {evt.actorName || 'System'}</span>
                  </div>
                </div>
              </div>
            ))}

            {accessibleAuditLogs.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs font-normal">
                No recent activity recorded yet.
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between font-normal">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-slate-400" />
              <span>Immutable Ledger</span>
            </span>
            <span className="text-emerald-600 font-medium font-mono text-xs">Synced & Sealed</span>
          </div>

        </div>

      </div>

    </div>
  );
}

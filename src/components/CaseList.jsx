import React, { useState } from 'react';
import { Search, FolderGit2, ShieldCheck, Scale, FileText, ChevronRight, Lock, MapPin, Building, Plus } from 'lucide-react';

export default function CaseList({ cases, onSelectCase, onNewCaseModal, currentRole }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.policeStation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.acts.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Search Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FolderGit2 className="w-6 h-6 text-blue-400" />
              Legal & Investigation Case Dossiers
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Digitally centralized, cryptographically sealed case folders with automated chain of custody and evidentiary tracking.
            </p>
          </div>

          {/* Action button if role has permissions */}
          {currentRole.permissions.includes('create_fir') && (
            <button
              onClick={onNewCaseModal}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-blue-900/40 hover:shadow-blue-900/60 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Case (FIR)</span>
            </button>
          )}
        </div>

        {/* Search & Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by FIR number, accused name, BNS/IPC section, police station..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-4">
            <select
              aria-label="Filter by Case Lifecycle Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Case Lifecycle States</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Charge Sheet Filed">Charge Sheet Filed</option>
              <option value="Appellate Review">Appellate Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Case Dossiers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredCases.map(c => {
          const docCount = c.documents?.length || 0;
          const signedCount = c.documents?.filter(d => d.digitalSignature)?.length || 0;

          return (
            <div
              key={c.id}
              onClick={() => onSelectCase(c)}
              className="group bg-slate-900 border border-slate-800 hover:border-blue-500/60 rounded-xl p-5 transition-all duration-200 hover:shadow-xl hover:shadow-blue-950/40 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-blue-400 bg-blue-950/70 border border-blue-800/80 px-2 py-0.5 rounded">
                        {c.caseNumber}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        c.classification === 'Top Secret' ? 'bg-red-950/70 border-red-800 text-red-300' :
                        c.classification === 'Secret' ? 'bg-amber-950/70 border-amber-800 text-amber-300' :
                        'bg-blue-950/70 border-blue-800 text-blue-300'
                      }`}>
                        <Lock className="w-2.5 h-2.5 inline mr-1" />
                        {c.classification}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors mt-2">
                      {c.title}
                    </h2>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border shrink-0 ${
                    c.status === 'Charge Sheet Filed' ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300' :
                    c.status === 'Under Investigation' ? 'bg-blue-950/70 border-blue-800 text-blue-300' :
                    'bg-purple-950/70 border-purple-800 text-purple-300'
                  }`}>
                    {c.status}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {c.summary}
                </p>

                {/* Statutory Sections */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {c.acts.slice(0, 2).map((act, i) => (
                    <span key={i} className="text-[11px] bg-slate-800/80 text-slate-300 border border-slate-700/60 px-2 py-0.5 rounded max-w-full truncate">
                      § {act}
                    </span>
                  ))}
                  {c.acts.length > 2 && (
                    <span className="text-[11px] bg-slate-800/50 text-slate-400 px-1.5 py-0.5 rounded">
                      +{c.acts.length - 2} more
                    </span>
                  )}
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{c.policeStation.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{c.courtName.split(',')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Footer status bar */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 mt-3">
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-slate-300">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    {docCount} Documents
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {signedCount} Sealed & Signed
                  </span>
                </div>

                <div className="flex items-center text-xs font-semibold text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Open Dossier</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">No matching case dossiers found</p>
          <p className="text-xs text-slate-500 mt-1">Try modifying your search criteria or filter options.</p>
        </div>
      )}
    </div>
  );
}

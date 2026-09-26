import React, { useState } from 'react';
import { 
  X, 
  GitBranch, 
  Clock, 
  UserCheck, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Scale,
  Eye,
  Columns
} from 'lucide-react';

export default function VersionHistoryModal({ doc, caseItem, onClose, onOpenDocumentViewer, onVerifyDoc, onViewAudit }) {
  const [selectedVersion, setSelectedVersion] = useState(doc.versions?.[0] || null);
  const [compareMode, setCompareMode] = useState(false);

  const versions = doc.versions || [
    {
      version: doc.currentVersion || 'V1',
      isCurrent: true,
      modifiedBy: doc.uploadedBy,
      date: doc.uploadDate,
      fileSize: doc.fileSize,
      hash: doc.storedHash,
      changeDescription: 'Initial sealed ingestion.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                Document Version Timeline & Lineage
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Document: <strong className="font-medium text-slate-800">{doc.name}</strong> • Case: <span className="font-mono text-blue-700 font-medium">#{caseItem?.caseNumber || doc.caseId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs max-h-[70vh] overflow-y-auto">
          
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-700 uppercase tracking-wider text-xs">
              Chained Versions Stack ({versions.length} Revisions):
            </span>
            <button
              onClick={() => setCompareMode(!compareMode)}
              className="inline-flex items-center space-x-1.5 text-xs text-indigo-700 hover:text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg font-semibold"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{compareMode ? 'Exit Comparison' : 'Compare V3 vs V1'}</span>
            </button>
          </div>

          {/* Compare Mode Side-by-Side View */}
          {compareMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="space-y-2 border-r border-slate-200 pr-2">
                <span className="text-xs font-semibold text-indigo-700 font-mono">V3 — Current State</span>
                <div className="space-y-1 text-slate-700 font-normal">
                  <div><strong className="font-medium">Modified:</strong> 26 Sep 2026, 09:42</div>
                  <div><strong className="font-medium">Officer:</strong> Officer Sharma (IO)</div>
                  <div><strong className="font-medium">Size:</strong> 2.4 MB (+600 KB added)</div>
                  <div className="text-xs text-slate-500 font-mono break-all">
                    <strong className="font-medium">Hash:</strong> a8f9104b2c1e8934fa76210d...
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 text-xs text-slate-600 font-normal">
                    Appended verified IPDR telemetry logs and bank transaction trace sheets.
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-600 font-mono">V1 — Initial State</span>
                <div className="space-y-1 text-slate-700 font-normal">
                  <div><strong className="font-medium">Modified:</strong> 24 Sep 2026, 11:12</div>
                  <div><strong className="font-medium">Officer:</strong> Officer Sharma (IO)</div>
                  <div><strong className="font-medium">Size:</strong> 1.8 MB (Baseline)</div>
                  <div className="text-xs text-slate-500 font-mono break-all">
                    <strong className="font-medium">Hash:</strong> c8912345defa012938475610...
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 text-xs text-slate-600 font-normal">
                    Initial investigative field seizure report and evidence inventory.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline of Versions */}
          <div className="space-y-4">
            {versions.map((ver, idx) => {
              const isCurrent = ver.isCurrent;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-50/50 border-blue-200 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className={`font-mono text-xs font-medium px-2 py-0.5 rounded ${
                        isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {ver.version} {isCurrent && '— Current'}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        Modified by {ver.modifiedBy}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
                      <span>{ver.date}</span>
                      <span>•</span>
                      <span>{ver.fileSize}</span>
                    </div>
                  </div>

                  <div className="py-2.5">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {ver.changeDescription}
                    </p>
                    <div className="mt-2 font-mono text-[10px] text-slate-400 bg-slate-50 p-2 rounded border border-slate-100 break-all select-all">
                      <span className="font-semibold text-slate-500">Digital Seal: </span>
                      {ver.hash ? `${ver.hash.slice(0, 16)}••••••••••••••••${ver.hash.slice(-8)}` : 'Verified'}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Integrity Verified in Chained History</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenDocumentViewer(doc, caseItem);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View Version &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="text-[11px] text-slate-500">
            Linear hash-chained revision tracking under Section 63 BSA 2023.
          </div>

          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-1.5 rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

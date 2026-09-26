import React from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  GitBranch, 
  Download, 
  History, 
  CheckCircle2, 
  Lock, 
  Cpu, 
  User, 
  Calendar,
  Tag,
  Hash
} from 'lucide-react';

export default function DocumentViewerModal({
  doc,
  caseItem,
  onClose,
  onVerifyIntegrity,
  onViewVersions,
  onViewAudit,
  onDownload
}) {
  const isTampered = doc.isTampered;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-slate-900">
                  {doc.name}
                </span>
                <span className="font-mono text-xs bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-semibold border border-slate-200">
                  {doc.currentVersion}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${
                  doc.classification === 'Top Secret' ? 'bg-red-50 text-red-700 border-red-200' :
                  doc.classification === 'Secret' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {doc.classification}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Case: <strong className="font-mono text-blue-700">#{caseItem?.caseNumber || doc.caseId}</strong> • Type: {doc.type}
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

        {/* Verification Status Banner */}
        <div className={`px-6 py-2.5 border-b flex items-center justify-between text-xs ${
          isTampered
            ? 'bg-red-50 border-red-200 text-red-900'
            : 'bg-emerald-50 border-emerald-100 text-emerald-900'
        }`}>
          <div className="flex items-center space-x-2">
            {isTampered ? (
              <>
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 animate-bounce" />
                <span className="font-semibold">
                  STATUS: MODIFIED — Calculated hash does not match stored cryptographic anchor!
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">
                  STATUS: VERIFIED — Cryptographic fingerprint verified against case ledger
                </span>
              </>
            )}
          </div>

          <button
            onClick={() => onVerifyIntegrity(doc, caseItem)}
            className="text-xs font-semibold text-blue-700 hover:underline"
          >
            Inspect Hash Details &rarr;
          </button>
        </div>

        {/* Modal Body: Document Viewer & Extracted Metadata Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 max-h-[65vh] overflow-y-auto">
          
          {/* Left 2 Cols: Document Text Content */}
          <div className="lg:col-span-2 p-6 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Certified Document Payload Content:
            </span>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap selection:bg-blue-600 selection:text-white shadow-inner">
              {doc.content}
            </div>
          </div>

          {/* Right Col: Extracted Metadata & OCR Panel */}
          <div className="p-6 space-y-4 text-xs bg-slate-50/50">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
              Extracted Metadata & OCR
            </h4>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">DOCUMENT TYPE:</span>
                <strong className="text-slate-900">{doc.type}</strong>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">CASE ID:</span>
                <span className="font-mono text-blue-700 font-bold">#{caseItem?.caseNumber || doc.caseId}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">UPLOAD DATE:</span>
                <span className="text-slate-700">{doc.uploadDate}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">OFFICER:</span>
                <span className="text-slate-800 font-medium">{doc.uploadedBy}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">FILE SIZE:</span>
                <span className="text-slate-700 font-mono">{doc.fileSize}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">ACCESS LEVEL:</span>
                <span className="text-slate-700">{doc.accessLevel}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">OCR STATUS:</span>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-emerald-700 font-semibold">{doc.ocrStatus || 'Completed'}</span>
                  <span className="text-[10px] text-slate-400 font-mono">(Simulated OCR)</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">EXTRACTED KEYWORDS:</span>
                <div className="flex flex-wrap gap-1">
                  {(doc.ocrKeywords || ['investigation', 'RTGS', 'exhibit', 'evidence']).map((kw, i) => (
                    <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">DIGITAL FINGERPRINT:</span>
                <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[10px] text-slate-700 break-all select-all font-semibold">
                  {doc.storedHash ? `${doc.storedHash.slice(0, 16)}••••••••••••••••${doc.storedHash.slice(-8)}` : 'N/A'}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Action Bar */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80">
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onVerifyIntegrity(doc, caseItem)}
              className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify Integrity</span>
            </button>

            <button
              onClick={() => onViewVersions(doc, caseItem)}
              className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
              <span>Version History</span>
            </button>

            <button
              onClick={() => onDownload(doc)}
              className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download Record</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onViewAudit(caseItem);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1"
            >
              View Audit Events &rarr;
            </button>
            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

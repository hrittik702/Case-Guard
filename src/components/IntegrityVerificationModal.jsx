import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  Hash, 
  Scale, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { computeSHA256 } from '../services/cryptoService';

export default function IntegrityVerificationModal({
  doc,
  caseItem,
  onClose,
  onSimulateTamper,
  onRestoreOriginal,
  onViewAudit
}) {
  const [calculatedHash, setCalculatedHash] = useState(doc.isTampered ? (doc.tamperedHash || 'c71e2891aa3fe0912837465abcde901234567890abcdef019283746501928374') : doc.storedHash);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState('Just now');

  const isTampered = doc.isTampered;
  const isMatch = !isTampered && calculatedHash === doc.storedHash;

  const handleRunVerification = async () => {
    setIsVerifying(true);
    const hash = await computeSHA256(doc.content);
    setTimeout(() => {
      setCalculatedHash(hash);
      setIsVerifying(false);
      setLastCheckTime('Just now');
    }, 350);
  };

  const handleTamperClick = () => {
    onSimulateTamper(doc, caseItem);
    // Calculated hash for tampered content
    const fakeTampered = 'c71e2891aa3fe0912837465abcde901234567890abcdef019283746501928374';
    setCalculatedHash(fakeTampered);
  };

  const handleRestoreClick = () => {
    onRestoreOriginal(doc, caseItem);
    setCalculatedHash(doc.storedHash);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
              isMatch ? 'bg-emerald-600' : 'bg-red-600 animate-pulse'
            }`}>
              {isMatch ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Cryptographic Integrity Verification
              </h2>
              <p className="text-[11px] text-slate-500">
                Case: <strong className="font-mono text-blue-700">#{caseItem?.caseNumber || doc.caseId}</strong> • Section 63 BSA Digital Seal
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
        <div className={`px-6 py-3.5 border-b flex items-center justify-between gap-3 text-xs ${
          isMatch
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-red-50 border-red-200 text-red-900 animate-pulse-subtle'
        }`}>
          <div className="flex items-center space-x-2">
            {isMatch ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-bold text-sm">
                  RESULT: ✓ INTEGRITY VERIFIED
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span className="font-bold text-sm">
                  RESULT: ⚠ INTEGRITY MISMATCH DETECTED
                </span>
              </>
            )}
          </div>

          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1 rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0"
          >
            {isVerifying ? 'Recalculating...' : 'Recalculate Hash'}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Document Specification Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">DOCUMENT:</span>
              <strong className="text-slate-900 text-xs truncate block mt-0.5">{doc.name}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">CURRENT VERSION:</span>
              <strong className="text-blue-700 font-mono text-xs block mt-0.5">{doc.currentVersion}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">CASE ID:</span>
              <span className="font-mono text-slate-700 text-xs block mt-0.5">#{caseItem?.caseNumber || doc.caseId}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">VERIFIED AT:</span>
              <span className="text-slate-600 text-xs block mt-0.5">{lastCheckTime}</span>
            </div>
          </div>

          {/* Hash Comparison Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Cryptographic Seal Comparison:
            </h4>

            {/* Stored Hash */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-500 uppercase tracking-wider">
                  STORED DIGITAL SEAL (Anchored in Repository Ledger):
                </span>
                <span className="text-blue-600 font-mono font-semibold">Ledger Root</span>
              </div>
              <div className="font-mono text-xs text-slate-900 bg-white p-2 rounded border border-slate-200 break-all select-all font-semibold">
                {doc.storedHash ? `${doc.storedHash.slice(0, 16)}••••••••••••••••${doc.storedHash.slice(-8)}` : 'N/A'}
              </div>
            </div>

            {/* Calculated Hash */}
            <div className={`border rounded-xl p-3 space-y-1 ${
              isMatch ? 'bg-slate-50 border-slate-200' : 'bg-red-50/70 border-red-200'
            }`}>
              <div className="flex items-center justify-between text-[11px]">
                <span className={`font-bold uppercase tracking-wider ${isMatch ? 'text-slate-500' : 'text-red-700'}`}>
                  COMPUTED LIVE FINGERPRINT (Evaluated from binary payload):
                </span>
                <span className={`font-mono font-semibold ${isMatch ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isMatch ? 'Matches 100%' : 'Mismatch Detected'}
                </span>
              </div>
              <div className={`font-mono text-xs p-2 rounded border break-all select-all font-semibold ${
                isMatch 
                  ? 'bg-white text-slate-900 border-slate-200' 
                  : 'bg-white text-red-700 border-red-300'
              }`}>
                {calculatedHash ? `${calculatedHash.slice(0, 16)}••••••••••••••••${calculatedHash.slice(-8)}` : 'Computing...'}
              </div>
            </div>
          </div>

          {/* Tamper Alert Callout if altered */}
          {!isMatch && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-red-800">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>INTEGRITY ALERT RECORDED IN AUDIT LEDGER</span>
              </div>
              <p className="text-[11px] leading-relaxed text-red-700">
                The calculated live fingerprint differs from the anchored state. The document content was altered without an authorized cryptographic version transition. This event has been permanently recorded in the Section 63 BSA audit trail.
              </p>
            </div>
          )}

          {/* Educational SIH Jury Callout */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-xs text-blue-900">
            <span className="font-bold block mb-0.5">Section 63 BSA Evidentiary Non-Repudiation:</span>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              In judicial proceedings, proving that electronic records have not been tampered with between seizure and trial is mandatory. Any alteration of a single byte immediately invalidates the cryptographic seal.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
          
          {/* Simulation Toggle Buttons */}
          <div className="flex items-center space-x-2">
            {!isTampered ? (
              <button
                onClick={handleTamperClick}
                className="inline-flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                title="Modifies 1 byte in memory to demonstrate tamper detection"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>Simulate Document Tampering</span>
              </button>
            ) : (
              <button
                onClick={handleRestoreClick}
                className="inline-flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Restore Original Document</span>
              </button>
            )}
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

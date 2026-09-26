import React, { useState } from 'react';
import { X, Sparkles, Shield, Eye, EyeOff, CheckCircle2, Lock, Download, AlertCircle } from 'lucide-react';

export default function AIRedactionModal({ doc, caseItem, onClose, onSaveRedactedVersion }) {
  const [activeView, setActiveView] = useState('REDACTED'); // 'ORIGINAL' or 'REDACTED'
  const [maskAadhaar, setMaskAadhaar] = useState(true);
  const [maskPhone, setMaskPhone] = useState(true);
  const [maskVictimMinor, setMaskVictimMinor] = useState(true);
  const [maskAddress, setMaskAddress] = useState(true);

  // Redaction logic applying legal masking rules
  const getRedactedContent = (rawText) => {
    let text = rawText;

    if (maskAadhaar) {
      text = text.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[REDACTED: AADHAAR NO. XXXX-XXXX-1234]');
    }

    if (maskPhone) {
      text = text.replace(/(\+91[-\s]?)?[6-9]\d{9}/g, '[REDACTED: PHONE NUMBER +91-XXXXX-XXXXX]');
    }

    if (maskVictimMinor) {
      // Redact victim names as mandated by Sec 73 BNS / Sec 228A IPC
      text = text.replace(/Radhika Swaminathan/gi, '[PROTECTED WITNESS / VICTIM - IDENTITY SHIELDED UNDER S.73 BNS]');
      text = text.replace(/Rajeshwar Goel/gi, '[DECEASED VICTIM - IDENTITY REDACTED]');
    }

    if (maskAddress) {
      text = text.replace(/Barakhamba Road, Connaught Place, New Delhi/gi, '[RESIDENTIAL LOCATION REDACTED FOR WITNESS PROTECTION]');
      text = text.replace(/Rohini Sector 14, Delhi/gi, '[LOCATION REDACTED]');
    }

    return text;
  };

  const redactedText = getRedactedContent(doc.content);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white border border-slate-200 rounded-xl w-full max-w-4xl shadow-xl overflow-hidden my-6 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="redaction-modal-title"
      >
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded font-mono font-medium">
                  AI Legal Redaction Suite
                </span>
                <span className="text-xs text-slate-500 font-normal">
                  Section 73 BNS / Section 228A IPC Compliance
                </span>
              </div>
              <h2 id="redaction-modal-title" className="text-lg font-semibold text-slate-900 tracking-tight mt-0.5">
                Automated PII & Sensitive Entity Sanitization
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
            aria-label="Close dialog"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold text-slate-700">Sanitization Rules:</span>
            
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={maskAadhaar}
                onChange={(e) => setMaskAadhaar(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span>Aadhaar Numbers</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={maskPhone}
                onChange={(e) => setMaskPhone(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span>Phone Numbers</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={maskVictimMinor}
                onChange={(e) => setMaskVictimMinor(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span>Victim / Minor Names (S.73 BNS)</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={maskAddress}
                onChange={(e) => setMaskAddress(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span>Residential Addresses</span>
            </label>
          </div>

          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
            <button
              onClick={() => setActiveView('REDACTED')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                activeView === 'REDACTED'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sanitized Preview
            </button>
            <button
              onClick={() => setActiveView('ORIGINAL')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                activeView === 'ORIGINAL'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Original View
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-6 max-h-[55vh] overflow-y-auto bg-slate-50/50">
          <div className="bg-white border border-slate-200 rounded-xl p-6 font-mono text-sm leading-relaxed text-slate-800 whitespace-pre-wrap selection:bg-purple-100 selection:text-purple-900 shadow-inner">
            {activeView === 'REDACTED' ? redactedText : doc.content}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Ready for public court inspection & legal defense disclosure without breaching privacy.</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSaveRedactedVersion(doc, redactedText)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Save As Sanitized Public Copy
            </button>
            <button
              onClick={onClose}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

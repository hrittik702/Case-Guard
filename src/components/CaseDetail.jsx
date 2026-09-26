import React, { useState } from 'react';
import { ArrowLeft, Plus, FileText, CheckCircle2, AlertTriangle, Shield, Eye, Lock, Copy, Check, Scale, User, Calendar, Cpu, Sparkles } from 'lucide-react';

export default function CaseDetail({
  caseItem,
  onBack,
  onOpenDocument,
  onVerifyDocument,
  onNewDocument,
  onSimulateTamper,
  onRedactDocument,
  onViewCert,
  currentRole
}) {
  const [docCategory, setDocCategory] = useState('ALL');
  const [copiedHash, setCopiedHash] = useState(null);

  const copyHash = (hash) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredDocs = caseItem.documents?.filter(doc => {
    if (docCategory === 'ALL') return true;
    return doc.type.toLowerCase().includes(docCategory.toLowerCase()) ||
           doc.category.toLowerCase().includes(docCategory.toLowerCase());
  }) || [];

  return (
    <div className="space-y-6">
      
      {/* Back button & top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Directory</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNewDocument(caseItem)}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-md shadow-blue-900/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Digitize & Ingest Document</span>
          </button>
        </div>
      </div>

      {/* Case Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-400 bg-blue-950/80 border border-blue-800 px-2.5 py-0.5 rounded">
                {caseItem.caseNumber}
              </span>
              <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full font-medium">
                {caseItem.status}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                caseItem.classification === 'Top Secret' ? 'bg-red-950/80 border-red-800 text-red-300' :
                caseItem.classification === 'Secret' ? 'bg-amber-950/80 border-amber-800 text-amber-300' :
                'bg-blue-950/80 border-blue-800 text-blue-300'
              }`}>
                <Lock className="w-3 h-3 inline mr-1" />
                {caseItem.classification}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight">
              {caseItem.title}
            </h1>

            <p className="text-sm text-slate-400 max-w-4xl leading-relaxed">
              {caseItem.summary}
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5 min-w-[260px] shrink-0">
            <div className="text-slate-400 font-medium border-b border-slate-800 pb-1 flex items-center justify-between">
              <span>Jurisdictional Bench & IO</span>
              <Scale className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div>
              <span className="text-slate-500">Police Station: </span>
              <span className="text-slate-200">{caseItem.policeStation}</span>
            </div>
            <div>
              <span className="text-slate-500">Presiding Court: </span>
              <span className="text-slate-200">{caseItem.courtName}</span>
            </div>
            <div>
              <span className="text-slate-500">Investigating Officer: </span>
              <span className="text-slate-200">{caseItem.investigatingOfficer}</span>
            </div>
            <div>
              <span className="text-slate-500">Public Prosecutor: </span>
              <span className="text-slate-200">{caseItem.publicProsecutor}</span>
            </div>
          </div>
        </div>

        {/* Acts and statutory provisions */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Penal Sections:
          </span>
          {caseItem.acts.map((act, i) => (
            <span key={i} className="text-xs bg-slate-800/80 text-blue-300 border border-slate-700/80 px-2.5 py-1 rounded">
              {act}
            </span>
          ))}
        </div>
      </div>

      {/* Document filter tabs & list */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 p-4 border-b border-slate-800 overflow-x-auto bg-slate-900/60">
          {[
            { id: 'ALL', label: 'All Documents' },
            { id: 'FIR', label: 'FIR & Police Reports' },
            { id: 'Witness', label: 'Witness Statements (S.180 BNSS)' },
            { id: 'Forensic', label: 'Forensic & Expert Reports' },
            { id: 'Charge', label: 'Charge Sheets (S.193 BNSS)' },
            { id: 'Court', label: 'Court & Judicial Orders' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setDocCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                docCategory === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Documents Table / Card List */}
        <div className="divide-y divide-slate-800">
          {filteredDocs.map((doc) => {
            const isSigned = !!doc.digitalSignature;
            const isTampered = doc.isTampered;

            return (
              <div
                key={doc.id}
                className={`p-5 transition-colors hover:bg-slate-800/30 ${
                  isTampered ? 'bg-red-950/20 border-l-4 border-red-500' : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left doc info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {doc.type}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                        doc.classification === 'Top Secret' ? 'bg-red-950/70 border-red-800 text-red-300' :
                        doc.classification === 'Secret' ? 'bg-amber-950/70 border-amber-800 text-amber-300' :
                        'bg-blue-950/70 border-blue-800 text-blue-300'
                      }`}>
                        {doc.classification}
                      </span>

                      {/* e-Signature Status badge */}
                      {isSigned ? (
                        <span className="text-xs bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>e-Signed by {doc.digitalSignature.signerName.split(' ')[0]}</span>
                        </span>
                      ) : (
                        <span className="text-xs bg-amber-950/80 border border-amber-800 text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span>Pending e-Sign</span>
                        </span>
                      )}

                      {/* Blockchain status */}
                      <span className="text-xs font-mono bg-indigo-950/80 border border-indigo-800 text-indigo-300 px-2 py-0.5 rounded">
                        Block #{doc.blockHeight ?? 1}
                      </span>

                      {isTampered && (
                        <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded animate-pulse flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          TAMPER DETECTED
                        </span>
                      )}
                    </div>

                    <h2
                      onClick={() => onOpenDocument(doc, caseItem)}
                      className="text-base font-bold text-white hover:text-blue-400 cursor-pointer transition-colors"
                    >
                      {doc.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-500" />
                        Authored by: <strong className="text-slate-300">{doc.author}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {new Date(doc.dateUploaded).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>Version: v{doc.version}</span>
                    </div>

                    {/* Cryptographic Evidence Seal Display */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
                        Fingerprint:
                      </span>
                      <code className="text-[11px] font-mono bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded truncate max-w-sm">
                        {doc.sha256 ? `${doc.sha256.slice(0, 16)}••••••••••••••••${doc.sha256.slice(-8)}` : 'N/A'}
                      </code>
                      <button
                        onClick={() => copyHash(doc.sha256)}
                        title="Copy Fingerprint"
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                      >
                        {copiedHash === doc.sha256 ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Right Action buttons */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenDocument(doc, caseItem)}
                      className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => onVerifyDocument(doc, caseItem)}
                      className="inline-flex items-center space-x-1.5 bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verify Integrity</span>
                    </button>

                    <button
                      onClick={() => onRedactDocument(doc, caseItem)}
                      title="AI Automated PII Redaction for Public Filing"
                      className="inline-flex items-center space-x-1.5 bg-purple-950/70 hover:bg-purple-900/80 text-purple-300 border border-purple-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>AI Redact</span>
                    </button>

                    <button
                      onClick={() => onViewCert(doc, caseItem)}
                      title="Generate Section 65B BSA Admissibility Certificate"
                      className="inline-flex items-center space-x-1.5 bg-blue-950/70 hover:bg-blue-900/80 text-blue-300 border border-blue-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Scale className="w-3.5 h-3.5 text-blue-400" />
                      <span>Sec 65B</span>
                    </button>

                    {/* Test Tamper Detection */}
                    <button
                      onClick={() => onSimulateTamper(doc, caseItem)}
                      title="Test Cryptographic Tamper Detection"
                      className="inline-flex items-center space-x-1 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/60 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-colors"
                    >
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      <span>Test Tamper</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}

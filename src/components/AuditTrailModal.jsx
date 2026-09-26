import React, { useState } from 'react';
import { History, Shield, AlertTriangle, CheckCircle2, Scale, Filter, Download, Printer, User, Clock, FileText } from 'lucide-react';

export default function AuditTrailModal({ auditLogs, activeCert, onCloseCert }) {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchRole = selectedRoleFilter === 'ALL' || log.role === selectedRoleFilter;
    const matchAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchRole && matchAction;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                Section 63 BSA / Sec 65B Evidence Act
              </span>
              <span className="text-xs text-slate-400">
                Immutable Forensic Activity Trail
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mt-1">
              <History className="w-6 h-6 text-emerald-400" />
              Compliance Audit Trail & Electronic Admissibility
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Every document view, export, cryptographic signature, tamper incident, and custody transfer is time-stamped with IP address and actor ID.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Audit Log</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Filter by User Role:</label>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Authorized Roles</option>
              <option value="police_io">Investigating Officer (Police)</option>
              <option value="fsl_analyst">CFSL Forensic Analyst</option>
              <option value="public_prosecutor">Public Prosecutor</option>
              <option value="judge">Judicial Magistrate / Judge</option>
              <option value="malkhana_custodian">Malkhana Custodian</option>
              <option value="vigilance_auditor">Vigilance & Compliance Officer</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Filter by Action Event:</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Logged Actions</option>
              <option value="DOCUMENT_VIEWED">Document Viewed</option>
              <option value="INTEGRITY_VERIFIED">Cryptographic Hash Verified</option>
              <option value="DIGITALLY_SIGNED">Digital Signature Applied</option>
              <option value="TAMPER_DETECTED">TAMPER / BREACH ALERT</option>
              <option value="CUSTODY_TRANSFERRED">Evidence Custody Handover</option>
              <option value="AI_REDACTION_APPLIED">AI PII Redaction</option>
              <option value="SEC65B_CERT_GENERATED">Section 65B Certificate Issued</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Logged Events ({filteredLogs.length})
          </span>
          <span className="text-xs text-slate-500">
            Recorded via Secure Intranet Telemetry
          </span>
        </div>

        <div className="divide-y divide-slate-800 overflow-x-auto">
          {filteredLogs.map((log) => {
            const isAlert = log.status === 'ALERT' || log.action === 'TAMPER_DETECTED';

            return (
              <div
                key={log.id}
                className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                  isAlert ? 'bg-red-950/30' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {log.id}
                    </span>
                    <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      isAlert
                        ? 'bg-red-900/80 text-red-200 border border-red-700 animate-pulse'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-blue-400 font-mono font-medium">
                      {log.caseId}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs">
                    {log.details}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span>Officer: <strong className="text-slate-400">{log.actorName}</strong> ({log.badge})</span>
                    <span>•</span>
                    <span>Origin IP: <code className="text-slate-400 font-mono">{log.ipAddress}</code></span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isAlert
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 65B / Section 63 BSA Admissibility Certificate Modal */}
      {activeCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-blue-500/50 rounded-2xl w-full max-w-3xl shadow-2xl p-8 space-y-6 my-8">
            
            {/* Certificate Header */}
            <div className="text-center border-b border-slate-800 pb-5">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-950 border border-blue-600 flex items-center justify-center mb-3">
                <Scale className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide uppercase">
                Certificate of Electronic Evidence Admissibility
              </h2>
              <p className="text-xs text-blue-400 font-semibold mt-1">
                {activeCert.actReference}
              </p>
              <div className="font-mono text-xs text-slate-500 mt-1">
                Certificate Identifier: {activeCert.certificateId}
              </div>
            </div>

            {/* Statutory Declaration */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed font-serif">
              "{activeCert.statement}"
            </div>

            {/* Document Evidence Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-slate-200 block border-b border-slate-800 pb-1">
                  Electronic Document Specifications
                </span>
                <div>
                  <span className="text-slate-500">Document Title: </span>
                  <span className="text-white font-medium">{activeCert.documentDetails.title}</span>
                </div>
                <div>
                  <span className="text-slate-500">Document Type: </span>
                  <span className="text-slate-300">{activeCert.documentDetails.type}</span>
                </div>
                <div>
                  <span className="text-slate-500">Classification: </span>
                  <span className="text-slate-300">{activeCert.documentDetails.classification}</span>
                </div>
                <div>
                  <span className="text-slate-500">Signature Status: </span>
                  <span className="text-emerald-400 font-semibold">{activeCert.documentDetails.digitalSignatureStatus}</span>
                </div>
                <div>
                  <span className="text-slate-500">Signatory: </span>
                  <span className="text-slate-300">{activeCert.documentDetails.signedBy}</span>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-slate-200 block border-b border-slate-800 pb-1">
                  Cryptographic Integrity & Blockchain Anchor
                </span>
                <div>
                  <span className="text-slate-500">Block Height: </span>
                  <span className="text-indigo-400 font-mono font-bold">Block #{activeCert.blockchainProof.blockHeight}</span>
                </div>
                <div>
                  <span className="text-slate-500">Validator Node: </span>
                  <span className="text-slate-300">{activeCert.blockchainProof.validatorNode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Digital Integrity Seal:</span>
                  <span className="font-mono text-[11px] text-amber-300 break-all select-all block bg-slate-900 p-1.5 rounded mt-1">
                    {activeCert.documentDetails.sha256Hash ? `${activeCert.documentDetails.sha256Hash.slice(0, 16)}••••••••••••••••${activeCert.documentDetails.sha256Hash.slice(-8)}` : 'Verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Certifying Authority Stamp */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Certifying Official:</span>
                <strong className="text-white text-sm block">{activeCert.certifyingAuthority.officerName}</strong>
                <span className="text-slate-400 block">{activeCert.certifyingAuthority.designation}</span>
                <span className="text-slate-500 text-[11px] block">{activeCert.certifyingAuthority.department}</span>
              </div>

              <div className="border-2 border-dashed border-emerald-600/60 rounded-lg p-3 text-center bg-emerald-950/20">
                <div className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-widest">
                  OFFICIALLY SEALED
                </div>
                <div className="text-xs font-bold text-white mt-0.5">
                  LEGAL DIGITAL CERTIFICATE
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  {new Date(activeCert.certifyingAuthority.certificationTimestamp).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeCert.legalStatus}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Signed Certificate</span>
                </button>
                <button
                  onClick={onCloseCert}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

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
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono font-medium">
                Section 63 BSA / Sec 65B Evidence Act
              </span>
              <span className="text-xs text-slate-500 font-normal">
                Immutable Forensic Activity Trail
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 mt-1">
              <History className="w-5 h-5 text-emerald-600" />
              Compliance Audit Trail & Electronic Admissibility
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Every document view, export, cryptographic signature, tamper incident, and custody transfer is time-stamped with IP address and actor ID.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Audit Log</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="audit-modal-role-filter" className="text-xs font-medium text-slate-600 block mb-1">Filter by User Role:</label>
            <select
              id="audit-modal-role-filter"
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xs"
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
            <label htmlFor="audit-modal-action-filter" className="text-xs font-medium text-slate-600 block mb-1">Filter by Action Event:</label>
            <select
              id="audit-modal-action-filter"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xs"
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
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">
            Logged Events ({filteredLogs.length})
          </span>
          <span className="text-xs text-slate-500">
            Recorded via Secure Intranet Telemetry
          </span>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {filteredLogs.map((log) => {
            const isAlert = log.status === 'ALERT' || log.action === 'TAMPER_DETECTED';

            return (
              <div
                key={log.id}
                className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                  isAlert ? 'bg-red-50/70 border-l-2 border-red-500' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-600 text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                      {log.id}
                    </span>
                    <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      isAlert
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-blue-600 font-mono font-medium">
                      {log.caseId}
                    </span>
                  </div>

                  <p className="text-slate-800 text-xs font-normal">
                    {log.details}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span>Officer: <strong className="text-slate-700 font-medium">{log.actorName}</strong> ({log.badge})</span>
                    <span>•</span>
                    <span>Origin IP: <code className="text-slate-600 font-mono">{log.ipAddress}</code></span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] text-slate-500 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isAlert
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div 
            className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl p-8 space-y-6 my-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="audit-cert-modal-title"
          >
            
            {/* Certificate Header */}
            <div className="text-center border-b border-slate-200 pb-5">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mb-3 text-blue-700">
                <Scale className="w-6 h-6 text-blue-600" />
              </div>
              <h2 id="audit-cert-modal-title" className="text-xl font-bold text-slate-900 tracking-wide uppercase">
                Certificate of Electronic Evidence Admissibility
              </h2>
              <p className="text-xs text-blue-700 font-semibold mt-1">
                {activeCert.actReference}
              </p>
              <div className="font-mono text-xs text-slate-500 mt-1">
                Certificate Identifier: {activeCert.certificateId}
              </div>
            </div>

            {/* Statutory Declaration */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 leading-relaxed font-serif">
              "{activeCert.statement}"
            </div>

            {/* Document Evidence Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-1">
                  Electronic Document Specifications
                </span>
                <div>
                  <span className="text-slate-500">Document Title: </span>
                  <span className="text-slate-900 font-medium">{activeCert.documentDetails.title}</span>
                </div>
                <div>
                  <span className="text-slate-500">Document Type: </span>
                  <span className="text-slate-700">{activeCert.documentDetails.type}</span>
                </div>
                <div>
                  <span className="text-slate-500">Classification: </span>
                  <span className="text-slate-700">{activeCert.documentDetails.classification}</span>
                </div>
                <div>
                  <span className="text-slate-500">Signature Status: </span>
                  <span className="text-emerald-700 font-semibold">{activeCert.documentDetails.digitalSignatureStatus}</span>
                </div>
                <div>
                  <span className="text-slate-500">Signatory: </span>
                  <span className="text-slate-700">{activeCert.documentDetails.signedBy}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-1">
                  Cryptographic Integrity & Blockchain Anchor
                </span>
                <div>
                  <span className="text-slate-500">Block Height: </span>
                  <span className="text-blue-700 font-mono font-bold">Block #{activeCert.blockchainProof.blockHeight}</span>
                </div>
                <div>
                  <span className="text-slate-500">Validator Node: </span>
                  <span className="text-slate-700">{activeCert.blockchainProof.validatorNode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Digital Integrity Seal:</span>
                  <span className="font-mono text-[11px] text-amber-800 break-all select-all block bg-white border border-slate-200 p-1.5 rounded mt-1">
                    {activeCert.documentDetails.sha256Hash ? `${activeCert.documentDetails.sha256Hash.slice(0, 16)}••••••••••••••••${activeCert.documentDetails.sha256Hash.slice(-8)}` : 'Verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Certifying Authority Stamp */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Certifying Official:</span>
                <strong className="text-slate-900 text-sm block">{activeCert.certifyingAuthority.officerName}</strong>
                <span className="text-slate-600 block">{activeCert.certifyingAuthority.designation}</span>
                <span className="text-slate-500 text-[11px] block">{activeCert.certifyingAuthority.department}</span>
              </div>

              <div className="border-2 border-dashed border-emerald-600/60 rounded-lg p-3 text-center bg-emerald-50">
                <div className="text-[10px] text-emerald-800 font-mono font-bold uppercase tracking-widest">
                  OFFICIALLY SEALED
                </div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  LEGAL DIGITAL CERTIFICATE
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  {new Date(activeCert.certifyingAuthority.certificationTimestamp).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{activeCert.legalStatus}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Signed Certificate</span>
                </button>
                <button
                  onClick={onCloseCert}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                  aria-label="Close certificate"
                  title="Close"
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

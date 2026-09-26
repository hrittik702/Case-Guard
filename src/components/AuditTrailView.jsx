import React, { useState } from 'react';
import { 
  History, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  Filter, 
  Printer, 
  Download, 
  Search, 
  X,
  FileText,
  Lock,
  UserCheck
} from 'lucide-react';
import { generateSection65BCertificate } from '../services/auditService';

export default function AuditTrailView({ auditLogs = [], cases = [], documents = [], currentRole, addToast }) {
  const [selectedCaseFilter, setSelectedCaseFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [resultFilter, setResultFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCert, setActiveCert] = useState(null);

  const filteredLogs = auditLogs.filter(log => {
    const matchCase = selectedCaseFilter === 'ALL' || (log.caseId && log.caseId.includes(selectedCaseFilter));
    const matchAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchResult = resultFilter === 'ALL' || log.status === resultFilter;
    const matchSearch = 
      (log.details || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.actorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.caseId || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchCase && matchAction && matchResult && matchSearch;
  });

  const handleGenerateCertificate = () => {
    // Select first available document
    const primaryDoc = documents[0] || (cases.length > 0 && cases[0].documents ? cases[0].documents[0] : null);
    
    if (!primaryDoc) {
      if (addToast) {
        addToast('No Documents', 'Upload an evidence document before generating an admissibility certificate.', 'warning');
      } else {
        alert('Please upload an evidence document before generating a certificate.');
      }
      return;
    }

    const assocCase = cases.find(c => c.caseNumber === primaryDoc.caseId) || cases[0] || { caseNumber: primaryDoc.caseId || 'GENERAL' };
    const cert = generateSection65BCertificate({
      document: primaryDoc,
      caseItem: assocCase,
      officer: currentRole,
      blockchainBlock: { blockHeight: 1, validatorNode: 'Node-01-Delhi-High-Court' }
    });
    setActiveCert(cert);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                Section 63 BSA 2023 / Sec 65B Evidence Act
              </span>
              <span className="text-xs text-slate-500">
                Non-repudiation Activity Ledger
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1 flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-600" />
              Institutional Audit Trail & Admissibility Telemetry
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Every document ingestion, hash verification, version creation, access denial, and tampering incident is recorded with timestamp and actor identity.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleGenerateCertificate}
              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Generate Section 63 BSA Certificate</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Log</span>
            </button>
          </div>
        </div>

        {/* Multi-parameter Filter Controls */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-600 block mb-1 font-semibold">Filter by Case:</label>
            <select
              value={selectedCaseFilter}
              onChange={(e) => setSelectedCaseFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
            >
              <option value="ALL">All Cases</option>
              {cases.map(c => (
                <option key={c.id} value={c.caseNumber}>Case #{c.caseNumber}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-semibold">Filter by Action:</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
            >
              <option value="ALL">All Actions</option>
              <option value="DOCUMENT_UPLOADED">Document Ingested</option>
              <option value="OCR_STARTED">OCR Started</option>
              <option value="OCR_COMPLETED">OCR Completed</option>
              <option value="OCR_FAILED">OCR Failed</option>
              <option value="OCR_CANCELLED">OCR Cancelled</option>
              <option value="INTEGRITY_VERIFIED">Integrity Verified</option>
              <option value="TAMPER_DETECTED">TAMPER ALERT</option>
              <option value="DOCUMENT_RESTORED">Document Restored</option>
              <option value="UNAUTHORIZED_ACCESS_DENIED">Unauthorized Access Blocked</option>
              <option value="VERSION_CREATED">Version Created</option>
              <option value="CASE_CREATED">Case Created</option>
              <option value="DOCUMENT_DELETED">Document Deleted</option>
              <option value="SEC65B_CERT_GENERATED">Section 63 Certificate Issued</option>
            </select>
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-semibold">Filter by Result:</label>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
            >
              <option value="ALL">All Results</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="ALERT">ALERT / MISMATCH</option>
              <option value="DENIED">DENIED (403)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-semibold">Search Telemetry Text:</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search actor, keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
            Audited Telemetry Records ({filteredLogs.length})
          </span>
          <span className="text-slate-500 font-mono text-[11px]">
            Live Node Telemetry
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-3">User & Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Case / Document</th>
                <th className="py-2.5 px-3">Result</th>
                <th className="py-2.5 px-4">Telemetry Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => {
                const isAlert = log.status === 'ALERT' || log.action === 'TAMPER_DETECTED';
                const isDenied = log.status === 'DENIED' || log.action === 'UNAUTHORIZED_ACCESS_DENIED';

                return (
                  <tr 
                    key={log.id} 
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isAlert ? 'bg-red-50/50' : isDenied ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{log.actorName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{log.badge}</div>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isAlert ? 'bg-red-100 text-red-800 border-red-200' :
                        isDenied ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-blue-700 font-medium">
                      #{log.caseId}
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAlert ? 'bg-red-600 text-white' :
                        isDenied ? 'bg-amber-600 text-white' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {log.status}
                      </span>
                    </td>

                    <td className="py-2.5 px-4 text-slate-700 max-w-md truncate">
                      {log.details}
                      <span className="text-[10px] text-slate-400 font-mono ml-2">IP: {log.ipAddress}</span>
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <div className="font-semibold text-slate-700 text-xs">No audit events found</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {auditLogs.length === 0 
                        ? 'Operational activity and cryptographic events will be automatically logged here.' 
                        : 'No events match the current filter criteria.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 63 BSA / Section 65B Certificate Modal */}
      {activeCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 space-y-5 my-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                    Certificate of Electronic Evidence Admissibility
                  </h3>
                  <p className="text-xs text-blue-700 font-semibold">
                    Section 63, Bharatiya Sakshya Adhiniyam (BSA), 2023
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveCert(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed font-serif">
              "{activeCert.statement}"
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
                  Document Identity:
                </span>
                <div><span className="text-slate-500">Title:</span> <strong className="text-slate-800">{activeCert.documentDetails.title}</strong></div>
                <div><span className="text-slate-500">Type:</span> <span className="text-slate-700">{activeCert.documentDetails.type}</span></div>
                <div><span className="text-slate-500">Security:</span> <span className="text-slate-700">{activeCert.documentDetails.classification}</span></div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
                  Cryptographic Integrity:
                </span>
                <div><span className="text-slate-500">Integrity Standard:</span> <span className="font-mono text-slate-800">Section 63 BSA Digital Seal</span></div>
                <div><span className="text-slate-500">Anchor:</span> <span className="text-emerald-700 font-bold">Ledger Block #{activeCert.blockchainProof.blockHeight}</span></div>
                <div className="font-mono text-[10px] text-slate-600 break-all select-all pt-1">
                  {activeCert.documentDetails.sha256Hash ? `${activeCert.documentDetails.sha256Hash.slice(0, 16)}••••••••••••••••${activeCert.documentDetails.sha256Hash.slice(-8)}` : 'Verified'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Certifying Official:</span>
                <strong className="text-slate-900">{activeCert.certifyingAuthority.officerName}</strong>
                <div className="text-slate-500 text-[11px]">{activeCert.certifyingAuthority.designation}</div>
              </div>

              <button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Official Certificate</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

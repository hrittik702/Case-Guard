import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  ArrowLeft, 
  Plus, 
  FileText, 
  ShieldCheck, 
  History, 
  Lock, 
  Activity, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Share2
} from 'lucide-react';
import { DocumentRepository } from '../services/documentRepository';
import { AuditRepository } from '../services/auditRepository';

export default function CaseWorkspace({
  caseItem,
  onBack,
  onOpenUpload,
  onViewDocument,
  onDownloadDocument,
  onDocumentDeleted,
  currentUser,
  currentRole,
  onOpenShare,
  addToast
}) {
  const [activeTab, setActiveTab] = useState('documents'); // 'overview' | 'documents' | 'activity' | 'access' | 'integrity'
  const [caseDocs, setCaseDocs] = useState([]);
  const [caseActivity, setCaseActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCaseData = async () => {
    try {
      setLoading(true);
      const docs = await DocumentRepository.getDocumentsByCase(caseItem.caseNumber);
      const activity = await AuditRepository.getAuditEventsByCase(caseItem.caseNumber);
      setCaseDocs(docs);
      setCaseActivity(activity);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaseData();
  }, [caseItem.caseNumber]);

  const handleVerifyDoc = async (doc) => {
    try {
      const res = await DocumentRepository.verifyDocumentIntegrity(doc.id);
      await AuditRepository.logAuditEvent({
        actor: currentRole,
        action: 'INTEGRITY_VERIFIED',
        targetType: 'DOCUMENT',
        targetId: doc.id,
        caseId: caseItem.caseNumber,
        result: res.valid ? 'SUCCESS' : 'ALERT',
        details: res.valid ? 'Hash verified.' : 'Integrity mismatch detected.'
      });

      if (res.valid) {
        addToast('Integrity Verified', `"${doc.name}" matches stored cryptographic checksum.`, 'success');
      } else {
        addToast('Integrity Alert', `Corrupted bytes detected for "${doc.name}"!`, 'error');
      }
      loadCaseData();
    } catch (e) {
      addToast('Error', e.message, 'error');
    }
  };

  const handleSimulateTamper = async (doc) => {
    try {
      await DocumentRepository.simulateDocumentTamper(doc.id);
      await AuditRepository.logAuditEvent({
        actor: currentRole,
        action: 'TAMPER_DETECTED',
        targetType: 'DOCUMENT',
        targetId: doc.id,
        caseId: caseItem.caseNumber,
        result: 'ALERT',
        details: `Simulated tamper injected into "${doc.name}".`
      });
      addToast('Tamper Injected', `Corrupted 1 byte in "${doc.name}". Re-verify to see hash mismatch.`, 'warning');
      loadCaseData();
    } catch (e) {
      addToast('Error', e.message, 'error');
    }
  };

  const handleRestoreDoc = async (doc) => {
    try {
      await DocumentRepository.restoreDocument(doc.id);
      await AuditRepository.logAuditEvent({
        actor: currentRole,
        action: 'DOCUMENT_RESTORED',
        targetType: 'DOCUMENT',
        targetId: doc.id,
        caseId: caseItem.caseNumber,
        result: 'SUCCESS',
        details: `Restored authentic original file for "${doc.name}".`
      });
      addToast('Restored', `Authentic original file restored for "${doc.name}".`, 'success');
      loadCaseData();
    } catch (e) {
      addToast('Error', e.message, 'error');
    }
  };

  const handleDeleteDoc = async (doc) => {
    if (!currentRole.permissions.includes('delete')) {
      await AuditRepository.logAuditEvent({
        actor: currentRole,
        action: 'UNAUTHORIZED_ACCESS_DENIED',
        targetType: 'DOCUMENT',
        targetId: doc.id,
        caseId: caseItem.caseNumber,
        result: 'DENIED',
        details: `403 Forbidden: Role "${currentRole.name}" cannot delete document "${doc.name}".`
      });
      addToast('Access Denied', `Role "${currentRole.name}" cannot delete documents.`, 'error');
      return;
    }

    if (window.confirm(`Delete "${doc.name}"?`)) {
      await DocumentRepository.deleteDocument(doc.id);
      await AuditRepository.logAuditEvent({
        actor: currentRole,
        action: 'DOCUMENT_DELETED',
        targetType: 'DOCUMENT',
        targetId: doc.id,
        caseId: caseItem.caseNumber,
        result: 'SUCCESS',
        details: `Deleted "${doc.name}".`
      });
      addToast('Deleted', `"${doc.name}" deleted.`, 'info');
      onDocumentDeleted && onDocumentDeleted(doc.id);
      loadCaseData();
    }
  };

  const handleUnauthorizedTest = async () => {
    await AuditRepository.logAuditEvent({
      actor: currentRole,
      action: 'UNAUTHORIZED_ACCESS_DENIED',
      targetType: 'CASE',
      targetId: caseItem.id,
      caseId: caseItem.caseNumber,
      result: 'DENIED',
      details: `403 Forbidden: Role "${currentRole.name}" attempted restricted case management.`
    });
    addToast('403 Access Denied', `Action restricted by RBAC policy for "${currentRole.name}".`, 'warning');
    loadCaseData();
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: `Documents (${caseDocs.length})` },
    { id: 'activity', label: `Activity (${caseActivity.length})` },
    { id: 'access', label: 'Access Control' },
    { id: 'integrity', label: 'Integrity' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cases</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenUpload(caseItem.caseNumber)}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Upload to Case</span>
          </button>
        </div>
      </div>

      {/* Case Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
            CASE #{caseItem.caseNumber}
          </span>
          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
            {caseItem.type}
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            caseItem.priority === 'Critical' || caseItem.priority === 'High' 
              ? 'bg-red-50 text-red-700 border-red-200' 
              : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}>
            Priority: {caseItem.priority}
          </span>
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
            {caseItem.status}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {caseItem.title}
        </h1>

        {caseItem.description && (
          <p className="text-xs text-slate-600 max-w-4xl leading-relaxed">
            {caseItem.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Created: <strong className="text-slate-700">{new Date(caseItem.createdAt).toLocaleDateString()}</strong></span>
          <span>•</span>
          <span>Documents: <strong className="text-slate-700">{caseDocs.length} files</strong></span>
          <span>•</span>
          <span>Last Activity: <strong className="text-slate-700">{new Date(caseItem.updatedAt).toLocaleTimeString()}</strong></span>
        </div>
      </div>

      {/* Case Workspace Tabs */}
      <div className="border-b border-slate-200 flex items-center space-x-2 bg-white px-2 rounded-t-xl overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-800">Case Overview & Scope</h3>
          <p className="text-slate-600 leading-relaxed">
            {caseItem.description || 'No detailed description provided for this case.'}
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
            <strong>Case ID:</strong> <span className="font-mono text-slate-800">{caseItem.caseNumber}</span> • 
            <strong className="ml-2">Type:</strong> {caseItem.type} • 
            <strong className="ml-2">Status:</strong> {caseItem.status}
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
            <span className="font-bold text-slate-700">Documents in Case ({caseDocs.length})</span>
            <button
              onClick={() => onOpenUpload(caseItem.caseNumber)}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              + Upload File
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase">
                  <th className="py-2.5 px-4">Filename</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Version</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Integrity</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {caseDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-bold text-slate-900">
                      <span 
                        onClick={() => onViewDocument(doc)} 
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        {doc.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{doc.category || 'Record'}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{doc.currentVersion}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{(doc.size / 1024).toFixed(1)} KB</td>
                    <td className="py-2.5 px-3">
                      {doc.isTampered ? (
                        <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                          MISMATCH
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          VERIFIED
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => onViewDocument(doc)}
                        className="p-1 text-slate-500 hover:text-blue-600 rounded"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenShare && onOpenShare(doc)}
                        className="p-1 text-slate-500 hover:text-blue-600 rounded"
                        title="Delegate Access (PoLP)"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleVerifyDoc(doc)}
                        className="p-1 text-slate-500 hover:text-emerald-600 rounded"
                        title="Verify Integrity"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(doc)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {caseDocs.length === 0 && (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="font-bold text-slate-700 text-xs">No documents uploaded to this case</div>
                <p className="text-[11px] text-slate-500">Upload a file to begin building this case dossier.</p>
                <button
                  onClick={() => onOpenUpload(caseItem.caseNumber)}
                  className="mt-2 inline-flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Document</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVITY */}
      {activeTab === 'activity' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3 text-xs">
          <h3 className="font-bold text-slate-800 text-sm">Case Audit Trail</h3>
          <div className="space-y-2">
            {caseActivity.map(ev => (
              <div key={ev.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-800">{ev.action.replace(/_/g, ' ')}</span>
                  <span className="font-mono text-slate-400 text-[10px]">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-[11px] text-slate-600">{ev.details}</p>
                <div className="text-[10px] text-slate-400 font-mono">By: {ev.actorName} ({ev.role})</div>
              </div>
            ))}

            {caseActivity.length === 0 && (
              <div className="p-6 text-center text-slate-400">
                No activity recorded for this case yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: ACCESS CONTROL */}
      {activeTab === 'access' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Role-Based Access</h3>
              <p className="text-slate-500 text-[11px]">Active role: <strong>{currentRole.name}</strong> ({currentRole.clearance})</p>
            </div>
            <button
              onClick={handleUnauthorizedTest}
              className="inline-flex items-center space-x-1 bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-100"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>Test Unauthorized Access Denial</span>
            </button>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 leading-relaxed">
            Case files are governed by the principle of least privilege. Investigation Officers and Administrators hold primary management rights.
          </div>
        </div>
      )}

      {/* TAB 5: INTEGRITY */}
      {activeTab === 'integrity' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-800 text-sm">Case Cryptographic Integrity Matrix</h3>
          <div className="space-y-3">
            {caseDocs.map(d => (
              <div key={d.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-slate-900">{d.name} ({d.currentVersion})</div>
                  <div className="font-mono text-[10px] text-slate-500 break-all">
                    Digital Fingerprint: <span className="text-slate-800">{d.storedHash ? `${d.storedHash.slice(0, 16)}••••••••••••••••${d.storedHash.slice(-8)}` : 'Anchored'}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleVerifyDoc(d)}
                    className="inline-flex items-center space-x-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1 rounded text-xs font-semibold"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verify</span>
                  </button>

                  {!d.isTampered ? (
                    <button
                      onClick={() => handleSimulateTamper(d)}
                      className="inline-flex items-center space-x-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded text-xs font-semibold"
                    >
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                      <span>Tamper</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRestoreDoc(d)}
                      className="inline-flex items-center space-x-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded text-xs font-semibold"
                    >
                      <RotateCcw className="w-3 h-3 text-emerald-600" />
                      <span>Restore</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {caseDocs.length === 0 && (
              <div className="p-6 text-center text-slate-400">
                No files in this case to verify.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

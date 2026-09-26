import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Cpu, 
  Database, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { computeSHA256 } from '../services/cryptoService';

export default function SecureUploadModal({ caseItem, onClose, onUploadComplete, currentRole }) {
  const [docName, setDocName] = useState('Bank_Forensic_Audit_Trail_Exhibit_B.pdf');
  const [docType, setDocType] = useState('Investigation Report');
  const [classification, setClassification] = useState('Confidential');
  const [docContent, setDocContent] = useState(`BANK FORENSIC AUDIT TRAIL & RTGS ROUTING REPORT
Case Reference: ${caseItem?.caseNumber || 'INV-2026-0142'}
Examined Account: Indus Horizon Bank Ltd (A/C #4401928102)
Transaction Count: 14 outbound RTGS batches
Originating IP: 185.220.101.44 (Frankfurt Cloud Exit Gateway)
Total Value Diverted: INR 3,84,50,000/-
Beneficiary Entities: 14 identified mule accounts in Surat and Kolkata branches.
Certified authentic by Internal Security Operations Center (SOC).`);

  // Stage: 'FORM' | 'PROCESSING' | 'SUCCESS'
  const [stage, setStage] = useState('FORM');
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [generatedHash, setGeneratedHash] = useState('');

  const steps = [
    { title: 'Uploading payload binary stream', detail: 'Transferring over TLS 1.3 tunnel' },
    { title: 'File validation & MIME check', detail: 'Verified application/pdf format' },
    { title: 'Cryptographic Fingerprint Generation', detail: 'Calculating mathematical digital seal' },
    { title: 'Payload Envelope Encryption', detail: 'Deriving ephemeral key & sealing payload' },
    { title: 'Metadata & OCR Extraction (Simulated)', detail: 'Extracted penal keywords & timestamps' },
    { title: 'Version V1 Creation & Storage Commit', detail: 'Anchored to case dossier repository' },
    { title: 'Audit Event Recorded', detail: 'Committed to Section 63 BSA legal trail' }
  ];

  const handleStartUpload = async (e) => {
    e.preventDefault();
    setStage('PROCESSING');
    setProgressPercent(15);
    setCurrentStepIndex(0);

    // Compute live hash
    const hash = await computeSHA256(docContent);
    setGeneratedHash(hash);

    // Step-by-step progress simulation
    setTimeout(() => {
      setProgressPercent(30);
      setCurrentStepIndex(1);
    }, 400);

    setTimeout(() => {
      setProgressPercent(50);
      setCurrentStepIndex(2);
    }, 850);

    setTimeout(() => {
      setProgressPercent(70);
      setCurrentStepIndex(3);
    }, 1300);

    setTimeout(() => {
      setProgressPercent(85);
      setCurrentStepIndex(4);
    }, 1750);

    setTimeout(() => {
      setProgressPercent(95);
      setCurrentStepIndex(5);
    }, 2100);

    setTimeout(() => {
      setProgressPercent(100);
      setCurrentStepIndex(6);
    }, 2450);

    setTimeout(() => {
      setStage('SUCCESS');
    }, 2850);
  };

  const handleCommitDocument = () => {
    const newDoc = {
      id: `DOC-${Date.now().toString(36).toUpperCase()}`,
      name: docName,
      type: docType,
      caseId: caseItem.caseNumber,
      currentVersion: 'V1',
      uploadedBy: currentRole.name,
      uploadDate: 'Just now',
      fileSize: '1.9 MB',
      classification,
      integrityStatus: 'VERIFIED',
      accessLevel: classification === 'Top Secret' ? 'Special Clearance' : 'Restricted',
      storedHash: generatedHash,
      sha256: generatedHash,
      blockHeight: 8,
      ocrStatus: 'Completed (Simulated)',
      ocrKeywords: ['RTGS trace', 'Frankfurt IP', 'SOC report', 'mule accounts'],
      content: docContent,
      versions: [
        {
          version: 'V1',
          isCurrent: true,
          modifiedBy: currentRole.name,
          date: 'Just now',
          fileSize: '1.9 MB',
          hash: generatedHash,
          changeDescription: 'Initial secure upload and cryptographic sealing.'
        }
      ]
    };

    onUploadComplete(caseItem.id, newDoc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Secure Document Ingestion & Verification
              </h2>
              <p className="text-[11px] text-slate-500">
                Case: <strong className="font-mono text-blue-700">#{caseItem?.caseNumber || 'INV-2026-0142'}</strong> • Uploading as {currentRole.name}
              </p>
            </div>
          </div>

          {stage !== 'PROCESSING' && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* STAGE 1: FORM SELECTION */}
        {stage === 'FORM' && (
          <form onSubmit={handleStartUpload} className="p-6 space-y-4 text-xs">
            
            {/* File Drag and Drop Card */}
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center bg-slate-50/50 cursor-pointer transition-colors">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-slate-800 text-xs">
                {docName}
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Size: 1.9 MB • Format: Certified Portable Document (PDF)
              </span>
              <span className="inline-block mt-2 text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-medium">
                Change File...
              </span>
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-semibold">Document Title / File Name:</label>
              <input
                type="text"
                required
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Document Type:</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Investigation Report">Investigation Report</option>
                  <option value="FIR">First Information Report (FIR)</option>
                  <option value="Witness Statement">Witness Statement</option>
                  <option value="Forensic Report">Forensic Report (CFSL)</option>
                  <option value="Evidence Record">Evidence Record</option>
                  <option value="Legal Notice">Legal Notice / Order</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Security Classification:</label>
                <select
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Confidential">Confidential</option>
                  <option value="Secret">Secret</option>
                  <option value="Top Secret">Top Secret</option>
                  <option value="Restricted">Restricted</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-semibold">Document Content Extract (For Hashing):</label>
              <textarea
                rows={4}
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <span>Execute Ingestion & Hashing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STAGE 2: REAL-TIME PROCESSING SIMULATION */}
        {stage === 'PROCESSING' && (
          <div className="p-6 space-y-5 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-800">
                  Processing Evidence Lifecycle
                </span>
                <span className="font-mono font-bold text-blue-600">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-2 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Checklist of steps */}
            <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
              {steps.map((step, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={idx} className="flex items-start space-x-2.5">
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`font-semibold ${isDone ? 'text-slate-800' : isCurrent ? 'text-blue-700' : 'text-slate-400'}`}>
                        {step.title}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {step.detail}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {generatedHash && (
              <div className="p-3 bg-white border border-slate-200 rounded-lg font-mono text-[11px]">
                <span className="text-slate-400 text-[10px] uppercase block font-semibold">Live Computed Digital Fingerprint:</span>
                <span className="text-slate-900 break-all select-all font-bold">
                  {generatedHash ? `${generatedHash.slice(0, 16)}••••••••••••••••${generatedHash.slice(-8)}` : 'Computing...'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* STAGE 3: SUCCESS STATE */}
        {stage === 'SUCCESS' && (
          <div className="p-6 space-y-4 text-xs">
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Document Successfully Ingested & Verified
              </h3>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Version V1 created and cryptographically anchored to Case #{caseItem.caseNumber}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Document Name:</span>
                <strong className="text-slate-900">{docName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Version:</span>
                <span className="font-mono font-bold text-blue-700">V1 (Initial Sealed)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Classification:</span>
                <span className="font-semibold text-slate-800">{classification}</span>
              </div>
              <div className="border-t border-slate-200 pt-2">
                <span className="text-slate-500 block text-[10px] uppercase">Digital Integrity Seal:</span>
                <span className="font-mono text-[11px] text-slate-900 break-all select-all font-medium">
                  {generatedHash ? `${generatedHash.slice(0, 16)}••••••••••••••••${generatedHash.slice(-8)}` : 'Sealed'}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-[11px]">
                <span className="text-slate-500">Audit Status:</span>
                <span className="text-emerald-700 font-semibold">✓ Event Committed to Legal Trail</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                onClick={handleCommitDocument}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold shadow-xs transition-colors text-center"
              >
                Add Document to Case Dossier
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

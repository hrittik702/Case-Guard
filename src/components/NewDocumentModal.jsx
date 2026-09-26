import React, { useState } from 'react';
import { X, FilePlus, Shield, Stamp, FileText, CheckCircle2 } from 'lucide-react';
import { computeSHA256, generateDigitalSignature } from '../services/cryptoService';

export default function NewDocumentModal({ caseItem, onClose, onAddDocument, currentRole }) {
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('Witness Statement');
  const [classification, setClassification] = useState('Confidential');
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadSampleTemplate = () => {
    setTitle(`Witness Statement - Section 180 BNSS (Examined at Scene)`);
    setDocType('Witness Statement');
    setContent(`STATEMENT OF WITNESS RECORDED UNDER SECTION 180 BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023
(Corresponding to Section 161 Cr.P.C.)

Case Reference: ${caseItem.caseNumber}
Police Station: ${caseItem.policeStation}
Investigating Officer: ${currentRole.name} (${currentRole.badge})
Date of Examination: ${new Date().toLocaleDateString()}

Witness Details:
Name: Sh. Harish Chandra Verma, Age: 42 yrs
Address: 104, Green Park Extension, New Delhi
Mobile: +91-9810234567

Statement:
I was present at the location on the evening of the incident. At approximately 19:45 hrs, I observed two individuals arriving on a black motorcycle without a registration plate. One of the suspects approached the premises carrying a dark nylon backpack. Within 15 minutes, both fled the scene heading toward the Outer Ring Road. I can identify the rider if presented during a Test Identification Parade (TIP).

Recorded by:
${currentRole.name}, ${currentRole.designation}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsProcessing(true);
    
    // 1. Compute cryptographic fingerprint
    const sha256 = await computeSHA256(content);

    // 2. Generate digital signature using active officer's credentials
    const digitalSignature = generateDigitalSignature(currentRole, sha256);

    const newDoc = {
      id: `DOC-${Date.now().toString(36).toUpperCase()}`,
      title,
      type: docType,
      category: 'Investigation Record',
      dateUploaded: new Date().toISOString(),
      author: currentRole.name,
      classification,
      version: '1.0',
      sha256,
      digitalSignature,
      content,
      tags: [docType, caseItem.caseNumber],
      blockchainStatus: 'COMMITTED'
    };

    setTimeout(() => {
      setIsProcessing(false);
      onAddDocument(caseItem.id, newDoc);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center">
              <FilePlus className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Digitize & Cryptographically Seal Document
              </h2>
              <p className="text-xs text-slate-400">
                Case: <strong className="text-blue-300 font-mono">{caseItem.caseNumber}</strong> • Ingesting as {currentRole.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Drafting official document</span>
            <button
              type="button"
              onClick={loadSampleTemplate}
              className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Fill Sample Witness Deposition Template
            </button>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">Document Title:</label>
            <input
              type="text"
              required
              placeholder="e.g., Witness Statement of Sh. Harish Verma under Section 180 BNSS"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">Document Type:</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="FIR">First Information Report (FIR)</option>
                <option value="Witness Statement">Witness Statement (Sec 180 BNSS)</option>
                <option value="Forensic Report">Forensic Science Report (CFSL)</option>
                <option value="Charge Sheet">Police Final Report / Charge Sheet (Sec 193 BNSS)</option>
                <option value="Seizure Memo">Seizure Memo & Panchnama</option>
                <option value="Court Order">Judicial Order / Warrant</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">Security Clearance Level:</label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Confidential">Confidential</option>
                <option value="Secret">Secret</option>
                <option value="Top Secret">Top Secret</option>
                <option value="Restricted">Restricted</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">Document Text / Record Body:</label>
            <textarea
              required
              rows={8}
              placeholder="Paste or draft legal document contents here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-slate-400">
              <Stamp className="w-4 h-4 text-emerald-400" />
              <span>Will be signed as: <strong className="text-white">{currentRole.name}</strong> ({currentRole.badge})</span>
            </div>
            <span className="text-[11px] text-blue-400 font-mono">Digital Integrity Auto-Sealing</span>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-xs font-semibold shadow-md shadow-blue-900/40 flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Mining Block & Hashing...' : 'Digitize, e-Sign & Anchor to Ledger'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

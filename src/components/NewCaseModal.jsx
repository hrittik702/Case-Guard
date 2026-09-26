import React, { useState } from 'react';
import { X, FolderPlus, Shield } from 'lucide-react';
import { computeSHA256, generateDigitalSignature } from '../services/cryptoService';

export default function NewCaseModal({ onClose, onAddCase, currentRole }) {
  const [caseNumber, setCaseNumber] = useState('FIR No. 0588/2024');
  const [title, setTitle] = useState('State vs. Suraj Patel & Ors. (Narcotics & Contraband Seizure)');
  const [policeStation, setPoliceStation] = useState('Special Task Force (Anti-Narcotics), New Delhi');
  const [courtName, setCourtName] = useState('Special NDPS Court, Patiala House Courts, New Delhi');
  const [acts, setActs] = useState('Section 20(b)(ii)(C) & 29 NDPS Act 1985; Section 61(2) BNS 2023');
  const [summary, setSummary] = useState('Interception of illicit commercial quantity narcotic shipment concealed in courier air cargo terminal with cross-border linkages.');
  const [classification, setClassification] = useState('Secret');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const caseId = `CASE-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const firContent = `FIRST INFORMATION REPORT UNDER SECTION 173 BNSS 2023
Police Station: ${policeStation}
Case: ${caseNumber} | Date: ${new Date().toISOString().split('T')[0]}

Complainant / Reporting Officer: ${currentRole.name} (${currentRole.badge})
Title: ${title}
Acts & Sections: ${acts}

Incident Summary:
${summary}

Recorded and verified under official police seal.`;

    const firHash = await computeSHA256(firContent);
    const signature = generateDigitalSignature(currentRole, firHash);

    const initialDoc = {
      id: `DOC-${caseId}-FIR`,
      title: `First Information Report (${caseNumber})`,
      type: 'FIR',
      category: 'Police Record',
      dateUploaded: new Date().toISOString(),
      author: currentRole.name,
      classification,
      version: '1.0',
      sha256: firHash,
      digitalSignature: signature,
      content: firContent,
      tags: ['FIR', 'Initial Registration'],
      blockchainStatus: 'COMMITTED'
    };

    const newCase = {
      id: caseId,
      caseNumber,
      title,
      policeStation,
      courtName,
      investigatingOfficer: `${currentRole.name} (${currentRole.badge})`,
      publicProsecutor: 'Advocate R. K. Shrivastava',
      presidingJudge: 'Hon\'ble Sessions Judge',
      status: 'Under Investigation',
      dateRegistered: new Date().toISOString().split('T')[0],
      classification,
      acts: acts.split(';').map(s => s.trim()),
      summary,
      documents: [initialDoc]
    };

    onAddCase(newCase, initialDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Register New Police Case & File FIR
              </h2>
              <p className="text-xs text-slate-400">
                Creates a digitally sealed case dossier with automated genesis FIR hashing
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">FIR / Crime Number:</label>
            <input
              type="text"
              required
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Case Title / Cause Title:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Police Station / Branch:</label>
              <input
                type="text"
                required
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Jurisdictional Court:</label>
              <input
                type="text"
                required
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Statutory Acts & Sections (separated by semicolon):</label>
            <input
              type="text"
              required
              value={acts}
              onChange={(e) => setActs(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Security Clearance Level:</label>
            <select
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Confidential">Confidential</option>
              <option value="Secret">Secret</option>
              <option value="Top Secret">Top Secret</option>
              <option value="Restricted">Restricted</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Brief Case Summary / Gist:</label>
            <textarea
              required
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-md"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Create Sealed Case & Mine FIR</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

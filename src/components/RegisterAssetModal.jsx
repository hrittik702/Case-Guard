import React, { useState } from 'react';
import { X, Package, Shield } from 'lucide-react';
import { computeSHA256 } from '../services/cryptoService';

export default function RegisterAssetModal({ cases, onClose, onAddAsset, currentRole }) {
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || '');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Digital Device');
  const [seizureLocation, setSeizureLocation] = useState('Crime Scene / Search Warrant Premises');
  const [storageLocation, setStorageLocation] = useState('Locker Vault Bay-02, Central Malkhana');
  const [tamperBagSeal, setTamperBagSeal] = useState(`SEAL-DL-POLICE-${Math.floor(10000 + Math.random() * 90000)}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    const chosenCase = cases.find(c => c.id === selectedCaseId) || cases[0];
    const barcode = `BAR-MALK-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const rawAssetString = `${name}:${category}:${barcode}:${tamperBagSeal}:${new Date().toISOString()}`;
    const evidenceHash = await computeSHA256(rawAssetString);

    const newAsset = {
      id: `ASSET-EV-${Date.now().toString(36).toUpperCase()}`,
      caseId: chosenCase.id,
      caseNumber: chosenCase.caseNumber,
      name,
      category,
      barcode,
      seizureDate: new Date().toISOString().split('T')[0],
      seizureLocation,
      seizingOfficer: currentRole.name,
      currentCustodian: currentRole.name,
      storageLocation,
      tamperBagSeal,
      sha256EvidenceHash: evidenceHash,
      lifecycleState: 'STORED_IN_MALKHANA',
      custodyChain: [
        {
          step: 1,
          action: 'EVIDENCE_SEIZED_AND_REGISTERED',
          from: 'Seized during Search / Investigation',
          to: `${currentRole.name} (${currentRole.badge})`,
          date: new Date().toISOString(),
          purpose: 'Malkhana Entry & Seizure Panchnama',
          signatures: [currentRole.badge, 'PANCHNAMA-WIT-01'],
          blockHeight: 1
        }
      ]
    };

    onAddAsset(newAsset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-950 border border-amber-800 flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Register Seized Property in Malkhana
              </h2>
              <p className="text-xs text-slate-400">
                Creates an evidentiary asset with barcode and cryptographic integrity seal
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Associated Case / FIR:</label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              {cases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} - {c.title.slice(0, 45)}...
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Evidence Item Name & Model / Specs:</label>
            <input
              type="text"
              required
              placeholder="e.g. Apple iPhone 15 Pro, Black (IMEI: 358921094829102)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Asset Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Digital Device">Digital Device (Mobile, Laptop, Drive)</option>
                <option value="Firearm / Weapon">Firearm / Ammunition / Weapon</option>
                <option value="Narcotics">Narcotics / Chemical Substance</option>
                <option value="Currency / Valuables">Currency / Gold / Valuables</option>
                <option value="Vehicular Property">Vehicle / Transport Asset</option>
                <option value="Physical Document Parcel">Physical Document Parcel</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Tamper-Evident Bag Seal No:</label>
              <input
                type="text"
                required
                value={tamperBagSeal}
                onChange={(e) => setTamperBagSeal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Seizure Location & Panchnama Memo Ref:</label>
            <input
              type="text"
              required
              value={seizureLocation}
              onChange={(e) => setSeizureLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-semibold">Malkhana Storage Vault Location:</label>
            <input
              type="text"
              required
              value={storageLocation}
              onChange={(e) => setStorageLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2 rounded font-semibold flex items-center gap-1.5 shadow-md"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Register & Mine Asset Block</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

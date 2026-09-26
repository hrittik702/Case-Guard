import React, { useState } from 'react';
import { Package, Shield, QrCode, ArrowRight, UserCheck, CheckCircle2, Lock, Plus, Search, Building2, Calendar, MapPin, Truck } from 'lucide-react';

export default function AssetMalkhana({
  assets,
  onTransferCustody,
  onRegisterAsset,
  currentRole
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [targetCustodian, setTargetCustodian] = useState('Dr. Ananya Sharma (CFSL Cyber Lab)');
  const [transferPurpose, setTransferPurpose] = useState('Forensic bitstream extraction & analysis');
  const [targetState, setTargetState] = useState('AT_FSL_LAB');

  const filteredAssets = assets.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInitiateTransfer = (asset) => {
    setSelectedAsset(asset);
    setTransferModalOpen(true);
  };

  const handleExecuteTransfer = () => {
    if (!selectedAsset) return;
    onTransferCustody({
      assetId: selectedAsset.id,
      toCustodian: targetCustodian,
      purpose: transferPurpose,
      targetState: targetState
    });
    setTransferModalOpen(false);
    setSelectedAsset(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-amber-400" />
              Police Asset & Malkhana Evidence Lifecycle Tracker
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Complete physical-to-digital chain of custody monitoring for case exhibits, firearms, digital drives, and seized property.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRegisterAsset}
              className="inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-amber-950/40 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Register Seized Property (Malkhana Memo)</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by evidence item, barcode number, FIR number, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Asset Grid & Detailed Custody Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Asset Cards List */}
        <div className="lg:col-span-1 space-y-4">
          {filteredAssets.map(asset => {
            const isSelected = selectedAsset?.id === asset.id;

            return (
              <div
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-500/80 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/70 border border-amber-800 px-2 py-0.5 rounded">
                    {asset.barcode}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    asset.lifecycleState === 'AT_FSL_LAB' ? 'bg-purple-950/80 border-purple-800 text-purple-300' :
                    asset.lifecycleState === 'STORED_IN_MALKHANA' ? 'bg-blue-950/80 border-blue-800 text-blue-300' :
                    'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                  }`}>
                    {asset.lifecycleState.replace(/_/g, ' ')}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-white mb-1">
                  {asset.name}
                </h2>

                <div className="text-xs text-slate-400 space-y-1 mb-3">
                  <div>
                    <span className="text-slate-500">Case: </span>
                    <span className="text-slate-300 font-mono">{asset.caseNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Current Custody: </span>
                    <strong className="text-slate-200">{asset.currentCustodian}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Tamper Seal: </span>
                    <span className="font-mono text-slate-300">{asset.tamperBagSeal}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-500">{asset.category}</span>
                  <span className="text-amber-400 font-medium">Inspect Chain &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Custody Chain Detail View */}
        <div className="lg:col-span-2">
          {selectedAsset ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
              
              {/* Asset header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold bg-amber-950 border border-amber-800 text-amber-300 px-2 py-0.5 rounded">
                      {selectedAsset.barcode}
                    </span>
                    <span className="text-xs text-slate-400">
                      {selectedAsset.caseNumber}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedAsset.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                    <span>Category: <strong className="text-slate-300">{selectedAsset.category}</strong></span>
                    <span>•</span>
                    <span>Seal No: <strong className="text-slate-300 font-mono">{selectedAsset.tamperBagSeal}</strong></span>
                    <span>•</span>
                    <span>Location: <strong className="text-slate-300">{selectedAsset.storageLocation}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => handleInitiateTransfer(selectedAsset)}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow transition-all shrink-0"
                >
                  <Truck className="w-4 h-4" />
                  <span>Transfer Custody</span>
                </button>
              </div>

              {/* Cryptographic Evidence Hash */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono">
                <span className="text-slate-500 text-[11px] block uppercase tracking-wider mb-1">
                  Evidence Package Digital Seal Snapshot:
                </span>
                <span className="text-amber-300 break-all select-all">
                  {selectedAsset.sha256EvidenceHash ? `${selectedAsset.sha256EvidenceHash.slice(0, 16)}••••••••••••••••${selectedAsset.sha256EvidenceHash.slice(-8)}` : 'Verified'}
                </span>
              </div>

              {/* Chain of Custody Step-by-Step Timeline */}
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Verified Chain of Custody Timeline
                </h3>

                <div className="space-y-4">
                  {selectedAsset.custodyChain.map((step, idx) => (
                    <div
                      key={idx}
                      className="relative pl-6 pb-4 border-l-2 border-slate-700 last:border-l-0 last:pb-0"
                    >
                      {/* Node point */}
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-slate-900 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-bold text-blue-400">
                            Step {step.step}: {step.action.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {new Date(step.date).toLocaleString()}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 flex items-center gap-2 py-1">
                          <span className="text-slate-400">From:</span>
                          <strong className="text-white">{step.from}</strong>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-slate-400">To:</span>
                          <strong className="text-amber-300">{step.to}</strong>
                        </div>

                        <p className="text-xs text-slate-400">
                          <strong>Purpose:</strong> {step.purpose}
                        </p>

                        <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="text-slate-500">Dual e-Signatures:</span>
                          {step.signatures.map((sig, sIdx) => (
                            <span key={sIdx} className="bg-emerald-950/70 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded font-mono">
                              ✓ {sig}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-200">Select an evidence asset to inspect chain of custody</p>
              <p className="text-xs text-slate-500 mt-1">
                Choose any asset from the inventory on the left to review its physical location, custody transfers, and digital signatures.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Custody Transfer Modal */}
      {transferModalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-400" />
              Official Evidentiary Custody Transfer
            </h2>

            <p className="text-xs text-slate-400">
              Transferring custody of exhibit <strong className="text-white">{selectedAsset.name}</strong> ({selectedAsset.barcode}). This action will require digital verification and will be anchored into the Blockchain Ledger.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Transferring Officer (Current Custodian):</label>
                <input
                  type="text"
                  disabled
                  value={selectedAsset.currentCustodian}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-400"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Recipient Custodian & Department:</label>
                <select
                  value={targetCustodian}
                  onChange={(e) => setTargetCustodian(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Dr. Ananya Sharma (CFSL Cyber Lab)">Dr. Ananya Sharma (CFSL Cyber Lab)</option>
                  <option value="Dr. Ananya Sharma (CFSL Ballistics Lab)">Dr. Ananya Sharma (CFSL Ballistics Lab)</option>
                  <option value="SI Harpreet Singh (Central Malkhana Custodian)">SI Harpreet Singh (Central Malkhana Custodian)</option>
                  <option value="Court Nazir / Sessions Court Property Room">Court Nazir / Sessions Court Property Room</option>
                  <option value="Inspector Vikram Rathore (IO)">Inspector Vikram Rathore (IO)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">New Asset Lifecycle State:</label>
                <select
                  value={targetState}
                  onChange={(e) => setTargetState(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="AT_FSL_LAB">AT_FSL_LAB (Forensic Examination)</option>
                  <option value="STORED_IN_MALKHANA">STORED_IN_MALKHANA (Safe Custody Vault)</option>
                  <option value="IN_COURT">IN_COURT (Produced as Judicial Exhibit)</option>
                  <option value="DISPOSED">DISPOSED / CONFISCATED (Court Ordered Disposal)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Official Purpose & Movement Order Ref:</label>
                <input
                  type="text"
                  value={transferPurpose}
                  onChange={(e) => setTransferPurpose(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
              <button
                onClick={() => setTransferModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteTransfer}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-xs font-semibold shadow-md"
              >
                Dual Sign & Commit Transfer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

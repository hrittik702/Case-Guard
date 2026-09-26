import React, { useState } from 'react';
import { Database, ShieldCheck, AlertTriangle, Link2, CheckCircle2, RefreshCw, Cpu, Server, Lock, Layers } from 'lucide-react';
import { verifyBlockchainIntegrity } from '../services/blockchainService';

export default function BlockchainLedger({ chain, onIntegrityCheckResult }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    const result = await verifyBlockchainIntegrity(chain);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult(result);
      if (onIntegrityCheckResult) onIntegrityCheckResult(result);
    }, 450);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-mono">
                PoA Consortium Network
              </span>
              <span className="text-xs text-slate-400">
                Judiciary & Law Enforcement Distributed Ledger
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mt-1">
              <Database className="w-6 h-6 text-indigo-400" />
              National Legal Evidentiary Blockchain Ledger
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Every filed FIR, witness deposition, forensic parcel, and custody transfer is cryptographically sealed in an immutable hash chain.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleVerifyChain}
              disabled={isVerifying}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-indigo-950/40"
            >
              <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Verifying Hashes...' : 'Scan & Verify Chain Integrity'}</span>
            </button>
          </div>
        </div>

        {/* Verification Alert Banner */}
        {verificationResult && (
          <div className={`mt-5 p-4 rounded-lg border text-xs font-medium flex items-center justify-between ${
            verificationResult.valid
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
              : 'bg-red-950/80 border-red-700 text-red-200 animate-pulse'
          }`}>
            <div className="flex items-center space-x-2">
              {verificationResult.valid ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    <strong>CHAIN INTEGRITY 100% VALID:</strong> {verificationResult.message}
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>
                    <strong>CORRUPTION / TAMPER DETECTED:</strong> {verificationResult.error}
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => setVerificationResult(null)}
              className="text-slate-400 hover:text-white ml-2"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Network Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Total Blocks Committed</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">#{chain.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Genesis block + {chain.length - 1} records</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Consensus Algorithm</div>
          <div className="text-lg font-bold text-indigo-400 mt-1">Proof-of-Authority</div>
          <div className="text-[11px] text-slate-500 mt-0.5">NIC & Apex Judiciary Nodes</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Integrity Standard</div>
          <div className="text-lg font-bold text-amber-400 mt-1 font-mono">Section 63 BSA</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Digital Non-Repudiation Seal</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Ledger Health</div>
          <div className="text-lg font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5" />
            <span>Active & Sealed</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Zero unanchored forks</div>
        </div>
      </div>

      {/* Block Stream Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          Block Height Explorer (Latest to Genesis)
        </h2>

        <div className="space-y-4">
          {[...chain].reverse().map((block, idx) => (
            <div
              key={block.blockHeight}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-sm transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-indigo-400 bg-indigo-950 border border-indigo-800 px-3 py-1 rounded">
                    Block #{block.blockHeight}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                    {block.action.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                    ✓ {block.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Server className="w-3.5 h-3.5 text-slate-500" />
                    Node: {block.validatorNode}
                  </span>
                  <span>•</span>
                  <span>Timestamp: {new Date(block.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Block Details Grid */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-500">Case Identifier: </span>
                    <strong className="text-slate-200 font-mono">{block.caseId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Document / Asset Reference: </span>
                    <span className="text-white font-medium">{block.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Authorized Officer / Submitter: </span>
                    <span className="text-slate-300">{block.actor}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">PoA Nonce: </span>
                    <span className="font-mono text-slate-400">{block.nonce}</span>
                  </div>
                </div>

                {/* Hashes Column */}
                <div className="space-y-2 font-mono text-[11px] bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Previous Block Seal:</span>
                    <span className="text-slate-400 break-all select-all">
                      {block.prevHash === '0'.repeat(64) ? '00000000••••••••••••••••00000000' : (block.prevHash ? `${block.prevHash.slice(0, 16)}••••••••••••••••${block.prevHash.slice(-8)}` : 'N/A')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Payload Digital Seal:</span>
                    <span className="text-amber-300 break-all select-all">
                      {block.documentHash ? `${block.documentHash.slice(0, 16)}••••••••••••••••${block.documentHash.slice(-8)}` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-indigo-400 block text-[10px] uppercase font-bold">Block Ledger Root:</span>
                    <span className="text-indigo-300 font-bold break-all select-all">
                      {block.blockHash ? `${block.blockHash.slice(0, 16)}••••••••••••••••${block.blockHash.slice(-8)}` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

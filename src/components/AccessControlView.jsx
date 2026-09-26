import React, { useState } from 'react';
import { 
  Lock, 
  ShieldAlert, 
  ShieldCheck, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Key, 
  FileText 
} from 'lucide-react';
import { ROLES } from '../data/roles';

export default function AccessControlView({ 
  currentRole, 
  setCurrentRole, 
  onTriggerUnauthorizedAccess 
}) {
  const rolesList = Object.values(ROLES);

  const permissionMatrix = [
    { permission: 'View FIR & Police Reports', io: true, legal: true, fsl: true, admin: true },
    { permission: 'Upload New Evidence & Reports', io: true, legal: false, fsl: true, admin: true },
    { permission: 'Cryptographic Hash Verification', io: true, legal: true, fsl: true, admin: true },
    { permission: 'View Forensic Bitstream Images', io: true, legal: false, fsl: true, admin: true },
    { permission: 'Access Top Secret Informant Registry', io: true, legal: false, fsl: false, admin: true },
    { permission: 'Redact PII for Public Court Record', io: false, legal: true, fsl: false, admin: true },
    { permission: 'Manage Access Permissions (ABAC)', io: false, legal: false, fsl: false, admin: true },
    { permission: 'Export Certified Sec 63 BSA Stamp', io: true, legal: true, fsl: true, admin: true }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                Least Privilege & Multi-Tier Clearance
              </span>
              <span className="text-xs text-slate-500">
                Institutional Security Model
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              Access Control & Authorization Policies
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Role-Based (RBAC) and Attribute-Based (ABAC) access controls enforced at every document request boundary.
            </p>
          </div>

          {/* Test Unauthorized Access Simulation Trigger */}
          <button
            onClick={onTriggerUnauthorizedAccess}
            className="inline-flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-2xs shrink-0"
          >
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>Simulate Unauthorized Access Attempt</span>
          </button>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rolesList.map(r => {
          const isActive = currentRole.id === r.id;

          return (
            <div
              key={r.id}
              onClick={() => setCurrentRole(r)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{r.avatar}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  r.clearance === 'Top Secret' ? 'bg-red-50 text-red-700 border-red-200' :
                  r.clearance === 'Secret' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {r.clearance}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-xs truncate">
                {r.name}
              </h3>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {r.designation}
              </p>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                Permissions: {r.permissions.length} granted
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Session:</span>
                <span className={`font-semibold ${isActive ? 'text-blue-700' : 'text-slate-500'}`}>
                  {isActive ? '● Active Session' : 'Click to Switch'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Master Permission Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Statutory Permission Matrix (Least Privilege)
          </span>
          <span className="text-slate-500">
            Enforced by Kernel Authorization Hook
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">Action / Resource Boundary</th>
                <th className="py-2.5 px-3 text-center">Investigation Officer</th>
                <th className="py-2.5 px-3 text-center">Legal Officer</th>
                <th className="py-2.5 px-3 text-center">Forensic Analyst</th>
                <th className="py-2.5 px-3 text-center">System Administrator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-slate-900">
                    {row.permission}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.io ? <span className="text-emerald-600 font-bold">✓ ALLOW</span> : <span className="text-slate-300">✗ DENY</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.legal ? <span className="text-emerald-600 font-bold">✓ ALLOW</span> : <span className="text-slate-300">✗ DENY</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.fsl ? <span className="text-emerald-600 font-bold">✓ ALLOW</span> : <span className="text-slate-300">✗ DENY</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.admin ? <span className="text-emerald-600 font-bold">✓ ALLOW</span> : <span className="text-slate-300">✗ DENY</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

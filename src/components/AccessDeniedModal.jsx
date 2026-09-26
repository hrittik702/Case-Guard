import React from 'react';
import { X, ShieldAlert, AlertTriangle, ArrowRight, Lock } from 'lucide-react';

export default function AccessDeniedModal({
  onClose,
  currentRole,
  attemptedDocName,
  attemptedType = 'DOCUMENT',
  resourceClassification = 'RESTRICTED',
  denialReason,
  onViewAudit
}) {
  const isTopSecret = (resourceClassification || '').toUpperCase().includes('TOP');
  const roleName = currentRole?.name || 'Officer';
  const roleDesignation = currentRole?.designation || currentRole?.role || 'Authorized Personnel';
  const roleClearance = currentRole?.clearance || 'Confidential';
  const badge = currentRole?.badge || currentRole?.id || 'AUTH-001';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-red-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-150">
        
        {/* Red Alert Header */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900">
                403 Access Denied — Security Boundary Enforced
              </h3>
              <p className="text-xs text-red-700 font-normal">
                Principle of Least Privilege (PoLP) Violation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs font-normal">
          <div className="p-3.5 bg-red-50/50 border border-red-200 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-[13px]">Attempted Resource:</span>
              <strong className="text-slate-900 text-[13px] font-semibold truncate max-w-xs">{attemptedDocName || 'Restricted Docket'}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-[13px]">Resource Boundary:</span>
              <span className="font-medium text-red-700 bg-red-100 px-1.5 py-0.5 rounded uppercase text-[11px] tracking-wider">
                {resourceClassification}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-[13px]">Active Officer Clearance:</span>
              <span className="font-medium text-slate-800 bg-slate-200 px-1.5 py-0.5 rounded uppercase text-[11px]">
                {roleClearance} ({roleName})
              </span>
            </div>
          </div>

          <div className="space-y-1 text-slate-700 leading-relaxed">
            <p className="font-semibold text-slate-900 text-[13px]">Denial Justification:</p>
            <p className="text-slate-600 text-xs font-normal">
              {denialReason || `Access was denied because your active identity (${roleDesignation}) is not authorized for this resource and does not meet the required access criteria.`}
            </p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2 text-amber-900 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Compliance Audit Event Generated:</strong> This unauthorized access attempt has been logged into the Section 63 BSA audit trail with your badge identifier (<span className="font-mono text-xs font-medium">{badge}</span>) and origin IP address.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            onClick={() => {
              onClose();
              if (onViewAudit) onViewAudit();
            }}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View Logged Audit Entry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-medium shadow-xs"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}

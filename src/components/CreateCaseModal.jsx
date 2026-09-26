import React, { useState } from 'react';
import { X, FolderPlus, ArrowRight } from 'lucide-react';
import { CaseRepository } from '../services/caseRepository';
import { AuditRepository } from '../services/auditRepository';

export default function CreateCaseModal({ onClose, onCaseCreated, currentRole, addToast }) {
  const [caseNumber, setCaseNumber] = useState(`INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Financial Fraud');
  const [priority, setPriority] = useState('High');
  const [status, setStatus] = useState('Active');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caseNumber || !title) return;

    setIsSubmitting(true);
    try {
      const newCase = await CaseRepository.createCase({
        caseNumber,
        title,
        type,
        priority,
        status,
        description
      });

      // Real audit event
      await AuditRepository.logAuditEvent({
        actor: currentRole,
        action: 'CASE_CREATED',
        targetType: 'CASE',
        targetId: newCase.id,
        caseId: newCase.caseNumber,
        result: 'SUCCESS',
        details: `Created Case #${newCase.caseNumber}: "${newCase.title}". Priority: ${newCase.priority}.`
      });

      addToast('Case Created', `Case #${newCase.caseNumber} has been initialized.`, 'success');
      onCaseCreated && onCaseCreated(newCase);
      onClose();
    } catch (err) {
      console.error(err);
      addToast('Error', err.message || 'Failed to create case.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                Create New Case
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Initialize an evidence and document dossier
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 block mb-1 font-medium text-xs">Case Identifier:</label>
              <input
                type="text"
                required
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-medium text-xs">Case Type:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-normal text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Financial Fraud">Financial Fraud</option>
                <option value="Cybercrime">Cybercrime</option>
                <option value="Homicide">Homicide & Violent Crime</option>
                <option value="Narcotics">Narcotics & Contraband</option>
                <option value="Economic Offences">Economic Offences</option>
                <option value="Judicial Trial">Judicial Trial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-700 block mb-1 font-medium text-xs">Case Title:</label>
            <input
              type="text"
              required
              placeholder="e.g. State vs. Enterprise Syndicate Investigation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-normal text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 block mb-1 font-medium text-xs">Priority:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-normal text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-medium text-xs">Initial Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-normal text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Active">Active Investigation</option>
                <option value="Pending Review">Pending Review</option>
                <option value="In Trial">In Trial</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-700 block mb-1 font-medium text-xs">Description / Scope Summary:</label>
            <textarea
              rows={3}
              placeholder="Brief summary of the investigative scope or allegations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-normal text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-medium text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-xs shadow-xs flex items-center space-x-1.5"
            >
              <span>{isSubmitting ? 'Creating...' : 'Create Case'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

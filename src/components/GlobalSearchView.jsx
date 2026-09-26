import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  ChevronRight, 
  ArrowUpRight,
  Eye,
  Hash
} from 'lucide-react';

function getOcrSnippet(text, query) {
  if (!text || !query) return null;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return null;
  const index = lowerText.indexOf(lowerQuery);
  if (index === -1) return null;

  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + lowerQuery.length + 50);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < text.length ? '...' : '';
  return prefix + text.slice(start, end).replace(/\s+/g, ' ') + suffix;
}

function HighlightedSnippet({ text, query }) {
  if (!text || !query) return <span>{text}</span>;
  const parts = [];
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return <span>{text}</span>;
  
  let lastIndex = 0;
  let idx = lowerText.indexOf(lowerQuery, lastIndex);

  while (idx !== -1) {
    if (idx > lastIndex) {
      parts.push({ text: text.substring(lastIndex, idx), highlight: false });
    }
    parts.push({ text: text.substring(idx, idx + lowerQuery.length), highlight: true });
    lastIndex = idx + lowerQuery.length;
    idx = lowerText.indexOf(lowerQuery, lastIndex);
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.substring(lastIndex), highlight: false });
  }

  return (
    <span>
      {parts.map((p, i) =>
        p.highlight ? (
          <mark key={i} className="bg-yellow-200 text-yellow-950 font-semibold px-0.5 rounded">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </span>
  );
}

export default function GlobalSearchView({ 
  cases = [], 
  documents = [],
  onSelectCase, 
  onViewDocument, 
  onVerifyDocument 
}) {
  const [query, setQuery] = useState('');
  const [caseFilter, setCaseFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [classificationFilter, setClassificationFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Flatten all documents across all cases or from direct documents prop
  const allDocs = documents.length > 0
    ? documents.map(d => ({ ...d, caseItem: cases.find(c => c.caseNumber === d.caseId) }))
    : cases.flatMap(c => (c.documents || []).map(d => ({ ...d, caseItem: c })));

  const filteredResults = allDocs.map(d => {
    const q = query.trim().toLowerCase();
    const docName = (d.name || '').toLowerCase();
    const docCaseId = (d.caseId || '').toLowerCase();
    const docType = (d.category || d.type || '').toLowerCase();
    const docUploader = (d.createdBy || d.uploadedBy || '').toLowerCase();
    const docHash = (d.storedHash || d.hash || '').toLowerCase();
    const docOcrText = (d.ocr?.text || '').toLowerCase();

    const matches = [];
    if (q) {
      if (docName.includes(q)) matches.push('Filename');
      if (docCaseId.includes(q)) matches.push(`Case #${d.caseId}`);
      if (docType.includes(q)) matches.push('Document Type');
      if (docUploader.includes(q)) matches.push('Uploader');
      if (docHash.includes(q)) matches.push('Digital Fingerprint');
      if (docOcrText.includes(q)) matches.push('OCR Extracted Text');
    }

    const matchQuery = !q || matches.length > 0;
    const matchCase = caseFilter === 'ALL' || d.caseId === caseFilter;
    const matchType = typeFilter === 'ALL' || (d.category || d.type) === typeFilter;
    const matchClassification = classificationFilter === 'ALL' || d.classification === classificationFilter;
    const matchStatus = statusFilter === 'ALL' || (statusFilter === 'VERIFIED' && !d.isTampered) || (statusFilter === 'TAMPERED' && d.isTampered);

    const isVisible = matchQuery && matchCase && matchType && matchClassification && matchStatus;
    const ocrSnippet = q && docOcrText.includes(q) ? getOcrSnippet(d.ocr.text, query) : null;

    return {
      ...d,
      isVisible,
      matchReasons: matches,
      ocrSnippet
    };
  }).filter(d => d.isVisible);

  return (
    <div className="space-y-6">
      
      {/* Search Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
              Full-Text & Metadata Index
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Client-Side Tesseract OCR
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Universal Document & Evidentiary Search
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Query across case files, metadata, cryptographic hashes, and text extracted from images, PDFs, and documents.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by keyword, case ID, filename, or OCR extracted text..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div>
            <label className="text-slate-600 block mb-1 font-semibold">Filter by Case:</label>
            <select
              value={caseFilter}
              onChange={(e) => setCaseFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
            >
              <option value="ALL">All Cases</option>
              {cases.map(c => (
                <option key={c.id} value={c.caseNumber}>Case #{c.caseNumber}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-semibold">Document Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="Investigation Report">Investigation Report</option>
              <option value="FIR">First Information Report</option>
              <option value="Forensic Report">Forensic Report</option>
              <option value="Evidence Record">Evidence Record</option>
            </select>
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-semibold">Security Clearance:</label>
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
            >
              <option value="ALL">All Levels</option>
              <option value="Confidential">Confidential</option>
              <option value="Secret">Secret</option>
              <option value="Top Secret">Top Secret</option>
            </select>
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-semibold">Integrity Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified (Intact)</option>
              <option value="TAMPERED">Tamper Flagged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Results Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Found <strong>{filteredResults.length}</strong> matching records across active cases</span>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-blue-600 hover:underline font-medium"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filteredResults.map(doc => {
          const isTampered = doc.isTampered;

          return (
            <div
              key={doc.id}
              className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                      #{doc.caseId}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {doc.category || doc.type || 'Record'}
                    </span>
                    <span className="font-mono text-xs text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                      {doc.currentVersion}
                    </span>
                    <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold border ${
                      doc.classification === 'Top Secret' ? 'bg-red-50 text-red-700 border-red-200' :
                      doc.classification === 'Secret' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {doc.classification}
                    </span>

                    {isTampered ? (
                      <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.2 rounded-full border border-red-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <span>TAMPER MISMATCH</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>VERIFIED</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {doc.name}
                  </h3>

                  <div className="text-xs text-slate-500">
                    Uploaded by <strong className="text-slate-700">{doc.createdBy || doc.uploadedBy || 'Authorized Officer'}</strong> on {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : (doc.uploadDate || 'Recent')} • Size: {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : (doc.fileSize || 'N/A')}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => onViewDocument(doc, doc.caseItem)}
                    className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Record</span>
                  </button>

                  {doc.caseItem && (
                    <button
                      onClick={() => onSelectCase(doc.caseItem)}
                      className="inline-flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <span>Open Case</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Match reasons & OCR context */}
              {query && doc.matchReasons && doc.matchReasons.length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400 font-semibold">Matched in:</span>
                  {doc.matchReasons.map((reason, i) => (
                    <span 
                      key={i} 
                      className={`px-2 py-0.5 rounded-full font-semibold border ${
                        reason === 'OCR Extracted Text'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : reason === 'Filename'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              )}

              {/* OCR Contextual Snippet if matched in OCR */}
              {doc.ocrSnippet && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-1">
                  <div className="flex items-center space-x-1.5 text-[10px] text-blue-700 font-semibold uppercase tracking-wider">
                    <span>OCR Extracted Text Snippet</span>
                  </div>
                  <div className="font-mono text-[11px] leading-relaxed break-words">
                    <HighlightedSnippet text={doc.ocrSnippet} query={query} />
                  </div>
                </div>
              )}

              {/* OCR Status Pill when not searching or when OCR available */}
              {!query && doc.ocr?.status === 'COMPLETED' && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="inline-flex items-center space-x-1 text-blue-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <span>OCR Text Indexed ({doc.ocr.pageCount || 1} {doc.ocr.pageCount === 1 ? 'page' : 'pages'})</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Language: {doc.ocr.language?.toUpperCase() || 'ENG'}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {filteredResults.length === 0 && (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl p-8">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <div className="font-bold text-slate-700 text-sm">No matching records found</div>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search keywords or clearing active filters.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

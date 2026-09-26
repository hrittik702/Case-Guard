import React, { useState, useEffect } from 'react';
import { PptxPreview } from 'react-pptx-preview-kit';
import { Presentation, Loader2, AlertCircle, Download } from 'lucide-react';

export default function PptxViewer({ blob, filename, onDownload }) {
  const [arrayBuffer, setArrayBuffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    if (!blob) {
      setLoading(false);
      setError('No presentation data provided.');
      return;
    }

    setLoading(true);
    setError(null);

    blob.arrayBuffer()
      .then(buffer => {
        if (!isCancelled) {
          setArrayBuffer(buffer);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to read PPTX ArrayBuffer:', err);
        if (!isCancelled) {
          setError('Unable to read presentation binary data.');
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [blob]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 space-y-2 m-auto">
        <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
        <span className="text-xs font-medium">Parsing PowerPoint presentation...</span>
      </div>
    );
  }

  if (error || !arrayBuffer) {
    return (
      <div className="m-auto text-center p-6 bg-white border border-red-200 rounded-xl max-w-sm space-y-2">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <div className="font-bold text-slate-800 text-xs">Presentation Preview Unavailable</div>
        <p className="text-[11px] text-slate-500">{error || 'This presentation could not be rendered in-browser.'}</p>
        {onDownload && (
          <button
            onClick={onDownload}
            className="mt-2 inline-flex items-center space-x-1 bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Presentation</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden">
      
      {/* Header Info */}
      <div className="bg-white border-b border-slate-200 px-3 py-2 flex items-center justify-between text-xs text-slate-700 shrink-0 select-none">
        <div className="flex items-center space-x-2">
          <Presentation className="w-4 h-4 text-orange-500" />
          <span className="font-semibold text-slate-900 truncate max-w-xs">{filename || 'Presentation'}</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded">Use arrow keys or click to navigate</span>
        </div>

        {onDownload && (
          <button
            onClick={onDownload}
            className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
            title="Download Presentation"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Slide Canvas */}
      <div className="flex-1 min-h-0 overflow-auto flex items-center justify-center p-4">
        <div className="max-w-4xl w-full flex justify-center bg-white rounded-lg shadow-sm border border-slate-200 p-2">
          <PptxPreview file={arrayBuffer} />
        </div>
      </div>

    </div>
  );
}

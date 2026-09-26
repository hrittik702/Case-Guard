import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PptxPreview } from 'react-pptx-preview-kit';
import { 
  Loader2, 
  AlertCircle, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';
import { detectSwipeDirection } from '../../utils/slideNavigation';

export default function PptxViewer({ blob, filename, onDownload }) {
  const [arrayBuffer, setArrayBuffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Presentation State parsed from PptxPreview DOM
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(1);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [isIdle, setIsIdle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const idleTimerRef = useRef(null);
  const touchStateRef = useRef({ startX: 0, startY: 0 });
  const dragStateRef = useRef({ isDown: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });

  // Load binary ArrayBuffer from blob
  useEffect(() => {
    let isCancelled = false;

    if (!blob) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

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
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [blob, retryCount]);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setRetryCount(c => c + 1);
  };

  // Activity timer for floating pill controls
  const handleActivity = useCallback(() => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, 2500);
  }, []);

  useEffect(() => {
    handleActivity();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [handleActivity]);

  // Synchronize slide counter and zoom from PptxPreview DOM
  useEffect(() => {
    const root = viewerRef.current;
    if (!root) return;

    const syncInfo = () => {
      const spans = root.querySelectorAll('span');
      for (const span of spans) {
        const text = span.textContent || '';
        const match = text.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
        if (match) {
          const cur = parseInt(match[1], 10);
          const tot = parseInt(match[2], 10);
          if (!isNaN(cur) && !isNaN(tot)) {
            setCurrentSlide(cur);
            setTotalSlides(tot);
          }
          break;
        }
      }

      for (const span of spans) {
        const text = span.textContent || '';
        const match = text.match(/^\s*(\d+)%\s*$/);
        if (match) {
          const z = parseInt(match[1], 10);
          if (!isNaN(z)) {
            setCurrentZoom(z / 100);
          }
          break;
        }
      }
    };

    syncInfo();
    const observer = new MutationObserver(syncInfo);
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, [arrayBuffer]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Navigation dispatchers targeting PptxPreview's hidden controls and keydown dispatcher
  const dispatchKey = useCallback((key) => {
    const root = viewerRef.current;
    if (!root) return;
    const target = root.querySelector('[tabindex="0"]') || root;
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  }, []);

  const navigateNext = useCallback(() => {
    const root = viewerRef.current;
    const buttons = root?.querySelectorAll('button');
    if (buttons && buttons.length >= 2) {
      buttons[1].click(); // Second button in PptxPreview toolbar is "›"
    } else {
      dispatchKey('ArrowRight');
    }
    handleActivity();
  }, [dispatchKey, handleActivity]);

  const navigatePrev = useCallback(() => {
    const root = viewerRef.current;
    const buttons = root?.querySelectorAll('button');
    if (buttons && buttons.length >= 1) {
      buttons[0].click(); // First button in PptxPreview toolbar is "‹"
    } else {
      dispatchKey('ArrowLeft');
    }
    handleActivity();
  }, [dispatchKey, handleActivity]);

  const navigateFirst = useCallback(() => {
    dispatchKey('Home');
    handleActivity();
  }, [dispatchKey, handleActivity]);

  const navigateLast = useCallback(() => {
    dispatchKey('End');
    handleActivity();
  }, [dispatchKey, handleActivity]);

  const navigateZoomIn = useCallback(() => {
    const root = viewerRef.current;
    const buttons = root?.querySelectorAll('button');
    if (buttons && buttons.length >= 5) {
      buttons[4].click(); // Fifth button is "+"
    } else {
      dispatchKey('+');
    }
    handleActivity();
  }, [dispatchKey, handleActivity]);

  const navigateZoomOut = useCallback(() => {
    const root = viewerRef.current;
    const buttons = root?.querySelectorAll('button');
    if (buttons && buttons.length >= 3) {
      buttons[2].click(); // Third button is "−"
    } else {
      dispatchKey('-');
    }
    handleActivity();
  }, [dispatchKey, handleActivity]);

  const navigateFit = useCallback(() => {
    const root = viewerRef.current;
    const buttons = root?.querySelectorAll('button');
    if (buttons && buttons.length >= 6) {
      buttons[5].click(); // Sixth button is "Fit"
    }
    setCurrentZoom(1);
    handleActivity();
  }, [handleActivity]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    handleActivity();
  }, [handleActivity]);

  // Global Keyboard Navigation (ArrowLeft, ArrowRight, Home, End)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.target?.isContentEditable) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        navigateNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        navigatePrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        navigateFirst();
      } else if (e.key === 'End') {
        e.preventDefault();
        navigateLast();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateNext, navigatePrev, navigateFirst, navigateLast]);

  // Touch Swipe Navigation for Mobile / Tablets
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStateRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY
      };
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches.length === 1) {
      const { startX, startY } = touchStateRef.current;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const direction = detectSwipeDirection(startX, startY, endX, endY);
      if (direction === 'next') {
        navigateNext();
      } else if (direction === 'prev') {
        navigatePrev();
      }
    }
  };

  // Spatial Edge-Click Navigation: clicks outside the slide on the left/right advance or go back
  const handleCanvasClick = (e) => {
    // If click is on interactive controls or toolbar, ignore
    if (e.target.closest('button') || e.target.closest('.floating-toolbar')) return;

    // Requirement: Do not trigger navigation when clicking inside the actual slide content
    const slideCard = e.target.closest('[style*="box-shadow"]') || e.target.closest('[style*="boxShadow"]');
    if (slideCard) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    if (clickX < rect.width * 0.3) {
      navigatePrev();
    } else if (clickX > rect.width * 0.7) {
      navigateNext();
    }
  };

  // Double-Click Zoom (Toggles between Fit and ~1.75x)
  const handleDoubleClick = (e) => {
    if (e.target.closest('button') || e.target.closest('.floating-toolbar')) return;
    if (currentZoom <= 1.05) {
      // Zoom in to controlled level
      navigateZoomIn();
      setTimeout(navigateZoomIn, 50);
      setTimeout(navigateZoomIn, 100);
    } else {
      navigateFit();
    }
  };

  // Drag / Pan when zoomed beyond Fit scale
  const isPannable = currentZoom > 1.05;

  const handleMouseDown = (e) => {
    if (!isPannable || e.button !== 0) return;
    if (e.target.closest('button') || e.target.closest('.floating-toolbar')) return;

    const scrollContainer = viewerRef.current?.querySelector('[style*="overflow: auto"]') || 
                           viewerRef.current?.querySelector('[style*="overflow:auto"]');
    if (!scrollContainer) return;

    dragStateRef.current = {
      isDown: true,
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: scrollContainer.scrollLeft,
      scrollTop: scrollContainer.scrollTop
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    handleActivity();
    if (!dragStateRef.current.isDown) return;

    const scrollContainer = viewerRef.current?.querySelector('[style*="overflow: auto"]') || 
                           viewerRef.current?.querySelector('[style*="overflow:auto"]');
    if (!scrollContainer) return;

    const dx = e.clientX - dragStateRef.current.startX;
    const dy = e.clientY - dragStateRef.current.startY;
    scrollContainer.scrollLeft = dragStateRef.current.scrollLeft - dx;
    scrollContainer.scrollTop = dragStateRef.current.scrollTop - dy;
  };

  const handleMouseUp = () => {
    if (dragStateRef.current.isDown) {
      dragStateRef.current.isDown = false;
      setIsDragging(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 h-full min-h-0 flex flex-col items-center justify-center p-12 text-slate-400 bg-slate-100 select-none">
        <Loader2 className="w-7 h-7 animate-spin text-orange-600 mb-2 stroke-[1.75]" />
        <span className="text-xs font-medium text-slate-500">Parsing PowerPoint presentation...</span>
      </div>
    );
  }

  if (error || !arrayBuffer) {
    return (
      <div className="flex-1 h-full min-h-0 flex items-center justify-center p-6 bg-slate-100 select-none">
        <div className="m-auto text-center p-8 bg-white border border-slate-200 rounded-2xl max-w-sm shadow-sm space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto stroke-1" />
          <div className="font-semibold text-slate-900 text-sm">Unable to preview this presentation.</div>
          <p className="text-xs text-slate-500 font-normal">
            The presentation structure could not be rendered in the browser.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleRetry}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium cursor-pointer transition-colors"
            >
              Retry
            </button>
            {onDownload && (
              <button
                type="button"
                onClick={onDownload}
                className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Original</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative flex-1 min-h-0 w-full h-full bg-slate-100 overflow-hidden select-none flex flex-col items-center justify-center ${
        isPannable 
          ? isDragging ? 'cursor-grabbing' : 'cursor-grab' 
          : 'cursor-default'
      }`}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Scoped Presentation Style Overrides */}
      <style>{`
        .pptx-clean-viewer > div {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          outline: none !important;
          background-color: #f1f5f9 !important;
        }
        /* Hide PptxPreview's built-in header/toolbar */
        .pptx-clean-viewer > div > div:nth-child(2) {
          display: none !important;
        }
        /* Hide PptxPreview's built-in left thumbnail sidebar (width: 212px) */
        .pptx-clean-viewer > div > div:last-child > div:first-child {
          display: none !important;
        }
        /* Main slide canvas fills entire space */
        .pptx-clean-viewer > div > div:last-child {
          width: 100% !important;
          height: 100% !important;
          flex: 1 1 0% !important;
          overflow: hidden !important;
          background-color: #f1f5f9 !important;
        }
        /* Centered slide stage */
        .pptx-clean-viewer > div > div:last-child > div:last-child {
          width: 100% !important;
          height: 100% !important;
          flex: 1 1 0% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background-color: #f1f5f9 !important;
          padding: 24px !important;
          box-sizing: border-box !important;
        }
        /* Slide card: clean border, institutional shadow, subtle 140ms transition */
        .pptx-clean-viewer > div > div:last-child > div:last-child > div {
          border-radius: 6px !important;
          box-shadow: 0 4px 24px -2px rgba(15, 23, 42, 0.12), 0 2px 8px -1px rgba(15, 23, 42, 0.08) !important;
          border: 1px solid #e2e8f0 !important;
          background-color: #ffffff !important;
          transition: opacity 140ms ease-out, transform 140ms ease-out !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .pptx-clean-viewer > div > div:last-child > div:last-child > div {
            transition: none !important;
          }
        }
      `}</style>

      {/* Actual High-Fidelity PPTX Slide Stage */}
      <div ref={viewerRef} className="pptx-clean-viewer w-full h-full flex-1 min-h-0 flex flex-col pointer-events-auto">
        <PptxPreview file={arrayBuffer} />
      </div>

      {/* Spatial Left Navigation Edge Trigger (Hover affordance) */}
      <div 
        onClick={(e) => { e.stopPropagation(); navigatePrev(); }}
        className="absolute left-0 top-0 bottom-0 w-20 sm:w-28 z-10 cursor-pointer flex items-center justify-start pl-3 group select-none pointer-events-auto"
        title="Previous Slide (Arrow Left / Click)"
      >
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-xs border border-slate-200 shadow-md rounded-full p-2 text-slate-600 hover:text-slate-900 hover:scale-105 active:scale-95 transition-transform">
          <ChevronLeft className="w-5 h-5" />
        </div>
      </div>

      {/* Spatial Right Navigation Edge Trigger (Hover affordance) */}
      <div 
        onClick={(e) => { e.stopPropagation(); navigateNext(); }}
        className="absolute right-0 top-0 bottom-0 w-20 sm:w-28 z-10 cursor-pointer flex items-center justify-end pr-3 group select-none pointer-events-auto"
        title="Next Slide (Arrow Right / Click)"
      >
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-xs border border-slate-200 shadow-md rounded-full p-2 text-slate-600 hover:text-slate-900 hover:scale-105 active:scale-95 transition-transform">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      {/* Minimal Floating Bottom Presentation Pill (Auto-hides after 2.5s idle) */}
      <div 
        className={`floating-toolbar absolute bottom-4 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-300 pointer-events-auto ${
          isIdle ? 'opacity-35 hover:opacity-100' : 'opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-md rounded-xl px-3 py-1.5 flex items-center space-x-2 text-xs text-slate-700 select-none">
          
          {/* Slide Indicator */}
          <span className="font-mono text-xs font-semibold text-slate-800 min-w-[50px] text-center px-1">
            {currentSlide} / {totalSlides}
          </span>

          <div className="h-3.5 w-px bg-slate-200"></div>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={navigateZoomOut}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
            title="Zoom Out (Ctrl + -)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Reset to Fit */}
          <button
            type="button"
            onClick={navigateFit}
            className="px-2 py-0.5 rounded-md hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer transition-colors flex items-center gap-1"
            title="Reset to Fit"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Fit</span>
          </button>

          {/* Zoom In */}
          <button
            type="button"
            onClick={navigateZoomIn}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
            title="Zoom In (Ctrl + +)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-3.5 w-px bg-slate-200"></div>

          {/* Zoom Scale Percentage */}
          <span className="font-mono text-xs font-medium text-slate-600 min-w-[38px] text-center">
            {Math.round(currentZoom * 100)}%
          </span>

          <div className="h-3.5 w-px bg-slate-200"></div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Presentation'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-slate-700" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

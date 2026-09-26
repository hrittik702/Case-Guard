import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, RotateCcw, AlertCircle } from 'lucide-react';
import { calculateFitDimensions } from '../../utils/imageFit';

export { calculateFitDimensions };

export default function ImageViewer({ blob, filename, onDownload }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [currentScale, setCurrentScale] = useState(1);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef(null);
  const containerRef = useRef(null);
  const transformComponentRef = useRef(null);
  const imgRef = useRef(null);

  const [naturalDimensions, setNaturalDimensions] = useState(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (!blob) {
      setImageUrl(null);
      setNaturalDimensions(null);
      return;
    }

    const url = URL.createObjectURL(blob);
    setImageUrl(url);
    setCurrentScale(1);
    isInitialRender.current = true;

    // Preload image directly to immediately capture natural dimensions
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setNaturalDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      }
    };
    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [blob]);

  // Measure container dimensions with ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerDimensions({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height)
        });
      }
    };

    measure();

    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measure());
      ro.observe(el);
    } else {
      window.addEventListener('resize', measure);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', measure);
    };
  }, []);

  // Capture natural dimensions on load or if already cached
  const handleImageLoad = (e) => {
    const target = e.target;
    if (target.naturalWidth && target.naturalHeight) {
      setNaturalDimensions({
        width: target.naturalWidth,
        height: target.naturalHeight
      });
    }
  };

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth) {
      setNaturalDimensions({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight
      });
    }
  }, [imageUrl]);

  // Dynamically compute dimensions strictly constrained to 90% (portrait/landscape aware)
  const fitDims = useMemo(() => {
    if (!naturalDimensions || !containerDimensions.width || !containerDimensions.height) {
      return null;
    }
    return calculateFitDimensions(
      naturalDimensions.width,
      naturalDimensions.height,
      containerDimensions.width,
      containerDimensions.height
    );
  }, [naturalDimensions, containerDimensions]);

  // When dimensions update or on initial load, center at 1.0 fit scale
  useEffect(() => {
    if (fitDims && transformComponentRef.current) {
      if (isInitialRender.current || currentScale <= 1.05) {
        isInitialRender.current = false;
        const timer = setTimeout(() => {
          transformComponentRef.current?.resetTransform(0);
        }, 30);
        return () => clearTimeout(timer);
      }
    }
  }, [fitDims]);

  // Auto-hide bottom controls after 2.5s idle
  const handleActivity = () => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, 2500);
  };

  useEffect(() => {
    handleActivity();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Dedicated non-passive wheel listener: Zooms ONLY the image document and stops browser page zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        if (transformComponentRef.current) {
          if (e.deltaY < 0) {
            transformComponentRef.current.zoomIn(0.15);
          } else {
            transformComponentRef.current.zoomOut(0.15);
          }
        }
        handleActivity();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Keyboard zoom controls (Ctrl/Cmd + Plus, Minus, Zero)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.target?.isContentEditable) return;

      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        transformComponentRef.current?.zoomIn(0.15);
        handleActivity();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        transformComponentRef.current?.zoomOut(0.15);
        handleActivity();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        transformComponentRef.current?.resetTransform();
        setCurrentScale(1);
        handleActivity();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!blob || !imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <AlertCircle className="w-8 h-8 text-slate-300 mb-2 stroke-1" />
        <span className="text-xs font-semibold">No image data available</span>
      </div>
    );
  }

  const isZoomed = currentScale > 1.05;

  return (
    <div 
      ref={containerRef}
      className="relative flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden select-none"
      onMouseMove={handleActivity}
    >
      <TransformWrapper
        ref={transformComponentRef}
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit={true}
        limitToBounds={true}
        onTransformed={(ref) => {
          setCurrentScale(ref.state.scale);
          handleActivity();
        }}
        wheel={{
          disabled: true
        }}
        pinch={{ step: 4 }}
        doubleClick={{
          mode: 'toggle',
          step: 0.35
        }}
        panning={{
          disabled: !isZoomed,
          velocityDisabled: true
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Viewport Canvas: 100% of container space, centered */}
            <div className={`flex-1 min-h-0 w-full h-full overflow-hidden flex items-center justify-center ${
              isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
            }`}>
              <TransformComponent
                wrapperClass="!w-full !h-full flex items-center justify-center"
                contentClass="flex items-center justify-center"
              >
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt={filename || 'Evidence Photo'}
                  onLoad={handleImageLoad}
                  style={
                    fitDims
                      ? {
                          width: `${fitDims.width}px`,
                          height: `${fitDims.height}px`,
                          maxWidth: '90%',
                          maxHeight: '90%',
                          objectFit: 'contain'
                        }
                      : {
                          maxWidth: '90%',
                          maxHeight: '90%',
                          objectFit: 'contain'
                        }
                  }
                  className="rounded-md shadow-md border border-slate-200/90 bg-white select-none pointer-events-auto transition-all duration-150"
                />
              </TransformComponent>
            </div>

            {/* Minimal Floating Light Toolbar (Centered at bottom, auto-hides when idle) */}
            <div 
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-300 pointer-events-auto ${
                isIdle ? 'opacity-40 hover:opacity-100' : 'opacity-100'
              }`}
            >
              <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-md rounded-xl px-3 py-1.5 flex items-center space-x-2 text-xs text-slate-700 select-none">
                
                {/* Zoom Out */}
                <button
                  type="button"
                  onClick={() => zoomOut(0.15)}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                {/* Reset to Fit */}
                <button
                  type="button"
                  onClick={() => {
                    resetTransform();
                    setCurrentScale(1);
                  }}
                  className="px-2 py-0.5 rounded-md hover:bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1"
                  title="Fit to Window (Reset)"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  <span>Fit</span>
                </button>

                {/* Zoom In */}
                <button
                  type="button"
                  onClick={() => zoomIn(0.15)}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <div className="h-3.5 w-px bg-slate-200"></div>

                {/* Scale Percentage Indicator */}
                <span className="font-mono text-[11px] text-slate-500 min-w-[38px] text-center">
                  {Math.round(currentScale * 100)}%
                </span>

                <span className="text-[10px] text-slate-400 pl-1 border-l border-slate-200 font-sans hidden sm:inline">
                  Ctrl + Wheel to Zoom
                </span>
              </div>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

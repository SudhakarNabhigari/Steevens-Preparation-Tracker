import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import type { RoadmapPdfRecord } from '../types';
import {
  Loader2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  FileText
} from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

interface PdfCanvasViewerProps {
  pdfRecord: RoadmapPdfRecord;
  pdfBytes: Uint8Array | null;
  objectUrl: string | null;
  isLoadingSource: boolean;
  sourceError: string | null;
  onRetry: () => void;
  onOpenExternal: () => void;
  onDownload: () => void;
  onPageCountResolved?: (numPages: number) => void;
}

interface PdfPageCanvasProps {
  pdfDoc: PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  containerWidth: number;
  onPageVisible: (pageNumber: number) => void;
  registerPageRef: (pageNumber: number, el: HTMLDivElement | null) => void;
}

const PdfPageCanvas: React.FC<PdfPageCanvasProps> = ({
  pdfDoc,
  pageNumber,
  scale,
  containerWidth,
  onPageVisible,
  registerPageRef,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const [shouldRender, setShouldRender] = useState(pageNumber <= 3);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      wrapperRef.current = el;
      registerPageRef(pageNumber, el);
    },
    [pageNumber, registerPageRef]
  );

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldRender(true);
            if (entry.intersectionRatio >= 0.35) {
              onPageVisible(pageNumber);
            }
          }
        }
      },
      {
        rootMargin: '400px 0px',
        threshold: [0.01, 0.35],
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pageNumber, onPageVisible]);

  useEffect(() => {
    if (!shouldRender) return;

    let cancelled = false;
    const renderPage = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Ignore cancel error
        }
        renderTaskRef.current = null;
      }

      setIsRendering(true);
      setPageError(null);

      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const availableWidth = Math.max(280, (containerWidth || 760) - 32);
        const fitScale = Math.min(1.6, availableWidth / baseViewport.width);
        const effectiveScale = Math.max(0.5, fitScale * scale);
        const viewport = page.getViewport({ scale: effectiveScale });
        const outputScale = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not initialize 2D canvas context.');
        }

        const renderContext = {
          canvas,
          canvasContext: context,
          transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined,
          viewport,
        };

        const task = page.render(renderContext);
        renderTaskRef.current = task;
        await task.promise;
        if (!cancelled) {
          setIsRendering(false);
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const name = err && typeof err === 'object' && 'name' in err ? String((err as { name: unknown }).name) : '';
        if (name === 'RenderingCancelledException') return;
        setPageError(err instanceof Error ? err.message : 'Unable to render page.');
        setIsRendering(false);
      }
    };

    renderPage();

    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Ignore cancellation errors
        }
        renderTaskRef.current = null;
      }
    };
  }, [pdfDoc, pageNumber, scale, containerWidth, shouldRender]);

  return (
    <div
      ref={setRefs}
      className="flex flex-col items-center w-full"
    >
      <div className="bg-white rounded-lg shadow-sm border border-[#E0DCD3] overflow-hidden relative min-h-[200px] flex items-center justify-center">
        <canvas ref={canvasRef} className="block bg-white" />
        {isRendering && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#78716C]">
              <Loader2 className="w-4 h-4 animate-spin text-[#E7826D]" />
              <span>Rendering page {pageNumber}...</span>
            </div>
          </div>
        )}
        {pageError && (
          <div className="absolute inset-0 bg-rose-50/95 flex items-center justify-center p-4 text-center">
            <p className="text-xs font-semibold text-[#DC2626]">
              Page {pageNumber}: {pageError}
            </p>
          </div>
        )}
      </div>
      <span className="mt-1.5 text-[11px] font-mono text-[#78716C]">
        Page {pageNumber}
      </span>
    </div>
  );
};

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  pdfRecord,
  pdfBytes,
  objectUrl,
  isLoadingSource,
  sourceError,
  onRetry,
  onOpenExternal,
  onDownload,
  onPageCountResolved,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [containerWidth, setContainerWidth] = useState<number>(760);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [isParsingDoc, setIsParsingDoc] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Measure scroll viewport width cleanly for crisp responsive page fitting
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const updateWidth = () => {
      if (el.clientWidth > 0) {
        setContainerWidth(el.clientWidth);
      }
    };
    updateWidth();

    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Load PDFDocumentProxy whenever resolved PDF bytes change
  useEffect(() => {
    let cancelled = false;
    let activeLoadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null;

    setPdfDoc(null);
    setNumPages(0);
    setCurrentPage(1);
    setParseError(null);

    if (!pdfBytes || pdfBytes.byteLength === 0) {
      setIsParsingDoc(false);
      return;
    }

    setIsParsingDoc(true);

    const loadDoc = async () => {
      try {
        // Slice to prevent pdf.js worker from detaching the source Uint8Array buffer
        const loadingTask = pdfjsLib.getDocument({
          data: pdfBytes.slice(),
          useSystemFonts: true,
        });
        activeLoadingTask = loadingTask;
        const doc = await loadingTask.promise;

        if (cancelled) {
          await loadingTask.destroy();
          return;
        }

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setIsParsingDoc(false);
        onPageCountResolved?.(doc.numPages);
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      } catch (err) {
        if (cancelled) return;
        setParseError(
          err instanceof Error
            ? `Failed to parse PDF "${pdfRecord.filename}": ${err.message}`
            : `Failed to parse PDF "${pdfRecord.filename}".`
        );
        setIsParsingDoc(false);
      }
    };

    loadDoc();

    return () => {
      cancelled = true;
      if (activeLoadingTask) {
        activeLoadingTask.destroy().catch(() => {});
      }
    };
  }, [pdfBytes, pdfRecord.id, pdfRecord.filename, onPageCountResolved]);

  const registerPageRef = useCallback((pageNum: number, el: HTMLDivElement | null) => {
    if (el) {
      pageRefs.current.set(pageNum, el);
    } else {
      pageRefs.current.delete(pageNum);
    }
  }, []);

  const handlePageVisible = useCallback((pageNum: number) => {
    setCurrentPage(pageNum);
  }, []);

  const jumpToPage = useCallback(
    (targetPage: number) => {
      const clamped = Math.max(1, Math.min(numPages || 1, targetPage));
      setCurrentPage(clamped);
      const targetEl = pageRefs.current.get(clamped);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [numPages]
  );

  const activeError = sourceError || parseError;
  const isBusy = isLoadingSource || isParsingDoc;

  return (
    <div className="flex flex-col border border-[#E0DCD3] rounded-xl overflow-hidden bg-[#FAF8F5]">
      {/* Viewer Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 bg-white border-b border-[#E0DCD3]">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => jumpToPage(currentPage - 1)}
            disabled={isBusy || !!activeError || currentPage <= 1}
            className="p-1.5 rounded-lg border border-[#E0DCD3] bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#292929] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            title="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 py-1 text-xs font-mono text-[#292929] bg-[#FAF8F5] border border-[#E0DCD3] rounded-lg min-w-[92px] text-center">
            {numPages > 0 ? `Page ${currentPage} / ${numPages}` : 'Page —'}
          </span>
          <button
            type="button"
            onClick={() => jumpToPage(currentPage + 1)}
            disabled={isBusy || !!activeError || currentPage >= numPages}
            className="p-1.5 rounded-lg border border-[#E0DCD3] bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#292929] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            title="Next page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoom(z => Math.max(0.6, Number((z - 0.15).toFixed(2))))}
            disabled={isBusy || !!activeError || zoom <= 0.6}
            className="p-1.5 rounded-lg border border-[#E0DCD3] bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#292929] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 py-1 text-xs font-mono text-[#292929] bg-[#FAF8F5] border border-[#E0DCD3] rounded-lg min-w-[54px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom(z => Math.min(2.0, Number((z + 0.15).toFixed(2))))}
            disabled={isBusy || !!activeError || zoom >= 2.0}
            className="p-1.5 rounded-lg border border-[#E0DCD3] bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#292929] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          {zoom !== 1 && (
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="p-1.5 rounded-lg border border-[#E0DCD3] bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#292929] cursor-pointer"
              title="Reset zoom to 100%"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenExternal}
            disabled={isLoadingSource || (!objectUrl && !pdfRecord.fileUrl)}
            className="px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#292929] border border-[#E0DCD3] text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E7826D]" />
            <span>Open PDF</span>
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={isLoadingSource || (!objectUrl && !pdfRecord.fileUrl)}
            className="px-2.5 py-1.5 rounded-lg bg-[#292929] hover:bg-[#3f3f3f] text-[#F3EFE6] text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Scrollable Document Canvas Stage */}
      <div
        ref={scrollContainerRef}
        className="w-full h-[650px] overflow-y-auto bg-[#EFEBE0] p-4 sm:p-6 relative"
      >
        {isBusy && !activeError && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#E0DCD3] flex items-center justify-center shadow-sm">
              <Loader2 className="w-6 h-6 animate-spin text-[#E7826D]" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#292929]">
                {isLoadingSource ? 'Loading PDF Document...' : 'Preparing PDF Pages...'}
              </p>
              <p className="text-xs text-[#78716C] font-mono">{pdfRecord.filename}</p>
            </div>
          </div>
        )}

        {activeError && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-[#DC2626] flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-[#292929]">
                  Unable to Display Embedded PDF
                </h3>
                <p className="text-xs text-[#78716C] leading-relaxed break-words">
                  {activeError}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-3.5 py-2 rounded-xl bg-[#E7826D] hover:bg-[#D66F5A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenExternal}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#292929] border border-[#E0DCD3] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open PDF</span>
                </button>
                <button
                  type="button"
                  onClick={onDownload}
                  className="px-3.5 py-2 rounded-xl bg-[#292929] hover:bg-[#3f3f3f] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {!isBusy && !activeError && pdfDoc && numPages > 0 && (
          <div className="space-y-5 flex flex-col items-center">
            {Array.from({ length: numPages }, (_, index) => (
              <PdfPageCanvas
                key={`${pdfRecord.id}_page_${index + 1}`}
                pdfDoc={pdfDoc}
                pageNumber={index + 1}
                scale={zoom}
                containerWidth={containerWidth}
                onPageVisible={handlePageVisible}
                registerPageRef={registerPageRef}
              />
            ))}
          </div>
        )}

        {!isBusy && !activeError && !pdfDoc && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-[#78716C]">
            <FileText className="w-8 h-8 text-[#E7826D]/70" />
            <p className="text-xs font-medium">Select a stored PDF document above to view it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

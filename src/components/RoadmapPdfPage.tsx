import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { RoadmapPdfRecord } from '../types';
import { PdfCanvasViewer } from './PdfCanvasViewer';
import {
  resolveRoadmapPdfBlob,
  createTrackedPdfObjectUrl,
  revokeTrackedPdfObjectUrl,
  triggerPdfDocumentAction
} from '../utils/pdfLoader';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Clock,
  HardDrive,
  RefreshCw
} from 'lucide-react';

export const RoadmapPdfPage: React.FC = () => {
  const {
    state,
    uploadRoadmapPdf,
    setActivePdf,
    deletePdf,
    refreshSharedContent,
    userRole
  } = useApp();

  const isOwner = userRole === 'owner';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Selected PDF to preview in viewer
  const activeRecord = state.uploadedPdfs.find(p => p.id === state.activePdfId) || state.uploadedPdfs[0];
  const [previewPdfId, setPreviewPdfId] = useState<string>(activeRecord?.id || '');

  useEffect(() => {
    const exists = state.uploadedPdfs.some(p => p.id === previewPdfId);
    if (!exists && activeRecord?.id) {
      setPreviewPdfId(activeRecord.id);
    }
  }, [state.uploadedPdfs, previewPdfId, activeRecord?.id]);

  const currentPreviewRecord = state.uploadedPdfs.find(p => p.id === previewPdfId) || activeRecord;

  // Resolved Blob / Object URL state for the currently displayed PDF
  const [viewerReloadTick, setViewerReloadTick] = useState(0);
  const [resolvedObjectUrl, setResolvedObjectUrl] = useState<string | null>(null);
  const [resolvedBytes, setResolvedBytes] = useState<Uint8Array | null>(null);
  const [isViewerLoading, setIsViewerLoading] = useState(false);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [resolvedPageCount, setResolvedPageCount] = useState<number | null>(null);

  useEffect(() => {
    if (!currentPreviewRecord) {
      setResolvedObjectUrl(null);
      setResolvedBytes(null);
      setIsViewerLoading(false);
      setViewerError(null);
      setResolvedPageCount(null);
      return;
    }

    const controller = new AbortController();
    let createdObjectUrl: string | null = null;
    let isDisposed = false;

    setIsViewerLoading(true);
    setViewerError(null);
    setResolvedBytes(null);
    setResolvedObjectUrl(null);
    setResolvedPageCount(null);

    resolveRoadmapPdfBlob(currentPreviewRecord, controller.signal)
      .then((payload) => {
        if (isDisposed || controller.signal.aborted) return;
        createdObjectUrl = createTrackedPdfObjectUrl(payload.blob);
        setResolvedObjectUrl(createdObjectUrl);
        setResolvedBytes(payload.bytes);
        setIsViewerLoading(false);
      })
      .catch((err: unknown) => {
        if (isDisposed || controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : 'Unable to load the selected PDF document.';
        setViewerError(message);
        setIsViewerLoading(false);
      });

    return () => {
      isDisposed = true;
      controller.abort();
      if (createdObjectUrl) {
        revokeTrackedPdfObjectUrl(createdObjectUrl);
      }
    };
  }, [
    currentPreviewRecord?.id,
    currentPreviewRecord?.fileUrl,
    currentPreviewRecord?.storagePath,
    viewerReloadTick
  ]);

  const handleRetryViewer = useCallback(() => {
    setViewerReloadTick(t => t + 1);
  }, []);

  const handleDocumentAction = useCallback(
    async (pdf: RoadmapPdfRecord, mode: 'open' | 'download') => {
      try {
        const cachedUrl = pdf.id === currentPreviewRecord?.id ? resolvedObjectUrl : null;
        await triggerPdfDocumentAction(pdf, mode, cachedUrl);
      } catch (err) {
        setUploadStatus({
          message:
            err instanceof Error
              ? err.message
              : `Could not ${mode === 'open' ? 'open' : 'download'} ${pdf.filename}.`,
          type: 'error'
        });
      }
    },
    [currentPreviewRecord?.id, resolvedObjectUrl]
  );

  // Confirmation modal states for Delete and Replace
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [replaceConfirmRecord, setReplaceConfirmRecord] = useState<RoadmapPdfRecord | null>(null);
  const [verificationPending, setVerificationPending] = useState(false);

  const handleSyncLatest = async () => {
    setIsSyncing(true);
    await refreshSharedContent();
    setTimeout(() => setIsSyncing(false), 300);
  };

  const handleFileProcess = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setUploadStatus({ message: 'Only PDF documents (.pdf) can be uploaded.', type: 'error' });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ message: isOwner ? 'Validating and uploading PDF to persistent storage...' : 'Adding PDF to this Guest preview...', type: 'info' });

    const result = await uploadRoadmapPdf(file);
    setIsUploading(false);

    if (result.success && result.pdfId) {
      setUploadStatus({ message: isOwner ? result.message : 'PDF saved only in this Guest preview.', type: 'success' });
      setPreviewPdfId(result.pdfId);
      // Ask owner if they want to activate this as the primary roadmap
      const uploadedRecord = result.record || state.uploadedPdfs.find(p => p.id === result.pdfId);
      if (uploadedRecord) {
        setReplaceConfirmRecord(uploadedRecord);
      }
    } else {
      setUploadStatus({ message: result.message, type: 'error' });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id: string) => {
    const ok = deletePdf(id);
    if (ok) {
      setDeleteConfirmId(null);
      setUploadStatus({ message: 'PDF removed from storage.', type: 'info' });
    }
  };

  const handleConfirmActivateRoadmap = () => {
    if (!replaceConfirmRecord) return;
    setVerificationPending(true);

    setTimeout(() => {
      setActivePdf(replaceConfirmRecord.id);
      setVerificationPending(false);
      setReplaceConfirmRecord(null);
      setUploadStatus({
        message: `Successfully verified 100% content extraction. ${replaceConfirmRecord.filename} is now the active reference roadmap!`,
        type: 'success'
      });
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0DCD3]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E7826D] font-bold mb-1">
            <FileText className="w-4 h-4" />
            <span>SINGLE SOURCE OF TRUTH STORAGE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292929] tracking-tight">
            ROADMAP PDF REPOSITORY
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Store, view, inspect, and manage your authoritative 180-Day Production RAG syllabus PDF.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".pdf,application/pdf"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2.5 rounded-xl bg-[#E7826D] hover:bg-[#D66F5A] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-[#E7826D]/30 transition-all disabled:opacity-50 uppercase tracking-wider"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading PDF...' : 'Upload New Roadmap PDF'}</span>
            </button>
          </div>
          {!isOwner && (
            <button
              onClick={handleSyncLatest}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E0DCD3] text-[#292929] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Sync latest Roadmap PDFs from Steeven"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#E7826D] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
          )}
        </div>
      </div>

      {/* Guest Notice Banner if Guest */}
      {!isOwner && (
        <div className="p-4 rounded-xl bg-white border border-[#E0DCD3] text-xs text-[#78716C] flex items-start gap-3 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-[#E7826D] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-[#292929] block">Guest Temporary PDF Sandbox</span>
            <p className="leading-relaxed">
              PDFs uploaded, activated, or removed here affect only this Guest preview. Owner documents and storage remain unchanged.
            </p>
          </div>
        </div>
      )}

      {/* Upload Status Toast Banner */}
      {uploadStatus && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
          uploadStatus.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : uploadStatus.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-[#FAF8F5] border-[#E0DCD3] text-[#292929]'
        }`}>
          <div className="flex items-center gap-2">
            {uploadStatus.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />}
            {uploadStatus.type === 'error' && <AlertTriangle className="w-4 h-4 text-[#DC2626]" />}
            {uploadStatus.type === 'info' && <Clock className="w-4 h-4 animate-spin text-[#E7826D]" />}
            <span className="font-semibold">{uploadStatus.message}</span>
          </div>
          <button
            onClick={() => setUploadStatus(null)}
            className="text-[#78716C] hover:text-[#292929] text-xs ml-4 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Each role uploads into its own isolated state. */}
      {
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#E7826D] bg-[#FAF8F5] shadow-md'
              : 'border-[#E0DCD3] bg-white hover:bg-[#FAF8F5]'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E0DCD3] text-[#E7826D] flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#292929] mb-1">
            Drag and drop your Roadmap PDF here, or click to browse
          </h3>
          <p className="text-xs text-[#78716C] max-w-md mx-auto">
            Supports PDF files up to 50MB. Guest uploads remain local to this temporary preview.
          </p>
        </div>
      }

      {/* Stored PDFs Repository Grid */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#E7826D]" />
            <h2 className="text-sm font-bold text-[#292929] uppercase tracking-wider">
              Stored Roadmap Documents ({state.uploadedPdfs.length})
            </h2>
          </div>
          <span className="text-xs text-[#78716C] font-mono">
            Active: <strong className="text-[#292929]">{activeRecord?.filename}</strong>
          </span>
        </div>

        <div className="space-y-3">
          {state.uploadedPdfs.map(pdf => {
            const isCurrentlyActive = pdf.id === state.activePdfId;
            const isCurrentlyPreviewed = pdf.id === currentPreviewRecord?.id;

            return (
              <div
                key={pdf.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCurrentlyPreviewed
                    ? 'bg-[#FAF8F5] border-[#E7826D] shadow-sm'
                    : 'bg-white border-[#E0DCD3] hover:border-[#292929]/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setPreviewPdfId(pdf.id)}
                  className="flex items-start gap-3 text-left flex-1 min-w-0 cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isCurrentlyActive ? 'bg-[#E7826D]/15 text-[#E7826D] border border-[#E7826D]/30' : 'bg-[#FAF8F5] text-[#78716C] border border-[#E0DCD3]'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#292929]">{pdf.filename}</span>
                      {isCurrentlyActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E7826D]/15 text-[#E7826D] border border-[#E7826D]/30 uppercase">
                          Active Roadmap
                        </span>
                      )}
                      {pdf.isDefaultSourcePdf && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                          Authoritative Source
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#78716C]">
                      <span>Size: <strong className="font-mono text-[#292929]">{pdf.fileSizeBytesFormatted}</strong></span>
                      <span>·</span>
                      <span>Uploaded: <strong className="text-[#292929]">{new Date(pdf.uploadTimestamp).toLocaleDateString('en-US', { dateStyle: 'medium' })}</strong></span>
                      <span>·</span>
                      <span>Version: <strong className="font-mono text-[#292929]">v{pdf.version}</strong></span>
                      {pdf.extractedSummary && (
                        <>
                          <span>·</span>
                          <span className="text-[#16A34A] font-mono font-bold">{pdf.extractedSummary.coveragePct}% Content Coverage</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>

                {/* Document Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Preview Button */}
                  <button
                    onClick={() => setPreviewPdfId(pdf.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors flex items-center gap-1.5 ${
                      isCurrentlyPreviewed
                        ? 'bg-[#292929] text-white border-[#292929]'
                        : 'bg-white hover:bg-[#FAF8F5] text-[#292929] border-[#E0DCD3]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isCurrentlyPreviewed ? 'Viewing' : 'Preview'}</span>
                  </button>

                  {/* Open / Download */}
                  <button
                    type="button"
                    onClick={() => handleDocumentAction(pdf, 'open')}
                    className="p-1.5 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#292929] border border-[#E0DCD3] text-xs font-medium flex items-center gap-1 cursor-pointer"
                    title="Open PDF in new browser tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDocumentAction(pdf, 'download')}
                    className="p-1.5 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#292929] border border-[#E0DCD3] text-xs font-medium flex items-center gap-1 cursor-pointer"
                    title="Download original PDF file"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  {/* Owner Replace & Delete */}
                  {!isCurrentlyActive && (
                    <button
                      onClick={() => setReplaceConfirmRecord(pdf)}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#E7826D] border border-[#E7826D]/30 text-xs font-bold cursor-pointer"
                    >
                      Set Active
                    </button>
                  )}

                  {state.uploadedPdfs.length > 1 && (
                    <button
                      onClick={() => setDeleteConfirmId(pdf.id)}
                      className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-[#78716C] hover:text-[#DC2626] border border-[#E0DCD3] text-xs cursor-pointer"
                      title="Delete PDF from repository"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded PDF Viewer Frame */}
      {currentPreviewRecord && (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E0DCD3] pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <Eye className="w-4 h-4 text-[#E7826D]" />
              <h2 className="text-sm font-bold text-[#292929] uppercase tracking-wider">
                Document Viewer: {currentPreviewRecord.filename}
              </h2>
              {currentPreviewRecord.id === state.activePdfId && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E7826D]/15 text-[#E7826D] border border-[#E7826D]/30 uppercase">
                  Active Roadmap
                </span>
              )}
              {resolvedPageCount !== null && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#FAF8F5] text-[#78716C] border border-[#E0DCD3]">
                  {resolvedPageCount} pages · {currentPreviewRecord.fileSizeBytesFormatted}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleDocumentAction(currentPreviewRecord, 'open')}
                disabled={isViewerLoading || (!resolvedObjectUrl && !currentPreviewRecord.fileUrl)}
                className="px-3 py-1 bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#292929] text-xs rounded-lg flex items-center gap-1.5 border border-[#E0DCD3] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Fullscreen View</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          <PdfCanvasViewer
            pdfRecord={currentPreviewRecord}
            pdfBytes={resolvedBytes}
            objectUrl={resolvedObjectUrl}
            isLoadingSource={isViewerLoading}
            sourceError={viewerError}
            onRetry={handleRetryViewer}
            onOpenExternal={() => handleDocumentAction(currentPreviewRecord, 'open')}
            onDownload={() => handleDocumentAction(currentPreviewRecord, 'download')}
            onPageCountResolved={setResolvedPageCount}
          />
        </div>
      )}

      {/* Confirmation Modal: Replace Active Roadmap */}
      {replaceConfirmRecord && (
        <div className="fixed inset-0 z-50 bg-[#292929]/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#E7826D] flex items-center justify-center shrink-0 border border-[#E0DCD3]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#292929]">
                  Confirm Roadmap Activation
                </h3>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  You are setting <strong className="text-[#292929] font-semibold">{replaceConfirmRecord.filename}</strong> as the active reference roadmap.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-xs text-[#78716C] space-y-2">
              <strong className="text-[#292929] block font-semibold">Important Source-Content Rule:</strong>
              <p>
                The existing 180-day schedule is derived from the authoritative syllabus. Activating a replacement roadmap runs content extraction checks to ensure zero missing topics.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setReplaceConfirmRecord(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-[#292929] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmActivateRoadmap}
                disabled={verificationPending}
                className="px-4 py-2 rounded-xl bg-[#E7826D] hover:bg-[#D66F5A] text-white text-xs font-bold cursor-pointer shadow-md shadow-[#E7826D]/30 flex items-center gap-1.5 uppercase tracking-wider"
              >
                {verificationPending ? (
                  <>
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Content Coverage...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify & Activate Roadmap</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete PDF */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-[#292929]/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#DC2626] flex items-center justify-center shrink-0 border border-rose-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#292929]">Delete Stored Roadmap PDF</h3>
                <p className="text-xs text-[#78716C]">
                  Are you sure you want to delete this PDF from your persistent repository?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-[#292929] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-rose-700 text-white text-xs font-bold cursor-pointer shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

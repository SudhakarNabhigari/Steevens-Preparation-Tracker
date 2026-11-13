import { RoadmapPdfRecord } from '../types';
import { getRoadmapPdfUrl } from '../services/roadmapPdfStorage';

export interface ResolvedPdfPayload {
  blob: Blob;
  bytes: Uint8Array<ArrayBuffer>;
  directUrl: string | null;
  sourceKind: 'data_url' | 'local_asset' | 'supabase_storage' | 'remote_url';
}

export function hasPdfMagicHeader(bytes: Uint8Array): boolean {
  if (!bytes || bytes.byteLength < 5) return false;
  const searchLimit = Math.min(bytes.byteLength - 4, 1024);
  for (let i = 0; i <= searchLimit; i++) {
    if (
      bytes[i] === 0x25 && // %
      bytes[i + 1] === 0x50 && // P
      bytes[i + 2] === 0x44 && // D
      bytes[i + 3] === 0x46 && // F
      bytes[i + 4] === 0x2d // -
    ) {
      return true;
    }
  }
  return false;
}

function looksLikeHtmlDocument(bytes: Uint8Array): boolean {
  if (!bytes || bytes.byteLength === 0) return false;
  const sampleLen = Math.min(bytes.byteLength, 256);
  let text = '';
  for (let i = 0; i < sampleLen; i++) {
    text += String.fromCharCode(bytes[i]);
  }
  const trimmed = text.trimStart().toLowerCase();
  return (
    trimmed.startsWith('<!doctype html') ||
    trimmed.startsWith('<html') ||
    trimmed.startsWith('<!doctype')
  );
}

export function decodeDataUrlToPdfBytes(dataUrl: string): Uint8Array<ArrayBuffer> {
  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx === -1) {
    throw new Error('Stored PDF data URI is malformed.');
  }

  const header = dataUrl.slice(0, commaIdx).toLowerCase();
  const payload = dataUrl.slice(commaIdx + 1);

  if (header.includes(';base64')) {
    const cleaned = payload.replace(/\s+/g, '');
    const binary = atob(cleaned);
    const bytes = new Uint8Array(new ArrayBuffer(binary.length));
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  const decodedText = decodeURIComponent(payload);
  const bytes = new Uint8Array(new ArrayBuffer(decodedText.length));
  for (let i = 0; i < decodedText.length; i++) {
    bytes[i] = decodedText.charCodeAt(i) & 0xff;
  }
  return bytes;
}

function classifyPdfSource(
  pdf: RoadmapPdfRecord,
  resolvedUrl: string
): ResolvedPdfPayload['sourceKind'] {
  if (resolvedUrl.startsWith('data:')) return 'data_url';
  if (
    pdf.storagePath &&
    !pdf.storagePath.startsWith('/') &&
    pdf.storagePath.includes('/') &&
    !pdf.fileUrl?.startsWith('data:')
  ) {
    return 'supabase_storage';
  }
  if (resolvedUrl.startsWith('/') && !resolvedUrl.startsWith('//')) return 'local_asset';
  return 'remote_url';
}

export async function resolveRoadmapPdfBlob(
  pdf: RoadmapPdfRecord,
  signal?: AbortSignal
): Promise<ResolvedPdfPayload> {
  if (!pdf) {
    throw new Error('No PDF document was selected.');
  }

  // 1. Inline uploaded PDF stored in browser IndexedDB / LocalStorage as Data URL
  if (pdf.fileUrl?.startsWith('data:')) {
    const bytes = decodeDataUrlToPdfBytes(pdf.fileUrl);
    if (!hasPdfMagicHeader(bytes)) {
      throw new Error(`Uploaded file "${pdf.filename}" does not appear to be a valid PDF document.`);
    }
    return {
      blob: new Blob([bytes], { type: 'application/pdf' }),
      bytes,
      directUrl: null,
      sourceKind: 'data_url',
    };
  }

  // 2. Resolve URL (bundled /assets/... path, external URL, or authorized Supabase signed URL)
  let resolvedUrl = '';
  try {
    resolvedUrl = await getRoadmapPdfUrl(pdf);
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'Unable to authorize document access.';
    throw new Error(`Could not obtain PDF URL for "${pdf.filename}": ${detail}`);
  }

  if (!resolvedUrl && pdf.storagePath?.startsWith('/')) {
    resolvedUrl = pdf.storagePath;
  }

  if (!resolvedUrl) {
    throw new Error(`No accessible file URL or storage path found for "${pdf.filename}".`);
  }

  if (resolvedUrl.startsWith('data:')) {
    const bytes = decodeDataUrlToPdfBytes(resolvedUrl);
    if (!hasPdfMagicHeader(bytes)) {
      throw new Error(`Document "${pdf.filename}" does not have a valid PDF header.`);
    }
    return {
      blob: new Blob([bytes], { type: 'application/pdf' }),
      bytes,
      directUrl: null,
      sourceKind: 'data_url',
    };
  }

  const sourceKind = classifyPdfSource(pdf, resolvedUrl);

  const response = await fetch(resolvedUrl, {
    signal,
    headers: {
      Accept: 'application/pdf,application/octet-stream,*/*',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch "${pdf.filename}" (HTTP ${response.status}${
        response.statusText ? ` ${response.statusText}` : ''
      }).`
    );
  }

  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(new ArrayBuffer(buffer.byteLength));
  bytes.set(new Uint8Array(buffer));

  if (bytes.byteLength === 0) {
    throw new Error(`"${pdf.filename}" returned an empty file.`);
  }

  if (looksLikeHtmlDocument(bytes)) {
    throw new Error(
      `"${pdf.filename}" could not be loaded because the server returned HTML instead of a PDF file.`
    );
  }

  if (!hasPdfMagicHeader(bytes)) {
    throw new Error(`"${pdf.filename}" is not a valid PDF binary (%PDF- signature missing).`);
  }

  return {
    blob: new Blob([bytes], { type: 'application/pdf' }),
    bytes,
    directUrl: resolvedUrl,
    sourceKind,
  };
}

export function createTrackedPdfObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokeTrackedPdfObjectUrl(url: string | null | undefined): void {
  if (!url || !url.startsWith('blob:')) return;
  try {
    URL.revokeObjectURL(url);
  } catch {
    // Ignore double-revocation
  }
}

function triggerAnchorNavigation(
  href: string,
  mode: 'open' | 'download',
  filename: string
): void {
  const anchor = document.createElement('a');
  anchor.href = href;
  if (mode === 'download') {
    anchor.download = filename;
  } else {
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
  }
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export async function triggerPdfDocumentAction(
  pdf: RoadmapPdfRecord,
  mode: 'open' | 'download',
  activeObjectUrl?: string | null
): Promise<void> {
  if (activeObjectUrl && activeObjectUrl.startsWith('blob:')) {
    triggerAnchorNavigation(activeObjectUrl, mode, pdf.filename);
    return;
  }

  const resolved = await resolveRoadmapPdfBlob(pdf);
  const tempObjectUrl = createTrackedPdfObjectUrl(resolved.blob);
  triggerAnchorNavigation(tempObjectUrl, mode, pdf.filename);

  // Give the browser enough time to read the blob before revoking.
  const revokeDelayMs = mode === 'open' ? 60_000 : 10_000;
  setTimeout(() => {
    revokeTrackedPdfObjectUrl(tempObjectUrl);
  }, revokeDelayMs);
}

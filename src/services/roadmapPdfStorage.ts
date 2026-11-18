import { isSupabaseConfigured, requireSupabaseClient } from '../lib/supabase';
import type { RoadmapPdfRecord } from '../types';

const BUCKET = 'roadmap-pdfs';
const SIGNED_URL_EXPIRY = 60 * 60;

export async function getRoadmapPdfUrl(
  pdf: RoadmapPdfRecord
): Promise<string> {
  // Uploaded inline PDFs (IndexedDB / LocalStorage data URIs) always resolve directly.
  if (pdf.fileUrl?.startsWith('data:')) {
    return pdf.fileUrl;
  }

  // Bundled local assets (e.g. /assets/aistudio/...) or non-bucket paths resolve directly.
  if (!pdf.storagePath || pdf.storagePath.startsWith('/') || !pdf.storagePath.includes('/')) {
    return pdf.fileUrl || pdf.storagePath || '';
  }

  // Fallback for legacy unmigrated records that still carry an explicit URL without Supabase configured.
  if (!isSupabaseConfigured && pdf.fileUrl) {
    return pdf.fileUrl;
  }

  const supabase = requireSupabaseClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(pdf.storagePath, SIGNED_URL_EXPIRY);

  if (error) throw error;
  if (!data?.signedUrl) {
    throw new Error(`Could not generate authorized access URL for ${pdf.filename}.`);
  }

  return data.signedUrl;
}

export async function migrateLegacyRoadmapPdfs(
  userId: string,
  records: RoadmapPdfRecord[]
): Promise<RoadmapPdfRecord[]> {
  if (!isSupabaseConfigured) {
    return records;
  }

  const supabase = requireSupabaseClient();
  const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr || !sessionData?.session || sessionData.session.user?.id !== userId) {
    throw new Error('Authenticated Supabase Owner session required before migrating PDFs to Storage.');
  }

  const migrated: RoadmapPdfRecord[] = [];

  for (const pdf of records) {
    if (!pdf.fileUrl?.startsWith('data:application/pdf')) {
      migrated.push(pdf);
      continue;
    }

    const safeFilename = pdf.filename.replace(/[^\w.-]+/g, '_');
    const storagePath = `${userId}/${pdf.id}-${safeFilename}`;

    const response = await fetch(pdf.fileUrl);
    if (!response.ok) {
      throw new Error(`Could not read legacy PDF: ${pdf.filename}`);
    }

    const blob = await response.blob();
    const headerSlice = new Uint8Array(await blob.slice(0, 16).arrayBuffer());
    const hasMagic =
      headerSlice.length >= 5 &&
      headerSlice[0] === 0x25 &&
      headerSlice[1] === 0x50 &&
      headerSlice[2] === 0x44 &&
      headerSlice[3] === 0x46 &&
      headerSlice[4] === 0x2d;

    if (!hasMagic) {
      throw new Error(`Invalid PDF payload in legacy record: ${pdf.filename}`);
    }

    const file = new File([blob], pdf.filename, {
      type: 'application/pdf'
    });

    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
      contentType: 'application/pdf',
      upsert: true
    });

    if (error) throw error;

    migrated.push({
      ...pdf,
      ownerId: userId,
      storagePath,
      fileUrl: ''
    });
  }

  return migrated;
}

export async function deleteRoadmapPdfFromStorage(
  storagePath: string
): Promise<void> {
  if (!storagePath || storagePath.startsWith('/') || !storagePath.includes('/')) return;

  const supabase = requireSupabaseClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath]);

  if (error) throw error;
}


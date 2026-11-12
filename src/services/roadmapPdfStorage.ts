import { supabase } from '../lib/supabase';
import type { RoadmapPdfRecord } from '../types';

const BUCKET = 'roadmap-pdfs';
const SIGNED_URL_EXPIRY = 60 * 60;

export async function getRoadmapPdfUrl(
  pdf: RoadmapPdfRecord
): Promise<string> {
  // Bundled/default PDFs and unmigrated legacy PDFs continue to work.
  if (!pdf.storagePath || pdf.storagePath.startsWith('/') || !pdf.storagePath.includes('/')) {
    return pdf.fileUrl;
  }

  if (pdf.fileUrl?.startsWith('data:application/pdf')) {
    return pdf.fileUrl;
  }

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(pdf.storagePath, SIGNED_URL_EXPIRY);

  if (error) throw error;

  return data.signedUrl;
}

export async function migrateLegacyRoadmapPdfs(
  userId: string,
  records: RoadmapPdfRecord[]
): Promise<RoadmapPdfRecord[]> {
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
    const file = new File([blob], pdf.filename, {
      type: 'application/pdf',
    });

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) throw error;

    migrated.push({
      ...pdf,
      ownerId: userId,
      storagePath,
      fileUrl: '',
    });
  }

  return migrated;
}

export async function deleteRoadmapPdfFromStorage(
  storagePath: string
): Promise<void> {
  if (!storagePath || !storagePath.includes('/')) return;

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath]);

  if (error) throw error;
}


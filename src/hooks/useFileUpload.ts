import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';

export type UploadMediaType = 'image' | 'audio' | 'pdf' | 'document' | 'video' | 'text' | 'unknown';

export interface UploadResult {
  file_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  media_type: UploadMediaType;
  preview: string;
  extracted_text: string;
}

export type UploadState = 'idle' | 'uploading' | 'done' | 'error';

interface UseFileUploadReturn {
  uploadState: UploadState;
  uploadResult: UploadResult | null;
  uploadError: string | null;
  upload: (file: File) => Promise<UploadResult | null>;
  reset: () => void;
}

const MAX_SIZE_MB = 25;
const ALLOWED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic',
  '.mp3', '.wav', '.ogg', '.m4a', '.flac',
  '.mp4', '.mov', '.avi', '.mkv',
  '.pdf', '.docx', '.doc', '.txt', '.md',
];

function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts[parts.length - 1].toLowerCase()}` : '';
}

export function useFileUpload(): UseFileUploadReturn {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<UploadResult | null> => {
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      const err = `File too large. Maximum size is ${MAX_SIZE_MB} MB.`;
      setUploadError(err);
      setUploadState('error');
      return null;
    }
    const ext = getFileExtension(file.name);
    if (ext && !ALLOWED_EXTENSIONS.includes(ext)) {
      const err = `File type not supported: ${ext}.`;
      setUploadError(err);
      setUploadState('error');
      return null;
    }
    setUploadState('uploading');
    setUploadError(null);
    setUploadResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await apiClient<UploadResult>('/api/webapp/upload', {
        method: 'POST',
        body: formData,
      });
      setUploadResult(result);
      setUploadState('done');
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(msg);
      setUploadState('error');
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setUploadState('idle');
    setUploadResult(null);
    setUploadError(null);
  }, []);

  return { uploadState, uploadResult, uploadError, upload, reset };
}

export function mediaTypeLabel(type: UploadMediaType): string {
  const labels: Record<UploadMediaType, string> = {
    image: 'Image', audio: 'Audio', video: 'Video',
    pdf: 'PDF', document: 'Document', text: 'Text', unknown: 'File',
  };
  return labels[type] ?? 'File';
}

export function mediaTypeIcon(type: UploadMediaType): string {
  const icons: Record<UploadMediaType, string> = {
    image: '\u{1F5BC}\uFE0F', audio: '\u{1F3B5}', video: '\u{1F3AC}',
    pdf: '\u{1F4C4}', document: '\u{1F4DD}', text: '\u{1F4C3}', unknown: '\u{1F4CE}',
  };
  return icons[type] ?? '\u{1F4CE}';
}

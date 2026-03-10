'use client';

import { X, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { UploadResult, UploadState, mediaTypeIcon, mediaTypeLabel } from '@/hooks/useFileUpload';

interface FilePreviewProps {
  file: File;
  uploadState: UploadState;
  uploadResult: UploadResult | null;
  uploadError: string | null;
  onRemove: () => void;
}

export default function FilePreview({ file, uploadState, uploadResult, uploadError, onRemove }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/');
  const objectUrl = isImage ? URL.createObjectURL(file) : null;

  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 max-w-xs">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
        {isImage && objectUrl ? (
          <Image src={objectUrl} alt={file.name} width={40} height={40} className="w-full h-full object-cover" unoptimized />
        ) : (
          <span className="text-xl">{uploadResult ? mediaTypeIcon(uploadResult.media_type) : '\u{1F4CE}'}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text truncate font-medium">{file.name}</p>
        <p className="text-xs text-text-muted">
          {uploadState === 'uploading' && (
            <span className="flex items-center gap-1 text-accent">
              <Loader2 size={10} className="animate-spin" />Processing...
            </span>
          )}
          {uploadState === 'done' && uploadResult && (
            <span className="text-green-400">{'\u2713'} {mediaTypeLabel(uploadResult.media_type)} ready</span>
          )}
          {uploadState === 'error' && (
            <span className="flex items-center gap-1 text-red-400">
              <AlertCircle size={10} />{uploadError ?? 'Upload failed'}
            </span>
          )}
          {uploadState === 'idle' && <span>{(file.size / 1024).toFixed(0)} KB</span>}
        </p>
      </div>
      <button onClick={onRemove} className="flex-shrink-0 p-1 rounded-full text-text-muted hover:text-text hover:bg-white/10 transition-colors" aria-label="Remove file">
        <X size={14} />
      </button>
    </div>
  );
}

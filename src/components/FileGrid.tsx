// ============================================
// components/FileGrid.tsx
// ============================================

import FileCard from './FileCard';
import { FileType } from '@/app/home/page';

type FileGridProps = {
  files: FileType[];
  onShare: (fileId: string) => void;
  onDelete: (fileId: string) => void;
};

export default function FileGrid({ files, onShare, onDelete }: FileGridProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-lg">No files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onShare={onShare}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

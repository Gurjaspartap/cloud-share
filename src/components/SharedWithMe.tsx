// ============================================
// components/SharedWithMe.tsx
// ============================================

import { Users } from 'lucide-react';
import SharedFileCard from './SharedFileCard';
import { FileType } from '@/app/home/page';

type SharedWithMeProps = {
  files: FileType[];
};

type SharedFileType = FileType & {
  sharedBy?: string;
  sharedAt?: string;
  permissions?: 'view' | 'download' | 'edit';
  message?: string;
};

export default function SharedWithMe({ files }: SharedWithMeProps) {
  const handleDownload = (file: any) => {
    if (file.downloadUrl) {
      const link = document.createElement('a');
      link.href = file.downloadUrl;
      link.download = file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Shared with Me</h1>
        </div>
        <p className="text-gray-600">Files that others have shared with you</p>
      </div>
      
      {files.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No files shared with you yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {files.map((file) => (
            <SharedFileCard
              key={file.id}
              file={file}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}
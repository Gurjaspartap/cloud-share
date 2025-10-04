// ============================================
// components/SharedWithMe.tsx
// ============================================

import { Users } from 'lucide-react';
import FileGrid from './FileGrid';
import { FileType } from '@/app/home/page';

type SharedWithMeProps = {
  files: FileType[];
};

export default function SharedWithMe({ files }: SharedWithMeProps) {
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
        <FileGrid 
          files={files} 
          onShare={() => {}}
          onDelete={() => {}}
        />
      )}
    </div>
  );
}
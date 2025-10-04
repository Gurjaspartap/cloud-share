
// ============================================
// components/FileCard.tsx
// ============================================

import { FileText, Image, Video, Music, File, Share2, Download, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { FileType } from '@/app/home/page';

type FileCardProps = {
  file: FileType;
  onShare: (fileId: string) => void;
  onDelete: (fileId: string) => void;
};

export default function FileCard({ file, onShare, onDelete }: FileCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleDownload = (file: FileType) => {
    if (file.downloadUrl) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = file.downloadUrl;
      link.download = file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('No download URL available for file:', file.name);
    }
  };

  const getFileIcon = () => {
    const iconClass = "w-12 h-12";
    switch (file.type) {
      case 'image':
        return <Image className={iconClass} />;
      case 'video':
        return <Video className={iconClass} />;
      case 'audio':
        return <Music className={iconClass} />;
      case 'document':
        return <FileText className={iconClass} />;
      default:
        return <File className={iconClass} />;
    }
  };

  const getFileColor = () => {
    switch (file.type) {
      case 'image':
        return 'from-green-400 to-green-600';
      case 'video':
        return 'from-red-400 to-red-600';
      case 'audio':
        return 'from-purple-400 to-purple-600';
      case 'document':
        return 'from-blue-400 to-blue-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {file.thumbnail ? (
        <div className="h-48 overflow-hidden">
          <img
            src={file.thumbnail}
            alt={file.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className={`h-48 bg-gradient-to-br ${getFileColor()} flex items-center justify-center text-white`}>
          {getFileIcon()}
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate mb-1">{file.name}</h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{file.size}</span>
          <span>{file.uploadDate}</span>
        </div>
        
        {file.sharedWith && file.sharedWith.length > 0 && (
          <div className="mt-2 flex items-center gap-1 text-xs text-indigo-600">
            <Share2 className="w-3 h-3" />
            <span>Shared with {file.sharedWith.length}</span>
          </div>
        )}
        
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => onShare(file.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          
          <button 
            onClick={() => handleDownload(file)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button
                  onClick={() => {
                    onDelete(file.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
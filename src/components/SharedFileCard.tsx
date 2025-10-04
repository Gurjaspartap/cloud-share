import { FileText, Image, Video, Music, File, Download, User, Calendar, MessageSquare, Eye, Download as DownloadIcon, Edit } from 'lucide-react';
import { useState } from 'react';
import { FileType } from '@/app/home/page';

type SharedFileType = FileType & {
  sharedBy?: string;
  sharedAt?: string;
  permissions?: 'view' | 'download' | 'edit';
  message?: string;
};

type SharedFileCardProps = {
  file: SharedFileType;
  onDownload: (file: SharedFileType) => void;
};

export default function SharedFileCard({ file, onDownload }: SharedFileCardProps) {
  const [showMessage, setShowMessage] = useState(false);

  const handleDownload = (file: SharedFileType) => {
    if (file.downloadUrl && file.permissions !== 'view') {
      onDownload(file);
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

  const getPermissionIcon = () => {
    switch (file.permissions) {
      case 'view':
        return <Eye className="w-4 h-4" />;
      case 'download':
        return <DownloadIcon className="w-4 h-4" />;
      case 'edit':
        return <Edit className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getPermissionText = () => {
    switch (file.permissions) {
      case 'view':
        return 'View only';
      case 'download':
        return 'View & Download';
      case 'edit':
        return 'View, Download & Edit';
      default:
        return 'View only';
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
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>{file.size}</span>
          <span>{file.uploadDate}</span>
        </div>

        {/* Shared by info */}
        {file.sharedBy && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <User className="w-4 h-4" />
            <span>Shared by {file.sharedBy}</span>
          </div>
        )}

        {/* Shared date */}
        {file.sharedAt && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Calendar className="w-4 h-4" />
            <span>Shared on {file.sharedAt}</span>
          </div>
        )}

        {/* Permissions */}
        <div className="flex items-center gap-2 text-sm text-indigo-600 mb-2">
          {getPermissionIcon()}
          <span>{getPermissionText()}</span>
        </div>

        {/* Message */}
        {file.message && (
          <div className="mb-3">
            <button
              onClick={() => setShowMessage(!showMessage)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{showMessage ? 'Hide message' : 'Show message'}</span>
            </button>
            {showMessage && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                "{file.message}"
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4">
          <button
            onClick={() => handleDownload(file)}
            disabled={!file.downloadUrl || file.permissions === 'view'}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            {file.permissions === 'view' ? 'View Only' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
}

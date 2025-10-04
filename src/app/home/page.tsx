'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import FileGrid from '@/components/FileGrid';
import SharedWithMe from '@/components/SharedWithMe';
import ShareModal from '@/components/ShareModal';
import AuthGuard from '@/components/AuthGuard';
import { ShareSettings } from '@/components/ShareModal';

export type FileType = {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'video' | 'document' | 'audio' | 'other';
  uploadDate: string;
  thumbnail?: string;
  downloadUrl?: string;
  key?: string;
  sharedWith?: string[];
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'myfiles' | 'shared'>('myfiles');
  const [files, setFiles] = useState<FileType[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [sharedFiles, setSharedFiles] = useState<FileType[]>([]);

  const handleFileUpload = async (uploadedFiles: File[]) => {
    if (!uid) return;
    
    for (const file of uploadedFiles) {
      try {
        // 1. Get pre-signed URL
        const res = await fetch("/api/upload-url", {
          method: "POST",
          body: JSON.stringify({ uid, filename: file.name }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        
        // 2. Upload file to S3
        await fetch(data.uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": "application/octet-stream" },
        });
        
        console.log("File uploaded to S3:", file.name);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    
    // Refresh the file list
    fetchFiles();
  };

  const getFileType = (mimeType: string): FileType['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('document') || mimeType.includes('pdf')) return 'document';
    return 'other';
  };

  const handleShare = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      setSelectedFile(file);
      setIsShareModalOpen(true);
    }
  };

  const handleShareSubmit = async (settings: ShareSettings) => {
    console.log("handleShareSubmit", settings);
    if (!selectedFile || !uid) return;

    // try {
    //   const response = await fetch('/api/share', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       fileId: selectedFile.id,
    //       fileName: selectedFile.name,
    //       ownerId: uid,
    //       sharedWith: settings.users,
    //       message: settings.message,
    //       linkSettings: settings.linkSettings,
    //       shareType: settings.type
    //     }),
    //   });

    //   const result = await response.json();
      
    //   if (response.ok) {
    //     console.log('Share created successfully:', result);
    //     // You could show a success toast here
    //   } else {
    //     console.error('Failed to create share:', result.error);
    //     throw new Error(result.error);
    //   }
    // } catch (error) {
    //   console.error('Error sharing file:', error);
    //   throw error;
    // }
  };

  const handleDelete = async (fileId: string) => {
    const fileToDelete = files.find(f => f.id === fileId);
    if (!fileToDelete) return;

    try {
      const response = await fetch('/api/upload-url', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: fileToDelete.key }),
      });

      if (response.ok) {
        setFiles(files.filter(f => f.id !== fileId));
        console.log('File deleted successfully');
      } else {
        console.error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };
    useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    setUid(storedUid);
  }, []);

    const fetchFiles = async () => {
    if (!uid) return;
    try {
      const res = await fetch(`/api/upload-url?uid=${uid}`);
      const data = await res.json();
      setFiles(data.files || []);
      console.log("Files from API:", data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const fetchSharedFiles = async () => {
    if (!uid) return;
    try {
      const res = await fetch(`/api/shared-files?userId=${uid}`);
      const data = await res.json();
      setSharedFiles(data.files || []);
      console.log("Shared files from API:", data.files);
    } catch (error) {
      console.error("Error fetching shared files:", error);
    }
  };

  useEffect(() => { 
    fetchFiles(); 
    fetchSharedFiles();
  }, [uid]);

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto p-8">
            {activeTab === 'myfiles' ? (
              <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">My Files</h1>
                  <p className="text-gray-600">Upload and manage your files</p>
                </div>
                
                <FileUpload onUpload={handleFileUpload} />
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    All Files ({files.length})
                  </h2>
                  <FileGrid 
                    files={files} 
                    onShare={handleShare}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            ) : (
              <SharedWithMe files={sharedFiles} />
            )}
          </main>
        </div>
      </div>

      {/* Share Modal */}
      {selectedFile && (
        <ShareModal
          file={selectedFile}
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setSelectedFile(null);
          }}
          onShare={handleShareSubmit}
        />
      )}
    </AuthGuard>
  );
}








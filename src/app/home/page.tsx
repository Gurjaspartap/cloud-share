'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import FileGrid from '@/components/FileGrid';
import SharedWithMe from '@/components/SharedWithMe';
import AuthGuard from '@/components/AuthGuard';

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

  const [sharedFiles, setSharedFiles] = useState<FileType[]>([
    {
      id: '5',
      name: 'Team Report.docx',
      size: '1.8 MB',
      type: 'document',
      uploadDate: '2024-10-02'
    },
    {
      id: '6',
      name: 'Meeting Notes.pdf',
      size: '856 KB',
      type: 'document',
      uploadDate: '2024-09-30'
    }
  ]);

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
    console.log('Share file:', fileId);
    // Add your share logic here
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
  useEffect(() => { fetchFiles(); }, [uid]);

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
    </AuthGuard>
  );
}








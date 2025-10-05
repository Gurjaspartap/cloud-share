
// ============================================
// components/FileUpload.tsx
// ============================================

import { useState } from 'react';
import { Upload } from 'lucide-react';

type FileUploadProps = {
  onUpload: (files: File[]) => void;
};

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onUpload(files);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50'
      }`}
    >
      <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-indigo-500' : 'text-gray-400'}`} />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {isDragging ? 'Drop files here' : 'Upload Files'}
      </h3>
      <p className="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
      <label className="inline-block">
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        <span className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 cursor-pointer inline-block transition-colors">
          Browse Files
        </span>
      </label>
    </div>
  );
}
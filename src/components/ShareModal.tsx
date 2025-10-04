'use client';

import { useState } from 'react';
import { X, Users, Link, Copy, Mail, Check, AlertCircle } from 'lucide-react';
import { FileType } from '@/app/home/page';

export type ShareUser = {
  email: string;
  name?: string;
  permissions: 'view' | 'download' | 'edit';
};

export type ShareSettings = {
  type: 'users' | 'link';
  users: ShareUser[];
  message: string;
  linkSettings: {
    expiresIn?: number; // days
    password?: string;
    requireAuth: boolean;
  };
};

type ShareModalProps = {
  file: FileType;
  isOpen: boolean;
  onClose: () => void;
  onShare: (settings: ShareSettings) => Promise<void>;
};

export default function ShareModal({ file, isOpen, onClose, onShare }: ShareModalProps) {
  const [shareType, setShareType] = useState('link');
  const [users, setUsers] = useState<ShareUser[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [linkSettings, setLinkSettings] = useState({
    expiresIn: 7,
    password: '',
    requireAuth: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

 


 
  const generateShareLink = async (key: string, expiresInDays: number) => {
    try {
      console.log("key generateShareLink",key)
      console.log("expiresInDays generateShareLink",expiresInDays)
      // If expiresInDays is 0, use a very long expiration (7 years)
      const expiresInSeconds = expiresInDays === 0 ? 7 * 365 * 24 * 60 * 60 : expiresInDays * 24 * 60 * 60;
      
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: key,
          expiresInSeconds: expiresInSeconds
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate share link');
      }

      const data = await response.json();
      return data.shareUrl;
    } catch (error) {
      console.error('Error generating share link:', error);
      throw error;
    }
  }

  const handleShare = async (file:any) => {
    setIsLoading(true);
    setError('');

    try {
     
      
      if (shareType === 'link') {
        // Generate share link using the API
        if (!file.key) {
          throw new Error('File key is missing');
        }
        console.log("before hittinf the api")
        console.log("file",file)
        const shareLink = await generateShareLink(file.key, linkSettings.expiresIn || 7);
        console.log("shareLink", shareLink);
        setShareLink(shareLink);
        console.log("after hittinf the api", shareLink);
      } else {
        //onClose();
      }
    } catch (err) {
      setError('Failed to share file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Share File</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-lg">
                {file.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{file.name}</h3>
              <p className="text-sm text-gray-500">{file.size} • {file.type}</p>
            </div>
          </div>
        </div>

        {/* Create Link */}
       
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link Settings
              </label>
              <div className="space-y-3">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={linkSettings.requireAuth}
                      onChange={(e) => setLinkSettings({...linkSettings, requireAuth: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm">Require authentication to access</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Expiration</label>
                  <select
                    value={linkSettings.expiresIn}
                    onChange={(e) => setLinkSettings({...linkSettings, expiresIn: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value={0}>Never expires</option>
                    <option value={1}>1 day</option>
                    <option value={7}>7 days</option>
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                  </select>
                </div>

              </div>
            </div>
          </div>
       

        {/* Share Link Result */}
        {shareLink && (
          <div className="p-6 border-t border-gray-200 bg-green-50">
            <div className="flex items-center gap-2 mb-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Share link created successfully!</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
             onClick={() => handleShare(file)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                {'Create Link'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

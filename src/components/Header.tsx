"use client";
import { Search, Bell } from 'lucide-react';
import { useFirebaseUserProfile } from '@/hooks/useFirebaseUser';
//import userImage from '/user.png';
// Default user image path
const defaultUserImage = '/user.png';
import Image from 'next/image';

// Client-only component for user profile to avoid hydration issues
function UserProfileSection() {
  const { 
    userProfile, 
    loading, 
    isAuthenticated, 
    getUserName, 
    getUserEmail, 
    getUserPhoto 
  } = useFirebaseUserProfile();

  if (loading) {
    return (
      <div className="flex items-center gap-4 ml-6">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (isAuthenticated && userProfile) {
    const profileImage = getUserPhoto() || defaultUserImage;
    return (
      <div className="flex items-center gap-3">
        <Image 
          src={profileImage} 
          alt="User" 
          width={40} 
          height={40} 
          className="rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">{getUserName()}</p>
          <p className="text-xs text-gray-500">{getUserEmail()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-semibold">
        ?
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">Not signed in</p>
        <p className="text-xs text-gray-500">Please log in</p>
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 ml-6">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <UserProfileSection />
        </div>
      </div>
    </header>
  );
}
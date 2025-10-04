"use client";
import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebaseClient';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  providerId: string;
}

export function useFirebaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      setUser(user);
      
      if (user) {
        // Extract user profile information
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber,
          providerId: user.providerId
        };
        setUserProfile(profile);
        setError(null);
      } else {
        setUserProfile(null);
        setError(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated: !!user
  };
}

// Alternative hook for getting user data with additional methods
export function useFirebaseUserProfile() {
  const { user, userProfile, loading, error, isAuthenticated } = useFirebaseUser();

  const getUserInitials = () => {
    if (!userProfile?.displayName) return 'U';
    return userProfile.displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserName = () => {
    return userProfile?.displayName || userProfile?.email?.split('@')[0] || 'User';
  };

  const getUserEmail = () => {
    return userProfile?.email || '';
  };

  const getUserPhoto = () => {
    return userProfile?.photoURL || null;
  };

  return {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated,
    getUserInitials,
    getUserName,
    getUserEmail,
    getUserPhoto
  };
}

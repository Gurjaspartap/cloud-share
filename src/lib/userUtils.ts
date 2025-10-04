import { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  providerId: string;
}

/**
 * Extract user profile information from Firebase User object
 */
export function extractUserProfile(user: User): UserProfile {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    phoneNumber: user.phoneNumber,
    providerId: user.providerId
  };
}

/**
 * Get user's display name or fallback to email username
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Guest';
  return user.displayName || user.email?.split('@')[0] || 'User';
}

/**
 * Get user's email address
 */
export function getUserEmail(user: User | null): string {
  return user?.email || '';
}

/**
 * Get user's profile photo URL
 */
export function getUserPhotoURL(user: User | null): string | null {
  return user?.photoURL || null;
}

/**
 * Generate user initials from display name or email
 */
export function getUserInitials(user: User | null): string {
  if (!user) return 'G';
  
  const displayName = user.displayName;
  if (displayName) {
    return displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  
  const email = user.email;
  if (email) {
    return email[0].toUpperCase();
  }
  
  return 'U';
}

/**
 * Check if user is authenticated
 */
export function isUserAuthenticated(user: User | null): boolean {
  return !!user;
}

/**
 * Get user's provider information
 */
export function getUserProvider(user: User | null): string {
  if (!user) return 'unknown';
  
  const providerData = user.providerData;
  if (providerData.length > 0) {
    return providerData[0].providerId;
  }
  
  return user.providerId;
}

/**
 * Format user data for display
 */
export function formatUserForDisplay(user: User | null) {
  if (!user) {
    return {
      name: 'Not signed in',
      email: '',
      initials: '?',
      photo: null,
      isAuthenticated: false
    };
  }

  return {
    name: getUserDisplayName(user),
    email: getUserEmail(user),
    initials: getUserInitials(user),
    photo: getUserPhotoURL(user),
    isAuthenticated: true,
    provider: getUserProvider(user),
    emailVerified: user.emailVerified
  };
}

/**
 * Save user data to localStorage (useful for persistence)
 */
export function saveUserToLocalStorage(user: User | null) {
  if (!user) {
    localStorage.removeItem('user');
    return;
  }

  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    providerId: user.providerId
  };

  localStorage.setItem('user', JSON.stringify(userData));
}

/**
 * Load user data from localStorage
 */
export function loadUserFromLocalStorage(): UserProfile | null {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    return null;
  }
}

/**
 * Clear user data from localStorage
 */
export function clearUserFromLocalStorage() {
  localStorage.removeItem('user');
}

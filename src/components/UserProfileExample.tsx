"use client";
import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebaseClient';
import { useFirebaseUser, useFirebaseUserProfile } from '@/hooks/useFirebaseUser';
import { 
  extractUserProfile, 
  getUserDisplayName, 
  getUserEmail, 
  getUserInitials, 
  getUserPhotoURL,
  formatUserForDisplay,
  saveUserToLocalStorage,
  loadUserFromLocalStorage
} from '@/lib/userUtils';

/**
 * Example component showing different ways to get user information from Firebase
 */
export default function UserProfileExample() {
  // Method 1: Using custom hooks (Recommended)
  const { user, userProfile, loading, error, isAuthenticated } = useFirebaseUser();
  const { getUserName, getUserEmail, getUserInitials, getUserPhoto } = useFirebaseUserProfile();

  // Method 2: Direct Firebase auth state listener
  const [directUser, setDirectUser] = useState<User | null>(null);
  const [directLoading, setDirectLoading] = useState(true);

  // Method 3: LocalStorage data
  const [localStorageUser, setLocalStorageUser] = useState<any>(null);

  useEffect(() => {
    // Method 2: Direct Firebase auth state listener
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setDirectUser(user);
      setDirectLoading(false);
      
      // Save to localStorage when user changes
      saveUserToLocalStorage(user);
    });

    // Method 3: Load from localStorage
    const savedUser = loadUserFromLocalStorage();
    setLocalStorageUser(savedUser);

    return () => unsubscribe();
  }, []);

  if (loading || directLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Loading user data...</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Firebase User Data Examples</h1>
      
      {/* Method 1: Using Custom Hooks */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">Method 1: Custom Hooks (Recommended)</h2>
        <div className="space-y-2">
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>Name:</strong> {getUserName()}</p>
          <p><strong>Email:</strong> {getUserEmail()}</p>
          <p><strong>Initials:</strong> {getUserInitials()}</p>
          <p><strong>Photo URL:</strong> {getUserPhoto() || 'None'}</p>
          {userProfile && (
            <div className="mt-3 p-3 bg-blue-100 rounded">
              <p><strong>Full Profile:</strong></p>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(userProfile, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Method 2: Direct Firebase Auth */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-green-900 mb-3">Method 2: Direct Firebase Auth</h2>
        <div className="space-y-2">
          <p><strong>User Object:</strong> {directUser ? 'Available' : 'Not available'}</p>
          {directUser && (
            <>
              <p><strong>UID:</strong> {directUser.uid}</p>
              <p><strong>Email:</strong> {directUser.email}</p>
              <p><strong>Display Name:</strong> {directUser.displayName || 'Not set'}</p>
              <p><strong>Email Verified:</strong> {directUser.emailVerified ? 'Yes' : 'No'}</p>
              <p><strong>Provider:</strong> {directUser.providerId}</p>
              <p><strong>Photo URL:</strong> {directUser.photoURL || 'None'}</p>
            </>
          )}
        </div>
      </div>

      {/* Method 3: Using Utility Functions */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-purple-900 mb-3">Method 3: Utility Functions</h2>
        <div className="space-y-2">
          <p><strong>Display Name:</strong> {getUserDisplayName(directUser)}</p>
          <p><strong>Email:</strong> {getUserEmail(directUser)}</p>
          <p><strong>Initials:</strong> {getUserInitials(directUser)}</p>
          <p><strong>Photo URL:</strong> {getUserPhotoURL(directUser) || 'None'}</p>
          
          {directUser && (
            <div className="mt-3 p-3 bg-purple-100 rounded">
              <p><strong>Formatted User Data:</strong></p>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(formatUserForDisplay(directUser), null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Method 4: LocalStorage Data */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-900 mb-3">Method 4: LocalStorage Data</h2>
        <div className="space-y-2">
          <p><strong>Saved User:</strong> {localStorageUser ? 'Available' : 'Not available'}</p>
          {localStorageUser && (
            <div className="mt-3 p-3 bg-yellow-100 rounded">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(localStorageUser, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-red-900 mb-3">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Code Examples */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Code Examples</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800">1. Using Custom Hook:</h3>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`import { useFirebaseUserProfile } from '@/hooks/useFirebaseUser';

function MyComponent() {
  const { userProfile, getUserName, getUserEmail, getUserPhoto } = useFirebaseUserProfile();
  
  return (
    <div>
      <p>Name: {getUserName()}</p>
      <p>Email: {getUserEmail()}</p>
      <img src={getUserPhoto()} alt="Profile" />
    </div>
  );
}`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">2. Direct Firebase Auth:</h3>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebaseClient';

useEffect(() => {
  const auth = getFirebaseAuth();
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User email:', user.email);
      console.log('User name:', user.displayName);
      console.log('User photo:', user.photoURL);
    }
  });
  return () => unsubscribe();
}, []);`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">3. Using Utility Functions:</h3>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`import { getUserDisplayName, getUserEmail, getUserInitials } from '@/lib/userUtils';

// Get user info from Firebase User object
const name = getUserDisplayName(user);
const email = getUserEmail(user);
const initials = getUserInitials(user);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

# Firebase User Management

This directory contains utilities and hooks for managing Firebase user authentication and profile data.

## Files

- `userUtils.ts` - Utility functions for extracting and formatting user data
- `useFirebaseUser.ts` - Custom React hooks for Firebase user state management

## Quick Start

### 1. Using Custom Hooks (Recommended)

```tsx
import { useFirebaseUserProfile } from '@/hooks/useFirebaseUser';

function MyComponent() {
  const { 
    userProfile, 
    loading, 
    isAuthenticated, 
    getUserName, 
    getUserEmail, 
    getUserPhoto 
  } = useFirebaseUserProfile();

  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome, {getUserName()}!</h1>
      <p>Email: {getUserEmail()}</p>
      {getUserPhoto() && <img src={getUserPhoto()} alt="Profile" />}
    </div>
  );
}
```

### 2. Using Utility Functions

```tsx
import { getUserDisplayName, getUserEmail, getUserInitials } from '@/lib/userUtils';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebaseClient';

function MyComponent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <p>Name: {getUserDisplayName(user)}</p>
      <p>Email: {getUserEmail(user)}</p>
      <p>Initials: {getUserInitials(user)}</p>
    </div>
  );
}
```

### 3. Direct Firebase Auth

```tsx
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebaseClient';

useEffect(() => {
  const auth = getFirebaseAuth();
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User ID:', user.uid);
      console.log('Email:', user.email);
      console.log('Display Name:', user.displayName);
      console.log('Photo URL:', user.photoURL);
      console.log('Email Verified:', user.emailVerified);
    }
  });
  return () => unsubscribe();
}, []);
```

## Available User Properties

When a user is authenticated, you can access:

- `user.uid` - Unique user identifier
- `user.email` - User's email address
- `user.displayName` - User's display name
- `user.photoURL` - User's profile photo URL
- `user.emailVerified` - Whether email is verified
- `user.phoneNumber` - User's phone number (if available)
- `user.providerId` - Authentication provider used

## Custom Hooks

### `useFirebaseUser()`
Returns basic user state and profile data.

**Returns:**
- `user` - Firebase User object
- `userProfile` - Formatted user profile object
- `loading` - Loading state
- `error` - Error message if any
- `isAuthenticated` - Boolean authentication status

### `useFirebaseUserProfile()`
Extends `useFirebaseUser` with helper methods.

**Additional Returns:**
- `getUserInitials()` - User's initials
- `getUserName()` - User's display name or email username
- `getUserEmail()` - User's email
- `getUserPhoto()` - User's photo URL

## Utility Functions

### `extractUserProfile(user: User): UserProfile`
Extracts a clean profile object from Firebase User.

### `getUserDisplayName(user: User | null): string`
Gets user's display name with fallbacks.

### `getUserEmail(user: User | null): string`
Gets user's email address.

### `getUserInitials(user: User | null): string`
Generates user initials from name or email.

### `getUserPhotoURL(user: User | null): string | null`
Gets user's profile photo URL.

### `formatUserForDisplay(user: User | null)`
Returns formatted user data for display purposes.

### `saveUserToLocalStorage(user: User | null)`
Saves user data to localStorage for persistence.

### `loadUserFromLocalStorage(): UserProfile | null`
Loads user data from localStorage.

## Example Component

See `UserProfileExample.tsx` for a comprehensive example showing all methods of getting user data.

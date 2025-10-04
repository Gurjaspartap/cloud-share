import { signOut } from 'firebase/auth';
import { getFirebaseAuth } from './firebaseClient';

/**
 * Logs out the current user from Firebase Authentication
 * @returns Promise that resolves when logout is complete
 * @throws Error if logout fails
 */
export async function logoutUser(): Promise<void> {
  try {
    const auth = getFirebaseAuth();
    await signOut(auth);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Failed to logout user');
  }
}

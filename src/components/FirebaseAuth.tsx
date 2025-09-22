"use client";
import { useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';

export default function FirebaseAuth() {
  useEffect(() => {
    if (!getApps().length) {
      initializeApp({ /* your config */ });
    }
  }, []);
  return null;
}
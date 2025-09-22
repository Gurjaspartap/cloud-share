import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALnbeftTzFGqTEsA_lOm1TXvT-RPI4Zsk",
  authDomain: "cloud-share-auth.firebaseapp.com",
  projectId: "cloud-share-auth",
  storageBucket: "cloud-share-auth.firebasestorage.app",
  messagingSenderId: "563717240348",
  appId: "1:563717240348:web:903207290e5611163a11d9",
  measurementId: "G-S1GL41WE4P"
};

export function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}



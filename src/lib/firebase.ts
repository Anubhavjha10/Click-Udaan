import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDHVlkXxYJC1AcQIifeEuwAWAuya3S_Zes",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "clickudaan-20cfe.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "clickudaan-20cfe",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "clickudaan-20cfe.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "516653918775",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:516653918775:web:091489256ab89e9db8adb2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-D0ZTQ7VGXE",
};

// Initialize Firebase once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { GlobalSettings } from "../types/database";

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  phone: "+91 85060 95853",
  whatsapp: "+91 85060 95853",
  email: "hello@clickudaan.com",
  secondaryEmail: "info@clickudaan.com",
  address: "Iconic Tower, Sector-63, Noida, UP, India",
  instagram: "https://www.instagram.com/clickudaan/",
  facebook: "https://www.facebook.com/share/1AzKTrj6gD/",
  twitter: "https://x.com/ClickUdaan",
  linkedin: "https://linkedin.com/company/clickudaan",
  youtube: "https://youtube.com/@clickudaan",
  tagline: "Where Clicks Take Flight",
};

export function useGlobalSettings() {
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_GLOBAL_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const settingsDocRef = doc(db, "settings", "global");

    // Realtime subscription for automatic instant updates across website
    const unsubscribe = onSnapshot(
      settingsDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setSettings({
            ...DEFAULT_GLOBAL_SETTINGS,
            ...data,
          });
        } else {
          // Document does not exist yet in Firestore
          setSettings(DEFAULT_GLOBAL_SETTINGS);
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Global settings realtime snapshot error (using defaults):", err);
        setSettings(DEFAULT_GLOBAL_SETTINGS);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveSettings = async (updated: Partial<GlobalSettings>) => {
    try {
      const settingsDocRef = doc(db, "settings", "global");
      const cleanData: any = {
        ...settings,
        ...updated,
        updatedAt: serverTimestamp(),
      };
      await setDoc(settingsDocRef, cleanData, { merge: true });
      setSettings(cleanData);
      return { success: true };
    } catch (err: any) {
      console.error("Failed to save global settings:", err);
      return { success: false, error: err.message || "Failed to save settings" };
    }
  };

  return {
    settings,
    loading,
    error,
    saveSettings,
  };
}

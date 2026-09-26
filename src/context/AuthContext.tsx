import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { AdminUser } from "../types/database";

export type AuthStage =
  | "UNAUTHENTICATED"
  | "PASSWORD_AUTHENTICATED"
  | "OTP_PENDING"
  | "ADMIN_AUTHENTICATED";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  adminData: AdminUser | null;
  isOtpVerified: boolean;
  authStage: AuthStage;
  maskedEmail: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ requiresOtp: boolean; maskedEmail?: string }>;
  sendAdminOtp: () => Promise<{ success: boolean; error?: string; remainingSeconds?: number; maskedEmail?: string }>;
  verifyAdminOtp: (otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  adminData: null,
  isOtpVerified: false,
  authStage: "UNAUTHENTICATED",
  maskedEmail: null,
  loading: true,
  login: async () => ({ requiresOtp: false }),
  sendAdminOtp: async () => ({ success: false }),
  verifyAdminOtp: async () => ({ success: false }),
  logout: async () => {},
});

const SESSION_STORAGE_KEY = "admin_2fa_session";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [authStage, setAuthStage] = useState<AuthStage>("UNAUTHENTICATED");
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const verifyAdminInFirestore = async (firebaseUser: User | null): Promise<boolean> => {
    if (!firebaseUser) {
      setIsAdmin(false);
      setAdminData(null);
      return false;
    }

    try {
      const adminDocRef = doc(db, "admins", firebaseUser.uid);
      const snapshot = await getDoc(adminDocRef);

      const exists = snapshot.exists();
      const data = exists ? snapshot.data() : null;
      const activeValue = data ? data.active : undefined;

      // Safe diagnostic logging: ONLY authenticated user's UID, existence, and active value (NO secrets)
      console.log(
        `[ADMIN_AUTH_DIAGNOSTIC] UID: ${firebaseUser.uid} | admins/${firebaseUser.uid} exists: ${exists} | active: ${activeValue}`
      );

      if (exists && data && data.active === true) {
        setIsAdmin(true);
        setAdminData({
          uid: firebaseUser.uid,
          email: firebaseUser.email || data.email,
          active: true,
          createdAt: data.createdAt,
        });
        return true;
      }

      setIsAdmin(false);
      setAdminData(null);
      return false;
    } catch (err: any) {
      console.error(
        `[ADMIN_AUTH_DIAGNOSTIC] UID: ${firebaseUser.uid} | Error checking admins/${firebaseUser.uid}:`,
        err.message || err
      );
      setIsAdmin(false);
      setAdminData(null);
      return false;
    }
  };

  const validateServerSession = async (firebaseUser: User): Promise<boolean> => {
    try {
      const sessionToken = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!sessionToken) return false;

      const idToken = await firebaseUser.getIdToken();
      const res = await fetch("/api/auth/admin-verify-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ sessionToken }),
      });

      if (res.ok) {
        const data = await res.json();
        return Boolean(data.valid);
      }
      return false;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const isAuthorized = await verifyAdminInFirestore(currentUser);
        if (isAuthorized) {
          // Check if there is an active verified 2FA session
          const hasValidSession = await validateServerSession(currentUser);
          if (hasValidSession) {
            setIsOtpVerified(true);
            setAuthStage("ADMIN_AUTHENTICATED");
          } else {
            // Password authenticated, but OTP not completed for this session
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
            setIsOtpVerified(false);
            setAuthStage("OTP_PENDING");
          }
        } else {
          // Unauthorized user signed in -> sign out immediately
          await fbSignOut(auth);
          setUser(null);
          setIsAdmin(false);
          setAdminData(null);
          setIsOtpVerified(false);
          setAuthStage("UNAUTHENTICATED");
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } else {
        setIsAdmin(false);
        setAdminData(null);
        setIsOtpVerified(false);
        setAuthStage("UNAUTHENTICATED");
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<{ requiresOtp: boolean; maskedEmail?: string }> => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const isAuthorized = await verifyAdminInFirestore(cred.user);
      if (!isAuthorized) {
        await fbSignOut(auth);
        setUser(null);
        setIsAdmin(false);
        setAdminData(null);
        setIsOtpVerified(false);
        setAuthStage("UNAUTHENTICATED");
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        throw new Error("Your account is not authorized to access the admin panel.");
      }

      setAuthStage("PASSWORD_AUTHENTICATED");

      // Trigger 2FA OTP generation and delivery on the server
      const idToken = await cred.user.getIdToken();
      const res = await fetch("/api/auth/admin-send-otp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to send verification code. Please try again.");
      }

      setMaskedEmail(data.maskedEmail || null);
      setAuthStage("OTP_PENDING");
      setIsOtpVerified(false);

      return { requiresOtp: true, maskedEmail: data.maskedEmail };
    } finally {
      setLoading(false);
    }
  };

  const sendAdminOtp = async (): Promise<{
    success: boolean;
    error?: string;
    remainingSeconds?: number;
    maskedEmail?: string;
  }> => {
    if (!user) {
      return { success: false, error: "Authentication session expired. Please sign in again." };
    }

    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/auth/admin-send-otp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.error || "Unable to send verification code. Please try again.",
          remainingSeconds: data.remainingSeconds,
        };
      }

      if (data.maskedEmail) {
        setMaskedEmail(data.maskedEmail);
      }

      return { success: true, maskedEmail: data.maskedEmail };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to send verification code." };
    }
  };

  const verifyAdminOtp = async (otp: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: "Authentication session expired. Please sign in again." };
    }

    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/auth/admin-verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ otp: otp.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Invalid verification code." };
      }

      if (data.sessionToken) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, data.sessionToken);
      }

      setIsOtpVerified(true);
      setAuthStage("ADMIN_AUTHENTICATED");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Internal error during verification." };
    }
  };

  const logout = async () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    await fbSignOut(auth);
    setUser(null);
    setIsAdmin(false);
    setAdminData(null);
    setIsOtpVerified(false);
    setAuthStage("UNAUTHENTICATED");
    setMaskedEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        adminData,
        isOtpVerified,
        authStage,
        maskedEmail,
        loading,
        login,
        sendAdminOtp,
        verifyAdminOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

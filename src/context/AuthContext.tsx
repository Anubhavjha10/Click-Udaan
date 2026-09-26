import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";
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

// Safe JSON fetch wrapper that never throws SyntaxError on non-JSON response
async function safeFetchJson(url: string, options: RequestInit): Promise<{ ok: boolean; status: number; data: any }> {
  try {
    const res = await fetch(url, options);
    let data: any = {};
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        data = await res.json();
      } catch {
        data = {};
      }
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text || `Server error (${res.status})` };
      }
    }
    return { ok: res.ok, status: res.status, data };
  } catch (err: any) {
    return { ok: false, status: 500, data: { error: err.message || "Network request failed" } };
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [authStage, setAuthStage] = useState<AuthStage>("UNAUTHENTICATED");
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const validateServerSession = async (firebaseUser: User): Promise<boolean> => {
    try {
      const sessionToken = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!sessionToken) return false;

      const idToken = await firebaseUser.getIdToken();
      const { ok, data } = await safeFetchJson("/api/auth/admin-verify-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ sessionToken }),
      });

      return ok && Boolean(data.valid);
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Any authenticated Firebase user is a CMS Admin account
        setIsAdmin(true);
        setAdminData({
          uid: currentUser.uid,
          email: currentUser.email || "",
          active: true,
        });

        // Validate 2FA OTP session
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
      setUser(cred.user);
      setIsAdmin(true);
      setAdminData({
        uid: cred.user.uid,
        email: cred.user.email || "",
        active: true,
      });
      setAuthStage("PASSWORD_AUTHENTICATED");

      // Trigger 2FA OTP generation and delivery on the server
      const idToken = await cred.user.getIdToken();
      const { ok, data } = await safeFetchJson("/api/auth/admin-send-otp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!ok) {
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
      const { ok, status, data } = await safeFetchJson("/api/auth/admin-send-otp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!ok) {
        return {
          success: false,
          error: data.error || "Unable to send verification code. Please try again.",
          remainingSeconds: status === 429 ? data.remainingSeconds : undefined,
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
      const { ok, data } = await safeFetchJson("/api/auth/admin-verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ otp: otp.trim() }),
      });

      if (!ok) {
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

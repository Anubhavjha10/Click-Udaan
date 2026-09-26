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

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  adminData: AdminUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  adminData: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await verifyAdminInFirestore(currentUser);
      } else {
        setIsAdmin(false);
        setAdminData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const isAuthorized = await verifyAdminInFirestore(cred.user);
      if (!isAuthorized) {
        // Sign out immediately if not in admins/{uid} with active: true
        await fbSignOut(auth);
        setUser(null);
        setIsAdmin(false);
        setAdminData(null);
        throw new Error("Your account is not authorized to access the admin panel.");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fbSignOut(auth);
    setUser(null);
    setIsAdmin(false);
    setAdminData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        adminData,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

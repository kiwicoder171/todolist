"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  email: string | null;
  username: string;
  circleId?: string | null;
  partnerRole?: "alex" | "sam" | null;
  createdAt?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isConfigured: boolean;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserCircle: (circleId: string | null, partnerRole?: "alex" | "sam" | null) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const configured = isFirebaseConfigured();

  const openAuthModal = (mode: "login" | "register" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (!auth || !configured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser && db) {
        // Subscribe to user profile document in Firestore for live cross-device updates
        const userRef = doc(db, "users", fbUser.uid);
        const unsubProfile = onSnapshot(
          userRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setUser(docSnap.data() as UserProfile);
            } else {
              // Create initial profile if missing
              const initialProfile: UserProfile = {
                uid: fbUser.uid,
                email: fbUser.email,
                username: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
                circleId: null,
                partnerRole: null,
                createdAt: new Date().toISOString(),
              };
              setDoc(userRef, initialProfile, { merge: true }).catch(console.error);
              setUser(initialProfile);
            }
            setLoading(false);
          },
          (error) => {
            console.error("User profile subscription error:", error);
            // Fallback to local profile from auth user
            setUser({
              uid: fbUser.uid,
              email: fbUser.email,
              username: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
              circleId: null,
              partnerRole: null,
            });
            setLoading(false);
          }
        );

        return () => unsubProfile();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [configured]);

  // Register via Username, Gmail/Email, and Password
  const register = async (username: string, email: string, password: string) => {
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanUsername || cleanUsername.length < 3) {
      throw new Error("Username must be at least 3 characters long.");
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
      throw new Error("Username can only contain letters, numbers, hyphens, and underscores.");
    }

    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("Please provide a valid email address.");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    if (!auth || !db) {
      throw new Error("Firebase Auth is not configured. Please check environment variables.");
    }

    // Check if username is already taken in Firestore
    const usernameKey = cleanUsername.toLowerCase();
    const usernameRef = doc(db, "usernames", usernameKey);
    const usernameSnap = await getDoc(usernameRef);

    if (usernameSnap.exists()) {
      throw new Error(`The username "${cleanUsername}" is already taken. Please choose another.`);
    }

    // Create Firebase Auth user
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const newFbUser = cred.user;

    // Update display name
    await updateProfile(newFbUser, { displayName: cleanUsername });

    // Store username -> email mapping for username-based login
    await setDoc(usernameRef, {
      username: cleanUsername,
      email: cleanEmail,
      uid: newFbUser.uid,
      createdAt: new Date().toISOString(),
    });

    // Store user profile
    const userProfile: UserProfile = {
      uid: newFbUser.uid,
      email: cleanEmail,
      username: cleanUsername,
      circleId: null,
      partnerRole: null,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "users", newFbUser.uid), userProfile);

    setUser(userProfile);
  };

  // Login via Username OR Email, and Password
  const login = async (identifier: string, password: string) => {
    const cleanInput = identifier.trim();
    if (!cleanInput) {
      throw new Error("Please enter your username or email.");
    }

    if (!auth) {
      throw new Error("Firebase Auth is not configured.");
    }

    let targetEmail = cleanInput;

    // If identifier doesn't contain '@', resolve username to email via Firestore
    if (!cleanInput.includes("@")) {
      if (!db) {
        throw new Error("Firestore connection unavailable to lookup username.");
      }

      const usernameKey = cleanInput.toLowerCase();
      const usernameSnap = await getDoc(doc(db, "usernames", usernameKey));

      if (!usernameSnap.exists()) {
        throw new Error(`No account found with username "${cleanInput}". Please check spelling or register.`);
      }

      const data = usernameSnap.data();
      if (!data?.email) {
        throw new Error("Could not find email associated with this username.");
      }
      targetEmail = data.email;
    }

    // Sign in with Firebase Auth using resolved email & password
    await signInWithEmailAndPassword(auth, targetEmail, password);
  };

  // Google Sign In (1-click)
  const signInWithGoogle = async () => {
    if (!auth || !db) {
      throw new Error("Firebase Auth is not configured.");
    }
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const fbUser = cred.user;

    const userRef = doc(db, "users", fbUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const generatedUsername = (
        fbUser.displayName?.replace(/\s+/g, "_").toLowerCase() ||
        fbUser.email?.split("@")[0] ||
        `user_${Date.now().toString().slice(-4)}`
      ).slice(0, 20);

      const usernameRef = doc(db, "usernames", generatedUsername);
      await setDoc(
        usernameRef,
        {
          username: generatedUsername,
          email: fbUser.email,
          uid: fbUser.uid,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      const newProfile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email,
        username: generatedUsername,
        circleId: null,
        partnerRole: null,
        createdAt: new Date().toISOString(),
      };
      await setDoc(userRef, newProfile);
      setUser(newProfile);
    }
  };

  // Sign out
  const logout = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setFirebaseUser(null);
  };

  // Link or unlink user circle in Firestore
  const updateUserCircle = async (circleId: string | null, partnerRole?: "alex" | "sam" | null) => {
    if (!user || !db) return;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      circleId: circleId || null,
      partnerRole: partnerRole || null,
    });

    setUser((prev) => (prev ? { ...prev, circleId, partnerRole: partnerRole || null } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isConfigured: configured,
        register,
        login,
        signInWithGoogle,
        logout,
        updateUserCircle,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const defaultAuthContext: AuthContextType = {
  user: null,
  firebaseUser: null,
  loading: false,
  isConfigured: false,
  isAuthModalOpen: false,
  setIsAuthModalOpen: () => {},
  authModalMode: "login",
  openAuthModal: () => {},
  closeAuthModal: () => {},
  register: async () => {},
  login: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
  updateUserCircle: async () => {},
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  return context || defaultAuthContext;
}

export function useOptionalAuth(): AuthContextType | undefined {
  return useContext(AuthContext);
}

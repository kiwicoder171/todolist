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
import { doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
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
  updateUsername: (newUsername: string) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AUTH_STORAGE_KEY = "couple_task_hub_auth_user";

export function extractCleanUsername(fbUser: FirebaseUser): string {
  // Use first name or email prefix, never full name + surname
  const firstName = fbUser.displayName ? fbUser.displayName.trim().split(/\s+/)[0].toLowerCase() : "";
  const emailPrefix = fbUser.email ? fbUser.email.split("@")[0].toLowerCase() : "";
  const candidate = (firstName || emailPrefix || `user_${Date.now().toString().slice(-4)}`).replace(/[^a-zA-Z0-9_-]/g, "");
  return candidate.slice(0, 18) || "user";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.uid) return parsed;
        }
      } catch {}
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) return false;
      } catch {}
    }
    return true;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const configured = isFirebaseConfigured();

  const updateCachedUser = (profile: UserProfile | null) => {
    setUser(profile);
    if (typeof window !== "undefined") {
      try {
        if (profile) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch {}
    }
  };

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
              updateCachedUser(docSnap.data() as UserProfile);
            } else {
              // Create initial profile if missing
              const initialProfile: UserProfile = {
                uid: fbUser.uid,
                email: fbUser.email,
                username: extractCleanUsername(fbUser),
                circleId: null,
                partnerRole: null,
                createdAt: new Date().toISOString(),
              };
              setDoc(userRef, initialProfile, { merge: true }).catch((err) =>
                console.warn("Initial profile sync warning:", err?.message || err)
              );
              updateCachedUser(initialProfile);
            }
            setLoading(false);
          },
          (error) => {
            console.warn("User profile subscription warning:", error);
            // Fallback to local profile from auth user
            updateCachedUser({
              uid: fbUser.uid,
              email: fbUser.email,
              username: extractCleanUsername(fbUser),
              circleId: null,
              partnerRole: null,
            });
            setLoading(false);
          }
        );

        return () => unsubProfile();
      } else {
        updateCachedUser(null);
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

    updateCachedUser(userProfile);
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
    const cred = await signInWithEmailAndPassword(auth, targetEmail, password);
    const fbUser = cred.user;

    // Immediately cache user profile to prevent mock data flash on refresh
    if (db) {
      try {
        const userRef = doc(db, "users", fbUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          updateCachedUser(snap.data() as UserProfile);
        } else {
          updateCachedUser({
            uid: fbUser.uid,
            email: fbUser.email,
            username: fbUser.displayName || cleanInput,
            circleId: null,
            partnerRole: null,
            createdAt: new Date().toISOString(),
          });
        }
      } catch {
        updateCachedUser({
          uid: fbUser.uid,
          email: fbUser.email,
          username: fbUser.displayName || cleanInput,
          circleId: null,
          partnerRole: null,
        });
      }
    }
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
      let generatedUsername = extractCleanUsername(fbUser);

      // Check if candidate username is already taken; if so, append random digits
      const usernameRef = doc(db, "usernames", generatedUsername);
      const existingSnap = await getDoc(usernameRef);
      if (existingSnap.exists()) {
        generatedUsername = `${generatedUsername}_${Date.now().toString().slice(-4)}`;
      }

      const finalUsernameRef = doc(db, "usernames", generatedUsername);
      await setDoc(
        finalUsernameRef,
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
      updateCachedUser(newProfile);
    } else {
      updateCachedUser(userSnap.data() as UserProfile);
    }
  };

  // Update Username & sync everywhere
  const updateUsername = async (newUsername: string) => {
    const clean = newUsername.trim().toLowerCase();
    if (!clean || clean.length < 3) {
      throw new Error("Username must be at least 3 characters long.");
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(clean)) {
      throw new Error("Username can only contain letters, numbers, hyphens, and underscores.");
    }
    if (!user || !user.uid || !db) {
      throw new Error("You must be logged in to update your username.");
    }
    if (clean === user.username.toLowerCase()) {
      return;
    }

    const usernameRef = doc(db, "usernames", clean);
    const snap = await getDoc(usernameRef);
    if (snap.exists()) {
      throw new Error(`The username "${clean}" is already taken.`);
    }

    // Remove old username mapping if existing
    if (user.username) {
      try {
        await deleteDoc(doc(db, "usernames", user.username.toLowerCase()));
      } catch {}
    }

    // Create new username mapping
    await setDoc(usernameRef, {
      username: clean,
      email: user.email,
      uid: user.uid,
      updatedAt: new Date().toISOString(),
    });

    // Update user profile document
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { username: clean });

    // Update local cached user profile
    const updatedUser = { ...user, username: clean };
    updateCachedUser(updatedUser);

    // Sync to active circle if linked
    if (user.circleId) {
      try {
        const circleRef = doc(db, "circles", user.circleId);
        const cSnap = await getDoc(circleRef);
        if (cSnap.exists()) {
          const cData = cSnap.data();
          if (user.partnerRole === "alex" || cData.createdByName === user.username) {
            await updateDoc(circleRef, { createdByName: clean });
          } else {
            await updateDoc(circleRef, { partnerName: clean });
          }
        }
      } catch (err) {
        console.warn("Could not sync updated username to circle:", err);
      }
    }
  };

  // Sign out
  const logout = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
    updateCachedUser(null);
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

    setUser((prev) => {
      const updated = prev ? { ...prev, circleId, partnerRole: partnerRole || null } : null;
      updateCachedUser(updated);
      return updated;
    });
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
        updateUsername,
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
  updateUsername: async () => {},
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  return context || defaultAuthContext;
}

export function useOptionalAuth(): AuthContextType | undefined {
  return useContext(AuthContext);
}

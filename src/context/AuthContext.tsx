'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { useApexStore } from '@/store/useApexStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, nickname?: string, avatarUrl?: string) => Promise<void>;
  updateUserProfileData: (nickname: string, avatarUrl?: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  updateUserProfileData: async () => {},
  signInAsGuest: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile to Firestore & Zustand
  const syncUserProfile = async (currentUser: User) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      const storeName = useApexStore.getState().username;
      const storeAvatar = useApexStore.getState().avatarUrl;

      if (!userSnap.exists()) {
        // Fresh user registration: reset state
        const effectiveName =
          currentUser.displayName || (storeName && storeName !== 'NEW OPERATIVE' ? storeName : currentUser.email?.split('@')[0].toUpperCase()) || 'NEW OPERATIVE';
        const effectiveAvatar = currentUser.photoURL || storeAvatar || '';

        useApexStore.setState({
          username: effectiveName,
          avatarUrl: effectiveAvatar,
        });

        await setDoc(userRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: effectiveName,
          photoURL: effectiveAvatar,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          level: 1,
          currentXp: 0,
          streak: 0,
        });
      } else {
        const data = userSnap.data();
        const effectiveName = data.displayName || currentUser.displayName || storeName;
        const effectiveAvatar = data.photoURL || currentUser.photoURL || storeAvatar;

        useApexStore.setState({
          username: effectiveName || 'NEW OPERATIVE',
          avatarUrl: effectiveAvatar || '',
        });

        await setDoc(
          userRef,
          {
            lastLogin: serverTimestamp(),
            displayName: effectiveName,
            photoURL: effectiveAvatar,
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.warn('[Firebase Auth] Firestore profile sync note:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string, nickname?: string, avatarUrl?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const effectiveNickname = nickname?.trim() || email.split('@')[0].toUpperCase();

    if (effectiveNickname || avatarUrl) {
      await updateProfile(cred.user, {
        displayName: effectiveNickname,
        photoURL: avatarUrl || '',
      });
    }

    useApexStore.setState({
      username: effectiveNickname,
      avatarUrl: avatarUrl || '',
    });

    await syncUserProfile(cred.user);
  };

  const updateUserProfileData = async (nickname: string, avatarUrl?: string) => {
    const currentUser = auth.currentUser;
    const effectiveName = nickname.trim() || 'OPERATIVE';
    const effectiveAvatar = avatarUrl || '';

    useApexStore.setState({
      username: effectiveName,
      avatarUrl: effectiveAvatar,
    });

    if (currentUser) {
      await updateProfile(currentUser, {
        displayName: effectiveName,
        photoURL: effectiveAvatar,
      });

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(
          userRef,
          {
            displayName: effectiveName,
            photoURL: effectiveAvatar,
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('[Firebase Auth] Failed to sync updated profile to Firestore:', err);
      }
    }
  };

  const signInAsGuest = async () => {
    await signInAnonymously(auth);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        updateUserProfileData,
        signInAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

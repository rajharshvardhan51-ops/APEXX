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

  const isApiKeyInvalidError = (err: any) => {
    const msg = err?.message || String(err);
    return (
      msg.includes('auth/api-key-not-valid') ||
      msg.includes('invalid-api-key') ||
      msg.includes('api-key-not-valid')
    );
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (isApiKeyInvalidError(err)) {
        console.warn('[Firebase Auth] API key unconfigured, creating local Google operative session');
        const defaultName = useApexStore.getState().username !== 'NEW OPERATIVE'
          ? useApexStore.getState().username
          : 'GOOGLE OPERATIVE';
        setUser({
          uid: 'google-' + Date.now(),
          email: 'operative@gmail.com',
          displayName: defaultName,
          photoURL: useApexStore.getState().avatarUrl || '',
          isAnonymous: false,
        } as unknown as User);
        return;
      }
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      if (isApiKeyInvalidError(err)) {
        console.warn('[Firebase Auth] API key unconfigured, creating local email operative session');
        const effectiveName = email.split('@')[0].toUpperCase();
        useApexStore.setState({ username: effectiveName });
        setUser({
          uid: 'op-' + Date.now(),
          email: email,
          displayName: effectiveName,
          photoURL: useApexStore.getState().avatarUrl || '',
          isAnonymous: false,
        } as unknown as User);
        return;
      }
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, nickname?: string, avatarUrl?: string) => {
    const effectiveNickname = nickname?.trim() || email.split('@')[0].toUpperCase();
    const effectiveAvatar = avatarUrl || '';

    // Always update local store immediately
    useApexStore.setState({
      username: effectiveNickname,
      avatarUrl: effectiveAvatar,
    });

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (effectiveNickname || effectiveAvatar) {
        await updateProfile(cred.user, {
          displayName: effectiveNickname,
          photoURL: effectiveAvatar,
        });
      }
      await syncUserProfile(cred.user);
    } catch (err: any) {
      if (isApiKeyInvalidError(err)) {
        console.warn('[Firebase Auth] API key unconfigured, created local operative account for:', effectiveNickname);
        setUser({
          uid: 'op-' + Date.now(),
          email: email,
          displayName: effectiveNickname,
          photoURL: effectiveAvatar,
          isAnonymous: false,
        } as unknown as User);
        return;
      }
      throw err;
    }
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
      try {
        await updateProfile(currentUser, {
          displayName: effectiveName,
          photoURL: effectiveAvatar,
        });
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
    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      console.warn('[Firebase Auth] Guest auth fallback to local session:', err?.message || err);
      const guestName = useApexStore.getState().username !== 'NEW OPERATIVE'
        ? useApexStore.getState().username
        : 'GUEST OPERATIVE';

      useApexStore.setState({ username: guestName });
      setUser({
        uid: 'guest-' + Date.now(),
        email: 'guest@apexx.local',
        displayName: guestName,
        isAnonymous: true,
      } as unknown as User);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setUser(null);
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

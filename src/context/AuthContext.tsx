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

export interface UserRegistrationDetails {
  fullName: string;
  nickname: string;
  dateOfBirth: string;
  gender: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, details: UserRegistrationDetails) => Promise<void>;
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

  // Sync user profile to Firestore, Local Storage Registry & Zustand Store
  const syncUserProfile = async (currentUser: User, freshDetails?: UserRegistrationDetails) => {
    try {
      const emailKey = (currentUser.email || currentUser.uid).toLowerCase();
      const localKey = 'apexx_profile_' + emailKey;

      let localSaved: any = null;
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(localKey);
        if (raw) {
          try { localSaved = JSON.parse(raw); } catch (e) {}
        }
      }

      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      let nickname = freshDetails?.nickname?.trim() || localSaved?.nickname || currentUser.displayName || '';
      let fullName = freshDetails?.fullName?.trim() || localSaved?.fullName || '';
      let dateOfBirth = freshDetails?.dateOfBirth || localSaved?.dateOfBirth || '';
      let gender = freshDetails?.gender || localSaved?.gender || '';
      let avatarUrl = freshDetails?.avatarUrl || localSaved?.avatarUrl || currentUser.photoURL || '';

      if (userSnap.exists()) {
        const data = userSnap.data();
        nickname = nickname || data.nickname || data.displayName || currentUser.email?.split('@')[0].toUpperCase() || 'OPERATIVE';
        fullName = fullName || data.fullName || '';
        dateOfBirth = dateOfBirth || data.dateOfBirth || '';
        gender = gender || data.gender || '';
        avatarUrl = avatarUrl || data.photoURL || data.avatarUrl || '';
      } else {
        nickname = nickname || currentUser.email?.split('@')[0].toUpperCase() || 'OPERATIVE';
      }

      // Update Zustand Store with Nickname as the active username!
      useApexStore.setState({
        username: nickname,
        nickname: nickname,
        fullName: fullName,
        dateOfBirth: dateOfBirth,
        gender: gender,
        avatarUrl: avatarUrl,
      });

      // Update Local Registry cache
      const profilePayload = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: nickname,
        nickname,
        fullName,
        dateOfBirth,
        gender,
        photoURL: avatarUrl,
        lastLogin: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(localKey, JSON.stringify(profilePayload));
        localStorage.setItem('apexx_last_active_user', JSON.stringify(profilePayload));
      }

      // Sync Firestore Document
      await setDoc(
        userRef,
        {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: nickname,
          nickname,
          fullName,
          dateOfBirth,
          gender,
          photoURL: avatarUrl,
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );
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
    const emailKey = email.trim().toLowerCase();
    const localKey = 'apexx_profile_' + emailKey;
    let savedNickname = '';

    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(localKey);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.nickname) savedNickname = parsed.nickname;
        } catch (e) {}
      }
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await syncUserProfile(cred.user);
    } catch (err: any) {
      if (isApiKeyInvalidError(err)) {
        console.warn('[Firebase Auth] API key unconfigured, creating local email operative session for:', email);
        const effectiveNickname = savedNickname || email.split('@')[0].toUpperCase();
        useApexStore.setState({ username: effectiveNickname, nickname: effectiveNickname });
        setUser({
          uid: 'op-' + Date.now(),
          email: email,
          displayName: effectiveNickname,
          photoURL: useApexStore.getState().avatarUrl || '',
          isAnonymous: false,
        } as unknown as User);
        return;
      }
      throw err;
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    details: UserRegistrationDetails
  ) => {
    const effectiveNickname = details.nickname.trim() || email.split('@')[0].toUpperCase();
    const effectiveAvatar = details.avatarUrl || '';

    // Always update local store immediately with Nickname
    useApexStore.setState({
      username: effectiveNickname,
      nickname: effectiveNickname,
      fullName: details.fullName.trim(),
      dateOfBirth: details.dateOfBirth,
      gender: details.gender,
      avatarUrl: effectiveAvatar,
    });

    const emailKey = email.trim().toLowerCase();
    const localKey = 'apexx_profile_' + emailKey;
    const profilePayload = {
      email,
      nickname: effectiveNickname,
      fullName: details.fullName.trim(),
      dateOfBirth: details.dateOfBirth,
      gender: details.gender,
      avatarUrl: effectiveAvatar,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(localKey, JSON.stringify(profilePayload));
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (effectiveNickname || effectiveAvatar) {
        await updateProfile(cred.user, {
          displayName: effectiveNickname,
          photoURL: effectiveAvatar,
        });
      }
      await syncUserProfile(cred.user, details);
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
      nickname: effectiveName,
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
            nickname: effectiveName,
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

      useApexStore.setState({ username: guestName, nickname: guestName });
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

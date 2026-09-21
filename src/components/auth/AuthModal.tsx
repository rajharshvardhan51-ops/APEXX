'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldAlert,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  LogOut,
  CheckCircle2,
  UserCheck,
  User,
  Calendar,
  Users,
  Upload,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApexStore } from '@/store/useApexStore';
import { playJarvisActivate } from '@/lib/audioEngine';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  {
    name: 'TITAN_NEON',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2309090c"/><circle cx="50" cy="38" r="22" fill="%23ffffff"/><path d="M20 90 Q50 60 80 90 Z" fill="%23ffffff"/></svg>',
  },
  {
    name: 'CYBER_CORE',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23050508"/><polygon points="50,15 85,35 85,75 50,95 15,75 15,35" fill="none" stroke="%23ffffff" stroke-width="4"/><circle cx="50" cy="55" r="15" fill="%23ffffff"/></svg>',
  },
  {
    name: 'SHADOW_PIONEER',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23121218"/><circle cx="50" cy="40" r="20" fill="%2371717a"/><path d="M15 95 C25 65 75 65 85 95 Z" fill="%2371717a"/><circle cx="50" cy="50" r="30" fill="none" stroke="%23ffffff" stroke-width="3"/></svg>',
  },
  {
    name: 'SOLAR_OPERATIVE',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230a0a0f"/><rect x="25" y="25" width="50" height="50" rx="10" fill="%23e4e4e7"/><circle cx="50" cy="50" r="12" fill="%2309090c"/></svg>',
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuest, logout } = useAuth();
  const username = useApexStore((state) => state.username);
  const nicknameStore = useApexStore((state) => state.nickname);

  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('MALE');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image file size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatFirebaseError = (errMessage: string): string => {
    if (
      errMessage.includes('auth/api-key-not-valid') ||
      errMessage.includes('invalid-api-key') ||
      errMessage.includes('api-key-not-valid')
    ) {
      return 'Firebase Auth API Key note: APEX operating in high-performance local mode.';
    }
    if (
      errMessage.includes('auth/invalid-credential') ||
      errMessage.includes('wrong-password') ||
      errMessage.includes('user-not-found')
    ) {
      return 'Invalid email or password. Please verify your operative credentials.';
    }
    if (errMessage.includes('auth/email-already-in-use')) {
      return 'An operative account already exists with this email address. Please sign in instead.';
    }
    if (errMessage.includes('auth/weak-password')) {
      return 'Security password must be at least 6 characters long.';
    }
    return errMessage.replace('Firebase: ', '').replace(/^Error \((.*)\)\.$/, '$1');
  };

  const speakWelcomeGreeting = (callsign: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Welcome back, Operative ${callsign}. System session authenticated.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
    playJarvisActivate();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === 'LOGIN') {
        await signInWithEmail(email, password);
        const activeName = useApexStore.getState().username || useApexStore.getState().nickname || email.split('@')[0].toUpperCase();
        setSuccessMsg(`SESSION AUTHENTICATED // WELCOME BACK, ${activeName}`);
        speakWelcomeGreeting(activeName);
      } else {
        await signUpWithEmail(email, password, {
          fullName,
          nickname: nickname.trim(),
          dateOfBirth,
          gender,
          avatarUrl,
        });
        const activeName = nickname.trim() || email.split('@')[0].toUpperCase();
        setSuccessMsg(`REGISTERED SUCCESSFULLY // WELCOME TO APEX, ${activeName}`);
        speakWelcomeGreeting(activeName);
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(formatFirebaseError(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      const activeName = useApexStore.getState().username || 'OPERATIVE';
      speakWelcomeGreeting(activeName);
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign in failed';
      setError(formatFirebaseError(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInAsGuest();
      speakWelcomeGreeting('GUEST');
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Guest sign in failed';
      setError(formatFirebaseError(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const displayCallsign = nicknameStore || username || 'OPERATIVE';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none font-mono overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-[#08080A] border border-[#1E1E26] rounded-xl p-4 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.95)] overflow-hidden my-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

          {/* Modal Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#1E1E26] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#FFFFFF]" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#FFFFFF]">
                [ AUTHENTICATION // OPERATIVE ACCESS ]
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded bg-[#000000] text-[#8E8E93] hover:text-[#FFFFFF] border border-[#1E1E26] hover:border-[#FFFFFF] transition-colors cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Authenticated State Display */}
          {user ? (
            <div className="relative z-10 space-y-4 py-2">
              <div className="p-4 rounded-lg bg-[#000000] border border-[#383848] space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#FFFFFF] font-bold">
                  <UserCheck className="w-4 h-4 text-[#FFFFFF]" />
                  <span>OPERATIVE SESSION ACTIVE</span>
                </div>
                <div className="text-sm font-extrabold text-[#FFFFFF] text-glow font-mono">
                  CALLSIGN: {displayCallsign}
                </div>
                <p className="text-xs text-[#8E8E93] truncate font-mono">
                  EMAIL: {user.email || (user.isAnonymous ? 'ANONYMOUS GUEST SESSION' : user.uid)}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-[#FFFFFF]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FFFFFF]" />
                  <span>FIREBASE CLOUD FIRESTORE SYNC: ONLINE</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#000000] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#383848] font-bold text-xs transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> DEAUTHENTICATE SESSION
              </button>
            </div>
          ) : (
            /* Unauthenticated Form */
            <div className="relative z-10 space-y-4">
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-[#000000] p-1 rounded-lg border border-[#1E1E26] text-xs">
                <button
                  type="button"
                  onClick={() => { setMode('LOGIN'); setError(null); setSuccessMsg(null); }}
                  className={`py-1.5 rounded font-bold uppercase transition-all cursor-pointer ${
                    mode === 'LOGIN'
                      ? 'bg-[#18181F] text-[#FFFFFF] border border-[#383848] shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                      : 'text-[#8E8E93] hover:text-[#FFFFFF]'
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('SIGNUP'); setError(null); setSuccessMsg(null); }}
                  className={`py-1.5 rounded font-bold uppercase transition-all cursor-pointer ${
                    mode === 'SIGNUP'
                      ? 'bg-[#18181F] text-[#FFFFFF] border border-[#383848] shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                      : 'text-[#8E8E93] hover:text-[#FFFFFF]'
                  }`}
                >
                  REGISTER (CREATE ID)
                </button>
              </div>

              {/* Status Notifications */}
              {error && (
                <div className="p-2.5 rounded bg-[#000000] border border-[#FF3B30]/60 text-[#FF3B30] text-[11px] font-mono">
                  ⚠ {error}
                </div>
              )}

              {successMsg && (
                <div className="p-2.5 rounded bg-[#000000] border border-[#FFFFFF]/60 text-[#FFFFFF] text-[11px] font-mono font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" /> {successMsg}
                </div>
              )}

              {/* Quick Google Auth Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg bg-[#000000] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#1E1E26] hover:border-[#FFFFFF] font-bold text-xs transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>CONTINUE WITH GOOGLE</span>
              </button>

              <div className="flex items-center gap-2 text-[10px] text-[#8E8E93] uppercase font-bold my-2">
                <div className="h-[1px] flex-1 bg-[#1E1E26]" />
                <span>{mode === 'LOGIN' ? 'OPERATIVE SIGN IN' : 'NEW OPERATIVE REGISTRATION'}</span>
                <div className="h-[1px] flex-1 bg-[#1E1E26]" />
              </div>

              {/* Form Input */}
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                {/* Mode: REGISTER / CREATE ID -> Asks for Email, Password, Name, Nickname, DOB, Gender */}
                {mode === 'SIGNUP' && (
                  <>
                    {/* 1. Full Name */}
                    <div>
                      <label className="text-[10px] text-[#8E8E93] uppercase font-bold flex items-center gap-1 mb-1">
                        <User className="w-3 h-3 text-[#FFFFFF]" /> FULL NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alexander Vance"
                        className="w-full bg-[#000000] border border-[#1E1E26] focus:border-[#FFFFFF] rounded px-3 py-2 text-xs text-[#FFFFFF] outline-none transition-colors"
                      />
                    </div>

                    {/* 2. Nickname / Callsign */}
                    <div>
                      <label className="text-[10px] text-[#8E8E93] uppercase font-bold flex items-center gap-1 mb-1">
                        <UserCheck className="w-3 h-3 text-[#FFFFFF]" /> NICKNAME / CALLSIGN (USED BY APEX & J.A.R.V.I.S.)
                      </label>
                      <input
                        type="text"
                        required
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="e.g. CYBER_MONARCH"
                        className="w-full bg-[#000000] border border-[#1E1E26] focus:border-[#FFFFFF] rounded px-3 py-2 text-xs text-[#FFFFFF] outline-none transition-colors"
                      />
                    </div>

                    {/* 3. Date of Birth & Gender Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#8E8E93] uppercase font-bold flex items-center gap-1 mb-1">
                          <Calendar className="w-3 h-3 text-[#FFFFFF]" /> DATE OF BIRTH
                        </label>
                        <input
                          type="date"
                          required
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="w-full bg-[#000000] border border-[#1E1E26] focus:border-[#FFFFFF] rounded px-2.5 py-2 text-xs text-[#FFFFFF] outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[#8E8E93] uppercase font-bold flex items-center gap-1 mb-1">
                          <Users className="w-3 h-3 text-[#FFFFFF]" /> GENDER
                        </label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full bg-[#000000] border border-[#1E1E26] focus:border-[#FFFFFF] rounded px-2.5 py-2 text-xs text-[#FFFFFF] outline-none transition-colors"
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="NON_BINARY">Non-Binary</option>
                          <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                        </select>
                      </div>
                    </div>

                    {/* Avatar Customization (Optional) */}
                    <div>
                      <label className="text-[10px] text-[#8E8E93] uppercase font-bold flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-[#FFFFFF]" /> AVATAR PICTURE
                        </span>
                        <span className="text-[9px] text-[#8E8E93]">(OPTIONAL)</span>
                      </label>

                      <div className="p-2.5 rounded-lg bg-[#000000] border border-[#1E1E26] space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full border border-[#FFFFFF] bg-[#18181F] overflow-hidden shrink-0 flex items-center justify-center">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-[#8E8E93]" />
                            )}
                          </div>

                          <div className="flex-1">
                            <label className="cursor-pointer px-2.5 py-1 rounded bg-[#18181F] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#383848] text-[10px] font-bold inline-flex items-center gap-1.5 transition-colors">
                              <Upload className="w-3 h-3" /> CHOOSE IMAGE FILE
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        {/* Preset Avatars */}
                        <div className="flex items-center gap-2 pt-1 border-t border-[#1E1E26]">
                          <span className="text-[9px] text-[#8E8E93] font-bold">PRESETS:</span>
                          {PRESET_AVATARS.map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => setAvatarUrl(preset.url)}
                              className={`w-7 h-7 rounded-full border transition-all overflow-hidden bg-[#0A0A0E] cursor-pointer ${
                                avatarUrl === preset.url
                                  ? 'border-[#FFFFFF] ring-2 ring-[#FFFFFF]'
                                  : 'border-[#1E1E26] opacity-70 hover:opacity-100'
                              }`}
                              title={preset.name}
                            >
                              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Email Field (Required for both LOGIN & REGISTER) */}
                <div>
                  <label className="text-[10px] text-[#8E8E93] uppercase font-bold flex items-center gap-1 mb-1">
                    <Mail className="w-3 h-3" /> OPERATIVE EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operative@apexx.system"
                    className="w-full bg-[#000000] border border-[#1E1E26] focus:border-[#FFFFFF] rounded px-3 py-2 text-xs text-[#FFFFFF] outline-none transition-colors"
                  />
                </div>

                {/* Password Field (Required for both LOGIN & REGISTER) */}
                <div>
                  <label className="text-[10px] text-[#8E8E93] uppercase font-bold flex items-center gap-1 mb-1">
                    <Lock className="w-3 h-3" /> SECURITY PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#000000] border border-[#1E1E26] focus:border-[#FFFFFF] rounded px-3 py-2 text-xs text-[#FFFFFF] outline-none transition-colors"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#FFFFFF] text-[#000000] font-bold text-xs hover:bg-[#E4E4E7] transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                >
                  {mode === 'LOGIN' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  <span>{mode === 'LOGIN' ? 'AUTHENTICATE SESSION' : 'REGISTER OPERATIVE'}</span>
                </button>
              </form>

              {/* Anonymous Guest Sign-In */}
              <div className="pt-2 border-t border-[#1E1E26]">
                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  disabled={isSubmitting}
                  className="w-full text-center text-[11px] text-[#8E8E93] hover:text-[#FFFFFF] transition-colors underline cursor-pointer"
                >
                  CONTINUE AS ANONYMOUS GUEST OPERATIVE
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;

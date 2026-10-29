'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApexStore } from '@/store/useApexStore';
import { useAuth } from '@/context/AuthContext';
import { User, Key, Eye, EyeOff, Cloud, Bell, CheckCircle2, Shield, Settings, Upload, Image as ImageIcon } from 'lucide-react';

export const CorePreferencesForm: React.FC = () => {
  const username = useApexStore((state) => state.username);
  const honorificStore = useApexStore((state) => state.honorific);
  const setHonorificStore = useApexStore((state) => state.setHonorific);
  const avatarUrlStore = useApexStore((state) => state.avatarUrl);
  const { updateUserProfileData } = useAuth();

  const [name, setName] = useState(username);
  const [honorific, setHonorific] = useState(honorificStore || 'SIR');
  const [avatarUrl, setAvatarUrl] = useState(avatarUrlStore);
  const [mentor, setMentor] = useState('Jarvis (Polite & Analytical)');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [cloudSync, setCloudSync] = useState(true);
  const [dailyNotifications, setDailyNotifications] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setToastMessage('Image file size must be under 2MB.');
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim() || 'NEW OPERATIVE';

    setHonorificStore(honorific);
    await updateUserProfileData(cleanName, avatarUrl);

    if (apiKey) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('apexx_gemini_api_key', apiKey);
      }
    }

    setToastMessage('System preferences and operative profile updated.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#0A0A0E] border border-[#1E1E26] rounded-2xl p-4 sm:p-5 shadow-[0_4px_25px_rgba(0,0,0,0.8)] space-y-4 sm:space-y-5 font-mono select-none"
    >
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3.5 rounded-xl bg-[#000000] border border-[#FFFFFF] text-[#FFFFFF] text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            <CheckCircle2 className="w-4 h-4 text-[#FFFFFF] shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 border-b border-[#1E1E26] pb-3">
        <Settings className="w-4 h-4 text-[#FFFFFF]" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
          CORE SYSTEM PREFERENCES
        </h2>
      </div>

      <form onSubmit={handleCommit} className="space-y-4">
        {/* Character Salutation & Callsign Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5 sm:col-span-1">
            <label className="text-[10px] text-[#8E8E93] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#FFFFFF]" /> SALUTATION / TITLE
            </label>
            <select
              value={honorific}
              onChange={(e) => setHonorific(e.target.value)}
              className="w-full bg-[#050507] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-xl px-3 py-2.5 text-base sm:text-xs text-[#FFFFFF] focus:outline-none transition-colors cursor-pointer font-mono font-bold min-h-[44px]"
            >
              <option value="SIR">SIR</option>
              <option value="BOSS">BOSS</option>
              <option value="MA'AM">MA'AM</option>
              <option value="COMMANDER">COMMANDER</option>
              <option value="CHIEF">CHIEF</option>
              <option value="OPERATIVE">OPERATIVE</option>
              <option value="NONE">NONE (NAME ONLY)</option>
            </select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[10px] text-[#8E8E93] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#FFFFFF]" /> OPERATIVE NICKNAME / CALLSIGN
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. HARSH, ALEX, VICTOR..."
              className="w-full bg-[#050507] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-[#FFFFFF] focus:outline-none transition-colors min-h-[44px]"
            />
          </div>
        </div>

        {/* Profile Picture Upload Section */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-[#8E8E93] uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#FFFFFF]" /> PROFILE PICTURE / AVATAR
          </label>
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#050507] border border-[#1E1E26] flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="relative w-14 h-14 rounded-full border-2 border-[#FFFFFF] bg-[#18181F] overflow-hidden shrink-0 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Operative Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-[#8E8E93]" />
              )}
            </div>

            <div className="flex-1 w-full space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <label className="cursor-pointer px-3.5 py-2 min-h-[40px] rounded-xl bg-[#18181F] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#383848] text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95 touch-manipulation">
                  <Upload className="w-3.5 h-3.5" /> UPLOAD IMAGE
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="px-3 py-2 min-h-[40px] rounded-xl text-xs text-[#FF3B30] border border-[#FF3B30]/30 hover:bg-[#FF3B30]/10 active:scale-95 touch-manipulation"
                  >
                    REMOVE
                  </button>
                )}
              </div>
              <input
                type="url"
                value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Or paste avatar image URL..."
                className="w-full bg-[#000000] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-xl px-3 py-2 text-base sm:text-xs text-[#FFFFFF] outline-none font-mono min-h-[40px]"
              />
            </div>
          </div>
        </div>

        {/* AI Mentor Personality Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-[#8E8E93] uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#FFFFFF]" /> AI MENTOR PERSONALITY FILTER
          </label>
          <select
            value={mentor}
            onChange={(e) => setMentor(e.target.value)}
            className="w-full bg-[#050507] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-[#FFFFFF] focus:outline-none transition-colors cursor-pointer min-h-[44px]"
          >
            <option value="Jarvis (Polite & Analytical)">Jarvis (Polite & Analytical)</option>
            <option value="Stern Master (Tough Love & Discipline)">Stern Master (Tough Love & Discipline)</option>
            <option value="Supportive Mentor (Empathetic & Kind)">Supportive Mentor (Empathetic & Kind)</option>
            <option value="Logical Strategist (Mathematical Yield)">Logical Strategist (Mathematical Yield)</option>
          </select>
        </div>

        {/* Gemini LLM API Key BYOK */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-[#8E8E93] uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-[#FFFFFF]" /> GEMINI LLM API KEY (BYOK)
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste AIZA... API Key"
              className="w-full bg-[#050507] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-xl pl-3.5 pr-11 py-2.5 text-base sm:text-xs text-[#FFFFFF] placeholder-[#8E8E93] focus:outline-none transition-colors font-mono min-h-[44px]"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#8E8E93] hover:text-[#FFFFFF] active:scale-95 touch-manipulation"
              aria-label="Toggle API key visibility"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Cloud Sync Toggle */}
        <div className="p-3.5 rounded-xl bg-[#050507] border border-[#1E1E26] flex items-center justify-between gap-3">
          <div className="space-y-0.5 flex-1">
            <span className="text-xs font-bold text-[#FFFFFF] flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-[#FFFFFF]" /> FIREBASE CLOUD SYNC
            </span>
            <p className="text-[10px] text-[#8E8E93] leading-snug">
              Sync habits and telemetry directly to private cloud backup.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCloudSync(!cloudSync)}
            className={`w-14 h-8 rounded-full transition-colors p-1 relative shrink-0 active:scale-95 touch-manipulation cursor-pointer ${
              cloudSync ? 'bg-[#FFFFFF]' : 'bg-[#1E1E26]'
            }`}
            aria-label="Toggle Cloud Sync"
          >
            <div
              className={`w-6 h-6 rounded-full bg-[#050507] transition-transform ${
                cloudSync ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Daily Notifications Toggle */}
        <div className="p-3.5 rounded-xl bg-[#050507] border border-[#1E1E26] flex items-center justify-between gap-3">
          <div className="space-y-0.5 flex-1">
            <span className="text-xs font-bold text-[#FFFFFF] flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#FFFFFF]" /> DAILY NOTIFICATIONS
            </span>
            <p className="text-[10px] text-[#8E8E93] leading-snug">
              Warning alert if daily reports remain unsubmitted by 9:00 PM.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDailyNotifications(!dailyNotifications)}
            className={`w-14 h-8 rounded-full transition-colors p-1 relative shrink-0 active:scale-95 touch-manipulation cursor-pointer ${
              dailyNotifications ? 'bg-[#FFFFFF]' : 'bg-[#1E1E26]'
            }`}
            aria-label="Toggle Daily Notifications"
          >
            <div
              className={`w-6 h-6 rounded-full bg-[#050507] transition-transform ${
                dailyNotifications ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Action CTA */}
        <button
          type="submit"
          className="w-full py-3.5 min-h-[48px] cursor-pointer rounded-xl bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] active:scale-95 touch-manipulation"
        >
          COMMIT SETTINGS
        </button>
      </form>
    </motion.div>
  );
};

export default CorePreferencesForm;

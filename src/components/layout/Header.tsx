'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Award, RefreshCw, CheckCircle2, Wifi, WifiOff, UserCheck, LogIn, Mic, Menu } from 'lucide-react';
import { useApexStore } from '@/store/useApexStore';
import { subscribeSyncStatus, processSyncQueue, SyncStatusState } from '@/lib/storageAdapter';
import ApexLogo from '@/components/brand/ApexLogo';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { useVoiceJarvis } from '@/hooks/useVoiceJarvis';
import { JarvisVoiceHud } from '@/components/voice/JarvisVoiceHud';

interface HeaderProps {
  onSyncNode?: () => void;
  onOpenDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSyncNode, onOpenDrawer }) => {
  const level = useApexStore((state) => state.level);
  const currentXp = useApexStore((state) => state.currentXp);
  const xpToNextLevel = useApexStore((state) => state.xpToNextLevel);
  const title = useApexStore((state) => state.currentTitle);
  const username = useApexStore((state) => state.username);
  const avatarUrl = useApexStore((state) => state.avatarUrl);

  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize Voice Assistant Hook
  const voiceJarvis = useVoiceJarvis();
  const { isListening, isSpeaking, triggerVoiceBriefing } = voiceJarvis;

  const [syncStatus, setSyncStatus] = useState<SyncStatusState>({
    isOnline: true,
    isSyncing: false,
    pendingCount: 0,
  });
  const [syncedSuccess, setSyncedSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeSyncStatus((status) => {
      setSyncStatus(status);
    });
    return () => unsubscribe();
  }, []);

  const xpPercentage = Math.min(100, Math.round((currentXp / xpToNextLevel) * 100));

  const handleSync = async () => {
    if (syncStatus.isSyncing) return;
    setSyncedSuccess(false);

    if (onSyncNode) {
      onSyncNode();
    }

    const remaining = await processSyncQueue();
    if (remaining === 0 && syncStatus.isOnline) {
      setSyncedSuccess(true);
      setTimeout(() => setSyncedSuccess(false), 3000);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-[#08090E]/95 backdrop-blur-xl border-b border-[#1C1E2A] px-2.5 sm:px-6 flex items-center justify-between select-none max-w-full">
        {/* Telemetry Left: Mobile Drawer Trigger, Brand & Level Bar */}
        <div className="flex items-center gap-1.5 sm:gap-4 shrink-0 min-w-0">
          {/* Mobile / Collapsed View Brand Icon & Drawer Toggle */}
          <div className="md:hidden flex items-center shrink-0 pr-1 sm:pr-2 border-r border-[#1C1E2A]/70 gap-1">
            {onOpenDrawer && (
              <button
                onClick={onOpenDrawer}
                className="w-10 h-10 rounded-xl bg-[#12131C] active:bg-[#FFFFFF] text-[#94949E] active:text-[#000000] border border-[#232634] flex items-center justify-center transition-all cursor-pointer active-tactile shrink-0"
                aria-label="Open Navigation Drawer"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <ApexLogo variant="icon-only" size="sm" glow={true} />
          </div>

          {/* Desktop Title Badge */}
          <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#11121A] border border-[#232634]">
            <Award className="w-4 h-4 text-[#FFFFFF]" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-[#94949E] font-mono font-medium">
                Title
              </span>
              <span className="text-xs font-bold text-[#FFFFFF] tracking-wide">
                {title}
              </span>
            </div>
          </div>

          {/* Level & XP Telemetry Bar - Ultra Responsive for all screen sizes */}
          <div className="flex items-center gap-1.5 sm:gap-3 bg-[#11121A] px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-[#232634] shrink-0">
            <div className="flex items-center gap-1 shrink-0">
              <Zap className="w-3.5 h-3.5 text-[#FFFFFF] fill-[#FFFFFF]" />
              <span className="text-xs font-extrabold text-[#FFFFFF] font-mono">LVL {level}</span>
            </div>

            <div className="flex flex-col w-14 sm:w-36 md:w-44 gap-0.5 sm:gap-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#94949E] hidden sm:inline font-medium text-[9px]">XP Progress</span>
                <span className="text-[#FFFFFF] font-bold hidden sm:inline text-[10px]">
                  {currentXp} / {xpToNextLevel}
                </span>
                <span className="text-[#FFFFFF] font-bold sm:hidden text-[9px] ml-auto">
                  {xpPercentage}%
                </span>
              </div>

              {/* XP Progress Track */}
              <div className="h-1 sm:h-1.5 w-full bg-[#1C1E2A] rounded-full overflow-hidden p-[1px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercentage}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#8E8E9B] to-[#FFFFFF] rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Header Right: Action Triggers & Sync Telemetry */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* J.A.R.V.I.S. "HEY APEX" Voice Trigger Button */}
          <button
            onClick={triggerVoiceBriefing}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer group min-h-[42px] min-w-[42px] active-tactile ${
              isSpeaking || isListening
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] shadow-glow-white'
                : 'bg-[#11121A] active:bg-[#FFFFFF] text-[#FFFFFF] active:text-[#000000] border-[#232634] hover:border-[#FFFFFF]'
            }`}
            title="Click to trigger J.A.R.V.I.S. voice work briefing"
            aria-label="Hey Apex Voice Briefing"
          >
            <Mic className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-[#000000]' : isListening ? 'animate-pulse text-[#000000]' : 'text-[#FFFFFF] group-hover:text-[#000000]'}`} />
            <span className="font-sans font-semibold tracking-wide text-xs hidden sm:inline">
              Voice AI
            </span>
          </button>

          {/* Firebase Operative Auth Trigger Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center justify-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-[#11121A] active:bg-[#FFFFFF] text-[#FFFFFF] active:text-[#000000] border border-[#232634] hover:border-[#FFFFFF] text-xs font-semibold transition-all group min-h-[42px] min-w-[42px] active-tactile"
            title={user ? `Signed in as ${username || user.email || 'Operative'}` : 'Sign in with Firebase'}
            aria-label="Operative Auth"
          >
            {user && avatarUrl ? (
              <div className="w-5 h-5 rounded-full overflow-hidden border border-[#FFFFFF] shrink-0">
                <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
              </div>
            ) : user ? (
              <UserCheck className="w-4 h-4 text-[#FFFFFF] group-hover:text-[#000000]" />
            ) : (
              <LogIn className="w-4 h-4 text-[#FFFFFF]" />
            )}
            <span className="truncate max-w-[80px] sm:max-w-[120px] font-sans text-xs hidden sm:inline">
              {user ? (username || (user.email ? user.email.split('@')[0] : 'Account')) : 'Sign In'}
            </span>
          </button>

          {/* Node Sync Status Telemetry Pill (Desktop) */}
          <div
            className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all min-h-[42px] ${
              syncStatus.isOnline
                ? 'bg-[#11121A] text-[#FFFFFF] border-[#232634]'
                : 'bg-[#11121A] text-[#94949E] border-[#232634]'
            }`}
          >
            {syncStatus.isOnline ? (
              <Wifi className="w-4 h-4 text-[#FFFFFF] animate-pulse" />
            ) : (
              <WifiOff className="w-4 h-4 text-[#94949E]" />
            )}
            <span className="font-sans text-xs">
              {syncStatus.isOnline ? 'Online' : 'Offline'}
            </span>
            {syncStatus.pendingCount > 0 && (
              <span className="text-[10px] bg-[#1C1E2A] px-2 py-0.5 rounded-full text-[#FFFFFF] font-mono">
                {syncStatus.pendingCount}
              </span>
            )}
          </div>

          {/* Sync Node Trigger Button */}
          <button
            onClick={handleSync}
            disabled={syncStatus.isSyncing}
            className={`relative group overflow-hidden flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 border min-h-[42px] min-w-[42px] active-tactile cursor-pointer ${
              syncedSuccess
                ? 'bg-[#FFFFFF]/20 text-[#FFFFFF] border-[#FFFFFF] shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                : 'bg-[#11121A] active:bg-[#FFFFFF] text-[#FFFFFF] active:text-[#000000] border-[#232634] hover:border-[#FFFFFF]'
            }`}
            aria-label="Sync Data"
          >
            <motion.div
              animate={{ rotate: syncStatus.isSyncing ? 360 : 0 }}
              transition={{ repeat: syncStatus.isSyncing ? Infinity : 0, duration: 1, ease: 'linear' }}
            >
              {syncedSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" />
              ) : (
                <RefreshCw className="w-4 h-4 text-[#FFFFFF]" />
              )}
            </motion.div>

            <span className="hidden sm:inline font-sans">
              {syncStatus.isSyncing
                ? 'Syncing...'
                : syncedSuccess
                ? 'Synced'
                : 'Sync'}
            </span>
          </button>
        </div>
      </header>

      {/* Render Telemetry Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Render Holographic J.A.R.V.I.S. Voice HUD Overlay */}
      <JarvisVoiceHud voiceJarvis={voiceJarvis} />
    </>
  );
};

export default Header;

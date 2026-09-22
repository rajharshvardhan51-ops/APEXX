'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Award, RefreshCw, CheckCircle2, Wifi, WifiOff, UserCheck, LogIn, Mic, Sparkles, Menu } from 'lucide-react';
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
  const { isListening, isSpeaking, toggleListening, triggerVoiceBriefing } = voiceJarvis;

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
      <header className="sticky top-0 z-20 h-14 sm:h-16 bg-[#060608] backdrop-blur-md border-b border-[#1E1E26] px-2 sm:px-6 flex items-center justify-between select-none font-mono">
        {/* Telemetry Left: Mobile Brand & Level & Title */}
        <div className="flex items-center gap-1.5 sm:gap-6">
          {/* Mobile / Collapsed View Brand Icon & Drawer Toggle */}
          <div className="md:hidden flex items-center shrink-0 pr-1 border-r border-[#1E1E26] gap-1">
            {onOpenDrawer && (
              <button
                onClick={onOpenDrawer}
                className="w-8 h-8 rounded bg-[#121217] hover:bg-[#FFFFFF] text-[#8E8E93] hover:text-[#000000] border border-[#1E1E26] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Open Navigation Drawer"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
            <ApexLogo variant="icon-only" size="sm" glow={true} />
          </div>

          {/* Title Badge */}
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-[#000000] border border-[#1E1E26]">
            <Award className="w-4 h-4 text-[#FFFFFF]" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-[#8E8E93]">
                CURRENT TITLE
              </span>
              <span className="text-xs font-bold text-[#FFFFFF] tracking-wider text-glow-sm">
                {title}
              </span>
            </div>
          </div>

          {/* Level & XP Telemetry Bar */}
          <div className="flex items-center gap-1.5 sm:gap-4 bg-[#000000] px-2 sm:px-4 py-1.5 rounded-md border border-[#1E1E26]">
            <div className="flex items-center gap-1 shrink-0">
              <Zap className="w-3.5 h-3.5 text-[#FFFFFF] fill-[#FFFFFF]" />
              <span className="text-xs font-extrabold text-[#FFFFFF] text-glow-sm">LVL {level}</span>
            </div>

            <div className="flex flex-col w-16 sm:w-48 gap-1">
              <div className="flex items-center justify-between text-[9px] sm:text-[10px]">
                <span className="text-[#8E8E93] hidden sm:inline">XP PROGRESS</span>
                <span className="text-[#FFFFFF] font-bold hidden sm:inline">
                  {currentXp} / {xpToNextLevel}
                </span>
                <span className="text-[#FFFFFF] font-bold sm:hidden text-[9px]">
                  {xpPercentage}%
                </span>
              </div>

              {/* XP Progress Track */}
              <div className="h-1.5 w-full bg-[#1E1E26] rounded-sm overflow-hidden p-[1px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercentage}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#71717A] to-[#FFFFFF] rounded-sm shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Header Right Action Trigger & Sync Telemetry */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          {/* J.A.R.V.I.S. "HEY APEX" Voice Trigger Button */}
          <button
            onClick={triggerVoiceBriefing}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-md border text-xs font-bold transition-all cursor-pointer group min-h-[36px] ${
              isSpeaking || isListening
                ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] shadow-glow-white'
                : 'bg-[#000000] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border-[#383848] hover:border-[#FFFFFF]'
            }`}
            title="Click to trigger J.A.R.V.I.S. voice work briefing"
            aria-label="Hey Apex Voice Briefing"
          >
            <Mic className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-[#000000]' : isListening ? 'animate-pulse text-[#000000]' : 'text-[#FFFFFF] group-hover:text-[#000000]'}`} />
            <span className="font-mono uppercase tracking-wider text-[10px] sm:text-xs hidden sm:inline">
              HEY APEX
            </span>
          </button>

          {/* Firebase Operative Auth Trigger Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md bg-[#000000] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#1E1E26] hover:border-[#FFFFFF] text-xs font-bold transition-all group min-h-[36px]"
            title={user ? `Signed in as ${username || user.email || 'Operative'}` : 'Sign in with Firebase'}
            aria-label="Operative Auth"
          >
            {user && avatarUrl ? (
              <div className="w-4 h-4 rounded-full overflow-hidden border border-[#FFFFFF] shrink-0">
                <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
              </div>
            ) : user ? (
              <UserCheck className="w-3.5 h-3.5 text-[#FFFFFF] group-hover:text-[#000000]" />
            ) : (
              <LogIn className="w-3.5 h-3.5 text-[#FFFFFF]" />
            )}
            <span className="truncate max-w-[80px] sm:max-w-[120px] font-mono uppercase text-[10px] sm:text-xs hidden sm:inline">
              {user ? (username || (user.email ? user.email.split('@')[0] : 'GUEST')) : 'AUTHENTICATE'}
            </span>
          </button>

          {/* Node Sync Status Telemetry Pill */}
          <div
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md border text-xs font-bold transition-all min-h-[36px] ${
              syncStatus.isOnline
                ? 'bg-[#000000] text-[#FFFFFF] border-[#383848]'
                : 'bg-[#000000] text-[#E4E4E7] border-[#27272A]'
            }`}
          >
            {syncStatus.isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-[#FFFFFF] animate-pulse" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-[#8E8E93]" />
            )}
            <span className="hidden md:inline">
              {syncStatus.isOnline ? 'NODE SYNC: ACTIVE' : 'NODE SYNC: OFFLINE'}
            </span>
            {syncStatus.pendingCount > 0 && (
              <span className="text-[9px] bg-[#1E1E26] px-1.5 py-0.5 rounded text-[#FFFFFF]">
                {syncStatus.pendingCount} QUEUED
              </span>
            )}
          </div>

          {/* Sync Node Trigger Button */}
          <button
            onClick={handleSync}
            disabled={syncStatus.isSyncing}
            className={`relative group overflow-hidden flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-md text-xs font-bold tracking-wider transition-all duration-200 border min-h-[36px] ${
              syncedSuccess
                ? 'bg-[#FFFFFF]/20 text-[#FFFFFF] border-[#FFFFFF] shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                : 'bg-[#08080A] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border-[#1E1E26] hover:border-[#FFFFFF]'
            }`}
            aria-label="Sync Node"
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

            <span className="hidden sm:inline">
              {syncStatus.isSyncing
                ? 'SYNCING...'
                : syncedSuccess
                ? 'SYNCED'
                : 'SYNC NODE'}
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



'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Award, RefreshCw, CheckCircle2, Wifi, WifiOff, UserCheck, LogIn } from 'lucide-react';
import { useApexStore } from '@/store/useApexStore';
import { subscribeSyncStatus, processSyncQueue, SyncStatusState } from '@/lib/storageAdapter';
import ApexLogo from '@/components/brand/ApexLogo';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

interface HeaderProps {
  onSyncNode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSyncNode }) => {
  const level = useApexStore((state) => state.level);
  const currentXp = useApexStore((state) => state.currentXp);
  const xpToNextLevel = useApexStore((state) => state.xpToNextLevel);
  const title = useApexStore((state) => state.currentTitle);
  const username = useApexStore((state) => state.username);
  const avatarUrl = useApexStore((state) => state.avatarUrl);

  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
      <header className="sticky top-0 z-20 h-16 bg-[#060608] backdrop-blur-md border-b border-[#1E1E26] px-6 flex items-center justify-between select-none font-mono">
        {/* Telemetry Left: Mobile Brand & Level & Title */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Mobile / Collapsed View Brand Icon */}
          <div className="md:hidden flex items-center shrink-0 pr-2 border-r border-[#1E1E26]">
            <ApexLogo variant="icon-only" size="sm" glow={true} />
          </div>

          {/* Title Badge */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-[#000000] border border-[#1E1E26]">
            <Award className="w-4 h-4 text-[#FFFFFF]" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-[#8E8E93]">
                CURRENT TITLE
              </span>
              <span className="text-xs font-bold text-[#FFFFFF] tracking-wider">
                {title}
              </span>
            </div>
          </div>


          {/* Level & XP Telemetry Bar */}
          <div className="flex items-center gap-4 bg-[#000000] px-4 py-1.5 rounded-md border border-[#1E1E26]">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#FFFFFF] fill-[#FFFFFF]" />
              <span className="text-xs font-extrabold text-[#FFFFFF]">LVL {level}</span>
            </div>

            <div className="flex flex-col w-48 gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#8E8E93]">XP PROGRESS</span>
                <span className="text-[#FFFFFF] font-bold">
                  {currentXp.toLocaleString()} / {xpToNextLevel.toLocaleString()} ({xpPercentage}%)
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
        <div className="flex items-center gap-3">
          {/* Firebase Operative Auth Trigger Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#000000] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#1E1E26] hover:border-[#FFFFFF] text-xs font-bold transition-all group"
            title={user ? `Signed in as ${username || user.email || 'Operative'}` : 'Sign in with Firebase'}
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
            <span className="truncate max-w-[120px] font-mono uppercase">
              {user ? (username || (user.email ? user.email.split('@')[0] : 'GUEST')) : 'AUTHENTICATE'}
            </span>
          </button>

          {/* Node Sync Status Telemetry Pill */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-bold transition-all ${
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
            className={`relative group overflow-hidden flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold tracking-wider transition-all duration-200 border ${
              syncedSuccess
                ? 'bg-[#FFFFFF]/20 text-[#FFFFFF] border-[#FFFFFF] shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                : 'bg-[#08080A] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border-[#1E1E26] hover:border-[#FFFFFF]'
            }`}
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
    </>
  );
};

export default Header;


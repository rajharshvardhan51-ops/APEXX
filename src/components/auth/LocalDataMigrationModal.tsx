'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, DownloadCloud, CheckCircle2, X, Sparkles, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApexStore } from '@/store/useApexStore';

export const LocalDataMigrationModal: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migratedSuccess, setMigratedSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Check if migration was already performed on this device
    const migrationKey = `apexx_migrated_${user.uid || user.email}`;
    const alreadyDone = localStorage.getItem(migrationKey);

    if (alreadyDone) return;

    // Check if local store contains non-zero progress data to import
    const localStore = useApexStore.getState();
    const hasDataToMigrate =
      localStore.level > 1 ||
      localStore.currentXp > 0 ||
      localStore.habitLogs.length > 0 ||
      localStore.growthLedgerHistory.length > 0;

    if (hasDataToMigrate) {
      // Delay modal appearance slightly after login for smooth UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleImport = async () => {
    if (!user) return;
    setIsMigrating(true);

    try {
      const currentState = useApexStore.getState();

      const response = await fetch('/api/migration/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.uid}`,
        },
        body: JSON.stringify({ localState: currentState }),
      });

      if (response.ok) {
        const data = await response.json();
        setImportedCount(data.recordsImported || 1);
        setMigratedSuccess(true);
        const migrationKey = `apexx_migrated_${user.uid || user.email}`;
        localStorage.setItem(migrationKey, 'true');

        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      }
    } catch (err) {
      console.warn('[Data Migration] Upload error:', err);
      setIsOpen(false);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleSkip = () => {
    if (user) {
      const migrationKey = `apexx_migrated_${user.uid || user.email}`;
      localStorage.setItem(migrationKey, 'skipped');
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#08080A] border border-[#383848] rounded-xl p-5 shadow-[0_0_50px_rgba(255,255,255,0.15)] text-[#FFFFFF] space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1E1E26]">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#FFFFFF] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF]">
                [ LOCAL DATA MIGRATION DETECTED ]
              </span>
            </div>
            <button
              onClick={handleSkip}
              className="p-1 rounded bg-[#000000] text-[#8E8E93] hover:text-[#FFFFFF] border border-[#1E1E26]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-3 text-xs">
            {migratedSuccess ? (
              <div className="p-4 rounded-lg bg-[#000000] border border-[#FFFFFF]/40 text-[#FFFFFF] space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#FFFFFF]" /> MIGRATION COMPLETE!
                </div>
                <p className="text-[11px] text-[#E4E4E7]">
                  Successfully imported {importedCount} local records to your PostgreSQL account.
                </p>
              </div>
            ) : (
              <>
                <p className="text-[#E4E4E7] leading-relaxed">
                  We detected existing local APEXX metrics (XP, Level, Habit Logs & Heatmaps) on this browser device.
                </p>
                <div className="p-3 rounded-lg bg-[#000000] border border-[#1E1E26] text-[11px] space-y-1 text-[#8E8E93]">
                  <div className="text-[#FFFFFF] font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#FFFFFF]" /> SAFE CLOUD ASSOCIATION:
                  </div>
                  <p>Would you like to import and link this progress to your authenticated account?</p>
                </div>
              </>
            )}
          </div>

          {/* Footer Buttons */}
          {!migratedSuccess && (
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1E1E26]">
              <button
                onClick={handleSkip}
                disabled={isMigrating}
                className="px-3 py-2 rounded-lg bg-[#000000] hover:bg-[#18181F] text-[#8E8E93] border border-[#1E1E26] text-xs font-bold transition-all"
              >
                SKIP MIGRATION
              </button>

              <button
                onClick={handleImport}
                disabled={isMigrating}
                className="px-4 py-2 rounded-lg bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all cursor-pointer"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>{isMigrating ? 'MIGRATING...' : 'IMPORT TO ACCOUNT'}</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LocalDataMigrationModal;

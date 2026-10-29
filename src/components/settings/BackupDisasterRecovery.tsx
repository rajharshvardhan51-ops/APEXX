'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApexStore } from '@/store/useApexStore';
import { exportDatabaseBackup, importDatabaseBackup } from '@/lib/storageAdapter';
import { z } from 'zod';
import { Download, Upload, AlertTriangle, ShieldAlert, CheckCircle2, Database, Trash2 } from 'lucide-react';

const backupSchema = z.object({
  version: z.string().optional(),
  timestamp: z.string().optional(),
  stateStore: z.record(z.string(), z.any()).optional(),
  state: z.record(z.string(), z.any()).optional(),
});

export const BackupDisasterRecovery: React.FC = () => {
  const [rawJsonPayload, setRawJsonPayload] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [showPurgeModal, setShowPurgeModal] = useState(false);

  const handleExportJson = async () => {
    try {
      const jsonBackup = await exportDatabaseBackup();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonBackup);
      const downloadAnchor = document.createElement('a');
      const filename = `apexx_indexeddb_backup_${new Date().toISOString().split('T')[0]}.json`;

      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setStatusMessage({ text: `Export completed: ${filename}`, isError: false });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      setStatusMessage({ text: `Export Error: ${err instanceof Error ? err.message : 'Export failed'}`, isError: true });
    }
  };

  const handleRestoreJson = async () => {
    if (!rawJsonPayload.trim()) {
      setStatusMessage({ text: 'Error: Backup JSON payload cannot be empty.', isError: true });
      return;
    }

    try {
      const parsed = JSON.parse(rawJsonPayload.trim());
      backupSchema.parse(parsed);

      await importDatabaseBackup(rawJsonPayload.trim());

      setStatusMessage({ text: 'IndexedDB backup restored successfully! Reloading application...', isError: false });
      setRawJsonPayload('');
      setTimeout(() => {
        if (typeof window !== 'undefined') window.location.reload();
      }, 1500);
    } catch (err) {
      const errDetail = err instanceof Error ? err.message : 'Invalid JSON payload structure';
      setStatusMessage({ text: `Validation Error: ${errDetail}`, isError: true });
    }
  };

  const handlePurgeCache = () => {
    useApexStore.setState({
      username: 'HARSHVARDHAN-RAJ',
      level: 1,
      currentXp: 0,
      xpToNextLevel: 500,
      streak: 1,
      currentTitle: 'TITAN ARCHITECT',
      equippedFrame: 'TITAN',
      categoryXp: { DEV: 0, FITNESS: 0, ACADEMICS: 0, MIND: 0 },
      completedQuestIds: [],
      habitLogs: [],
      lastXpEvent: null,
      completionIndex: 0,
      graduationCompletedMilestones: [],
    });

    if (typeof window !== 'undefined') {
      localStorage.clear();
      indexedDB.deleteDatabase('apexx_db');
    }

    setShowPurgeModal(false);
    setStatusMessage({ text: 'IndexedDB & local cache purged. Restored to baseline Level 1.', isError: false });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-[#0A0A0E] border border-[#1E1E26] rounded-2xl p-4 sm:p-5 shadow-[0_4px_25px_rgba(0,0,0,0.8)] space-y-4 sm:space-y-5 font-mono select-none"
    >
      {/* Status Feedback Banner */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
              statusMessage.isError
                ? 'bg-[#18181F] border-[#383848] text-[#FFFFFF] shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                : 'bg-[#000000] border-[#FFFFFF] text-[#FFFFFF] shadow-[0_0_15px_rgba(255,255,255,0.3)]'
            }`}
          >
            {statusMessage.isError ? <AlertTriangle className="w-4 h-4 text-[#FFFFFF] shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-[#FFFFFF] shrink-0" />}
            <span className="truncate">{statusMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 border-b border-[#1E1E26] pb-3">
        <Database className="w-4 h-4 text-[#FFFFFF]" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
          BACKUP & DISASTER RECOVERY
        </h2>
      </div>

      {/* Export Database Section */}
      <div className="p-4 rounded-xl bg-[#050507] border border-[#1E1E26] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#FFFFFF] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-[#FFFFFF]" /> EXPORT DATABASE STATE
          </span>
          <span className="text-[10px] text-[#E4E4E7] font-bold">JSON FORMAT</span>
        </div>
        <p className="text-[10px] text-[#8E8E93]">
          Serialize entire local habit logs, XP accumulation, titles, and quest matrices to a downloadable file.
        </p>
        <button
          type="button"
          onClick={handleExportJson}
          className="w-full py-3 min-h-[46px] rounded-xl bg-[#18181F] hover:bg-[#383848] border border-[#1E1E26] hover:border-[#FFFFFF] text-[#FFFFFF] text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors active:scale-95 touch-manipulation cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> DOWNLOAD JSON BACKUP
        </button>
      </div>

      {/* Restore Backup Section */}
      <div className="p-4 rounded-xl bg-[#050507] border border-[#1E1E26] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#FFFFFF] flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-[#FFFFFF]" /> RESTORE SYSTEM BACKUP
          </span>
          <span className="text-[10px] text-[#E4E4E7] font-bold">ZOD VALIDATED</span>
        </div>
        <textarea
          rows={3}
          value={rawJsonPayload}
          onChange={(e) => setRawJsonPayload(e.target.value)}
          placeholder="Paste raw JSON backup payload here to restore..."
          className="w-full bg-[#0A0A0E] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-xl p-3 text-base sm:text-xs text-[#FFFFFF] placeholder-[#8E8E93] font-mono focus:outline-none transition-colors"
        />
        <button
          type="button"
          onClick={handleRestoreJson}
          className="w-full py-3 min-h-[46px] rounded-xl bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors shadow-[0_0_12px_rgba(255,255,255,0.3)] active:scale-95 touch-manipulation cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" /> RESTORE SYSTEM BACKUP
        </button>
      </div>

      {/* Danger Zone: Purge Database Cache */}
      <div className="pt-2 border-t border-[#1E1E26]">
        <div className="p-4 rounded-xl bg-[#050507] border border-[#383848] space-y-3">
          <div className="flex items-center justify-between text-[#FFFFFF]">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#FFFFFF]" /> SECURITY & PURGE PROTOCOL
            </span>
            <span className="text-[9px] font-bold uppercase text-[#8E8E93]">DANGER ZONE</span>
          </div>
          <p className="text-[10px] text-[#8E8E93]">
            Purge local cache and reset user profile back to baseline Level 1. This action is permanent.
          </p>
          <button
            type="button"
            onClick={() => setShowPurgeModal(true)}
            className="w-full py-3 min-h-[46px] rounded-xl bg-[#18181F] hover:bg-[#383848] border border-[#383848] hover:border-[#FFFFFF] text-[#FFFFFF] text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors active:scale-95 touch-manipulation cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> PURGE LOCAL DATABASE CACHE
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showPurgeModal && (
          <div className="fixed inset-0 z-50 bg-[#050507]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0A0A0E] border border-[#FFFFFF] rounded-2xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-[0_0_30px_rgba(255,255,255,0.2)] font-mono text-center max-h-[90dvh] overflow-y-auto"
            >
              <ShieldAlert className="w-10 h-10 text-[#FFFFFF] mx-auto animate-pulse" />
              <h3 className="text-sm sm:text-base font-extrabold text-[#FFFFFF]">
                CONFIRM DATABASE PURGE?
              </h3>
              <p className="text-xs text-[#8E8E93] leading-relaxed">
                Are you sure you want to reset all XP progress, completed quests, habit streams, and titles back to baseline Level 1?
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPurgeModal(false)}
                  className="w-full sm:w-auto px-5 py-3 min-h-[44px] rounded-xl bg-[#18181F] hover:bg-[#383848] text-[#FFFFFF] text-xs font-bold uppercase border border-[#1E1E26] active:scale-95 touch-manipulation"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handlePurgeCache}
                  className="w-full sm:w-auto px-5 py-3 min-h-[44px] rounded-xl bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] text-xs font-bold uppercase shadow-[0_0_15px_rgba(255,255,255,0.3)] active:scale-95 touch-manipulation"
                >
                  CONFIRM PURGE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BackupDisasterRecovery;

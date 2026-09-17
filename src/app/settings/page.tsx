'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CorePreferencesForm from '@/components/settings/CorePreferencesForm';
import BackupDisasterRecovery from '@/components/settings/BackupDisasterRecovery';
import { Settings, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8 font-mono select-none">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-[#FFFFFF] font-bold tracking-widest uppercase">
            <Settings className="w-4 h-4 text-[#FFFFFF]" /> SYSTEM CONFIGURATION & SECURITY PROTOCOLS
          </div>
          <h1 className="text-2xl font-extrabold text-[#FFFFFF] font-sans">
            SYSTEM SETTINGS <span className="text-[#8E8E93]">.OS</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-[#050507] px-3.5 py-2 rounded-lg border border-[#383848] text-xs text-[#FFFFFF] font-bold">
          <ShieldCheck className="w-4 h-4 text-[#FFFFFF]" /> CLIENT SECURITY & ENCRYPTION ACTIVE
        </div>
      </motion.div>

      {/* Main Grid: Left Core Preferences & Right Backup/Disaster Recovery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CorePreferencesForm />
        <BackupDisasterRecovery />
      </div>
    </div>
  );
}

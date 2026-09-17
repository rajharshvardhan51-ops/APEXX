'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApexStore } from '@/store/useApexStore';
import { Terminal, RefreshCw, X, ShieldAlert, Sparkles } from 'lucide-react';
import { initDayRolloverEngine } from '@/lib/dayRolloverEngine';

export const DayRolloverToast: React.FC = () => {
  const rolloverNotification = useApexStore((state) => state.rolloverNotification);
  const clearRolloverNotification = useApexStore((state) => state.clearRolloverNotification);

  // Initialize Day Rollover Engine listeners on mount
  useEffect(() => {
    const cleanup = initDayRolloverEngine();
    return cleanup;
  }, []);

  useEffect(() => {
    if (!rolloverNotification) return;

    const timer = setTimeout(() => {
      clearRolloverNotification();
    }, 6000);

    return () => clearTimeout(timer);
  }, [rolloverNotification, clearRolloverNotification]);

  if (!rolloverNotification) return null;

  const isDecay = rolloverNotification.includes('DECAY');
  const isShield = rolloverNotification.includes('SHIELD');

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-auto select-none font-mono max-w-md">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-xl border backdrop-blur-md flex items-start gap-3 shadow-[0_4px_30px_rgba(0,0,0,0.95)] bg-[#0A0A0E] border-[#FFFFFF] text-[#FFFFFF] shadow-[0_0_20px_rgba(255,255,255,0.25)]"
        >
          <div className="p-2 rounded bg-[#050507] border border-[#1E1E26] shrink-0 mt-0.5">
            {isDecay ? (
              <ShieldAlert className="w-4 h-4 text-[#FFFFFF] animate-pulse" />
            ) : (
              <Terminal className="w-4 h-4 text-[#FFFFFF]" />
            )}
          </div>

          <div className="flex-1 flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-[#FFFFFF] animate-spin" /> [ DAY CYCLE ROLLOVER ]
              </span>
              <button
                onClick={clearRolloverNotification}
                className="text-[#8E8E93] hover:text-[#FFFFFF] transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-[#FFFFFF] font-bold leading-snug">
              {rolloverNotification}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DayRolloverToast;

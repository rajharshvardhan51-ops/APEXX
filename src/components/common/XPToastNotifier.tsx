'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApexStore } from '@/store/useApexStore';
import { Zap, Award, Sparkles } from 'lucide-react';

export const XPToastNotifier: React.FC = () => {
  const lastXpEvent = useApexStore((state) => state.lastXpEvent);
  const clearXpEvent = useApexStore((state) => state.clearXpEvent);

  useEffect(() => {
    if (!lastXpEvent) return;

    const timer = setTimeout(() => {
      clearXpEvent();
    }, 4000);

    return () => clearTimeout(timer);
  }, [lastXpEvent, clearXpEvent]);

  if (!lastXpEvent) return null;

  return (
    <div className="fixed top-20 right-6 z-50 pointer-events-none select-none font-mono">
      <AnimatePresence mode="wait">
        <motion.div
          key={lastXpEvent.timestamp}
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-4 rounded-xl border backdrop-blur-md flex items-center gap-3 shadow-[0_4px_25px_rgba(0,0,0,0.8)] bg-[#0A0A0E]/95 border-[#FFFFFF] text-[#FFFFFF] shadow-[0_0_20px_rgba(255,255,255,0.25)]"
        >
          <div className="p-2.5 rounded-lg bg-[#050507] border border-[#1E1E26] shrink-0">
            {lastXpEvent.isLevelUp ? (
              <Award className="w-6 h-6 text-[#FFFFFF] animate-bounce" />
            ) : (
              <Zap className="w-5 h-5 text-[#FFFFFF] fill-current" />
            )}
          </div>

          <div className="flex flex-col space-y-0.5">
            {lastXpEvent.isLevelUp ? (
              <>
                <div className="flex items-center gap-1 text-xs font-extrabold text-[#FFFFFF] tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5" /> LEVEL UP EVENT DETECTED!
                </div>
                <span className="text-sm font-black text-[#FFFFFF]">
                  LEVEL {lastXpEvent.newLevel} UNLOCKED
                </span>
                <span className="text-[10px] text-[#E4E4E7]">
                  +{lastXpEvent.amount} XP SECURED [{lastXpEvent.category || 'GLOBAL'}]
                </span>
              </>
            ) : (
              <>
                <div className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider">
                  HUD TELEMETRY SYNC
                </div>
                <span className="text-xs font-extrabold text-[#FFFFFF] flex items-center gap-1">
                  +{lastXpEvent.amount} XP SECURED [{lastXpEvent.category || 'GLOBAL'}]
                </span>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default XPToastNotifier;

'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApexStore } from '@/store/useApexStore';
import { Zap } from 'lucide-react';

export const XPFloatToast: React.FC = () => {
  const lastXpEvent = useApexStore((state) => state.lastXpEvent);
  const clearXpEvent = useApexStore((state) => state.clearXpEvent);

  const isLevelUp = lastXpEvent?.isLevelUp;

  useEffect(() => {
    if (!lastXpEvent || isLevelUp) return;

    // Auto-clear XP float toast after 1000ms
    const timer = setTimeout(() => {
      clearXpEvent();
    }, 1000);

    return () => clearTimeout(timer);
  }, [lastXpEvent, isLevelUp, clearXpEvent]);

  if (!lastXpEvent || isLevelUp) return null;

  const domainTag = (lastXpEvent.category || 'DEV').toUpperCase();

  return (
    <div className="fixed top-18 sm:top-24 right-3 sm:right-8 z-50 pointer-events-none select-none font-mono max-w-[90vw]">
      <AnimatePresence mode="wait">
        <motion.div
          key={lastXpEvent.timestamp}
          initial={{ opacity: 0, y: 0, scale: 0.85 }}
          animate={{ opacity: 1, y: -24, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="px-3 py-1.5 rounded-xl bg-[#0A0A0E]/95 backdrop-blur-md border border-[#FFFFFF] text-[#FFFFFF] shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
        >
          <Zap className="w-3.5 h-3.5 fill-[#FFFFFF] animate-pulse shrink-0" />
          <span className="text-xs font-extrabold tracking-wider text-[#FFFFFF] whitespace-nowrap">
            +{lastXpEvent.amount} XP
          </span>
          <span className="text-[10px] text-[#E4E4E7] bg-[#18181F] px-1.5 py-0.5 rounded-md border border-[#383848] font-bold">
            [{domainTag}]
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default XPFloatToast;

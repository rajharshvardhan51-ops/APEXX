'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApexLogo from '@/components/brand/ApexLogo';
import { Terminal, ShieldCheck } from 'lucide-react';

interface SystemBootProps {
  onComplete?: () => void;
}

export const SystemBoot: React.FC<SystemBootProps> = ({ onComplete }) => {
  const [booting, setBooting] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check session storage to only run full boot sequence once per browser session
    const hasBooted = typeof window !== 'undefined' && sessionStorage.getItem('apexx_booted');
    if (hasBooted) {
      setBooting(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setBooting(false);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('apexx_booted', 'true');
            }
            if (onComplete) onComplete();
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!booting) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 bg-[#050507] flex flex-col items-center justify-center p-6 select-none font-mono"
      >
        {/* CRT Scanline & Cyber Grid Background */}
        <div className="absolute inset-0 bg-cyber-grid bg-scanline opacity-30 pointer-events-none" />

        {/* Central Boot Container */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-xl w-full">
          {/* Brand Mark Component (variant="full", size="xl", glow={true}) */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <ApexLogo variant="full" size="xl" glow={true} />
          </motion.div>

          {/* Status Readouts */}
          <div className="space-y-2 w-full">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#FFFFFF] uppercase tracking-widest">
              <Terminal className="w-4 h-4 animate-pulse text-[#FFFFFF]" />
              <span>[ INITIALIZING APEX CORE TELEMETRY... ]</span>
            </div>

            <div className="text-[11px] text-[#8E8E93] tracking-[0.2em] font-semibold uppercase">
              [ TARGET: BECOME YOUR HIGHEST POTENTIAL ]
            </div>
          </div>

          {/* Boot Progress Bar */}
          <div className="w-full max-w-md space-y-2">
            <div className="flex items-center justify-between text-[10px] text-[#8E8E93] font-bold">
              <span>SYSTEM_BOOT_SEQUENCE</span>
              <span className="text-[#FFFFFF]">{progress}%</span>
            </div>

            <div className="h-2 w-full bg-[#1E1E26] rounded-sm overflow-hidden p-[1px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
                className="h-full bg-[#FFFFFF] rounded-sm shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              />
            </div>
          </div>

          {/* Telemetry Footnote */}
          <div className="text-[9px] text-[#8E8E93] uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FFFFFF]" /> SECURE OFFLINE ARCHITECTURE ACTIVE
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SystemBoot;

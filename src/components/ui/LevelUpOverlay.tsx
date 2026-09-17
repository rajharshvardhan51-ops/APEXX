'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApexStore } from '@/store/useApexStore';
import { Award, Sparkles, ShieldCheck, Terminal, Crosshair } from 'lucide-react';
import { playLevelUp, playTerminalClick } from '@/lib/audioEngine';

export const LevelUpOverlay: React.FC = () => {
  const lastXpEvent = useApexStore((state) => state.lastXpEvent);
  const level = useApexStore((state) => state.level);
  const currentTitle = useApexStore((state) => state.currentTitle);
  const clearXpEvent = useApexStore((state) => state.clearXpEvent);

  const isLevelUp = !!lastXpEvent?.isLevelUp;
  const newLevel = lastXpEvent?.newLevel || level;

  // Synthesize Procedural Level Up Audio Chord via AudioEngine
  useEffect(() => {
    if (!isLevelUp) return;
    playLevelUp();
  }, [isLevelUp]);

  const handleDismiss = () => {
    playTerminalClick();
    clearXpEvent();
  };

  if (!isLevelUp) return null;


  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050507]/90 backdrop-blur-lg select-none font-mono"
      >
        {/* Background Cyber Grid & CRT Scanline */}
        <div className="absolute inset-0 bg-cyber-grid bg-scanline opacity-40 pointer-events-none" />

        {/* HUD Corner Reticles */}
        <div className="absolute top-4 left-4 z-10 text-[10px] text-[#8E8E93] flex items-center gap-1">
          <span className="text-[#FFFFFF] font-bold">[+</span>
          <Crosshair className="w-3 h-3 text-[#FFFFFF]" />
          <span>ELEVATION_PROTOCOL]</span>
        </div>

        <div className="absolute top-4 right-4 z-10 text-[10px] text-[#8E8E93]">
          <span>[SYSTEM: LEVEL_UP_CONFIRMED]</span>
        </div>

        <div className="absolute bottom-4 left-4 z-10 text-[10px] text-[#8E8E93]">
          <span>[NEURAL_SYNC: 100%]</span>
        </div>

        <div className="absolute bottom-4 right-4 z-10 text-[10px] text-[#8E8E93]">
          <span>[STATUS: OVERLAY_ENGAGED]</span>
        </div>

        {/* Central Level-Up Modal Container */}
        <motion.div
          initial={{ scale: 0.85, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.85, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="relative z-20 max-w-lg w-full bg-[#0A0A0E] border-2 border-[#FFFFFF] rounded-2xl p-8 shadow-[0_0_50px_rgba(255,255,255,0.2)] flex flex-col items-center text-center space-y-6 overflow-hidden"
        >
          {/* Wireframe Diamond Level Badge */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-[#FFFFFF] rotate-45 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] bg-[#050507] animate-pulse" />
            <div className="relative z-10 flex flex-col items-center space-y-0.5">
              <Award className="w-8 h-8 text-[#FFFFFF]" />
              <span className="text-2xl font-black text-[#FFFFFF] font-mono">
                {newLevel}
              </span>
              <span className="text-[9px] text-[#E4E4E7] font-bold tracking-widest uppercase">
                LEVEL
              </span>
            </div>
          </div>

          {/* Title & Announcement */}
          <div className="space-y-2">
            <div className="hud-tag border-[#383848] text-[#FFFFFF] inline-flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#FFFFFF] animate-pulse" />
              [ RANK UNLOCKED ]
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] font-sans tracking-tight">
              LEVEL {newLevel} // <span className="text-[#E4E4E7] font-mono">{currentTitle}</span>
            </h2>
          </div>

          {/* Monospaced Audio-Visual Readout Box */}
          <div className="w-full bg-[#050507] border border-[#1E1E26] rounded-xl p-4 flex items-start gap-3 text-left text-xs text-[#8E8E93]">
            <Terminal className="w-4 h-4 text-[#FFFFFF] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[#FFFFFF] font-bold tracking-wider">
                SYNAPSE ELEVATION CONFIRMED. NEW DIRECTIVES UNLOCKED.
              </p>
              <p className="text-[11px] text-[#8E8E93]">
                All neural growth matrix thresholds have been recalculated. System capacity increased.
              </p>
            </div>
          </div>

          {/* Acknowledge Button */}
          <button
            onClick={handleDismiss}
            className="w-full py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] font-mono text-xs font-extrabold tracking-wider flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <ShieldCheck className="w-4 h-4" /> ACKNOWLEDGE & RESUME
          </button>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LevelUpOverlay;

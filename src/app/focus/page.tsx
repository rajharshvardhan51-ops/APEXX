'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TimerDisplay, { FocusMode } from '@/components/focus/TimerDisplay';
import DistractionMonitor from '@/components/focus/DistractionMonitor';
import SoundscapesHUD from '@/components/focus/SoundscapesHUD';
import { Timer, Zap, CheckCircle2 } from 'lucide-react';

export default function FocusPage() {
  const [focusMinsToday, setFocusMinsToday] = useState(135);
  const [distractionCount, setDistractionCount] = useState(2);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(5);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  const handleSessionComplete = (mins: number, mode: FocusMode) => {
    setFocusMinsToday((prev) => prev + mins);
    setCompletedSessionsCount((prev) => prev + 1);

    setLastNotification(`+${mins * 10} XP CLAIMED! COMPLETED ${mins}-MIN ${mode} SPRINT.`);
    setTimeout(() => setLastNotification(null), 3500);
  };

  const handleLogDistraction = () => {
    setDistractionCount((prev) => prev + 1);
  };

  const handleForceComplete = () => {
    handleSessionComplete(25, 'PROGRAMMING');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-[#FFFFFF] font-bold tracking-widest uppercase">
            <Timer className="w-4 h-4 text-[#FFFFFF]" /> DEEP WORK & PROCEDURES ENGINE
          </div>
          <h1 className="text-2xl font-extrabold text-[#FFFFFF] font-sans">
            DEEP WORK TIMER <span className="text-[#8E8E93]">.OS</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 bg-[#050507] px-3.5 py-2 rounded-lg border border-[#1E1E26]">
            <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8E8E93] uppercase">COMPLETED SESSIONS</span>
              <span className="font-extrabold text-[#FFFFFF]">{completedSessionsCount} SESSIONS</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Completion Toast Notification */}
      {lastNotification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-3 rounded-lg bg-[#000000] border border-[#FFFFFF] text-[#FFFFFF] font-mono text-xs font-bold flex items-center justify-between shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 fill-current" /> {lastNotification}
          </span>
        </motion.div>
      )}

      {/* Main Grid: Left Center Timer Display & Right Telemetry Monitors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Center Timer Display (2 Cols) */}
        <div className="lg:col-span-2">
          <TimerDisplay onSessionComplete={handleSessionComplete} />
        </div>

        {/* Right Widgets: Distraction Monitor & Soundscapes Selector */}
        <div className="space-y-6">
          <DistractionMonitor
            focusMinsToday={focusMinsToday}
            distractionCount={distractionCount}
            onLogDistraction={handleLogDistraction}
            onForceComplete={handleForceComplete}
          />

          <SoundscapesHUD />
        </div>
      </div>
    </div>
  );
}

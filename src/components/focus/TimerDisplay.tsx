'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Code, Dumbbell, Music, GraduationCap } from 'lucide-react';

export type FocusMode = 'PROGRAMMING' | 'FITNESS' | 'MUSIC' | 'LEARNING';

interface TimerDisplayProps {
  onSessionComplete?: (durationMins: number, mode: FocusMode) => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<FocusMode>('PROGRAMMING');
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const endTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Tab-throttling immune timer using timestamp diffs
  useEffect(() => {
    if (!isRunning) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    endTimeRef.current = Date.now() + secondsLeft * 1000;

    const tick = () => {
      if (!endTimeRef.current) return;
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));

      setSecondsLeft(remaining);

      if (remaining <= 0) {
        setIsRunning(false);
        if (onSessionComplete) {
          onSessionComplete(Math.round(totalSeconds / 60), mode);
        }
      } else {
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, secondsLeft, totalSeconds, mode, onSessionComplete]);

  const setPreset = (mins: number) => {
    setIsRunning(false);
    const secs = mins * 60;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
  };

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercentage = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  const modeIcons = {
    PROGRAMMING: Code,
    FITNESS: Dumbbell,
    MUSIC: Music,
    LEARNING: GraduationCap,
  };

  return (
    <div className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.8)] space-y-6 text-center select-none relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFFFFF]/5 blur-3xl pointer-events-none" />

      {/* Mode Selector */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
        {(['PROGRAMMING', 'FITNESS', 'MUSIC', 'LEARNING'] as FocusMode[]).map((m) => {
          const Icon = modeIcons[m];
          const isActive = mode === m;

          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-[#18181F] text-[#FFFFFF] border border-[#FFFFFF] shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                  : 'bg-[#050507] text-[#8E8E93] hover:text-[#FFFFFF] border border-[#1E1E26]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>[{m}]</span>
            </button>
          );
        })}
      </div>

      {/* Center Monospace Digital Timer Readout */}
      <div className="py-6 flex flex-col items-center justify-center space-y-3">
        <motion.div
          key={secondsLeft}
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="font-mono text-6xl sm:text-7xl font-extrabold text-[#FFFFFF] tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          {formatTime(secondsLeft)}
        </motion.div>

        {/* Progress Bar */}
        <div className="w-64 h-1.5 bg-[#050507] rounded-full border border-[#1E1E26] overflow-hidden p-[1px]">
          <div
            className="h-full bg-[#FFFFFF] rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Block Presets */}
      <div className="flex items-center justify-center gap-3 font-mono text-xs">
        <button
          onClick={() => setPreset(25)}
          className={`px-3 py-1.5 rounded border transition-colors ${
            totalSeconds === 25 * 60
              ? 'bg-[#18181F] text-[#FFFFFF] border-[#383848]'
              : 'bg-[#050507] text-[#8E8E93] border-[#1E1E26] hover:text-[#FFFFFF]'
          }`}
        >
          WORK BLOCK (25m)
        </button>

        <button
          onClick={() => setPreset(5)}
          className={`px-3 py-1.5 rounded border transition-colors ${
            totalSeconds === 5 * 60
              ? 'bg-[#18181F] text-[#FFFFFF] border-[#383848]'
              : 'bg-[#050507] text-[#8E8E93] border-[#1E1E26] hover:text-[#FFFFFF]'
          }`}
        >
          SHORT BREAK (5m)
        </button>

        <button
          onClick={() => setPreset(15)}
          className={`px-3 py-1.5 rounded border transition-colors ${
            totalSeconds === 15 * 60
              ? 'bg-[#18181F] text-[#FFFFFF] border-[#383848]'
              : 'bg-[#050507] text-[#8E8E93] border-[#1E1E26] hover:text-[#FFFFFF]'
          }`}
        >
          LONG BREAK (15m)
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-extrabold uppercase tracking-wider transition-all duration-200 border ${
            isRunning
              ? 'bg-[#18181F] text-[#FFFFFF] border-[#383848] shadow-[0_0_15px_rgba(255,255,255,0.2)]'
              : 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] shadow-[0_0_20px_rgba(255,255,255,0.3)]'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isRunning ? 'PAUSE TIMER' : 'START FOCUS SPRINT'}</span>
        </button>

        <button
          onClick={handleReset}
          className="p-3 rounded-lg bg-[#050507] hover:bg-[#18181F] text-[#8E8E93] hover:text-[#FFFFFF] border border-[#1E1E26] hover:border-[#383848] transition-colors"
          aria-label="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TimerDisplay;

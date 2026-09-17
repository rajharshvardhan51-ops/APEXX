'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface DistractionMonitorProps {
  focusMinsToday: number;
  distractionCount: number;
  onLogDistraction: () => void;
  onForceComplete: () => void;
}

export const DistractionMonitor: React.FC<DistractionMonitorProps> = ({
  focusMinsToday,
  distractionCount,
  onLogDistraction,
  onForceComplete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-4 font-mono select-none"
    >
      <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#FFFFFF]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
            DISTRACTION & TELEMETRY MONITOR
          </h3>
        </div>
        <span className="text-[10px] text-[#FFFFFF] bg-[#18181F] px-2 py-0.5 rounded border border-[#383848] font-bold">
          LIVE TRACKING
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Focus Time Logged Today */}
        <div className="p-3.5 rounded-lg bg-[#050507] border border-[#1E1E26] space-y-1">
          <span className="text-[10px] text-[#8E8E93] uppercase flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#FFFFFF]" /> FOCUS TIME TODAY
          </span>
          <div className="text-2xl font-extrabold text-[#FFFFFF]">
            {focusMinsToday} <span className="text-xs font-normal text-[#8E8E93]">MINS</span>
          </div>
        </div>

        {/* Today's Distractions Counter */}
        <div className="p-3.5 rounded-lg bg-[#050507] border border-[#1E1E26] space-y-1">
          <span className="text-[10px] text-[#8E8E93] uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-[#FFFFFF]" /> DISTRACTIONS
          </span>
          <div className="text-2xl font-extrabold text-[#FFFFFF]">
            {distractionCount} <span className="text-xs font-normal text-[#8E8E93]">EVENTS</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        <button
          onClick={onLogDistraction}
          className="w-full sm:flex-1 py-2.5 rounded-lg bg-[#18181F] hover:bg-[#383848] border border-[#1E1E26] hover:border-[#383848] text-[#FFFFFF] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#8E8E93]" /> LOG DISTRACTION (+1)
        </button>

        <button
          onClick={onForceComplete}
          className="w-full sm:flex-1 py-2.5 rounded-lg bg-[#FFFFFF] hover:bg-[#E4E4E7] border border-[#FFFFFF] text-[#000000] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-[0_0_12px_rgba(255,255,255,0.3)]"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#000000]" /> FORCE COMPLETE
        </button>
      </div>
    </motion.div>
  );
};

export default DistractionMonitor;

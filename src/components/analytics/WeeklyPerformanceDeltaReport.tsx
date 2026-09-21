'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, Award, Sparkles, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useApexStore } from '@/store/useApexStore';
import { calculateWeeklyWorkDelta } from '@/lib/targetQuotaEngine';

export const WeeklyPerformanceDeltaReport: React.FC = () => {
  const growthLedgerHistory = useApexStore((state) => state.growthLedgerHistory);
  const habitLogs = useApexStore((state) => state.habitLogs);
  const macroAim = useApexStore((state) => state.macroAim);

  const weeklyDelta = calculateWeeklyWorkDelta(growthLedgerHistory, habitLogs, 250);

  return (
    <div className="hud-card p-4 sm:p-5 space-y-4 font-mono select-none border border-[#383848] shadow-[0_0_20px_rgba(255,255,255,0.05)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E1E26]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#000000] border border-[#383848] text-[#FFFFFF] shadow-glow-white">
            <Activity className="w-5 h-5 text-[#FFFFFF] animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-[#8E8E93] uppercase font-bold tracking-widest flex items-center gap-1">
              <span>[ 7-DAY OPERATIONAL PERFORMANCE REPORT ]</span>
              <span className="text-[#FFFFFF] bg-[#18181F] px-1.5 py-0.5 rounded border border-[#27272A]">
                WEEKLY AUDIT
              </span>
            </div>
            <h2 className="text-sm font-extrabold text-[#FFFFFF] text-glow tracking-wide">
              WEEKLY WORK DONE & VARIANCE DELTA
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#000000] border border-[#383848] text-xs font-bold">
          {weeklyDelta.isSurplus ? (
            <>
              <TrendingUp className="w-4 h-4 text-[#FFFFFF]" />
              <span className="text-[#FFFFFF]">{weeklyDelta.formattedStatus}</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 text-[#8E8E93]" />
              <span className="text-[#E4E4E7]">{weeklyDelta.formattedStatus}</span>
            </>
          )}
        </div>
      </div>

      {/* Metric Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-[#000000] border border-[#1E1E26] space-y-1">
          <span className="text-[9px] text-[#8E8E93] uppercase font-bold block">TARGET WEEKLY QUOTA</span>
          <span className="font-extrabold text-sm text-[#FFFFFF]">
            {weeklyDelta.targetWeeklyHours} HRS ({weeklyDelta.targetWeeklyXp} XP)
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#000000] border border-[#1E1E26] space-y-1">
          <span className="text-[9px] text-[#8E8E93] uppercase font-bold block">ACTUAL WORK EXECUTED</span>
          <span className="font-extrabold text-sm text-[#FFFFFF]">
            {weeklyDelta.actualWeeklyHours} HRS ({weeklyDelta.actualWeeklyXp} XP)
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#000000] border border-[#1E1E26] space-y-1">
          <span className="text-[9px] text-[#8E8E93] uppercase font-bold block">WORK VARIANCE DELTA</span>
          <span className={`font-extrabold text-sm ${weeklyDelta.isSurplus ? 'text-[#FFFFFF]' : 'text-[#E4E4E7]'}`}>
            {weeklyDelta.isSurplus ? `+${weeklyDelta.deltaXp} XP SURPLUS` : `${weeklyDelta.deltaXp} XP DEFICIT`}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#000000] border border-[#1E1E26] space-y-1">
          <span className="text-[9px] text-[#8E8E93] uppercase font-bold block">WEEKLY PACE STATUS</span>
          <span className="font-extrabold text-sm text-[#FFFFFF]">
            {weeklyDelta.isSurplus ? 'AHEAD OF SCHEDULE 🎉' : 'CATCH-UP REQUIRED ⚠️'}
          </span>
        </div>
      </div>

      {/* Day-by-Day 7-Day Comparison Bars */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center justify-between pb-1 border-b border-[#1E1E26]">
          <span>7-DAY DAILY BREAKDOWN (TARGET: 250 XP / DAY)</span>
          <span className="text-[10px] text-[#8E8E93]">SURPLUS vs DEFICIT</span>
        </h3>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs">
          {weeklyDelta.dailyBreakdown.map((item) => {
            const percent = Math.min(100, Math.round((item.actualXp / item.targetXp) * 100));

            return (
              <div key={item.dateStr} className="p-2 rounded-lg bg-[#000000] border border-[#1E1E26] flex flex-col items-center justify-between space-y-2">
                <span className="text-[10px] text-[#8E8E93] font-bold uppercase">{item.dayName}</span>

                {/* Vertical Bar Representation */}
                <div className="w-full h-16 bg-[#18181F] rounded relative flex items-end overflow-hidden p-[1px] border border-[#27272A]">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${percent}%` }}
                    transition={{ duration: 0.5 }}
                    className={`w-full rounded-sm ${item.isSurplus ? 'bg-[#FFFFFF] shadow-[0_0_8px_#FFFFFF]' : 'bg-[#71717A]'}`}
                  />
                </div>

                <div className="text-[10px] font-bold">
                  <span className={item.isSurplus ? 'text-[#FFFFFF]' : 'text-[#8E8E93]'}>
                    {item.actualXp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* J.A.R.V.I.S. Operational Assessment */}
      <div className="p-3 rounded-lg bg-[#000000] border border-[#383848] text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-[#FFFFFF] text-[11px] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#FFFFFF] animate-pulse" /> J.A.R.V.I.S. WEEKLY TACTICAL ASSESSMENT
        </div>
        <p className="text-[11px] text-[#E4E4E7] leading-relaxed">
          {weeklyDelta.isSurplus
            ? `Outstanding execution, Sir. You have logged ${weeklyDelta.actualWeeklyHours} hours this week (+${weeklyDelta.deltaPercentage}% above target quota). Your trajectory towards becoming a ${macroAim || 'Software Backend Engineer'} is ahead of schedule.`
            : `Attention, Sir. You are currently ${weeklyDelta.deltaPercentage}% below target weekly quota. I recommend completing 45 additional minutes of deep work coding today to eliminate the ${weeklyDelta.targetWeeklyHours - weeklyDelta.actualWeeklyHours} hour deficit.`}
        </p>
      </div>
    </div>
  );
};

export default WeeklyPerformanceDeltaReport;

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Zap,
  Award,
  BarChart2,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';

import ParticleDotMatrixGraph from '../analytics/ParticleDotMatrixGraph';

interface TelemetryWidgetsGridProps {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  streakDays: number;
  title: string;
}

const weeklyXpData = [
  { day: 'MON', xp: 850, efficiency: 88 },
  { day: 'TUE', xp: 1200, efficiency: 94 },
  { day: 'WED', xp: 950, efficiency: 82 },
  { day: 'THU', xp: 1450, efficiency: 98 },
  { day: 'FRI', xp: 1100, efficiency: 90 },
  { day: 'SAT', xp: 1650, efficiency: 96 },
  { day: 'SUN', xp: 1300, efficiency: 92 },
];

const zeroWeeklyXpData = [
  { day: 'MON', xp: 0, efficiency: 0 },
  { day: 'TUE', xp: 0, efficiency: 0 },
  { day: 'WED', xp: 0, efficiency: 0 },
  { day: 'THU', xp: 0, efficiency: 0 },
  { day: 'FRI', xp: 0, efficiency: 0 },
  { day: 'SAT', xp: 0, efficiency: 0 },
  { day: 'SUN', xp: 0, efficiency: 0 },
];

const consistencyTrendData = [
  { time: '08:00', consistency: 75, energy: 80 },
  { time: '10:00', consistency: 88, energy: 95 },
  { time: '12:00', consistency: 92, energy: 85 },
  { time: '14:00', consistency: 85, energy: 78 },
  { time: '16:00', consistency: 96, energy: 90 },
  { time: '18:00', consistency: 98, energy: 92 },
  { time: '20:00', consistency: 94, energy: 86 },
];

export const TelemetryWidgetsGrid: React.FC<TelemetryWidgetsGridProps> = ({
  level,
  currentXp,
  nextLevelXp,
  streakDays,
  title,
}) => {
  const xpPercentage = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));
  const activeXpData = zeroWeeklyXpData;
  const totalXpLabel = '+0 XP';

  return (
    <div className="space-y-6">
      {/* Top 2 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Flame Streak Counter Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="relative overflow-hidden rounded-xl bg-[#08080A] border border-[#1E1E26] hover:border-[#FFFFFF]/60 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.95)] flex flex-col justify-between group transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded bg-[#000000] text-[#FFFFFF] border border-[#1E1E26]">
                <Flame className="w-5 h-5 text-[#FFFFFF]" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
                [ METRIC // STREAK_COUNTER ]
              </span>
            </div>

            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#000000] text-[#FFFFFF] border border-[#383848]">
              ACTIVE MATRIX
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="font-mono text-4xl font-extrabold text-[#FFFFFF] tracking-tight flex items-baseline gap-2">
                {streakDays} <span className="text-xs font-mono font-normal text-[#8E8E93]">DAYS</span>
              </div>
              <p className="font-mono text-[11px] text-[#FFFFFF] flex items-center gap-1 mt-1 font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" /> +4 DAYS VS PREVIOUS RECORD
              </p>
            </div>

            <div className="flex flex-col items-end font-mono text-[10px] text-[#8E8E93]">
              <span>MULTIPLIER</span>
              <span className="text-sm font-bold text-[#FFFFFF] font-mono">1.75X XP</span>
            </div>
          </div>
        </motion.div>

        {/* Current Title & Net XP Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="relative overflow-hidden rounded-xl bg-[#08080A] border border-[#1E1E26] hover:border-[#FFFFFF]/60 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.95)] flex flex-col justify-between group transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded bg-[#000000] text-[#FFFFFF] border border-[#1E1E26]">
                <Award className="w-5 h-5 text-[#FFFFFF]" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[#8E8E93] uppercase tracking-wider">
                  [ RANK & TITLE ]
                </span>
                <span className="font-mono text-xs font-extrabold text-[#FFFFFF] tracking-wide">
                  {title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 font-mono text-xs font-extrabold text-[#FFFFFF] bg-[#000000] px-2.5 py-1 rounded border border-[#1E1E26]">
              <Zap className="w-3.5 h-3.5 fill-[#FFFFFF]" /> LVL {level}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-[#8E8E93]">NET XP PROGRESS</span>
              <span className="text-[#FFFFFF] font-bold">
                {currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP ({xpPercentage}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-[#000000] rounded-sm overflow-hidden p-[1px] border border-[#1E1E26]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#71717A] to-[#FFFFFF] rounded-sm"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom 2 Telemetry Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly XP Gain & Efficiency Particle Dot Matrix Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
        >
          <ParticleDotMatrixGraph
            data={activeXpData}
            height={230}
            title="[ CHART // WEEKLY_XP_MATRIX ]"
            totalXp={totalXpLabel}
          />
        </motion.div>

        {/* Consistency Trend & Energy Vector Dual-Wave Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="bg-[#08080A] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.95)] flex flex-col space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FFFFFF]" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
                [ VECTOR // CONSISTENCY_TREND ]
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-[10px]">
              <span className="flex items-center gap-1 text-[#FFFFFF]">
                <span className="w-2 h-2 rounded-full bg-[#FFFFFF]" /> CONSISTENCY
              </span>
              <span className="flex items-center gap-1 text-[#A1A1AA]">
                <span className="w-2 h-2 rounded-full bg-[#A1A1AA]" /> ENERGY
              </span>
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={consistencyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="consistencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A1A1AA" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#A1A1AA" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E26" vertical={false} />
                <XAxis dataKey="time" stroke="#8E8E93" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke="#8E8E93" tick={{ fontSize: 10, fontFamily: 'monospace' }} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#000000',
                    borderColor: '#1E1E26',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#FFFFFF',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="consistency"
                  name="Consistency %"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#consistencyGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="energy"
                  name="Energy Index"
                  stroke="#A1A1AA"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#energyGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TelemetryWidgetsGrid;


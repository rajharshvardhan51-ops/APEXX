'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, BookOpen, Code, Zap, Grid, Layers } from 'lucide-react';
import ParticleDotMatrixGraph from './ParticleDotMatrixGraph';

import { useApexStore } from '@/store/useApexStore';

const zeroMoodProdData = [
  { day: 'MON', productivity: 0, mood: 0 },
  { day: 'TUE', productivity: 0, mood: 0 },
  { day: 'WED', productivity: 0, mood: 0 },
  { day: 'THU', productivity: 0, mood: 0 },
  { day: 'FRI', productivity: 0, mood: 0 },
  { day: 'SAT', productivity: 0, mood: 0 },
  { day: 'SUN', productivity: 0, mood: 0 },
];

const zeroCodeReadData = [
  { day: 'MON', codingHrs: 0, readingPages: 0 },
  { day: 'TUE', codingHrs: 0, readingPages: 0 },
  { day: 'WED', codingHrs: 0, readingPages: 0 },
  { day: 'THU', codingHrs: 0, readingPages: 0 },
  { day: 'FRI', codingHrs: 0, readingPages: 0 },
  { day: 'SAT', codingHrs: 0, readingPages: 0 },
  { day: 'SUN', codingHrs: 0, readingPages: 0 },
];

const zeroXpSecuredData = [
  { day: 'MON', xp: 0, efficiency: 0 },
  { day: 'TUE', xp: 0, efficiency: 0 },
  { day: 'WED', xp: 0, efficiency: 0 },
  { day: 'THU', xp: 0, efficiency: 0 },
  { day: 'FRI', xp: 0, efficiency: 0 },
  { day: 'SAT', xp: 0, efficiency: 0 },
  { day: 'SUN', xp: 0, efficiency: 0 },
];

export const GrowthLedgerCharts: React.FC = () => {
  const { streak, growthLedgerHistory } = useApexStore();
  const [chartMode, setChartMode] = useState<'particles' | 'bars'>('particles');

  const hasHistory = streak > 0 || growthLedgerHistory.length > 0;
  const moodProdData = hasHistory ? zeroMoodProdData : zeroMoodProdData;
  const codeReadData = hasHistory ? zeroCodeReadData : zeroCodeReadData;
  const xpSecuredData = hasHistory ? zeroXpSecuredData : zeroXpSecuredData;
  const totalXpLabel = hasHistory ? '+0 XP' : '+0 XP';

  return (
    <div className="space-y-6">
      {/* Top 2 Charts: Dual-Line Mood/Productivity & Area Wave Coding/Reading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood & Productivity Index Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-4 font-mono"
        >
          <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FFFFFF]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
                MOOD & PRODUCTIVITY INDEX (1-10 SCALE)
              </h3>
            </div>

            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-[#FFFFFF]">
                <span className="w-2 h-2 rounded-full bg-[#FFFFFF]" /> PRODUCTIVITY
              </span>
              <span className="flex items-center gap-1 text-[#8E8E93]">
                <span className="w-2 h-2 rounded-full bg-[#8E8E93]" /> MOOD
              </span>
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodProdData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E26" vertical={false} />
                <XAxis dataKey="day" stroke="#8E8E93" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke="#8E8E93" domain={[0, 10]} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A0A0E',
                    borderColor: '#1E1E26',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#FFFFFF',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  name="Productivity (1-10)"
                  stroke="#FFFFFF"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#FFFFFF' }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  name="Mood (1-10)"
                  stroke="#8E8E93"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#8E8E93' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Coding Hours & Reading Volume Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-4 font-mono"
        >
          <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-[#FFFFFF]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
                CODING HOURS & READING VOLUME
              </h3>
            </div>

            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-[#FFFFFF]">
                <Code className="w-3 h-3 text-[#FFFFFF]" /> CODING (HRS)
              </span>
              <span className="flex items-center gap-1 text-[#8E8E93]">
                <BookOpen className="w-3 h-3 text-[#8E8E93]" /> READING (PAGES)
              </span>
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={codeReadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="codeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="readGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8E8E93" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8E8E93" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E26" vertical={false} />
                <XAxis dataKey="day" stroke="#8E8E93" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke="#8E8E93" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A0A0E',
                    borderColor: '#1E1E26',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#FFFFFF',
                  }}
                />
                <Area type="monotone" dataKey="codingHrs" name="Coding (Hrs)" stroke="#FFFFFF" fill="url(#codeGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="readingPages" name="Reading (Pages)" stroke="#8E8E93" fill="url(#readGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Chart: XP SECURED PER DAILY NODE SYNC (Dot Matrix Particle Wave / Image 1 Aesthetic) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between px-1 font-mono">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FFFFFF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              DATAISM TELEMETRY GRAPH VECTOR
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setChartMode('particles')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1.5 transition-all ${
                chartMode === 'particles'
                  ? 'bg-[#FFFFFF] text-[#000000] shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                  : 'bg-[#0A0A0E] text-[#8E8E93] border border-[#1E1E26] hover:text-[#FFFFFF]'
              }`}
            >
              <Grid className="w-3 h-3" /> PARTICLE MATRIX
            </button>

            <button
              onClick={() => setChartMode('bars')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1.5 transition-all ${
                chartMode === 'bars'
                  ? 'bg-[#FFFFFF] text-[#000000] shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                  : 'bg-[#0A0A0E] text-[#8E8E93] border border-[#1E1E26] hover:text-[#FFFFFF]'
              }`}
            >
              <Layers className="w-3 h-3" /> HISTOGRAM
            </button>
          </div>
        </div>

        {chartMode === 'particles' ? (
          <ParticleDotMatrixGraph
            data={xpSecuredData}
            height={280}
            title="XP SECURED PER DAILY NODE SYNC"
            totalXp={totalXpLabel}
          />
        ) : (
          <div className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FFFFFF]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
                  XP SECURED PER DAILY NODE SYNC
                </h3>
              </div>
              <span className="text-[10px] text-[#FFFFFF] bg-[#18181F] px-2 py-0.5 rounded border border-[#383848] font-bold">
                WEEKLY TOTAL: {totalXpLabel}
              </span>
            </div>

            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={xpSecuredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="xpSyncGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#8E8E93" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E26" vertical={false} />
                  <XAxis dataKey="day" stroke="#8E8E93" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                  <YAxis stroke="#8E8E93" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A0A0E',
                      borderColor: '#1E1E26',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      color: '#FFFFFF',
                    }}
                  />
                  <Bar dataKey="xp" name="XP Secured" fill="url(#xpSyncGrad)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GrowthLedgerCharts;


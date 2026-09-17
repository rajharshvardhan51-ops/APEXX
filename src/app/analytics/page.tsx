'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GrowthHeatmap from '@/components/analytics/GrowthHeatmap';
import GrowthLedgerCharts from '@/components/analytics/GrowthLedgerCharts';
import { Activity, Code, BookOpen, Flame, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useApexStore } from '@/store/useApexStore';

export default function AnalyticsPage() {
  const { streak, habitLogs, categoryXp } = useApexStore();

  const codingHrs = categoryXp?.DEV ? (categoryXp.DEV / 100).toFixed(1) : '0.0';
  const readingPages = categoryXp?.ACADEMICS ? Math.floor(categoryXp.ACADEMICS / 10) : 0;
  const growthScore = streak > 0 ? (Math.min(99.9, 50 + streak * 2.5)).toFixed(1) + '%' : '__%';

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
            <Activity className="w-4 h-4 text-[#FFFFFF]" /> TELEMETRY ANALYTICS & GROWTH LEDGER
          </div>
          <h1 className="text-2xl font-extrabold text-[#FFFFFF] font-sans">
            GROWTH HEATMAPS & LEDGER <span className="text-[#8E8E93]">.OS</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-[#050507] px-3.5 py-2 rounded-lg border border-[#383848] font-mono text-xs text-[#FFFFFF]">
          <TrendingUp className="w-4 h-4 text-[#FFFFFF]" /> 365-DAY TOPOGRAPHIC METRICS SYNCHRONIZED
        </div>
      </motion.div>

      {/* Top Row Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Growth Score */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-[#0A0A0E] border border-[#1E1E26] hover:border-[#383848] p-4 rounded-xl space-y-2 font-mono shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider">GROWTH SCORE</span>
            <Activity className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          <div className="text-2xl font-extrabold text-[#FFFFFF]">{growthScore}</div>
          <div className="text-[10px] text-[#8E8E93] flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-[#FFFFFF]" /> {streak > 0 ? 'CONSISTENCY INDEX (OPTIMAL)' : 'NO MATRIX HISTORY'}
          </div>
        </motion.div>

        {/* Metric 2: Coding Volume */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-[#0A0A0E] border border-[#1E1E26] hover:border-[#383848] p-4 rounded-xl space-y-2 font-mono shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider">CODING VOLUME</span>
            <Code className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          <div className="text-2xl font-extrabold text-[#FFFFFF]">{codingHrs} <span className="text-xs font-normal text-[#8E8E93]">HRS</span></div>
          <div className="text-[10px] text-[#8E8E93] flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-[#FFFFFF]" /> +0.0 HRS THIS MONTH
          </div>
        </motion.div>

        {/* Metric 3: Reading Ledger */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-[#0A0A0E] border border-[#1E1E26] hover:border-[#383848] p-4 rounded-xl space-y-2 font-mono shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider">READING LEDGER</span>
            <BookOpen className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          <div className="text-2xl font-extrabold text-[#FFFFFF]">{readingPages.toLocaleString()} <span className="text-xs font-normal text-[#8E8E93]">PAGES</span></div>
          <div className="text-[10px] text-[#8E8E93] flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-[#FFFFFF]" /> {readingPages > 0 ? `${Math.floor(readingPages / 60)} BOOKS & SPECS READ` : '0 BOOKS & SPECS READ'}
          </div>
        </motion.div>

        {/* Metric 4: Habit Defense */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-[#0A0A0E] border border-[#1E1E26] hover:border-[#383848] p-4 rounded-xl space-y-2 font-mono shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider">HABIT DEFENSE</span>
            <Flame className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          <div className="text-2xl font-extrabold text-[#FFFFFF]">{streak} <span className="text-xs font-normal text-[#8E8E93]">DAYS</span></div>
          <div className="text-[10px] text-[#8E8E93] flex items-center gap-1">
            {streak > 0 ? 'ACTIVE MATRIX STREAK' : 'NO ACTIVE STREAK'}
          </div>
        </motion.div>
      </div>

      {/* 365-Day Chronological Heatmap Grid */}
      <GrowthHeatmap />

      {/* Multi-variable Trend Vector Charts */}
      <GrowthLedgerCharts />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell,
  Code,
  BookOpen,
  Music,
  FileText,
  Target,
  Zap,
  Activity,
  LucideIcon,
} from 'lucide-react';
import GymLogger from '@/components/habits/GymLogger';
import MetricsMatrix from '@/components/habits/MetricsMatrix';

type HabitTab = 'GYM' | 'CODING' | 'READING' | 'PRACTICE LOG' | 'JOURNALING' | 'GOALS MATRIX';

interface TabConfig {
  id: HabitTab;
  label: string;
  icon: LucideIcon;
}

const tabs: TabConfig[] = [
  { id: 'GYM', label: '[GYM]', icon: Dumbbell },
  { id: 'CODING', label: '[CODING]', icon: Code },
  { id: 'READING', label: '[READING]', icon: BookOpen },
  { id: 'PRACTICE LOG', label: '[PRACTICE LOG]', icon: Music },
  { id: 'JOURNALING', label: '[JOURNALING]', icon: FileText },
  { id: 'GOALS MATRIX', label: '[GOALS MATRIX]', icon: Target },
];

export default function HabitsPage() {
  const [activeTab, setActiveTab] = useState<HabitTab>('GYM');
  const [totalHabitXp, setTotalHabitXp] = useState(1480);

  const handleLogSet = () => {
    setTotalHabitXp((prev) => prev + 60);
  };

  const handleSaveMetrics = () => {
    setTotalHabitXp((prev) => prev + 40);
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
            <Activity className="w-4 h-4 text-[#FFFFFF]" /> HABIT TELEMETRY & PROGRESSION
          </div>
          <h1 className="text-2xl font-extrabold text-[#FFFFFF] font-sans">
            HABIT TRACKERS <span className="text-[#8E8E93]">.OS</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 bg-[#050507] px-4 py-2 rounded-lg border border-[#383848] font-mono text-xs">
          <Zap className="w-4 h-4 text-[#FFFFFF] fill-current" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#8E8E93] uppercase">TOTAL HABIT XP</span>
            <span className="font-extrabold text-[#FFFFFF]">+{totalHabitXp.toLocaleString()} XP</span>
          </div>
        </div>
      </motion.div>

      {/* Horizontal Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#1E1E26] pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs font-bold tracking-wider transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-[#18181F] text-[#FFFFFF] border border-[#383848] shadow-[0_0_12px_rgba(255,255,255,0.1)]'
                  : 'bg-[#0A0A0E] text-[#8E8E93] hover:text-[#FFFFFF] border border-[#1E1E26]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFFFFF]' : 'text-[#8E8E93]'}`} />
              <span>{tab.label}</span>

              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFFFFF] shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'GYM' && (
          <motion.div
            key="GYM"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left 2 Columns: Gym Logger & Today's Set Stream */}
            <div className="lg:col-span-2">
              <GymLogger onLogSet={handleLogSet} />
            </div>

            {/* Right 1 Column: Body Metrics Matrix */}
            <div>
              <MetricsMatrix onSaveMetrics={handleSaveMetrics} />
            </div>
          </motion.div>
        )}

        {activeTab === 'CODING' && (
          <motion.div
            key="CODING"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-6 space-y-4 font-mono"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-[#FFFFFF] uppercase border-b border-[#1E1E26] pb-3">
              <Code className="w-4 h-4 text-[#FFFFFF]" /> CODING SPRINT TRACKER
            </div>
            <p className="text-xs text-[#8E8E93]">
              Log completed LeetCode problems, GitHub commits, and deep architecture refactors to claim XP.
            </p>
            <div className="p-4 rounded-lg bg-[#050507] border border-[#1E1E26] text-xs text-[#FFFFFF]">
              [FEATURE MODULE READY] Integration with LeetCode API & GitHub webhook telemetry active.
            </div>
          </motion.div>
        )}

        {activeTab === 'READING' && (
          <motion.div
            key="READING"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-6 space-y-4 font-mono"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-[#FFFFFF] uppercase border-b border-[#1E1E26] pb-3">
              <BookOpen className="w-4 h-4 text-[#FFFFFF]" /> TECHNICAL READING MATRIX
            </div>
            <p className="text-xs text-[#8E8E93]">
              Track technical book pages, research paper summaries, and architecture documentation readings.
            </p>
          </motion.div>
        )}

        {activeTab === 'PRACTICE LOG' && (
          <motion.div
            key="PRACTICE LOG"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-6 space-y-4 font-mono"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-[#FFFFFF] uppercase border-b border-[#1E1E26] pb-3">
              <Music className="w-4 h-4 text-[#FFFFFF]" /> INSTRUMENT & SKILL PRACTICE LOG
            </div>
            <p className="text-xs text-[#8E8E93]">
              Log flute practice sessions, ear training, and creative mastery sprints.
            </p>
          </motion.div>
        )}

        {activeTab === 'JOURNALING' && (
          <motion.div
            key="JOURNALING"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-6 space-y-4 font-mono"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-[#FFFFFF] uppercase border-b border-[#1E1E26] pb-3">
              <FileText className="w-4 h-4 text-[#FFFFFF]" /> MIND & JOURNAL LOGS
            </div>
            <p className="text-xs text-[#8E8E93]">
              Record daily wins, tactical retrospective notes, and stoic energy audits.
            </p>
          </motion.div>
        )}

        {activeTab === 'GOALS MATRIX' && (
          <motion.div
            key="GOALS MATRIX"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-6 space-y-4 font-mono"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-[#FFFFFF] uppercase border-b border-[#1E1E26] pb-3">
              <Target className="w-4 h-4 text-[#FFFFFF]" /> 4-YEAR DECOMPOSITION GOALS MATRIX
            </div>
            <p className="text-xs text-[#8E8E93]">
              View linked Skill Nodes and annual roadmap milestones.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

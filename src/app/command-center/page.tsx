'use client';

import React, { useState } from 'react';
import HeroBanner from '@/components/dashboard/HeroBanner';
import DailyMissionsPanel, { QuestItem } from '@/components/dashboard/DailyMissionsPanel';
import TelemetryWidgetsGrid from '@/components/dashboard/TelemetryWidgetsGrid';
import SummitTopology from '@/components/canvas/SummitTopology';
import GraduationModal from '@/components/dashboard/GraduationModal';
import DailyGoalMicroQuotaCard from '@/components/dashboard/DailyGoalMicroQuotaCard';
import WeeklyPerformanceDeltaReport from '@/components/analytics/WeeklyPerformanceDeltaReport';
import { useApexStore } from '@/store/useApexStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Zap, Clock, ShieldCheck, Mountain, ExternalLink } from 'lucide-react';

export default function CommandCenterPage() {
  const level = useApexStore((state) => state.level);
  const currentXp = useApexStore((state) => state.currentXp);
  const xpToNextLevel = useApexStore((state) => state.xpToNextLevel);
  const streakDays = useApexStore((state) => state.streak);
  const title = useApexStore((state) => state.currentTitle);
  const completionIndex = useApexStore((state) => state.completionIndex);

  // Graduation Modal state
  const [isGraduationModalOpen, setIsGraduationModalOpen] = useState(false);

  // Focus Quest Modal state
  const [activeFocusQuest, setActiveFocusQuest] = useState<QuestItem | null>(null);

  const handleQuestToggle = (_questId: string, xpDelta: number, isCompleted: boolean) => {
    if (xpDelta !== 0) {
      useApexStore.getState().addXp(xpDelta, 'DEV');
    }

    // Modulate completion index slightly on quest toggles
    const currentComp = useApexStore.getState().completionIndex;
    if (isCompleted) {
      useApexStore.getState().setCompletionIndex(Math.min(100, Number((currentComp + 0.5).toFixed(1))));
    } else {
      useApexStore.getState().setCompletionIndex(Math.max(0, Number((currentComp - 0.5).toFixed(1))));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8 select-none">
      {/* Hero Telemetry Banner */}
      <HeroBanner />

      {/* Daily Goal Specific Micro-Quota Card: What You Specifically Need To Do TODAY */}
      <DailyGoalMicroQuotaCard />

      {/* 3D Summit Topology Visual Horizon */}
      <div className="space-y-2">
        <div
          onClick={() => setIsGraduationModalOpen(true)}
          className="flex items-center justify-between font-sans text-xs text-[#94949E] bg-[#0B0C12] hover:bg-[#12141F] p-4 rounded-xl border border-[#1C1E2A] hover:border-[#FFFFFF] cursor-pointer transition-all duration-200 group active:scale-[0.99]"
          title="Click to open 4-Year Ascent Protocol Roadmap"
        >
          <span className="flex items-center gap-2.5 font-bold tracking-tight text-[#FFFFFF] text-sm">
            <Mountain className="w-4.5 h-4.5 text-[#FFFFFF]" />
            4-Year Ascent Horizon Roadmap
            <ExternalLink className="w-3.5 h-3.5 text-[#94949E] group-hover:text-[#FFFFFF] ml-1 opacity-80 transition-colors" />
          </span>
          <div className="flex items-center gap-3">
            <span className="hud-tag border-[#232634] text-[#FFFFFF] font-mono rounded-full px-3 py-1">
              Completion: {completionIndex.toFixed(1)}%
            </span>
            <span className="text-xs text-[#94949E] group-hover:text-[#FFFFFF] hidden sm:inline transition-colors font-medium">
              Click to view roadmap
            </span>
          </div>
        </div>

        <SummitTopology completionIndex={completionIndex} />
      </div>

      {/* Weekly Work Done & Variance Delta Report (More vs Less Work Comparison) */}
      <WeeklyPerformanceDeltaReport />

      {/* Main Command Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Daily Missions Panel */}
        <div className="lg:col-span-2">
          <DailyMissionsPanel
            onQuestToggle={handleQuestToggle}
            onStartFocusQuest={(quest) => setActiveFocusQuest(quest)}
          />
        </div>

        {/* Right 1 Column: Telemetry Quick Readouts & Focus Launcher */}
        <div className="space-y-4">
          <div className="bg-[#0B0C12] border border-[#1C1E2A] hover:border-[#383C52] rounded-2xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.6)] flex flex-col space-y-4 transition-all duration-200 font-sans">
            <div className="flex items-center gap-2.5 border-b border-[#1C1E2A] pb-3">
              <Zap className="w-4 h-4 text-[#FFFFFF] fill-[#FFFFFF]" />
              <h3 className="text-sm font-bold text-[#FFFFFF] tracking-tight">
                Focus Sprint Launcher
              </h3>
            </div>

            <p className="text-xs text-[#94949E] leading-relaxed font-sans">
              Launch a high-intensity Pomodoro focus session on active directives to gain 1.5x XP multipliers.
            </p>

            <button
              onClick={() =>
                setActiveFocusQuest({
                  id: 'sprint-custom',
                  title: 'Custom Deep Work Telemetry Sprint',
                  category: 'DEV',
                  xp: 350,
                  completed: false,
                  durationMins: 25,
                })
              }
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FFFFFF] text-[#000000] font-sans text-xs font-extrabold tracking-wide hover:bg-[#E4E4E7] transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-95 min-h-[44px] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-[#000000]" /> Launch 25-Min Sprint
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Widgets Grid (Streak, Level, Bar Chart, Dual-Wave Area Chart) */}
      <TelemetryWidgetsGrid
        level={level}
        currentXp={currentXp}
        nextLevelXp={xpToNextLevel}
        streakDays={streakDays}
        title={title}
      />

      {/* Interactive 4-Year Ascent Graduation Modal */}
      <GraduationModal
        isOpen={isGraduationModalOpen}
        onClose={() => setIsGraduationModalOpen(false)}
      />

      {/* Focus Quest Modal */}
      <AnimatePresence>
        {activeFocusQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050507]/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#0B0C12] border border-[#1C1E2A] rounded-2xl p-6 max-w-lg w-full shadow-[0_0_30px_rgba(255,255,255,0.15)] relative space-y-5 font-sans"
            >
              <button
                onClick={() => setActiveFocusQuest(null)}
                className="absolute top-4 right-4 text-[#94949E] hover:text-[#FFFFFF] transition-colors cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#181A26]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs text-[#FFFFFF] font-bold">
                <Clock className="w-4 h-4 text-[#FFFFFF]" /> Focus Session Active
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#FFFFFF]">{activeFocusQuest.title}</h3>
                <div className="flex items-center gap-2 text-xs text-[#94949E]">
                  <span>Category: <span className="font-mono text-[#FFFFFF]">{activeFocusQuest.category}</span></span> •
                  <span className="text-[#FFFFFF] font-bold font-mono">+{activeFocusQuest.xp} XP</span>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#06070B] border border-[#1C1E2A] flex flex-col items-center justify-center space-y-2">
                <div className="font-mono text-4xl font-extrabold text-[#FFFFFF] tracking-widest animate-pulse">
                  25:00
                </div>
                <span className="font-sans text-xs text-[#94949E] uppercase tracking-wider font-semibold">
                  Timer Engaged
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleQuestToggle(activeFocusQuest.id, activeFocusQuest.xp, true);
                    setActiveFocusQuest(null);
                  }}
                  className="flex-1 py-3 min-h-[48px] rounded-xl bg-[#FFFFFF] text-[#000000] font-sans text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#E4E4E7] transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  <ShieldCheck className="w-4.5 h-4.5" /> Complete & Claim XP
                </button>

                <button
                  onClick={() => setActiveFocusQuest(null)}
                  className="px-5 py-3 min-h-[48px] rounded-xl bg-[#06070B] text-[#E4E4E7] font-sans text-xs font-semibold border border-[#1C1E2A] hover:border-[#FFFFFF] transition-colors active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

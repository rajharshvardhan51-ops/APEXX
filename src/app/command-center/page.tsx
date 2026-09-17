'use client';

import React, { useState } from 'react';
import HeroBanner from '@/components/dashboard/HeroBanner';
import DailyMissionsPanel, { QuestItem } from '@/components/dashboard/DailyMissionsPanel';
import TelemetryWidgetsGrid from '@/components/dashboard/TelemetryWidgetsGrid';
import SummitTopology from '@/components/canvas/SummitTopology';
import GraduationModal from '@/components/dashboard/GraduationModal';
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

      {/* 3D Summit Topology Visual Horizon */}
      <div className="space-y-2">
        <div
          onClick={() => setIsGraduationModalOpen(true)}
          className="flex items-center justify-between font-mono text-xs text-[#8E8E93] bg-[#08080A] hover:bg-[#0E0E14] p-3 rounded-lg border border-[#1E1E26] hover:border-[#FFFFFF] cursor-pointer transition-all duration-200 group"
          title="Click to open 4-Year Ascent Protocol Roadmap"
        >
          <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#FFFFFF]">
            <Mountain className="w-4 h-4 text-[#FFFFFF]" />
            [ SECTOR: TOPOLOGY_MATRIX // 4-YEAR ASCENT PROTOCOL ]
            <ExternalLink className="w-3.5 h-3.5 text-[#8E8E93] group-hover:text-[#FFFFFF] ml-1 opacity-80 transition-colors" />
          </span>
          <div className="flex items-center gap-3">
            <span className="hud-tag border-[#383848] text-[#FFFFFF]">
              COMPLETION: {completionIndex.toFixed(1)}%
            </span>
            <span className="text-[10px] text-[#8E8E93] group-hover:text-[#FFFFFF] hidden sm:inline transition-colors">
              [ CLICK TO OPEN ROADMAP ]
            </span>
          </div>
        </div>

        <SummitTopology completionIndex={completionIndex} />
      </div>

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
          <div className="bg-[#08080A] border border-[#1E1E26] hover:border-[#383848] rounded-xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.95)] flex flex-col space-y-4 transition-all duration-200">
            <div className="flex items-center gap-2 border-b border-[#1E1E26] pb-3">
              <Zap className="w-4 h-4 text-[#FFFFFF] fill-[#FFFFFF]" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
                [ ENGINE // FOCUS_SPRINT ]
              </h3>
            </div>

            <p className="font-mono text-xs text-[#8E8E93] leading-relaxed">
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
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#FFFFFF] text-[#000000] font-mono text-xs font-extrabold tracking-wider hover:bg-[#E4E4E7] transition-all shadow-[0_0_15px_rgba(255,255,255,0.25)]"
            >
              <Play className="w-4 h-4 fill-current text-[#000000]" /> LAUNCH 25-MIN SPRINT
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
              className="bg-[#08080C] border border-[#1E1E26] rounded-xl p-6 max-w-lg w-full shadow-[0_0_30px_rgba(255,255,255,0.15)] relative space-y-5"
            >
              <button
                onClick={() => setActiveFocusQuest(null)}
                className="absolute top-4 right-4 text-[#8E8E93] hover:text-[#FFFFFF] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 font-mono text-xs text-[#FFFFFF] font-bold">
                <Clock className="w-4 h-4 text-[#FFFFFF]" /> [ MODE: FOCUS_SPRINT_ACTIVE ]
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#FFFFFF]">{activeFocusQuest.title}</h3>
                <div className="flex items-center gap-2 font-mono text-xs text-[#8E8E93]">
                  <span>CATEGORY: {activeFocusQuest.category}</span> •
                  <span className="text-[#FFFFFF] font-bold">REWARD: +{activeFocusQuest.xp} XP</span>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-[#050507] border border-[#1E1E26] flex flex-col items-center justify-center space-y-2">
                <div className="font-mono text-4xl font-extrabold text-[#FFFFFF] tracking-widest animate-pulse">
                  25:00
                </div>
                <span className="font-mono text-[10px] text-[#8E8E93] uppercase tracking-wider">
                  [ TELEMETRY // TIMER_ENGAGED ]
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleQuestToggle(activeFocusQuest.id, activeFocusQuest.xp, true);
                    setActiveFocusQuest(null);
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-[#FFFFFF] text-[#000000] font-mono text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#E4E4E7] transition-all shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                >
                  <ShieldCheck className="w-4 h-4" /> COMPLETE & CLAIM XP
                </button>

                <button
                  onClick={() => setActiveFocusQuest(null)}
                  className="px-4 py-2.5 rounded-lg bg-[#050507] text-[#E4E4E7] font-mono text-xs border border-[#1E1E26] hover:border-[#FFFFFF] transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



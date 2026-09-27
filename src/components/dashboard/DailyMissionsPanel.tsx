'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Check, Play, Zap, ShieldCheck, Filter } from 'lucide-react';
import { playQuestComplete, playTerminalClick } from '@/lib/audioEngine';

export interface QuestItem {
  id: string;
  title: string;
  category: 'DEV' | 'FITNESS' | 'ACADEMICS' | 'MIND';
  xp: number;
  completed: boolean;
  durationMins?: number;
}

const initialQuests: QuestItem[] = [
  {
    id: 'q-1',
    title: 'Execute 90-Min Deep Work Sprint on APEXX Architecture & Database Schema',
    category: 'DEV',
    xp: 450,
    completed: true,
    durationMins: 90,
  },
  {
    id: 'q-2',
    title: 'Complete 45-Min Physical Conditioning & Core Strength Protocol',
    category: 'FITNESS',
    xp: 300,
    completed: true,
    durationMins: 45,
  },
  {
    id: 'q-3',
    title: 'Review System Telemetry Metrics & Submit Growth Ledger Entry',
    category: 'MIND',
    xp: 200,
    completed: false,
    durationMins: 15,
  },
  {
    id: 'q-4',
    title: 'Solve 2 LeetCode Medium Algorithms (Dynamic Programming & Trees)',
    category: 'DEV',
    xp: 350,
    completed: false,
    durationMins: 60,
  },
  {
    id: 'q-5',
    title: 'Read 30 Pages of System Architecture & Distributed Systems Specs',
    category: 'ACADEMICS',
    xp: 250,
    completed: false,
    durationMins: 30,
  },
];

interface DailyMissionsPanelProps {
  onQuestToggle?: (questId: string, xpDelta: number, isCompleted: boolean) => void;
  onStartFocusQuest?: (quest: QuestItem) => void;
}

export const DailyMissionsPanel: React.FC<DailyMissionsPanelProps> = ({
  onQuestToggle,
  onStartFocusQuest,
}) => {
  const [quests, setQuests] = useState<QuestItem[]>(initialQuests);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [lastJustCompletedId, setLastJustCompletedId] = useState<string | null>(null);

  const toggleQuest = (id: string) => {
    setQuests((prevQuests) =>
      prevQuests.map((q) => {
        if (q.id === id) {
          const nextCompleted = !q.completed;
          const xpDelta = nextCompleted ? q.xp : -q.xp;

          if (nextCompleted) {
            playQuestComplete();
            setLastJustCompletedId(id);
            setTimeout(() => setLastJustCompletedId(null), 1200);
          } else {
            playTerminalClick();
          }

          if (onQuestToggle) {
            onQuestToggle(id, xpDelta, nextCompleted);
          }

          return { ...q, completed: nextCompleted };
        }
        return q;
      })
    );
  };

  const handleFilterClick = (cat: string) => {
    playTerminalClick();
    setActiveCategoryFilter(cat);
  };

  const filteredQuests = quests.filter((q) =>
    activeCategoryFilter === 'ALL' ? true : q.category === activeCategoryFilter
  );

  const completedCount = quests.filter((q) => q.completed).length;
  const totalXpAvailable = quests.reduce((acc, q) => acc + (q.completed ? q.xp : 0), 0);

  const getCategoryTag = (cat: QuestItem['category']) => {
    switch (cat) {
      case 'DEV':
        return 'text-[#FFFFFF] bg-[#000000] border-[#383848]';
      case 'FITNESS':
        return 'text-[#E4E4E7] bg-[#000000] border-[#27272A]';
      case 'ACADEMICS':
        return 'text-[#E4E4E7] bg-[#000000] border-[#27272A]';
      case 'MIND':
        return 'text-[#FFFFFF] bg-[#000000] border-[#383848]';
      default:
        return 'text-[#8E8E93] bg-[#000000] border-[#1E1E26]';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="bg-[#0B0C12] border border-[#1C1E2A] rounded-2xl p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.6)] flex flex-col space-y-5"
    >
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1C1E2A] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#12141F] text-[#FFFFFF] border border-[#232634]">
            <Target className="w-5 h-5 text-[#FFFFFF]" />
          </div>
          <div>
            <h2 className="font-sans text-base font-bold text-[#FFFFFF] tracking-tight flex items-center gap-2">
              Daily Quests & Directives
            </h2>
            <p className="font-sans text-xs text-[#94949E] mt-0.5">
              Progress: <span className="text-[#FFFFFF] font-bold">{completedCount} / {quests.length}</span> completed (<span className="font-mono text-[#FFFFFF]">+{totalXpAvailable} XP</span> earned)
            </p>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center gap-2 font-sans text-xs pb-1 lg:pb-0">
          <Filter className="w-4 h-4 text-[#717180] shrink-0" />
          {['ALL', 'DEV', 'FITNESS', 'ACADEMICS', 'MIND'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterClick(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 border cursor-pointer min-h-[36px] active:scale-95 ${
                activeCategoryFilter === cat
                  ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] shadow-sm'
                  : 'bg-[#06070B] text-[#94949E] hover:text-[#FFFFFF] border-[#1C1E2A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quest Items List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredQuests.map((quest) => {
            const isJustCompleted = lastJustCompletedId === quest.id;

            return (
              <motion.div
                key={quest.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className={`relative group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-200 ${
                  isJustCompleted
                    ? 'bg-[#FFFFFF]/10 border-[#FFFFFF] shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                    : quest.completed
                    ? 'bg-[#08090E]/60 border-[#1C1E2A] text-[#717180]'
                    : 'bg-[#06070B] hover:bg-[#11131E] border-[#1C1E2A] hover:border-[#383C52] text-[#FFFFFF]'
                }`}
              >
                {/* Left: Checkbox Switch & Quest Info */}
                <div className="flex items-start sm:items-center gap-3.5">
                  {/* Mechanical Checkbox Button */}
                  <button
                    onClick={() => toggleQuest(quest.id)}
                    className={`w-7 h-7 rounded-lg border transition-all duration-150 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 cursor-pointer active:scale-90 ${
                      quest.completed
                        ? 'bg-[#FFFFFF] border-[#FFFFFF] text-[#000000] shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                        : 'bg-[#0A0B10] border-[#232634] hover:border-[#FFFFFF] text-transparent'
                    }`}
                    aria-label={`Toggle quest ${quest.title}`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-sans font-medium tracking-normal transition-all duration-150 leading-snug ${
                          quest.completed ? 'line-through text-[#717180]' : 'text-[#FFFFFF]'
                        }`}
                      >
                        {quest.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryTag(
                          quest.category
                        )}`}
                      >
                        {quest.category}
                      </span>

                      {quest.durationMins && (
                        <span className="font-sans text-xs text-[#94949E]">
                          Est: <span className="font-mono text-[#FFFFFF]">{quest.durationMins} mins</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: XP Pill & Focus Trigger Button */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1C1E2A]/60">
                  {/* XP Reward Pill */}
                  <span
                    className={`font-mono text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shrink-0 ${
                      quest.completed
                        ? 'bg-[#08090E] text-[#94949E] border-[#232634]'
                        : 'bg-[#12141F] text-[#FFFFFF] border-[#232634]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-[#FFFFFF] fill-[#FFFFFF]" /> +{quest.xp} XP
                  </span>

                  {/* Focus Quest Trigger Button */}
                  {!quest.completed && (
                    <button
                      onClick={() => {
                        playTerminalClick();
                        onStartFocusQuest && onStartFocusQuest(quest);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] font-sans text-xs font-bold transition-all duration-150 shrink-0 cursor-pointer min-h-[40px] active:scale-95 shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Focus
                    </button>
                  )}

                  {quest.completed && (
                    <span className="font-sans text-xs text-[#94949E] flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-[#FFFFFF]" /> Done
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DailyMissionsPanel;



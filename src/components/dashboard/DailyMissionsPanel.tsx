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
      className="bg-[#08080A] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.95)] flex flex-col space-y-4"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E1E26] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-[#000000] text-[#FFFFFF] border border-[#1E1E26]">
            <Target className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          <div>
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFFFFF] flex items-center gap-2">
              [ DIRECTIVES // DAILY_QUEST_LOG ]
            </h2>
            <p className="font-mono text-[11px] text-[#8E8E93] mt-0.5">
              PROGRESS: <span className="text-[#FFFFFF] font-bold">{completedCount} / {quests.length}</span> COMPLETED ({totalXpAvailable} XP EARNED)
            </p>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-[#8E8E93] shrink-0" />
          {['ALL', 'DEV', 'FITNESS', 'ACADEMICS', 'MIND'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterClick(cat)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase font-mono transition-all duration-150 border cursor-pointer min-h-[32px] ${
                activeCategoryFilter === cat
                  ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                  : 'bg-[#000000] text-[#8E8E93] hover:text-[#FFFFFF] border-[#1E1E26]'
              }`}
            >
              [{cat}]
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
                className={`relative group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border transition-all duration-200 ${
                  isJustCompleted
                    ? 'bg-[#FFFFFF]/10 border-[#FFFFFF] shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                    : quest.completed
                    ? 'bg-[#000000]/80 border-[#1E1E26] text-[#71717A]'
                    : 'bg-[#000000] hover:bg-[#121217] border-[#1E1E26] hover:border-[#FFFFFF]/60 text-[#FFFFFF]'
                }`}
              >
                {/* Left: Checkbox Switch & Quest Info */}
                <div className="flex items-start sm:items-center gap-3">
                  {/* Mechanical Terminal Switch Checkbox */}
                  <button
                    onClick={() => toggleQuest(quest.id)}
                    className={`w-6 h-6 rounded-md border transition-all duration-150 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 cursor-pointer ${
                      quest.completed
                        ? 'bg-[#FFFFFF] border-[#FFFFFF] text-[#000000] shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                        : 'bg-[#000000] border-[#1E1E26] hover:border-[#FFFFFF] text-transparent'
                    }`}
                    aria-label={`Toggle quest ${quest.title}`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium tracking-wide transition-all duration-150 ${
                          quest.completed ? 'line-through text-[#71717A]' : 'text-[#FFFFFF]'
                        }`}
                      >
                        {quest.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${getCategoryTag(
                          quest.category
                        )}`}
                      >
                        [{quest.category}]
                      </span>

                      {quest.durationMins && (
                        <span className="font-mono text-[10px] text-[#8E8E93]">
                          EST: {quest.durationMins} MINS
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: XP Pill & Focus Trigger Button */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1E1E26]/50">
                  {/* XP Reward Pill */}
                  <span
                    className={`font-mono text-xs font-extrabold px-2.5 py-1 rounded border flex items-center gap-1 shrink-0 ${
                      quest.completed
                        ? 'bg-[#000000] text-[#FFFFFF] border-[#383848]'
                        : 'bg-[#000000] text-[#FFFFFF] border-[#1E1E26]'
                    }`}
                  >
                    <Zap className="w-3 h-3 text-[#FFFFFF] fill-[#FFFFFF]" /> +{quest.xp} XP
                  </span>

                  {/* Focus Quest Trigger Button */}
                  {!quest.completed && (
                    <button
                      onClick={() => {
                        playTerminalClick();
                        onStartFocusQuest && onStartFocusQuest(quest);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#000000] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#1E1E26] hover:border-[#FFFFFF] font-mono text-[11px] font-bold transition-all duration-150 shrink-0 cursor-pointer min-h-[36px]"
                    >
                      <Play className="w-3 h-3 fill-current" /> FOCUS
                    </button>
                  )}

                  {quest.completed && (
                    <span className="font-mono text-[10px] text-[#FFFFFF] flex items-center gap-1 uppercase font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> CLAIMED
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



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
  CheckCircle2,
  Plus,
} from 'lucide-react';
import GymLogger from '@/components/habits/GymLogger';
import MetricsMatrix from '@/components/habits/MetricsMatrix';
import { playQuestComplete, playTerminalClick } from '@/lib/audioEngine';

type HabitTab = 'GYM' | 'CODING' | 'READING' | 'PRACTICE LOG' | 'JOURNALING' | 'GOALS MATRIX';

interface TabConfig {
  id: HabitTab;
  label: string;
  icon: LucideIcon;
}

const tabs: TabConfig[] = [
  { id: 'GYM', label: 'Gym Workout', icon: Dumbbell },
  { id: 'CODING', label: 'Coding Sprint', icon: Code },
  { id: 'READING', label: 'Tech Reading', icon: BookOpen },
  { id: 'PRACTICE LOG', label: 'Practice Log', icon: Music },
  { id: 'JOURNALING', label: 'Journaling', icon: FileText },
  { id: 'GOALS MATRIX', label: 'Goals Matrix', icon: Target },
];

export default function HabitsPage() {
  const [activeTab, setActiveTab] = useState<HabitTab>('GYM');
  const [totalHabitXp, setTotalHabitXp] = useState(1480);

  // Coding tasks state
  const [codingSprintLogged, setCodingSprintLogged] = useState<string[]>([]);
  // Reading state
  const [pagesRead, setPagesRead] = useState<number>(15);
  const [readingLogged, setReadingLogged] = useState(false);
  // Journal text
  const [journalNote, setJournalNote] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  const handleLogSet = () => {
    setTotalHabitXp((prev) => prev + 60);
  };

  const handleSaveMetrics = () => {
    setTotalHabitXp((prev) => prev + 40);
  };

  const handleLogCodingSprint = (label: string, xp: number) => {
    playQuestComplete();
    setCodingSprintLogged((prev) => [...prev, label]);
    setTotalHabitXp((prev) => prev + xp);
  };

  const handleLogReading = () => {
    playQuestComplete();
    setReadingLogged(true);
    setTotalHabitXp((prev) => prev + pagesRead * 2);
    setTimeout(() => setReadingLogged(false), 2000);
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalNote.trim()) return;
    playQuestComplete();
    setJournalSaved(true);
    setTotalHabitXp((prev) => prev + 50);
    setTimeout(() => {
      setJournalNote('');
      setJournalSaved(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 pb-6 select-none font-sans">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-[#0B0C12] border border-[#1C1E2A] rounded-2xl p-4 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
      >
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#94949E] font-semibold tracking-wide">
            <Activity className="w-4 h-4 text-[#FFFFFF]" /> Habit Telemetry & Progression
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#FFFFFF] font-sans">
            Habit Trackers <span className="text-[#94949E] font-normal text-base sm:text-lg">.OS</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 bg-[#06070B] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-[#232634] text-xs self-start sm:self-auto">
          <Zap className="w-4 h-4 text-[#FFFFFF] fill-current" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#94949E] uppercase font-medium">Total Habit XP</span>
            <span className="font-extrabold text-[#FFFFFF] font-mono">+{totalHabitXp.toLocaleString()} XP</span>
          </div>
        </div>
      </motion.div>

      {/* Horizontal Tabs Bar with Smooth Horizontal Scrolling */}
      <div className="flex items-center gap-2 border-b border-[#1C1E2A] pb-2 sm:pb-3 overflow-x-auto no-scrollbar scroll-smooth -mx-2 px-2 sm:mx-0 sm:px-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                playTerminalClick();
                setActiveTab(tab.id);
              }}
              className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 shrink-0 cursor-pointer active:scale-95 touch-manipulation ${
                isActive
                  ? 'bg-[#FFFFFF] text-[#000000] shadow-sm font-bold'
                  : 'bg-[#0B0C12] text-[#94949E] hover:text-[#FFFFFF] border border-[#1C1E2A]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#000000]' : 'text-[#717180]'}`} />
              <span className="whitespace-nowrap">{tab.label}</span>
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
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
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
            className="bg-[#0A0A0E] border border-[#1E1E26] rounded-2xl p-4 sm:p-6 space-y-4 font-mono shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FFFFFF] uppercase">
                <Code className="w-4 h-4 text-[#FFFFFF]" /> CODING SPRINT PROTOCOL
              </div>
              <span className="text-[10px] text-[#FFFFFF] bg-[#18181F] px-2 py-0.5 rounded border border-[#383848] font-bold">
                GITHUB / LEETCODE TELEMETRY
              </span>
            </div>
            <p className="text-xs text-[#8E8E93]">
              Log completed LeetCode problems, GitHub commits, and deep architecture refactors to claim XP.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                { title: 'LeetCode Medium Solved', xp: 75, tag: 'ALGO' },
                { title: 'Feature Commit Pushed', xp: 50, tag: 'GIT' },
                { title: 'System PR Reviewed / Merged', xp: 120, tag: 'DEV' },
              ].map((sprint, idx) => {
                const isLogged = codingSprintLogged.includes(sprint.title);
                return (
                  <button
                    key={idx}
                    onClick={() => handleLogCodingSprint(sprint.title, sprint.xp)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-3 min-h-[90px] transition-all active:scale-95 cursor-pointer touch-manipulation ${
                      isLogged
                        ? 'bg-[#18181F] border-[#FFFFFF] text-[#FFFFFF]'
                        : 'bg-[#050507] border-[#1E1E26] hover:border-[#383848] text-[#8E8E93]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#8E8E93] bg-[#12141F] px-2 py-0.5 rounded border border-[#232634] font-bold">
                        [{sprint.tag}]
                      </span>
                      <span className="text-xs font-bold text-[#FFFFFF] flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-current" /> +{sprint.xp} XP
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLogged ? (
                        <CheckCircle2 className="w-4 h-4 text-[#FFFFFF] shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 text-[#FFFFFF] shrink-0" />
                      )}
                      <span className="text-xs font-bold text-[#FFFFFF]">{sprint.title}</span>
                    </div>
                  </button>
                );
              })}
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
            className="bg-[#0A0A0E] border border-[#1E1E26] rounded-2xl p-4 sm:p-6 space-y-4 font-mono shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FFFFFF] uppercase">
                <BookOpen className="w-4 h-4 text-[#FFFFFF]" /> TECHNICAL READING MATRIX
              </div>
              <span className="text-[10px] text-[#FFFFFF] bg-[#18181F] px-2 py-0.5 rounded border border-[#383848] font-bold">
                +2 XP / PAGE
              </span>
            </div>
            <p className="text-xs text-[#8E8E93]">
              Track technical book pages, research paper summaries, and architecture documentation readings.
            </p>

            <div className="p-4 rounded-xl bg-[#050507] border border-[#1E1E26] space-y-3">
              <label className="text-[11px] text-[#8E8E93] uppercase tracking-wider block">
                PAGES COMPLETED TODAY
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  inputMode="numeric"
                  value={pagesRead}
                  onChange={(e) => setPagesRead(parseInt(e.target.value, 10) || 0)}
                  className="bg-[#0A0A0E] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-xl px-4 py-2.5 text-base sm:text-sm text-[#FFFFFF] outline-none min-h-[44px] w-28 text-center font-bold"
                />
                <button
                  onClick={handleLogReading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] text-xs font-bold uppercase tracking-wider min-h-[44px] flex items-center justify-center gap-2 active:scale-95 touch-manipulation cursor-pointer"
                >
                  {readingLogged ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> LOGGED (+{pagesRead * 2} XP)!
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[2.5]" /> LOG PAGES (+{pagesRead * 2} XP)
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'PRACTICE LOG' && (
          <motion.div
            key="PRACTICE LOG"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0A0A0E] border border-[#1E1E26] rounded-2xl p-4 sm:p-6 space-y-4 font-mono shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FFFFFF] uppercase">
                <Music className="w-4 h-4 text-[#FFFFFF]" /> INSTRUMENT & SKILL PRACTICE LOG
              </div>
              <span className="text-[10px] text-[#FFFFFF] bg-[#18181F] px-2 py-0.5 rounded border border-[#383848] font-bold">
                +100 XP / SESSION
              </span>
            </div>
            <p className="text-xs text-[#8E8E93]">
              Log flute practice sessions, ear training, and creative mastery sprints.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  playQuestComplete();
                  setTotalHabitXp((prev) => prev + 100);
                }}
                className="p-4 rounded-xl bg-[#050507] hover:bg-[#12141F] border border-[#1E1E26] hover:border-[#383848] text-left space-y-2 min-h-[80px] active:scale-95 touch-manipulation cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#FFFFFF]">30-Min Flute Tone & Scales</span>
                  <span className="text-xs font-bold text-[#FFFFFF]">+100 XP</span>
                </div>
                <p className="text-[10px] text-[#8E8E93]">Embrouchure control, diatonic scales & finger agility</p>
              </button>

              <button
                onClick={() => {
                  playQuestComplete();
                  setTotalHabitXp((prev) => prev + 80);
                }}
                className="p-4 rounded-xl bg-[#050507] hover:bg-[#12141F] border border-[#1E1E26] hover:border-[#383848] text-left space-y-2 min-h-[80px] active:scale-95 touch-manipulation cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#FFFFFF]">20-Min Ear Training & Solfege</span>
                  <span className="text-xs font-bold text-[#FFFFFF]">+80 XP</span>
                </div>
                <p className="text-[10px] text-[#8E8E93]">Interval recognition & melodic dictation</p>
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'JOURNALING' && (
          <motion.div
            key="JOURNALING"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0A0A0E] border border-[#1E1E26] rounded-2xl p-4 sm:p-6 space-y-4 font-mono shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FFFFFF] uppercase">
                <FileText className="w-4 h-4 text-[#FFFFFF]" /> MIND & JOURNAL LOGS
              </div>
              <span className="text-[10px] text-[#FFFFFF] bg-[#18181F] px-2 py-0.5 rounded border border-[#383848] font-bold">
                +50 XP
              </span>
            </div>
            <p className="text-xs text-[#8E8E93]">
              Record daily wins, tactical retrospective notes, and stoic energy audits.
            </p>

            <form onSubmit={handleSaveJournal} className="space-y-3">
              <textarea
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="What was the primary win today? Any friction points to engineer away?"
                className="w-full bg-[#050507] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-xl p-3.5 text-base sm:text-xs text-[#FFFFFF] placeholder-[#8E8E93] outline-none min-h-[100px] resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 min-h-[44px] rounded-xl bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 touch-manipulation cursor-pointer"
              >
                {journalSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> JOURNAL SAVED (+50 XP)!
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[2.5]" /> COMMIT JOURNAL ENTRY (+50 XP)
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {activeTab === 'GOALS MATRIX' && (
          <motion.div
            key="GOALS MATRIX"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0A0A0E] border border-[#1E1E26] rounded-2xl p-4 sm:p-6 space-y-4 font-mono shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FFFFFF] uppercase">
                <Target className="w-4 h-4 text-[#FFFFFF]" /> 4-YEAR DECOMPOSITION GOALS MATRIX
              </div>
              <span className="text-[10px] text-[#FFFFFF] bg-[#18181F] px-2 py-0.5 rounded border border-[#383848] font-bold">
                SYSTEM HORIZON
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-[#050507] border border-[#1E1E26] space-y-2">
                <span className="text-[10px] text-[#8E8E93] uppercase font-bold">[ YEAR 1 TARGET ]</span>
                <h4 className="text-sm font-bold text-[#FFFFFF]">Full-Stack Java & Microservices Core</h4>
                <p className="text-xs text-[#8E8E93]">Spring Boot, Kafka, Docker & Data Structures fluency</p>
                <div className="w-full bg-[#18181F] h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-[#FFFFFF] h-full w-[65%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#050507] border border-[#1E1E26] space-y-2">
                <span className="text-[10px] text-[#8E8E93] uppercase font-bold">[ YEAR 2 TARGET ]</span>
                <h4 className="text-sm font-bold text-[#FFFFFF]">Distributed Systems & High Frequency Cloud</h4>
                <p className="text-xs text-[#8E8E93]">Kubernetes, AWS Architecting, Event Streaming & Security</p>
                <div className="w-full bg-[#18181F] h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-[#FFFFFF] h-full w-[25%]" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

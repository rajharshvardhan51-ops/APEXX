'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LifeMetricsGrid from '@/components/character/LifeMetricsGrid';
import TitleRegistry from '@/components/character/TitleRegistry';
import SkillTree from '@/components/character/SkillTree';
import { User, Trophy, GitBranch, Zap, CheckCircle2 } from 'lucide-react';
import { useApexStore } from '@/store/useApexStore';
import PersonnelProfileCard from '@/components/character/PersonnelProfileCard';
import { playTerminalClick } from '@/lib/audioEngine';

type CharacterTab = 'SHEET' | 'SKILL_TREE' | 'ACHIEVEMENTS';

export default function CharacterPage() {
  const { equipTitle } = useApexStore();
  const [activeTab, setActiveTab] = useState<CharacterTab>('SHEET');

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-6 font-mono select-none">
      {/* OSHIMA HARDIMAN PERSONNEL ID CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PersonnelProfileCard />
      </motion.div>

      {/* Tab Navigation Bar - Smooth Horizontal Scrolling on Mobile */}
      <div className="flex items-center gap-2 border-b border-[#1E1E26] pb-2 overflow-x-auto no-scrollbar scroll-smooth -mx-2 px-2 sm:mx-0 sm:px-0">
        <button
          onClick={() => {
            playTerminalClick();
            setActiveTab('SHEET');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] shrink-0 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer active:scale-95 touch-manipulation ${
            activeTab === 'SHEET'
              ? 'bg-[#18181F] text-[#FFFFFF] border border-[#383848] shadow-[0_0_12px_rgba(255,255,255,0.1)]'
              : 'bg-[#0A0A0E] text-[#8E8E93] border border-[#1E1E26] hover:text-[#FFFFFF]'
          }`}
        >
          <User className="w-3.5 h-3.5 text-[#FFFFFF]" /> [CHARACTER SHEET]
        </button>

        <button
          onClick={() => {
            playTerminalClick();
            setActiveTab('SKILL_TREE');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] shrink-0 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer active:scale-95 touch-manipulation ${
            activeTab === 'SKILL_TREE'
              ? 'bg-[#18181F] text-[#FFFFFF] border border-[#383848] shadow-[0_0_12px_rgba(255,255,255,0.1)]'
              : 'bg-[#0A0A0E] text-[#8E8E93] border border-[#1E1E26] hover:text-[#FFFFFF]'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5 text-[#FFFFFF]" /> [RPG SKILL TREE]
        </button>

        <button
          onClick={() => {
            playTerminalClick();
            setActiveTab('ACHIEVEMENTS');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] shrink-0 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer active:scale-95 touch-manipulation ${
            activeTab === 'ACHIEVEMENTS'
              ? 'bg-[#18181F] text-[#FFFFFF] border border-[#383848] shadow-[0_0_12px_rgba(255,255,255,0.1)]'
              : 'bg-[#0A0A0E] text-[#8E8E93] border border-[#1E1E26] hover:text-[#FFFFFF]'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-[#FFFFFF]" /> [ACHIEVEMENTS]
        </button>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'SHEET' && (
          <motion.div
            key="SHEET"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5 sm:space-y-6"
          >
            {/* Life Metrics Grid */}
            <LifeMetricsGrid />

            {/* Equipable Titles Registry */}
            <TitleRegistry onEquipTitle={equipTitle} />
          </motion.div>
        )}

        {activeTab === 'SKILL_TREE' && (
          <motion.div
            key="SKILL_TREE"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SkillTree />
          </motion.div>
        )}

        {activeTab === 'ACHIEVEMENTS' && (
          <motion.div
            key="ACHIEVEMENTS"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0A0A0E] border border-[#1E1E26] rounded-2xl p-4 sm:p-6 space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FFFFFF] border-b border-[#1E1E26] pb-3 tracking-wider">
              <Trophy className="w-4 h-4 text-[#FFFFFF]" /> ACHIEVEMENTS & TROPHY SHOWCASE
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl bg-[#050507] border border-[#383848] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#FFFFFF]">100-HR DEEP WORK</span>
                  <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" />
                </div>
                <p className="text-[10px] text-[#8E8E93]">Logged over 100+ hours of focused programming sprints without distraction.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#050507] border border-[#383848] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#FFFFFF]">30-DAY ZERO-DAY DEFENDER</span>
                  <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" />
                </div>
                <p className="text-[10px] text-[#8E8E93]">Maintained active habit consistency without slipping for 30 straight days.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#050507] border border-[#1E1E26] opacity-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#8E8E93]">LEVEL 100 MONARCH</span>
                  <Zap className="w-4 h-4 text-[#8E8E93]" />
                </div>
                <p className="text-[10px] text-[#8E8E93]">Reach total level 100 across all 9 life metrics.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

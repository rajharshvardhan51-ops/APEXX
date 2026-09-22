'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LifeMetricsGrid from '@/components/character/LifeMetricsGrid';
import TitleRegistry from '@/components/character/TitleRegistry';
import SkillTree from '@/components/character/SkillTree';
import { User, Shield, Trophy, GitBranch, Zap, CheckCircle2 } from 'lucide-react';

import { useApexStore } from '@/store/useApexStore';

type FrameSeed = 'ROUND' | 'SEED' | 'CORE' | 'SHADOW' | 'OBSIDIAN' | 'VOLCANIC' | 'TITAN';
type CharacterTab = 'SHEET' | 'SKILL_TREE' | 'ACHIEVEMENTS';

const frameSeedStyles: Record<FrameSeed, string> = {
  ROUND: 'rounded-full border-2 border-[#FFFFFF] shadow-[0_0_18px_rgba(255,255,255,0.5)] bg-[#0A0A0E]',
  SEED: 'rounded-xl border-2 border-[#FFFFFF] shadow-[0_0_18px_rgba(255,255,255,0.4)] bg-[#0A0A0E]',
  CORE: 'rounded-2xl border-2 border-[#FFFFFF] shadow-[0_0_20px_rgba(255,255,255,0.5)] bg-[#0A0A0E]',
  SHADOW: 'rounded-xl border-2 border-[#FFFFFF] shadow-[0_0_16px_rgba(255,255,255,0.45)] bg-[#0A0A0E]',
  OBSIDIAN: 'rounded-xl border-2 border-[#FFFFFF] shadow-[0_0_22px_rgba(255,255,255,0.5)] bg-[#0A0A0E]',
  VOLCANIC: 'rounded-xl border-2 border-[#FFFFFF] shadow-[0_0_18px_rgba(255,255,255,0.4)] bg-[#0A0A0E]',
  TITAN: 'rounded-2xl border-2 border-[#FFFFFF] shadow-[0_0_25px_rgba(255,255,255,0.65)] bg-[#0A0A0E]',
};

export default function CharacterPage() {
  const {
    username,
    avatarUrl,
    level,
    currentXp,
    xpToNextLevel,
    currentTitle,
    equippedFrame,
    equipTitle,
    setEquippedFrame,
    categoryXp,
  } = useApexStore();

  const [activeTab, setActiveTab] = useState<CharacterTab>('SHEET');

  const rankBadge = level >= 40 ? 'S-RANK' : level >= 25 ? 'A-RANK' : level >= 10 ? 'B-RANK' : 'RECRUIT';
  const totalAccXp = Object.values(categoryXp || {}).reduce((acc, curr) => acc + curr, currentXp);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8 font-mono select-none">
      {/* Header Badge & Profile Avatar Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-4 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
          {/* Avatar Frame Seed Preview */}
          <div className={`w-20 h-20 bg-[#18181F] flex items-center justify-center transition-all duration-300 relative overflow-hidden shrink-0 ${frameSeedStyles[(equippedFrame as FrameSeed) || 'TITAN']}`}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={username || 'Operative'} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-[#FFFFFF]" />
            )}
            <span className="absolute -bottom-2 bg-[#FFFFFF] text-[#000000] border border-[#FFFFFF] text-[8px] font-extrabold px-2 py-0.5 rounded uppercase shadow-[0_0_12px_rgba(255,255,255,0.5)] z-10">
              {rankBadge}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl font-extrabold text-[#FFFFFF] tracking-tight">{username || 'OPERATIVE'}</h1>
              <span className="text-[10px] bg-[#18181F] text-[#E4E4E7] border border-[#383848] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                [{currentTitle || 'INITIATE'}]
              </span>
            </div>

            <p className="text-xs text-[#E4E4E7] font-bold tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#FFFFFF]" /> LEVEL {level} // {level >= 40 ? 'S-CLASS OPERATIVE MONARCH' : 'OPERATIVE MATRIX'}
            </p>

            <div className="text-[10px] text-[#8E8E93]">
              TOTAL ACCUMULATED XP: <span className="text-[#FFFFFF] font-bold">{totalAccXp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        {/* Frame Seed Selector Buttons */}
        <div className="flex flex-col space-y-1.5 text-center sm:text-right w-full md:w-auto">
          <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider font-semibold">AVATAR FRAME SEEDS</span>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5">
            {(['ROUND', 'SEED', 'CORE', 'SHADOW', 'OBSIDIAN', 'VOLCANIC', 'TITAN'] as FrameSeed[]).map((seed) => (
              <button
                key={seed}
                onClick={() => setEquippedFrame(seed)}
                className={`px-2.5 py-1.5 min-h-[34px] rounded text-[9px] font-bold transition-all cursor-pointer ${
                  equippedFrame === seed
                    ? 'bg-[#FFFFFF] text-[#000000] border border-[#FFFFFF] shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                    : 'bg-[#050507] text-[#8E8E93] border border-[#1E1E26] hover:text-[#FFFFFF] hover:border-[#383848]'
                }`}
              >
                [{seed}]
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[#1E1E26] pb-2 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          onClick={() => setActiveTab('SHEET')}
          className={`flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] shrink-0 rounded-lg text-xs font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'SHEET'
              ? 'bg-[#18181F] text-[#FFFFFF] border border-[#383848] shadow-[0_0_12px_rgba(255,255,255,0.1)]'
              : 'bg-[#0A0A0E] text-[#8E8E93] border border-[#1E1E26] hover:text-[#FFFFFF] hover:border-[#383848]'
          }`}
        >
          <User className="w-3.5 h-3.5 text-[#FFFFFF]" /> [CHARACTER SHEET]
        </button>

        <button
          onClick={() => setActiveTab('SKILL_TREE')}
          className={`flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] shrink-0 rounded-lg text-xs font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'SKILL_TREE'
              ? 'bg-[#18181F] text-[#FFFFFF] border border-[#383848] shadow-[0_0_12px_rgba(255,255,255,0.1)]'
              : 'bg-[#0A0A0E] text-[#8E8E93] border border-[#1E1E26] hover:text-[#FFFFFF] hover:border-[#383848]'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5 text-[#FFFFFF]" /> [RPG SKILL TREE]
        </button>

        <button
          onClick={() => setActiveTab('ACHIEVEMENTS')}
          className={`flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] shrink-0 rounded-lg text-xs font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'ACHIEVEMENTS'
              ? 'bg-[#18181F] text-[#FFFFFF] border border-[#383848] shadow-[0_0_12px_rgba(255,255,255,0.1)]'
              : 'bg-[#0A0A0E] text-[#8E8E93] border border-[#1E1E26] hover:text-[#FFFFFF] hover:border-[#383848]'
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
            className="space-y-6"
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
            className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-[#FFFFFF] border-b border-[#1E1E26] pb-3 tracking-wider">
              <Trophy className="w-4 h-4 text-[#FFFFFF]" /> ACHIEVEMENTS & TROPHY SHOWCASE
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#050507] border border-[#383848] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#FFFFFF]">100-HOUR DEEP WORK MASTER</span>
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

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Dumbbell,
  BookOpen,
  Heart,
  DollarSign,
  Brain,
  Users,
  Music,
  Globe,
  Zap,
  ArrowUp,
  LucideIcon,
} from 'lucide-react';

import { useApexStore } from '@/store/useApexStore';

export interface LifeMetric {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
  color: string;
}

const metricConfigs: LifeMetric[] = [
  { id: 'm-1', name: 'Engineering / Career', category: 'DEV', icon: Code, color: '#FFFFFF' },
  { id: 'm-2', name: 'Fitness & Physical', category: 'FITNESS', icon: Dumbbell, color: '#FFFFFF' },
  { id: 'm-3', name: 'Learning & Science', category: 'ACADEMICS', icon: BookOpen, color: '#E4E4E7' },
  { id: 'm-4', name: 'Health & Recovery', category: 'HEALTH', icon: Heart, color: '#FFFFFF' },
  { id: 'm-5', name: 'Finance & Assets', category: 'FINANCE', icon: DollarSign, color: '#E4E4E7' },
  { id: 'm-6', name: 'Mental Resilience', category: 'MIND', icon: Brain, color: '#FFFFFF' },
  { id: 'm-7', name: 'Relationships & Network', category: 'SOCIAL', icon: Users, color: '#E4E4E7' },
  { id: 'm-8', name: 'Music & Creative Arts', category: 'ARTS', icon: Music, color: '#FFFFFF' },
  { id: 'm-9', name: 'Languages & Linguistics', category: 'CULTURE', icon: Globe, color: '#E4E4E7' },
];

export const LifeMetricsGrid: React.FC = () => {
  const { categoryXp, addXp } = useApexStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metricConfigs.map((config, idx) => {
        const Icon = config.icon;
        const totalCategoryXp = categoryXp?.[config.category] || 0;
        const level = Math.max(1, Math.floor(totalCategoryXp / 1000) + 1);
        const currentXp = totalCategoryXp % 1000;
        const nextLevelXp = 1000;
        const xpPercentage = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));

        return (
          <motion.div
            key={config.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            className="bg-[#08080A] border border-[#1E1E26] hover:border-[#FFFFFF]/60 p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.8)] flex flex-col justify-between space-y-3 font-mono transition-all duration-200 group"
          >
            {/* Header: Icon & Category Level */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#000000] border border-[#1E1E26] shrink-0 text-[#FFFFFF]">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider">
                    {config.category}
                  </span>
                  <h3 className="text-xs font-bold text-[#FFFFFF] truncate max-w-[150px]">
                    {config.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#000000] px-2.5 py-1 rounded border border-[#1E1E26]">
                <Zap className="w-3 h-3 text-[#FFFFFF]" />
                <span className="text-xs font-bold text-[#FFFFFF]">LVL {level}</span>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#8E8E93]">PROGRESSION</span>
                <span className="text-[#FFFFFF] font-semibold">
                  {currentXp} / {nextLevelXp} XP ({xpPercentage}%)
                </span>
              </div>

              <div className="h-2 w-full bg-[#000000] rounded-full border border-[#1E1E26] overflow-hidden p-[1px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercentage}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#71717A] to-[#FFFFFF] shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                />
              </div>
            </div>

            {/* Level Up Trigger */}
            <div className="pt-2 flex items-center justify-between border-t border-[#1E1E26]/50 text-[10px]">
              <span className="text-[#8E8E93]">SKILL NODE STATUS</span>

              <span className="text-[#FFFFFF] font-semibold flex items-center gap-1">
                ACTIVE MATRIX
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LifeMetricsGrid;

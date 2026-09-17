'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Calendar, Zap } from 'lucide-react';

export interface HeatmapNode {
  date: string;
  level: 0 | 1 | 2 | 3; // 0: unlogged, 1: slip/low, 2: partial, 3: mastered
  xp: number;
  primaryQuest: string;
}

// Generate 52 weeks x 7 days dummy dataset for 364 days
const generateYearData = (): HeatmapNode[] => {
  const nodes: HeatmapNode[] = [];
  const today = new Date(2026, 8, 3); // Sept 3, 2026

  const sampleQuests = [
    'Execute 90-Min Deep Work Sprint on APEXX',
    'Complete 45-Min Physical Workout Protocol',
    'Solve 2 LeetCode Medium Algorithms',
    'Read 30 Pages of Architecture Documentation',
    'Rest & Active Recovery Routine',
  ];

  for (let i = 363; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Seed pseudo-random levels for realistic heatmap rendering
    const rand = Math.random();
    let level: 0 | 1 | 2 | 3 = 0;
    let xp = 0;

    if (rand > 0.15) {
      if (rand > 0.6) {
        level = 3; // Mastered
        xp = 600 + Math.floor(Math.random() * 300);
      } else if (rand > 0.35) {
        level = 2; // Partial
        xp = 300 + Math.floor(Math.random() * 200);
      } else {
        level = 1; // Low/Slip
        xp = 100 + Math.floor(Math.random() * 100);
      }
    }

    nodes.push({
      date: dateStr,
      level,
      xp,
      primaryQuest: sampleQuests[Math.floor(Math.random() * sampleQuests.length)],
    });
  }

  return nodes;
};

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const GrowthHeatmap: React.FC = () => {
  const [data] = useState<HeatmapNode[]>(generateYearData);
  const [hoveredNode, setHoveredNode] = useState<HeatmapNode | null>(null);

  const getCellColor = (level: HeatmapNode['level']) => {
    switch (level) {
      case 3:
        return 'bg-[#FFFFFF] shadow-[0_0_8px_rgba(255,255,255,0.4)] border-[#FFFFFF]';
      case 2:
        return 'bg-[#A1A1AA] border-[#A1A1AA]/60';
      case 1:
        return 'bg-[#52525B] border-[#52525B]/60';
      case 0:
      default:
        return 'bg-[#18181F] border-[#1E1E26] hover:border-[#383848]';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-4 font-mono select-none"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E1E26] pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#FFFFFF]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
            CHRONOLOGICAL GROWTH HEATMAP GRID (365 DAYS)
          </h2>
        </div>

        {/* Intensity Legend */}
        <div className="flex items-center gap-3 text-[10px] text-[#8E8E93]">
          <span>LESS</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#18181F] border border-[#1E1E26]" title="Unlogged Node" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#52525B] border border-[#52525B]" title="Low Score / Slip" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#A1A1AA] border border-[#A1A1AA]" title="Partial Consistency" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#FFFFFF] border border-[#FFFFFF] shadow-[0_0_6px_rgba(255,255,255,0.4)]" title="Mastered / High Growth" />
          </div>
          <span>MORE</span>
        </div>
      </div>

      {/* Month Headers */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[720px] flex flex-col space-y-2">
          <div className="grid grid-cols-12 text-[10px] text-[#8E8E93] font-bold text-center">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          {/* 52-Week Grid Grid Container */}
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 justify-between">
            {data.map((node, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`w-3 h-3 rounded-sm border cursor-pointer transition-transform hover:scale-125 ${getCellColor(
                  node.level
                )}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Tooltip Card */}
      <div className="min-h-[48px] bg-[#050507] border border-[#1E1E26] rounded-lg p-3 flex items-center justify-between text-xs">
        <AnimatePresence mode="wait">
          {hoveredNode ? (
            <motion.div
              key={hoveredNode.date}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#FFFFFF] font-bold">{hoveredNode.date}</span>
                <span className="text-[#8E8E93]">|</span>
                <span className="text-[#FFFFFF] truncate max-w-md">
                  TOP QUEST: <span className="font-semibold text-[#FFFFFF]">{hoveredNode.primaryQuest}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#FFFFFF] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-current" /> +{hoveredNode.xp} XP
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                    hoveredNode.level === 3
                      ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                      : hoveredNode.level === 2
                      ? 'bg-[#18181F] text-[#FFFFFF] border-[#383848]'
                      : hoveredNode.level === 1
                      ? 'bg-[#050507] text-[#8E8E93] border-[#1E1E26]'
                      : 'bg-[#050507] text-[#8E8E93] border-[#1E1E26]'
                  }`}
                >
                  {hoveredNode.level === 3
                    ? 'MASTERED'
                    : hoveredNode.level === 2
                    ? 'PARTIAL'
                    : hoveredNode.level === 1
                    ? 'SLIP SCORE'
                    : 'UNLOGGED'}
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 text-[#8E8E93] text-xs">
              <Activity className="w-4 h-4 text-[#FFFFFF]" /> HOVER OVER ANY MATRIX CELL TO INSPECT DAILY TELEMETRY
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GrowthHeatmap;

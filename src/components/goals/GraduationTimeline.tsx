'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  semesterRoadmap,
  calculateGraduationReadiness,
} from '@/lib/roadmapEngine';
import {
  CheckCircle2,
  Circle,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
} from 'lucide-react';

import { useApexStore } from '@/store/useApexStore';

interface GraduationTimelineProps {
  currentSemesterNumber?: number;
  engineeringXp?: number;
  onCompleteMilestone?: (itemXp: number) => void;
}

export const GraduationTimeline: React.FC<GraduationTimelineProps> = ({
  currentSemesterNumber = 1,
  onCompleteMilestone,
}) => {
  const {
    graduationCompletedMilestones,
    toggleGraduationMilestone,
    categoryXp,
  } = useApexStore();

  const [expandedSemesters, setExpandedSemesters] = useState<Record<string, boolean>>({
    'sem-1': true,
    'sem-2': false,
  });

  const completedItemIds = graduationCompletedMilestones || [];
  const engineeringXp = categoryXp?.DEV || 0;

  const toggleChecklist = (id: string, xpReward: number) => {
    toggleGraduationMilestone(id, xpReward);
    if (onCompleteMilestone) {
      onCompleteMilestone(xpReward);
    }
  };

  const toggleExpand = (semId: string) => {
    setExpandedSemesters((prev) => ({
      ...prev,
      [semId]: !prev[semId],
    }));
  };

  const readinessScore = calculateGraduationReadiness(completedItemIds, engineeringXp);
  const currentSemesterNode =
    semesterRoadmap.find((s) => s.semesterNumber === currentSemesterNumber) || semesterRoadmap[1];

  return (
    <div className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.8)] space-y-6 font-mono select-none">
      {/* Top Banner: Graduation Readiness Gauge & Current Phase Tracker */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E1E26] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#FFFFFF] font-bold tracking-widest uppercase">
            <GraduationCap className="w-4 h-4 text-[#FFFFFF]" /> 4-YEAR SUMMIT ROADMAP TELEMETRY
          </div>
          <h2 className="text-xl font-extrabold text-[#FFFFFF] font-sans">
            JAVA FULL-STACK GRADUATION TIMELINE
          </h2>
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-[10px] bg-[#18181F] text-[#FFFFFF] border border-[#383848] px-2.5 py-0.5 rounded font-bold uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#FFFFFF]" /> CURRENT PHASE: {currentSemesterNode.yearLabel} - SEMESTER {currentSemesterNode.semesterNumber}
            </span>
          </div>
        </div>

        {/* Overall Graduation Readiness % Gauge */}
        <div className="flex items-center gap-4 bg-[#050507] p-4 rounded-xl border border-[#1E1E26] shrink-0">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#1E1E26]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#FFFFFF]"
                strokeDasharray={`${readinessScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-[#FFFFFF]">
              {readinessScore}%
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider font-bold">
              OVERALL GRADUATION READINESS
            </span>
            <span className="text-xs font-bold text-[#FFFFFF] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FFFFFF]" /> TARGET: 100% SECURED
            </span>
            <span className="text-[10px] text-[#8E8E93]">
              {completedItemIds.length} / 32 MILESTONES MASTERED
            </span>
          </div>
        </div>
      </div>

      {/* Cybernetic Vertical Timeline Grid */}
      <div className="relative space-y-6 pt-2 before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[2px] before:bg-[#1E1E26]">
        {semesterRoadmap.map((node) => {
          const isCurrent = node.semesterNumber === currentSemesterNumber;
          const isPast = node.semesterNumber < currentSemesterNumber;

          const totalNodeItems = node.checklists.length;
          const completedNodeItems = node.checklists.filter((c) =>
            completedItemIds.includes(c.id)
          ).length;
          const nodeProgressPct = Math.round((completedNodeItems / totalNodeItems) * 100);

          const isExpanded = expandedSemesters[node.id] ?? isCurrent;

          return (
            <div key={node.id} className="relative pl-10">
              {/* Timeline Node Point Marker */}
              <div
                className={`absolute left-2.5 top-3 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#FFFFFF] border-[#FFFFFF] shadow-[0_0_12px_rgba(255,255,255,0.4)] scale-125'
                    : isPast || nodeProgressPct === 100
                    ? 'bg-[#8E8E93] border-[#8E8E93]'
                    : 'bg-[#050507] border-[#1E1E26]'
                }`}
              />

              {/* Semester Node Card */}
              <div
                className={`p-5 rounded-xl border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-[#18181F] border-[#FFFFFF] shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                    : nodeProgressPct === 100
                    ? 'bg-[#18181F]/50 border-[#383848]'
                    : 'bg-[#050507] border-[#1E1E26]'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
                        [{node.yearLabel} . SEMESTER {node.semesterNumber}]
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#FFFFFF] text-[#000000] uppercase">
                          ACTIVE PHASE
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
                      {node.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Node Progress Bar */}
                    <div className="flex flex-col text-right space-y-1 min-w-[120px]">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#8E8E93]">PROGRESS</span>
                        <span className="text-[#FFFFFF] font-bold">{nodeProgressPct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#050507] rounded-full border border-[#1E1E26] overflow-hidden">
                        <div
                          className="h-full bg-[#FFFFFF] transition-all duration-300"
                          style={{ width: `${nodeProgressPct}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(node.id)}
                      className="p-2 rounded bg-[#050507] hover:bg-[#18181F] text-[#8E8E93] hover:text-[#FFFFFF] border border-[#1E1E26] hover:border-[#383848] transition-colors"
                      aria-label="Toggle Semester Details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#8E8E93] mt-2 leading-relaxed">
                  {node.description}
                </p>

                {/* Expandable Checklist Items */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pt-4 mt-4 border-t border-[#1E1E26] space-y-2.5 overflow-hidden"
                    >
                      <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">
                        SEMESTER MILESTONE DIRECTIVES CHECKLIST:
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {node.checklists.map((item) => {
                          const isDone = completedItemIds.includes(item.id);

                          return (
                            <button
                              key={item.id}
                              onClick={() => toggleChecklist(item.id, item.xpReward)}
                              className={`p-3 rounded-lg border text-left flex items-start justify-between gap-3 transition-all ${
                                isDone
                                  ? 'bg-[#18181F] border-[#FFFFFF] text-[#FFFFFF]'
                                  : 'bg-[#050507] border-[#1E1E26] hover:border-[#383848] text-[#8E8E93]'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-[#FFFFFF] shrink-0 mt-0.5" />
                                ) : (
                                  <Circle className="w-4 h-4 text-[#8E8E93] shrink-0 mt-0.5" />
                                )}
                                <span className={`text-xs ${isDone ? 'line-through text-[#FFFFFF]' : 'text-[#FFFFFF]'}`}>
                                  {item.label}
                                </span>
                              </div>

                              <span className="text-[10px] font-bold text-[#FFFFFF] shrink-0 flex items-center gap-0.5">
                                <Zap className="w-3 h-3 fill-current text-[#FFFFFF]" /> +{item.xpReward} XP
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GraduationTimeline;

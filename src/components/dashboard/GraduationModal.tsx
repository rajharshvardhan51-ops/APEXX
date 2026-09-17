'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  semesterRoadmap,
  SemesterNode,
} from '@/lib/roadmapEngine';
import { useApexStore } from '@/store/useApexStore';
import {
  GraduationCap,
  X,
  CheckCircle2,
  Circle,
  Zap,
  ChevronDown,
  ChevronUp,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';

interface GraduationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GraduationModal: React.FC<GraduationModalProps> = ({ isOpen, onClose }) => {
  const completionIndex = useApexStore((state) => state.completionIndex);
  const graduationCompletedMilestones = useApexStore(
    (state) => state.graduationCompletedMilestones || []
  );
  const toggleGraduationMilestone = useApexStore(
    (state) => state.toggleGraduationMilestone
  );

  const [expandedSemesters, setExpandedSemesters] = useState<Record<string, boolean>>({
    'sem-1': true,
    'sem-2': true,
    'sem-3': true,
  });

  const toggleExpand = (semId: string) => {
    setExpandedSemesters((prev) => ({
      ...prev,
      [semId]: !prev[semId],
    }));
  };

  // Determine Node State: COMPLETED | CURRENT_IN_PROGRESS | LOCKED
  const getNodeState = (node: SemesterNode) => {
    const totalItems = node.checklists.length;
    const completedItems = node.checklists.filter((c) =>
      graduationCompletedMilestones.includes(c.id)
    ).length;

    if (completedItems === totalItems && totalItems > 0) {
      return 'COMPLETED';
    } else if (completedItems > 0 || node.semesterNumber === 2) {
      return 'CURRENT_IN_PROGRESS';
    } else {
      return 'LOCKED';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050507]/90 backdrop-blur-md select-none"
        >
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="bg-[#08080C] border border-[#1F2028] hover:border-[#333545] rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.95)] relative"
          >
            {/* Header Telemetry Bar */}
            <div className="p-6 border-b border-[#1E1E26] bg-[#050507] flex flex-col space-y-4 relative">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-1.5 rounded-lg bg-[#0A0A0E] text-[#8E8E93] hover:text-[#FFFFFF] border border-[#1E1E26] hover:border-[#383848] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs text-[#FFFFFF] font-bold tracking-widest uppercase">
                  <span className="hud-tag border-[#383848] text-[#FFFFFF] flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#FFFFFF]" />
                    [ MACRO TARGET HORIZON ]
                  </span>
                  <span className="hud-tag text-[#8E8E93]">[ 4-YEAR ASCENT PROTOCOL ]</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#FFFFFF] font-sans tracking-tight">
                      JAVA FULL-STACK SOFTWARE ENGINEER
                    </h2>
                    <p className="font-mono text-xs text-[#8E8E93] mt-1">
                      Semester 2/8 Active — <span className="text-[#FFFFFF] font-bold">{completionIndex.toFixed(1)}%</span> Horizon Elevation Completed
                    </p>
                  </div>

                  {/* Global Trajectory Progress Bar */}
                  <div className="flex flex-col space-y-1.5 min-w-[200px] bg-[#0A0A0E] p-3 rounded-lg border border-[#1E1E26]">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-[#8E8E93] font-bold">[ TRAJECTORY ]</span>
                      <span className="text-[#FFFFFF] font-bold">{completionIndex.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#050507] rounded-sm border border-[#1E1E26] overflow-hidden p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionIndex}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-[#FFFFFF] rounded-sm shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable 8-Semester Timeline Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#0A0A0E]">
              <div className="relative space-y-6 before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[2px] before:bg-[#1E1E26]">
                {semesterRoadmap.map((node) => {
                  const nodeState = getNodeState(node);
                  const isExpanded = expandedSemesters[node.id] ?? (nodeState === 'CURRENT_IN_PROGRESS');

                  const totalItems = node.checklists.length;
                  const completedItems = node.checklists.filter((c) =>
                    graduationCompletedMilestones.includes(c.id)
                  ).length;
                  const nodeProgressPct = Math.round((completedItems / totalItems) * 100);

                  return (
                    <div key={node.id} className="relative pl-10">
                      {/* Timeline Node State Marker */}
                      <div
                        className={`absolute left-2.5 top-4 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                          nodeState === 'COMPLETED'
                            ? 'bg-[#8E8E93] border-[#8E8E93]'
                            : nodeState === 'CURRENT_IN_PROGRESS'
                            ? 'bg-[#FFFFFF] border-[#FFFFFF] shadow-[0_0_14px_rgba(255,255,255,0.8)] animate-pulse scale-110'
                            : 'bg-[#050507] border-[#1E1E26]'
                        }`}
                      />

                      {/* Semester Node Card with State Machine Styling */}
                      <div
                        className={`p-5 rounded-xl border transition-all duration-200 ${
                          nodeState === 'COMPLETED'
                            ? 'bg-[#18181F]/60 border-[#383848]'
                            : nodeState === 'CURRENT_IN_PROGRESS'
                            ? 'bg-[#050507] border-[#FFFFFF] shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                            : 'bg-[#050507] border-[#1E1E26] opacity-65'
                        }`}
                      >
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
                                [{node.yearLabel} . SEMESTER {node.semesterNumber}]
                              </span>

                              {nodeState === 'COMPLETED' && (
                                <span className="hud-tag border-[#383848] text-[#FFFFFF] font-bold flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-[#FFFFFF]" /> [ COMPLETED ]
                                </span>
                              )}

                              {nodeState === 'CURRENT_IN_PROGRESS' && (
                                <span className="hud-tag border-[#FFFFFF] text-[#FFFFFF] font-bold animate-pulse">
                                  [ ACTIVE PHASE ]
                                </span>
                              )}

                              {nodeState === 'LOCKED' && (
                                <span className="hud-tag text-[#8E8E93] flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-[#8E8E93]" /> [ LOCKED ]
                                </span>
                              )}
                            </div>

                            <h3 className="text-base font-bold text-[#FFFFFF] flex items-center gap-2 font-sans">
                              Sem {node.semesterNumber}: {node.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Node Progress & XP Requirement */}
                            <div className="flex flex-col text-right space-y-1 min-w-[130px] font-mono">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-[#8E8E93]">PROGRESS</span>
                                <span className="text-[#FFFFFF] font-bold">{nodeProgressPct}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#050507] rounded-sm border border-[#1E1E26] overflow-hidden">
                                <div
                                  className="h-full bg-[#FFFFFF] transition-all duration-300"
                                  style={{ width: `${nodeProgressPct}%` }}
                                />
                              </div>
                              <span className="text-[9px] text-[#8E8E93]">REQ: {node.xpRequired} XP</span>
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

                        <p className="font-mono text-xs text-[#8E8E93] mt-2 leading-relaxed">
                          {node.description}
                        </p>

                        {/* Expandable Checkpoint Objectives */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.15 }}
                              className="pt-4 mt-4 border-t border-[#1E1E26] space-y-2.5 overflow-hidden"
                            >
                              <span className="font-mono text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">
                                CORE COMPETENCY CHECKPOINTS:
                              </span>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {node.checklists.map((item) => {
                                  const isDone = graduationCompletedMilestones.includes(item.id);

                                  return (
                                    <button
                                      key={item.id}
                                      onClick={() => toggleGraduationMilestone(item.id, item.xpReward)}
                                      className={`p-3 rounded-lg border text-left flex items-start justify-between gap-3 font-mono transition-all duration-150 ${
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
                                        <span className={`text-xs ${isDone ? 'line-through text-[#8E8E93]' : 'text-[#FFFFFF]'}`}>
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

            {/* Footer Bar */}
            <div className="p-4 border-t border-[#1E1E26] bg-[#050507] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2 text-[#8E8E93]">
                <Layers className="w-4 h-4 text-[#FFFFFF]" />
                <span>3D TOPOLOGY AUTO-SYNC: ENGAGED</span>
              </div>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-[#0A0A0E] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#1E1E26] hover:border-[#FFFFFF] font-bold transition-colors"
              >
                CLOSE HORIZON
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GraduationModal;

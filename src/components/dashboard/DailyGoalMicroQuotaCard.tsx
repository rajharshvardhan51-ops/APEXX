'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Clock, Zap, ArrowRight, Compass, Edit3 } from 'lucide-react';
import { useApexStore } from '@/store/useApexStore';
import { generateDailyQuotaForGoal } from '@/lib/targetQuotaEngine';
import UserGoalSetupModal from '@/components/goals/UserGoalSetupModal';

export const DailyGoalMicroQuotaCard: React.FC = () => {
  const { macroAim, level, currentXp, completedQuestIds, completeQuest, addXp } = useApexStore();
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const quota = generateDailyQuotaForGoal(macroAim, level);

  // Check how many quota tasks have been executed today
  const completedTaskCount = quota.tasks.filter((t) => completedQuestIds.includes(t.id)).length;
  const totalTasks = quota.tasks.length;
  const progressPercent = Math.min(100, Math.round((completedTaskCount / totalTasks) * 100));

  const completedXp = quota.tasks
    .filter((t) => completedQuestIds.includes(t.id))
    .reduce((acc, t) => acc + t.xpReward, 0);

  const remainingMins = quota.tasks
    .filter((t) => !completedQuestIds.includes(t.id))
    .reduce((acc, t) => acc + t.durationMins, 0);

  const handleExecuteTask = (taskId: string, xpReward: number) => {
    if (!completedQuestIds.includes(taskId)) {
      completeQuest(taskId, xpReward, 'DEV');
      addXp(xpReward, 'DEV');
    }
  };

  return (
    <>
      <div className="hud-card p-4 sm:p-5 space-y-4 font-mono select-none border border-[#383848] shadow-[0_0_20px_rgba(255,255,255,0.05)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E1E26]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#000000] border border-[#383848] text-[#FFFFFF] shadow-glow-white">
              <Target className="w-5 h-5 text-[#FFFFFF] animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] text-[#8E8E93] uppercase font-bold tracking-widest flex items-center gap-1">
                <span>[ DAILY GOAL QUOTA BREAKDOWN ]</span>
                <span className="text-[#FFFFFF] bg-[#18181F] px-1.5 py-0.5 rounded border border-[#27272A]">
                  {quota.targetHorizonYears}-YEAR TARGET
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-[#FFFFFF] text-glow tracking-wide flex items-center gap-2">
                GOAL: {quota.goalTitle.toUpperCase()}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#000000] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#1E1E26] text-xs font-bold transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> CHANGE GOAL
          </button>
        </div>

        {/* Quota Telemetry Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#000000] border border-[#1E1E26] space-y-1">
            <span className="text-[9px] text-[#8E8E93] uppercase font-bold block">REQUIRED TODAY</span>
            <span className="font-extrabold text-sm text-[#FFFFFF]">{quota.dailyRequiredMins} MINS / {quota.dailyRequiredXp} XP</span>
          </div>

          <div className="p-3 rounded-lg bg-[#000000] border border-[#1E1E26] space-y-1">
            <span className="text-[9px] text-[#8E8E93] uppercase font-bold block">COMPLETED TODAY</span>
            <span className="font-extrabold text-sm text-[#FFFFFF]">{completedXp} / {quota.dailyRequiredXp} XP ({progressPercent}%)</span>
          </div>

          <div className="p-3 rounded-lg bg-[#000000] border border-[#1E1E26] space-y-1">
            <span className="text-[9px] text-[#8E8E93] uppercase font-bold block">WORK REMAINING TODAY</span>
            <span className={`font-extrabold text-sm ${remainingMins === 0 ? 'text-[#FFFFFF]' : 'text-[#E4E4E7]'}`}>
              {remainingMins === 0 ? 'GOAL MET TODAY! 🎉' : `${remainingMins} MINS REMAINING`}
            </span>
          </div>
        </div>

        {/* Today's Quota Progress Track */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-[#8E8E93]">
            <span>TODAY&apos;S WORK QUOTA PROGRESS</span>
            <span className="text-[#FFFFFF]">{progressPercent}% EXECUTED</span>
          </div>
          <div className="h-2 w-full bg-[#000000] rounded-sm overflow-hidden p-[1px] border border-[#1E1E26]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-[#71717A] to-[#FFFFFF] shadow-[0_0_10px_#FFFFFF]"
            />
          </div>
        </div>

        {/* Specific Micro-Tasks Required TODAY */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#1E1E26]">
            <Compass className="w-3.5 h-3.5 text-[#FFFFFF]" /> SPECIFIC WORK YOU NEED TO DO TODAY:
          </h3>

          <div className="space-y-2">
            {quota.tasks.map((task) => {
              const isDone = completedQuestIds.includes(task.id);

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                    isDone
                      ? 'bg-[#18181F] border-[#383848] opacity-80'
                      : 'bg-[#000000] border-[#1E1E26] hover:border-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleExecuteTask(task.id, task.xpReward)}
                      disabled={isDone}
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                        isDone
                          ? 'bg-[#FFFFFF] border-[#FFFFFF] text-[#000000]'
                          : 'border-[#383848] hover:border-[#FFFFFF] text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>

                    <div>
                      <span className={`font-bold ${isDone ? 'line-through text-[#8E8E93]' : 'text-[#FFFFFF]'}`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-[#8E8E93]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#FFFFFF]" /> {task.durationMins} MINS
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-[#FFFFFF]" /> +{task.xpReward} XP
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isDone && (
                    <button
                      onClick={() => handleExecuteTask(task.id, task.xpReward)}
                      className="px-3 py-1.5 rounded bg-[#18181F] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#383848] text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 self-end sm:self-center"
                    >
                      <span>COMPLETE TASK</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Goal Setup Modal */}
      <UserGoalSetupModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} />
    </>
  );
};

export default DailyGoalMicroQuotaCard;

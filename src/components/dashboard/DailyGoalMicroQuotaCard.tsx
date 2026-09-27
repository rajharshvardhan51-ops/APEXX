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
      <div className="bg-[#0B0C12] border border-[#1C1E2A] rounded-2xl p-5 sm:p-6 space-y-5 select-none shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1C1E2A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#12141F] border border-[#232634] text-[#FFFFFF]">
              <Target className="w-5 h-5 text-[#FFFFFF] animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-[#94949E] font-sans font-medium flex items-center gap-2">
                <span>Daily Target Quota</span>
                <span className="text-[#FFFFFF] bg-[#181A26] px-2 py-0.5 rounded-full border border-[#232634] font-mono text-[10px]">
                  {quota.targetHorizonYears}-Year Target
                </span>
              </div>
              <h2 className="text-base font-extrabold text-[#FFFFFF] font-sans tracking-tight mt-0.5">
                Goal: {quota.goalTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#12141F] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#232634] text-xs font-semibold transition-all cursor-pointer min-h-[40px] active:scale-95"
          >
            <Edit3 className="w-4 h-4" /> Change Goal
          </button>
        </div>

        {/* Quota Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
          <div className="p-3.5 rounded-xl bg-[#06070B] border border-[#1C1E2A] space-y-1">
            <span className="text-[10px] text-[#94949E] uppercase font-medium block">Required Today</span>
            <span className="font-bold text-sm text-[#FFFFFF] font-mono">{quota.dailyRequiredMins} mins / {quota.dailyRequiredXp} XP</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#06070B] border border-[#1C1E2A] space-y-1">
            <span className="text-[10px] text-[#94949E] uppercase font-medium block">Completed Today</span>
            <span className="font-bold text-sm text-[#FFFFFF] font-mono">{completedXp} / {quota.dailyRequiredXp} XP ({progressPercent}%)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#06070B] border border-[#1C1E2A] space-y-1">
            <span className="text-[10px] text-[#94949E] uppercase font-medium block">Work Remaining Today</span>
            <span className={`font-bold text-sm ${remainingMins === 0 ? 'text-[#FFFFFF]' : 'text-[#E4E4E7]'}`}>
              {remainingMins === 0 ? 'Goal Met Today! 🎉' : `${remainingMins} mins remaining`}
            </span>
          </div>
        </div>

        {/* Today's Quota Progress Track */}
        <div className="space-y-1.5 font-sans">
          <div className="flex justify-between text-xs font-medium text-[#94949E]">
            <span>Today&apos;s Quota Progress</span>
            <span className="text-[#FFFFFF] font-mono font-bold">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full bg-[#06070B] rounded-full overflow-hidden p-[1px] border border-[#1C1E2A]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-[#717180] to-[#FFFFFF] rounded-full shadow-[0_0_10px_#FFFFFF]"
            />
          </div>
        </div>

        {/* Specific Micro-Tasks Required TODAY */}
        <div className="space-y-3 font-sans">
          <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-2 pb-1 border-b border-[#1C1E2A]">
            <Compass className="w-4 h-4 text-[#FFFFFF]" /> Specific Work Needed Today:
          </h3>

          <div className="space-y-2.5">
            {quota.tasks.map((task) => {
              const isDone = completedQuestIds.includes(task.id);

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    isDone
                      ? 'bg-[#08090E]/60 border-[#1C1E2A] opacity-75'
                      : 'bg-[#06070B] border-[#1C1E2A] hover:border-[#383C52]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleExecuteTask(task.id, task.xpReward)}
                      disabled={isDone}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all active:scale-90 ${
                        isDone
                          ? 'bg-[#FFFFFF] border-[#FFFFFF] text-[#000000]'
                          : 'border-[#232634] hover:border-[#FFFFFF] text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div>
                      <span className={`font-semibold text-sm ${isDone ? 'line-through text-[#717180]' : 'text-[#FFFFFF]'}`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2.5 text-xs text-[#94949E] mt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-[#FFFFFF]" /> {task.durationMins} mins
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Zap className="w-3.5 h-3.5 text-[#FFFFFF]" /> +{task.xpReward} XP
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isDone && (
                    <button
                      onClick={() => handleExecuteTask(task.id, task.xpReward)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 min-h-[42px] active:scale-95 shadow-sm"
                    >
                      <span>Complete Task</span>
                      <ArrowRight className="w-4 h-4" />
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

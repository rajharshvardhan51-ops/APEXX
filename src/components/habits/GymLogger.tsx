'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Plus, Trash2, Sparkles, Cpu, Clock, Zap } from 'lucide-react';
import XpNotificationFloat from './XpNotificationFloat';

export interface ExerciseSet {
  id: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  durationMins: number;
  timestamp: string;
}

interface GymLoggerProps {
  onLogSet?: (set: ExerciseSet) => void;
}

const commonExercises = [
  'Barbell Bench Press',
  'Incline Dumbbell Press',
  'Weighted Pull-Ups',
  'Barbell Back Squat',
  'Romanian Deadlift',
  'Overhead Press (OHP)',
  'Cable Lat Pulldown',
  'Dumbbell Bicep Curls',
];

export const GymLogger: React.FC<GymLoggerProps> = ({ onLogSet }) => {
  const [loggedSets, setLoggedSets] = useState<ExerciseSet[]>([
    {
      id: 'set-1',
      exerciseName: 'Barbell Bench Press',
      weightKg: 85,
      reps: 8,
      durationMins: 3,
      timestamp: '08:15 AM',
    },
    {
      id: 'set-2',
      exerciseName: 'Incline Dumbbell Press',
      weightKg: 32,
      reps: 10,
      durationMins: 4,
      timestamp: '08:22 AM',
    },
  ]);

  // Form State
  const [exerciseName, setExerciseName] = useState('');
  const [weightKg, setWeightKg] = useState<string>('80');
  const [reps, setReps] = useState<string>('10');
  const [durationMins, setDurationMins] = useState<string>('3');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Micro-interaction notification state
  const [floatXp, setFloatXp] = useState<number | null>(null);
  const [floatId, setFloatId] = useState<number>(0);

  const handleSubmitSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseName.trim()) return;

    const newSet: ExerciseSet = {
      id: `set-${Date.now()}`,
      exerciseName: exerciseName.trim(),
      weightKg: parseFloat(weightKg) || 0,
      reps: parseInt(reps, 10) || 0,
      durationMins: parseInt(durationMins, 10) || 1,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };

    setLoggedSets((prev) => [newSet, ...prev]);

    if (onLogSet) {
      onLogSet(newSet);
    }

    // Trigger Floating XP micro-interaction
    setFloatXp(60);
    setFloatId(Date.now());
    setTimeout(() => setFloatXp(null), 1400);

    // Reset Form
    setExerciseName('');
    setShowSuggestions(false);
  };

  const handleDeleteSet = (id: string) => {
    setLoggedSets((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
      {/* Floating XP Badge Micro-interaction */}
      <XpNotificationFloat xp={floatXp} id={floatId} />

      {/* Left Column: Log Exercise Set Form */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-4 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#FFFFFF]" />
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-[#FFFFFF]">
                LOG EXERCISE SET
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#FFFFFF] bg-[#18181F] px-2 py-0.5 rounded border border-[#383848] font-bold">
              +60 XP / SET
            </span>
          </div>

          <form onSubmit={handleSubmitSet} className="space-y-4">
            {/* Exercise Name Autocomplete Input */}
            <div className="space-y-1.5 relative">
              <label className="font-mono text-[11px] text-[#8E8E93] uppercase tracking-wider block">
                EXERCISE NAME
              </label>
              <input
                type="text"
                value={exerciseName}
                onChange={(e) => {
                  setExerciseName(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="e.g. Barbell Bench Press"
                className="w-full bg-[#050507] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-lg px-3.5 py-2.5 font-mono text-xs text-[#FFFFFF] placeholder-[#8E8E93] outline-none transition-colors"
                required
              />

              {/* Autocomplete Dropdown Suggestions */}
              {showSuggestions && exerciseName.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-[#0A0A0E] border border-[#1E1E26] rounded-lg shadow-xl max-h-40 overflow-y-auto py-1">
                  {commonExercises
                    .filter((ex) => ex.toLowerCase().includes(exerciseName.toLowerCase()))
                    .map((ex) => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => {
                          setExerciseName(ex);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-1.5 font-mono text-xs text-[#FFFFFF] hover:bg-[#18181F] hover:text-[#FFFFFF] transition-colors"
                      >
                        {ex}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Weight, Reps, Duration Inputs Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#8E8E93] uppercase tracking-wider block">
                  WEIGHT (KG)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full bg-[#050507] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-lg px-3 py-2 font-mono text-xs text-[#FFFFFF] outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#8E8E93] uppercase tracking-wider block">
                  REPS
                </label>
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="w-full bg-[#050507] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-lg px-3 py-2 font-mono text-xs text-[#FFFFFF] outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#8E8E93] uppercase tracking-wider block">
                  DURATION (MINS)
                </label>
                <input
                  type="number"
                  value={durationMins}
                  onChange={(e) => setDurationMins(e.target.value)}
                  className="w-full bg-[#050507] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-lg px-3 py-2 font-mono text-xs text-[#FFFFFF] outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              <Plus className="w-4 h-4" /> LOG EXERCISE SET (+60 XP)
            </button>
          </form>
        </div>
      </motion.div>

      {/* Middle Column: Today's Workout Sets List & AI Suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-4 flex flex-col justify-between"
      >
        {/* Logged Sets Stream */}
        <div className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-3">
          <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3">
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-[#FFFFFF]">
              TODAY&apos;S WORKOUT SETS
            </h2>
            <span className="font-mono text-[10px] text-[#FFFFFF] font-bold">
              {loggedSets.length} SETS LOGGED
            </span>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            <AnimatePresence>
              {loggedSets.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 text-center font-mono text-xs text-[#8E8E93] space-y-1"
                >
                  <p className="text-[#FFFFFF]">No exercises logged today.</p>
                  <p className="text-[10px]">Initiate your sets to secure XP gains.</p>
                </motion.div>
              ) : (
                loggedSets.map((set) => (
                  <motion.div
                    key={set.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#050507] border border-[#1E1E26] font-mono text-xs"
                  >
                    <div className="flex flex-col space-y-0.5">
                      <span className="font-bold text-[#FFFFFF]">{set.exerciseName}</span>
                      <span className="text-[10px] text-[#8E8E93] flex items-center gap-2">
                        <span>{set.weightKg} KG × {set.reps} REPS</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#FFFFFF]" /> {set.durationMins} MINS
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#FFFFFF] text-[11px] flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" /> +60 XP
                      </span>
                      <button
                        onClick={() => handleDeleteSet(set.id)}
                        className="text-[#8E8E93] hover:text-[#FFFFFF] transition-colors"
                        aria-label="Delete set"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* AI Workout Suggestion HUD Box */}
        <div className="bg-[#0A0A0E] border border-[#383848] rounded-xl p-4 shadow-[0_0_15px_rgba(255,255,255,0.1)] space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#FFFFFF]">
            <Cpu className="w-4 h-4 text-[#FFFFFF]" /> AI WORKOUT SUGGESTION // NEURAL ADVICE
          </div>
          <p className="font-mono text-xs text-[#8E8E93] leading-relaxed">
            Based on your recent progressive overload trends, prioritize <span className="text-[#FFFFFF] font-semibold">Incline DB Press</span> and <span className="text-[#FFFFFF] font-semibold">Weighted Pull-Ups</span> today to maximize hypertrophy XP bonuses.
          </p>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#FFFFFF] pt-1">
            <Sparkles className="w-3 h-3 text-[#FFFFFF]" /> RECOMMENDATION ACCURACY: 98.4%
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GymLogger;

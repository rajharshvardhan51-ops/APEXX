'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Save, ShieldCheck } from 'lucide-react';
import XpNotificationFloat from './XpNotificationFloat';

interface MetricsMatrixProps {
  onSaveMetrics?: (metrics: BodyMetrics) => void;
}

export interface BodyMetrics {
  weightKg: number;
  heightCm: number;
  bmi: number;
  chestCm: number;
  waistCm: number;
  armsCm: number;
}

export const MetricsMatrix: React.FC<MetricsMatrixProps> = ({ onSaveMetrics }) => {
  const [weightKg, setWeightKg] = useState<string>('78.5');
  const [heightCm, setHeightCm] = useState<string>('180');
  const [chestCm, setChestCm] = useState<string>('104');
  const [waistCm, setWaistCm] = useState<string>('79');
  const [armsCm, setArmsCm] = useState<string>('39');

  const [floatXp, setFloatXp] = useState<number | null>(null);
  const [floatId, setFloatId] = useState<number>(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auto-calculated BMI
  const weightNum = parseFloat(weightKg) || 0;
  const heightM = (parseFloat(heightCm) || 180) / 100;
  const bmiCalculated = heightM > 0 ? Number((weightNum / (heightM * heightM)).toFixed(1)) : 24.2;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const metrics: BodyMetrics = {
      weightKg: weightNum,
      heightCm: parseFloat(heightCm) || 180,
      bmi: bmiCalculated,
      chestCm: parseFloat(chestCm) || 0,
      waistCm: parseFloat(waistCm) || 0,
      armsCm: parseFloat(armsCm) || 0,
    };

    if (onSaveMetrics) {
      onSaveMetrics(metrics);
    }

    // Trigger Floating XP micro-interaction
    setFloatXp(40);
    setFloatId(Date.now());
    setTimeout(() => setFloatXp(null), 1400);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-4 relative"
    >
      <XpNotificationFloat xp={floatXp} id={floatId} />

      <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3 mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#FFFFFF]" />
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-[#FFFFFF]">
            BODY METRICS MATRIX
          </h2>
        </div>
        <span className="font-mono text-[10px] text-[#FFFFFF] bg-[#18181F] px-2 py-0.5 rounded border border-[#383848] font-bold">
          +40 XP
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-3.5 font-mono">
        {/* Weight & Height */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] text-[#8E8E93] uppercase tracking-wider block">
              BODY WEIGHT (KG)
            </label>
            <input
              type="number"
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full bg-[#050507] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#8E8E93] uppercase tracking-wider block">
              HEIGHT (CM)
            </label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full bg-[#050507] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
              required
            />
          </div>
        </div>

        {/* Calculated BMI Badge */}
        <div className="p-3 rounded-lg bg-[#050507] border border-[#1E1E26] flex items-center justify-between">
          <span className="text-[11px] text-[#8E8E93]">CALCULATED BMI INDEX:</span>
          <span className="text-xs font-bold text-[#FFFFFF] bg-[#18181F] px-2 py-0.5 rounded border border-[#383848]">
            {bmiCalculated} (NORMAL RANGE)
          </span>
        </div>

        {/* Girth Circumference Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] text-[#8E8E93] uppercase tracking-wider block">
              CHEST (CM)
            </label>
            <input
              type="number"
              step="0.5"
              value={chestCm}
              onChange={(e) => setChestCm(e.target.value)}
              className="w-full bg-[#050507] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-lg px-3 py-2.5 text-xs text-[#FFFFFF] outline-none min-h-[42px]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#8E8E93] uppercase tracking-wider block">
              WAIST (CM)
            </label>
            <input
              type="number"
              step="0.5"
              value={waistCm}
              onChange={(e) => setWaistCm(e.target.value)}
              className="w-full bg-[#050507] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-lg px-3 py-2.5 text-xs text-[#FFFFFF] outline-none min-h-[42px]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#8E8E93] uppercase tracking-wider block">
              ARMS (CM)
            </label>
            <input
              type="number"
              step="0.5"
              value={armsCm}
              onChange={(e) => setArmsCm(e.target.value)}
              className="w-full bg-[#050507] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-lg px-3 py-2.5 text-xs text-[#FFFFFF] outline-none min-h-[42px]"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-3 min-h-[44px] cursor-pointer rounded-lg border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${
            savedSuccess
              ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] shadow-[0_0_15px_rgba(255,255,255,0.4)]'
              : 'bg-[#18181F] hover:bg-[#383848] border-[#383848] text-[#FFFFFF] shadow-[0_0_12px_rgba(255,255,255,0.15)]'
          }`}
        >
          {savedSuccess ? (
            <>
              <ShieldCheck className="w-4 h-4" /> MEASUREMENTS RECORDED!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> SAVE MEASUREMENTS (+40 XP)
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default MetricsMatrix;

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Compass, Sparkles, Check, X, ShieldAlert, Edit3 } from 'lucide-react';
import { useApexStore } from '@/store/useApexStore';
import { useAuth } from '@/context/AuthContext';

interface UserGoalSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGoalSetupModal: React.FC<UserGoalSetupModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { macroAim, sideHobbies, newHobbiesToDevelop, setGoalProfile } = useApexStore();

  const [formMacroAim, setFormMacroAim] = useState('');
  const [formSideHobbies, setFormSideHobbies] = useState('');
  const [formNewHobbies, setFormNewHobbies] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormMacroAim(macroAim || 'Full-Stack Developer & Founder');
      setFormSideHobbies(sideHobbies || 'Guitar, Fitness, Photography');
      setFormNewHobbies(newHobbiesToDevelop || 'Cybersecurity, Martial Arts, Chess');
    }
  }, [isOpen, macroAim, sideHobbies, newHobbiesToDevelop]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setGoalProfile({
      macroAim: formMacroAim,
      sideHobbies: formSideHobbies,
      newHobbiesToDevelop: formNewHobbies,
    });

    if (user) {
      try {
        await fetch('/api/user/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.uid}`,
          },
          body: JSON.stringify({
            email: user.email,
            nickname: useApexStore.getState().username,
            macroAim: formMacroAim,
            sideHobbies: formSideHobbies,
            newHobbiesToDevelop: formNewHobbies,
          }),
        });
      } catch (err) {
        console.warn('[UserGoalSetupModal] Save note:', err);
      }
    }

    setIsSaving(false);
    setSavedSuccess(true);

    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none font-mono overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#08080A] border border-[#383848] rounded-xl p-4 sm:p-6 shadow-[0_0_50px_rgba(255,255,255,0.15)] text-[#FFFFFF] space-y-4 my-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1E1E26]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-[#000000] border border-[#383848]">
                <Target className="w-5 h-5 text-[#FFFFFF] animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] text-[#8E8E93] uppercase font-bold tracking-widest block">
                  [ MACRO HORIZON & HOBBY ONBOARDING ]
                </span>
                <h3 className="text-sm font-extrabold text-[#FFFFFF] text-glow">
                  SET YOUR APEX VISION & GOALS
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded bg-[#000000] text-[#8E8E93] hover:text-[#FFFFFF] border border-[#1E1E26]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. What You Want To Become */}
            <div>
              <label className="text-[11px] text-[#FFFFFF] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Compass className="w-3.5 h-3.5 text-[#FFFFFF]" /> WHAT DO YOU WANT TO BECOME? (PRIMARY MACRO AIM)
              </label>
              <p className="text-[10px] text-[#8E8E93] mb-1.5">
                Define your core 4-year summit goal (e.g. &quot;Full-Stack Software Architect & AI Founder&quot;)
              </p>
              <input
                type="text"
                required
                value={formMacroAim}
                onChange={(e) => setFormMacroAim(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer & Founder"
                className="w-full bg-[#000000] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none transition-colors"
              />
            </div>

            {/* 2. Side Hobbies */}
            <div>
              <label className="text-[11px] text-[#FFFFFF] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FFFFFF]" /> CURRENT SIDE HOBBIES
              </label>
              <p className="text-[10px] text-[#8E8E93] mb-1.5">
                Your active creative, physical, or personal passions (e.g. &quot;Guitar, Weightlifting, Photography&quot;)
              </p>
              <input
                type="text"
                required
                value={formSideHobbies}
                onChange={(e) => setFormSideHobbies(e.target.value)}
                placeholder="e.g. Guitar, Calisthenics, Digital Art"
                className="w-full bg-[#000000] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none transition-colors"
              />
            </div>

            {/* 3. New Hobbies to Develop */}
            <div>
              <label className="text-[11px] text-[#FFFFFF] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Edit3 className="w-3.5 h-3.5 text-[#FFFFFF]" /> NEW HOBBIES TO DEVELOP
              </label>
              <p className="text-[10px] text-[#8E8E93] mb-1.5">
                Skills or pursuits you want to unlock next (e.g. &quot;Cybersecurity, Martial Arts, Chess&quot;)
              </p>
              <input
                type="text"
                required
                value={formNewHobbies}
                onChange={(e) => setFormNewHobbies(e.target.value)}
                placeholder="e.g. Machine Learning, Chess, Piano"
                className="w-full bg-[#000000] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none transition-colors"
              />
            </div>

            {savedSuccess && (
              <div className="p-2.5 rounded-lg bg-[#000000] border border-[#FFFFFF]/60 text-[#FFFFFF] text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FFFFFF]" /> HORIZON GOALS & HOBBIES SAVED TO POSTGRESQL DB!
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2 border-t border-[#1E1E26]">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-lg bg-[#000000] text-[#8E8E93] hover:text-[#FFFFFF] border border-[#1E1E26] text-xs font-bold transition-all cursor-pointer text-center"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-lg bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isSaving ? 'PERSISTING...' : 'SAVE GOALS & HOBBIES'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserGoalSetupModal;

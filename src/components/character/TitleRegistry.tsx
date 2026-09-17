'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Lock, CheckCircle2, Shield, Zap } from 'lucide-react';

export interface TitleCard {
  id: string;
  name: string;
  description: string;
  status: 'EQUIPPED' | 'AVAILABLE' | 'LOCKED';
  unlockRequirement?: string;
}

const initialTitles: TitleCard[] = [
  {
    id: 't-1',
    name: 'TITAN ARCHITECT',
    description: 'Master of large-scale software systems and long-term goal architectures.',
    status: 'EQUIPPED',
  },
  {
    id: 't-2',
    name: 'AWAKENED PIONEER',
    description: 'First milestone awarded for completing 10 consecutive daily directives.',
    status: 'AVAILABLE',
  },
  {
    id: 't-3',
    name: 'CODE ALCHEMIST',
    description: 'Awarded upon logging 100+ hours of deep work programming sprints.',
    status: 'AVAILABLE',
  },
  {
    id: 't-4',
    name: 'GYM OVERLORD',
    description: 'Awarded upon reaching 300+ logged workout sets in the habit matrix.',
    status: 'AVAILABLE',
  },
  {
    id: 't-5',
    name: 'BRONZE ROOKIE',
    description: 'Initial Operative rank upon system activation.',
    status: 'AVAILABLE',
  },
  {
    id: 't-6',
    name: 'SOVEREIGN MONARCH',
    description: 'Ultimate rank achieved at Level 100 with 100,000+ total XP.',
    status: 'LOCKED',
    unlockRequirement: 'REACH LEVEL 100 & 100,000 TOTAL XP',
  },
];

interface TitleRegistryProps {
  onEquipTitle?: (titleName: string) => void;
}

export const TitleRegistry: React.FC<TitleRegistryProps> = ({ onEquipTitle }) => {
  const [titles, setTitles] = useState<TitleCard[]>(initialTitles);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleEquip = (id: string, name: string) => {
    setTitles((prev) =>
      prev.map((t) => ({
        ...t,
        status: t.id === id ? 'EQUIPPED' : t.status === 'EQUIPPED' ? 'AVAILABLE' : t.status,
      }))
    );

    if (onEquipTitle) {
      onEquipTitle(name);
    }

    setToastMessage(`Title '${name}' equipped successfully.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-4 font-mono select-none">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-lg bg-[#000000] border border-[#FFFFFF] text-[#FFFFFF] text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#FFFFFF]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
            EQUIPPABLE TITLES REGISTRY
          </h2>
        </div>
        <span className="text-[10px] text-[#8E8E93]">
          5 / 6 UNLOCKED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {titles.map((title) => {
          const isEquipped = title.status === 'EQUIPPED';
          const isAvailable = title.status === 'AVAILABLE';
          const isLocked = title.status === 'LOCKED';

          return (
            <motion.div
              key={title.id}
              whileHover={isAvailable ? { scale: 1.02 } : {}}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all duration-200 ${
                isEquipped
                  ? 'bg-[#18181F] border-[#FFFFFF] text-[#FFFFFF] shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  : isAvailable
                  ? 'bg-[#08080A] border-[#1E1E26] hover:border-[#FFFFFF]/60 text-[#FFFFFF]'
                  : 'bg-[#000000]/60 border-[#1E1E26] opacity-50 text-[#8E8E93]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs tracking-wider flex items-center gap-1.5">
                    {isEquipped && <Zap className="w-3.5 h-3.5 text-[#FFFFFF] fill-current" />}
                    {title.name}
                  </span>

                  {isEquipped && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#000000] text-[#FFFFFF] border border-[#FFFFFF]/60">
                      EQUIPPED
                    </span>
                  )}
                  {isLocked && <Lock className="w-3.5 h-3.5 text-[#8E8E93]" />}
                </div>

                <p className="text-[10px] text-[#8E8E93] leading-relaxed">
                  {title.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#1E1E26]/50">
                {isEquipped && (
                  <span className="text-[10px] text-[#FFFFFF] font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3 text-[#FFFFFF]" /> ACTIVE OPERATIVE TITLE
                  </span>
                )}

                {isAvailable && (
                  <button
                    onClick={() => handleEquip(title.id, title.name)}
                    className="w-full py-1.5 rounded bg-[#000000] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#1E1E26] hover:border-[#FFFFFF] text-[10px] font-bold uppercase transition-colors"
                  >
                    EQUIP TITLE
                  </button>
                )}

                {isLocked && (
                  <span className="text-[9px] text-[#8E8E93] font-bold block uppercase truncate">
                    LOCKED: {title.unlockRequirement}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TitleRegistry;

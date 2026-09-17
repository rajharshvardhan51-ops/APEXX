'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

interface XpNotificationFloatProps {
  xp: number | null;
  id?: string | number;
}

export const XpNotificationFloat: React.FC<XpNotificationFloatProps> = ({ xp, id }) => {
  return (
    <AnimatePresence>
      {xp !== null && (
        <motion.div
          key={id || xp}
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -45, scale: 1.1 }}
          exit={{ opacity: 0, y: -70, scale: 0.9 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="pointer-events-none absolute top-0 right-4 z-50 flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FFFFFF] text-[#000000] font-mono text-xs font-extrabold shadow-[0_0_20px_rgba(255,255,255,0.4)]"
        >
          <Zap className="w-4 h-4 fill-current" /> +{xp} XP REWARDED!
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default XpNotificationFloat;

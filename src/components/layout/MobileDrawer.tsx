'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  CheckSquare,
  Timer,
  Activity,
  BookOpen,
  Settings,
  X,
  ShieldAlert,
  Download,
  Bot,
  Sparkles,
} from 'lucide-react';
import ApexLogo from '@/components/brand/ApexLogo';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInstall?: () => void;
}

const menuItems = [
  { name: 'Command Center', href: '/', icon: LayoutDashboard },
  { name: 'Character Profile', href: '/character', icon: User, badge: 'S-RANK' },
  { name: 'AI Coach Terminal', href: '/coach', icon: Bot, badge: 'AI' },
  { name: 'Habit Trackers', href: '/habits', icon: CheckSquare },
  { name: 'Deep Work Timer', href: '/focus', icon: Timer, badge: 'FOCUS' },
  { name: 'Growth Heatmaps', href: '/analytics', icon: Activity },
  { name: 'Growth Ledger', href: '/analytics', icon: BookOpen },
  { name: 'System Settings', href: '/settings', icon: Settings },
];

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, onOpenInstall }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-[85vw] max-w-[340px] bg-[#060608] border-r border-[#1E1E26] text-[#FFFFFF] flex flex-col justify-between select-none md:hidden overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#1E1E26] flex items-center justify-between bg-[#08080A]">
              <div className="flex items-center gap-2">
                <ApexLogo variant="compact" size="sm" glow={true} />
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-md bg-[#121217] hover:bg-[#FFFFFF] text-[#8E8E93] hover:text-[#000000] border border-[#1E1E26] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Mobile Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Telemetry Badge */}
            <div className="px-4 py-2.5 bg-[#000000] border-b border-[#1E1E26] flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#8E8E93] flex items-center gap-1 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-[#FFFFFF]" /> MOBILE // OS
              </span>
              <span className="px-2 py-0.5 rounded bg-[#18181F] text-[#FFFFFF] border border-[#383848] font-bold">
                ONLINE
              </span>
            </div>

            {/* Navigation List */}
            <nav className="flex-1 p-3 space-y-2 overflow-y-auto font-mono">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3.5 py-3 min-h-[44px] rounded-lg text-xs transition-all duration-200 ${
                      isActive
                        ? 'bg-[#18181F] text-[#FFFFFF] border border-[#383848] shadow-[0_0_12px_rgba(255,255,255,0.1)]'
                        : 'text-[#8E8E93] hover:text-[#FFFFFF] hover:bg-[#121217] border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FFFFFF]' : 'text-[#71717A]'}`} />
                    <span className="truncate font-medium">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#000000] text-[#E4E4E7] border border-[#27272A] shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#1E1E26] bg-[#08080A] space-y-2.5 pb-safe">
              {onOpenInstall && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenInstall();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-lg bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(255,255,255,0.2)] cursor-pointer min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  <span>INSTALL APEX ON PHONE</span>
                </button>
              )}

              <div className="flex items-center justify-center gap-2 pt-1">
                <div className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse" />
                <span className="font-mono text-[9px] text-[#8E8E93] tracking-wider uppercase">
                  APEX OS MOBILE v1.0
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;

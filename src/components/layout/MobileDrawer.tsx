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
            className="fixed top-0 left-0 bottom-0 z-50 w-[85vw] max-w-[340px] bg-[#0A0B10] border-r border-[#1C1E2A] text-[#FFFFFF] flex flex-col justify-between select-none md:hidden overflow-hidden shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#1C1E2A] flex items-center justify-between bg-[#0E0F16]">
              <div className="flex items-center gap-2">
                <ApexLogo variant="compact" size="sm" glow={true} />
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-[#141622] hover:bg-[#FFFFFF] text-[#94949E] hover:text-[#000000] border border-[#232634] flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Close Mobile Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Telemetry Badge */}
            <div className="px-4 py-3 bg-[#08090E] border-b border-[#1C1E2A] flex items-center justify-between text-xs font-sans">
              <span className="text-[#94949E] flex items-center gap-2 font-medium">
                <ShieldAlert className="w-4 h-4 text-[#FFFFFF]" /> APEX Mobile
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#181A26] text-[#FFFFFF] border border-[#2D3042] font-mono text-[10px] font-bold">
                Online
              </span>
            </div>

            {/* Navigation List */}
            <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto font-sans">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3.5 px-4 py-3 min-h-[48px] rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${
                      isActive
                        ? 'bg-[#181A26] text-[#FFFFFF] border border-[#383C52] shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                        : 'text-[#94949E] hover:text-[#FFFFFF] hover:bg-[#12141F] border border-transparent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#FFFFFF]' : 'text-[#717180]'}`} />
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#08090E] text-[#E4E4E7] border border-[#232634] shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#1C1E2A] bg-[#0E0F16] space-y-3 pb-safe">
              {onOpenInstall && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenInstall();
                  }}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] font-sans text-xs font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer min-h-[48px]"
                >
                  <Download className="w-4.5 h-4.5" />
                  <span>Install APEX App</span>
                </button>
              )}

              <div className="flex items-center justify-center gap-2 pt-1">
                <div className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse" />
                <span className="font-mono text-[10px] text-[#8E8E9B] tracking-wider uppercase">
                  APEX OS v1.0
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

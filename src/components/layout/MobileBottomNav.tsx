'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  Bot,
  User,
  Menu,
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenDrawer: () => void;
}

const mainNavTabs = [
  { name: 'Command', href: '/', icon: LayoutDashboard },
  { name: 'Habits', href: '/habits', icon: CheckSquare },
  { name: 'Focus', href: '/focus', icon: Timer },
  { name: 'AI Coach', href: '/coach', icon: Bot },
  { name: 'Profile', href: '/character', icon: User },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenDrawer }) => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0A0B10]/95 backdrop-blur-2xl border-t border-[#1C1E2A] px-1 sm:px-2 py-1.5 pb-safe flex items-center justify-around select-none shadow-[0_-4px_25px_rgba(0,0,0,0.8)]">
      {mainNavTabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 min-h-[50px] rounded-xl text-xs font-sans transition-all active:scale-90 ${
              isActive ? 'text-[#FFFFFF]' : 'text-[#8E8E9B] hover:text-[#FFFFFF]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="mobileActiveTab"
                className="absolute inset-0 bg-[#FFFFFF]/10 border border-[#FFFFFF]/25 rounded-xl shadow-[0_0_12px_rgba(255,255,255,0.06)]"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <Icon
              className={`w-5 h-5 mb-1 transition-all ${
                isActive ? 'scale-110 text-[#FFFFFF] drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]' : 'text-[#717180]'
              }`}
            />
            <span
              className={`truncate font-medium text-[10px] tracking-tight ${
                isActive ? 'font-bold text-[#FFFFFF]' : 'text-[#8E8E9B]'
              }`}
            >
              {tab.name}
            </span>
          </Link>
        );
      })}

      {/* Slide-over Drawer Trigger Button */}
      <button
        onClick={onOpenDrawer}
        className="relative flex flex-col items-center justify-center py-1.5 px-2 min-h-[50px] rounded-xl text-xs font-sans text-[#8E8E9B] hover:text-[#FFFFFF] active:scale-90 transition-all cursor-pointer shrink-0"
        aria-label="Open Mobile Menu Drawer"
      >
        <Menu className="w-5 h-5 mb-1 text-[#717180]" />
        <span className="truncate font-medium text-[10px] tracking-tight text-[#8E8E9B]">More</span>
      </button>
    </nav>
  );
};

export default MobileBottomNav;

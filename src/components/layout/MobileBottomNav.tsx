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
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Habits', href: '/habits', icon: CheckSquare },
  { name: 'Focus', href: '/focus', icon: Timer },
  { name: 'AI Coach', href: '/coach', icon: Bot },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenDrawer }) => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0A0B10]/95 backdrop-blur-xl border-t border-[#1C1E2A] px-2 py-1.5 pb-safe flex items-center justify-between select-none shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
      {mainNavTabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 min-h-[52px] rounded-xl text-xs font-sans transition-all active:scale-95 ${
              isActive ? 'text-[#FFFFFF]' : 'text-[#8E8E9B] hover:text-[#FFFFFF]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="mobileActiveTab"
                className="absolute inset-0 bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <Icon className={`w-5 h-5 mb-1 transition-all ${isActive ? 'scale-110 text-[#FFFFFF]' : 'text-[#717180]'}`} />
            <span className={`truncate font-medium text-[10px] tracking-tight ${isActive ? 'font-bold text-[#FFFFFF]' : 'text-[#8E8E9B]'}`}>
              {tab.name}
            </span>
          </Link>
        );
      })}

      {/* Menu / Drawer Open Button */}
      <button
        onClick={onOpenDrawer}
        className="relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 min-h-[52px] rounded-xl text-xs font-sans text-[#8E8E9B] hover:text-[#FFFFFF] active:scale-95 transition-all cursor-pointer"
        aria-label="Open Mobile Menu Drawer"
      >
        <Menu className="w-5 h-5 mb-1 text-[#717180]" />
        <span className="truncate font-medium text-[10px] tracking-tight text-[#8E8E9B]">Menu</span>
      </button>
    </nav>
  );
};

export default MobileBottomNav;

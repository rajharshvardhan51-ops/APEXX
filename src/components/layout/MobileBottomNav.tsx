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
  { name: 'Profile', href: '/character', icon: User },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenDrawer }) => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#060608]/95 backdrop-blur-md border-t border-[#1E1E26] px-1 py-1 pb-safe flex items-center justify-around select-none">
      {mainNavTabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 min-h-[48px] rounded-md text-[10px] font-mono transition-all ${
              isActive ? 'text-[#FFFFFF]' : 'text-[#8E8E93] hover:text-[#FFFFFF]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="mobileActiveTab"
                className="absolute top-0 w-8 h-[2px] bg-[#FFFFFF] rounded-full shadow-[0_0_8px_#FFFFFF]"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <Icon className={`w-5 h-5 mb-0.5 transition-transform ${isActive ? 'scale-110 text-[#FFFFFF]' : 'text-[#71717A]'}`} />
            <span className="truncate tracking-tight font-medium text-[9px] sm:text-[10px]">{tab.name}</span>
          </Link>
        );
      })}

      {/* Menu / Drawer Open Button */}
      <button
        onClick={onOpenDrawer}
        className="flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 min-h-[48px] rounded-md text-[10px] font-mono text-[#8E8E93] hover:text-[#FFFFFF] transition-all cursor-pointer"
        aria-label="Open Mobile Menu Drawer"
      >
        <Menu className="w-5 h-5 mb-0.5 text-[#71717A]" />
        <span className="truncate tracking-tight font-medium text-[9px] sm:text-[10px]">Menu</span>
      </button>
    </nav>
  );
};

export default MobileBottomNav;

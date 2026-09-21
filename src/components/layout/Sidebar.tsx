'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Clock,
  Terminal,
  Bot,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';
import ApexLogo from '@/components/brand/ApexLogo';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Command Center', href: '/', icon: LayoutDashboard },
  { name: 'Character Profile', href: '/character', icon: User, badge: 'S-RANK' },
  { name: 'AI Coach Terminal', href: '/coach', icon: Bot, badge: 'AI' },
  { name: 'Habit Trackers', href: '/habits', icon: CheckSquare },
  { name: 'Deep Work Timer', href: '/focus', icon: Timer, badge: 'FOCUS' },
  { name: 'Growth Heatmaps', href: '/analytics', icon: Activity },
  { name: 'Growth Ledger', href: '/analytics', icon: BookOpen },
  { name: 'System Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsCollapsed(true);
    }

    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '72px' : '280px' }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-screen bg-[#060608] border-r border-[#1E1E26] text-[#FFFFFF] z-30 select-none overflow-hidden shrink-0"
    >
      {/* Sidebar Header / Brand Identity */}
      <div className="flex flex-col border-b border-[#1E1E26] p-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {!isCollapsed ? (
              <ApexLogo variant="compact" size="md" glow={true} />
            ) : (
              <ApexLogo variant="icon-only" size="sm" glow={true} />
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-7 h-7 rounded bg-[#000000] hover:bg-[#FFFFFF] text-[#8E8E93] hover:text-[#000000] transition-colors border border-[#1E1E26] shrink-0"
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* System Telemetry & Rank Badge */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t border-[#1E1E26] flex flex-col gap-2"
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#8E8E93] flex items-center gap-1.5 font-bold">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#FFFFFF]" /> SYSTEM
                </span>
                <span className="px-2 py-0.5 rounded bg-[#000000] text-[#FFFFFF] border border-[#383848] font-bold tracking-wider">
                  v1.0 // S-RANK
                </span>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#8E8E93] flex items-center gap-1.5 font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#FFFFFF]" /> LOCAL TIME
                </span>
                <span className="text-[#FFFFFF] font-bold tracking-wider">
                  {currentTime || '00:00:00'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-2 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-md font-mono text-xs transition-all duration-200 group ${
                isActive
                  ? 'bg-[#18181F] text-[#FFFFFF] border border-[#383848] shadow-[0_0_12px_rgba(255,255,255,0.12)]'
                  : 'text-[#E4E4E7]/80 hover:text-[#FFFFFF] hover:bg-[#121217] border border-transparent'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#FFFFFF] rounded-r shadow-[0_0_8px_#FFFFFF]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#FFFFFF]' : 'text-[#71717A] group-hover:text-[#FFFFFF]'
                }`}
              />

              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-between w-full overflow-hidden"
                  >
                    <span className="truncate tracking-wide font-medium">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#000000] text-[#E4E4E7] border border-[#27272A] shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-[#1E1E26] bg-[#000000]">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse shadow-[0_0_8px_#FFFFFF]" />
            <span className="font-mono text-[10px] text-[#8E8E93] tracking-wider uppercase">
              NODE SYNC: ACTIVE
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse shadow-[0_0_8px_#FFFFFF]" />
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;

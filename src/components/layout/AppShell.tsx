'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import MobileDrawer from '@/components/layout/MobileDrawer';
import MobileInstallBanner from '@/components/ui/MobileInstallBanner';

import LocalDataMigrationModal from '@/components/auth/LocalDataMigrationModal';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInstallBannerOpen, setIsInstallBannerOpen] = useState(false);

  return (
    <>
      {/* Persistent Left Sidebar (Hidden on mobile, visible on md+) */}
      <Sidebar />

      {/* Main Application Container */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden relative">
        {/* Top Telemetry Header */}
        <Header onOpenDrawer={() => setIsDrawerOpen(true)} />

        {/* Scrollable Main Canvas - includes bottom padding on mobile for MobileBottomNav */}
        <main className="flex-1 overflow-y-auto bg-cyber-grid bg-scanline p-3 sm:p-6 pb-20 md:pb-6 relative">
          {children}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (Visible on < md) */}
      <MobileBottomNav onOpenDrawer={() => setIsDrawerOpen(true)} />

      {/* Mobile Slide-Over Menu Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenInstall={() => setIsInstallBannerOpen(true)}
      />

      {/* Mobile PWA Install Banner */}
      <MobileInstallBanner
        isOpenOverride={isInstallBannerOpen ? true : undefined}
        onCloseOverride={() => setIsInstallBannerOpen(false)}
      />

      {/* Local to PostgreSQL Data Migration Dialog */}
      <LocalDataMigrationModal />
    </>
  );
};

export default AppShell;

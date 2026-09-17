import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import SystemBoot from '@/components/layout/SystemBoot';
import XPFloatToast from '@/components/ui/XPFloatToast';
import LevelUpOverlay from '@/components/ui/LevelUpOverlay';
import DayRolloverToast from '@/components/ui/DayRolloverToast';
import PwaRegistrar from '@/components/ui/PwaRegistrar';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'APEXX // SYSTEM.OS',
  description: 'Cyberpunk RPG Life OS & Macro Horizon Target Engine',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'APEXX',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-[#000000] text-[#FFFFFF] flex h-screen overflow-hidden antialiased font-mono">
        <AuthProvider>
          {/* Animated System Boot Splash Screen */}
          <SystemBoot />

          {/* Service Worker Auto Registrar */}
          <PwaRegistrar />

          {/* Floating XP Badge Micro-Interaction */}
          <XPFloatToast />

          {/* Full-Screen Level-Up / Title Unlock Overlay */}
          <LevelUpOverlay />

          {/* Day Rollover Lifecycle Engine Toast & Listener */}
          <DayRolloverToast />

          {/* Persistent Left Sidebar */}
          <Sidebar />

          {/* Main Application Area */}
          <div className="flex flex-col flex-1 h-screen overflow-hidden relative">
            {/* Top Telemetry Header */}
            <Header />

            {/* Scrollable Main Canvas */}
            <main className="flex-1 overflow-y-auto bg-cyber-grid bg-scanline p-6 relative">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}





import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import SystemBoot from '@/components/layout/SystemBoot';
import XPFloatToast from '@/components/ui/XPFloatToast';
import LevelUpOverlay from '@/components/ui/LevelUpOverlay';
import DayRolloverToast from '@/components/ui/DayRolloverToast';
import PwaRegistrar from '@/components/ui/PwaRegistrar';
import AppShell from '@/components/layout/AppShell';
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
  icons: {
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
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
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
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

          {/* Main App Layout Shell with Mobile Bottom Nav & Drawer */}
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}

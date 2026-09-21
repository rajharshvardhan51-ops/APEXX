'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, PlusSquare, Smartphone, Check, Sparkles } from 'lucide-react';
import ApexLogo from '@/components/brand/ApexLogo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface MobileInstallBannerProps {
  isOpenOverride?: boolean;
  onCloseOverride?: () => void;
}

export const MobileInstallBanner: React.FC<MobileInstallBannerProps> = ({
  isOpenOverride,
  onCloseOverride,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [installedSuccess, setInstalledSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if app is in standalone mode (installed PWA)
    const inStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('navigator' in window && (window.navigator as unknown as { standalone?: boolean }).standalone === true);
    setIsStandalone(inStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIphoneOrIpad = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIphoneOrIpad);

    // Check local storage if user previously dismissed prompt today
    const lastDismissed = localStorage.getItem('apexx_install_dismissed');
    const isDismissedRecently =
      lastDismissed && Date.now() - parseInt(lastDismissed, 10) < 24 * 60 * 60 * 1000;

    // Show banner if not standalone and not recently dismissed
    if (!inStandalone && !isDismissedRecently) {
      // Delay prompt appearance for 2.5 seconds to let main UI render
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500);
      return () => clearTimeout(timer);
    }

    // Listen for Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onCloseOverride) onCloseOverride();
    localStorage.setItem('apexx_install_dismissed', Date.now().toString());
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setInstalledSuccess(true);
        setTimeout(() => setIsVisible(false), 3000);
      }
      setDeferredPrompt(null);
    }
  };

  const shouldShow = isOpenOverride !== undefined ? isOpenOverride : (isVisible && !isStandalone);

  return (
    <AnimatePresence>
      {shouldShow && (
        <>
          {/* Modal Backdrop on Mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm md:hidden"
          />

          {/* Cyberpunk Mobile Install Card */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-16 left-3 right-3 z-50 md:bottom-6 md:left-auto md:right-6 md:w-96 bg-[#060608] border border-[#383848] rounded-xl p-4 shadow-[0_0_25px_rgba(255,255,255,0.15)] text-[#FFFFFF] select-none font-mono"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#1E1E26]">
              <div className="flex items-center gap-3">
                <ApexLogo variant="icon-only" size="md" glow={true} />
                <div>
                  <h3 className="text-xs font-bold tracking-wider text-[#FFFFFF] flex items-center gap-1.5">
                    INSTALL APEX OS <Sparkles className="w-3.5 h-3.5 text-[#FFFFFF] animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-[#8E8E93]">Full Screen Mobile App Experience</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="w-6 h-6 rounded bg-[#121217] text-[#8E8E93] hover:text-[#FFFFFF] border border-[#1E1E26] flex items-center justify-center transition-colors"
                aria-label="Dismiss Install Banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="py-3 text-xs space-y-2">
              {installedSuccess ? (
                <div className="flex items-center gap-2 p-3 bg-[#18181F] rounded-lg border border-[#FFFFFF]/30 text-[#FFFFFF]">
                  <Check className="w-5 h-5 text-[#FFFFFF]" />
                  <span className="font-bold text-xs">APEX OS INSTALLED SUCCESSFULLY!</span>
                </div>
              ) : isIos ? (
                // iOS Installation Steps
                <div className="space-y-2 text-[11px] text-[#E4E4E7]">
                  <p className="text-[#8E8E93] text-[10px] uppercase font-bold">
                    INSTALL ON IPHONE / IPAD:
                  </p>
                  <div className="flex items-center gap-2 p-2 bg-[#000000] rounded-md border border-[#1E1E26]">
                    <span className="w-5 h-5 rounded-full bg-[#18181F] text-[#FFFFFF] flex items-center justify-center font-bold text-[10px] shrink-0">
                      1
                    </span>
                    <span>
                      Tap the <Share className="w-3.5 h-3.5 inline mx-1 text-[#FFFFFF]" /> <b>Share</b> button in Safari toolbar.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#000000] rounded-md border border-[#1E1E26]">
                    <span className="w-5 h-5 rounded-full bg-[#18181F] text-[#FFFFFF] flex items-center justify-center font-bold text-[10px] shrink-0">
                      2
                    </span>
                    <span>
                      Scroll down & tap <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-[#FFFFFF]" /> <b>Add to Home Screen</b>.
                    </span>
                  </div>
                </div>
              ) : (
                // Android / Desktop Chrome PWA Install
                <div className="space-y-2 text-[11px] text-[#E4E4E7]">
                  <p className="text-[#8E8E93]">
                    Run APEX OS offline with low-latency touch controls & full-screen RPG HUD view on your smartphone.
                  </p>
                  <button
                    onClick={handleInstallClick}
                    disabled={!deferredPrompt}
                    className="w-full mt-2 py-2.5 px-3 rounded-lg bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(255,255,255,0.25)] disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{deferredPrompt ? 'INSTALL APEX APP NOW' : 'ADD TO HOME SCREEN'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Footer dismissal */}
            <div className="pt-2 border-t border-[#1E1E26] flex items-center justify-between text-[9px] text-[#8E8E93]">
              <span className="flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-[#FFFFFF]" /> iOS & ANDROID COMPATIBLE
              </span>
              <button
                onClick={handleDismiss}
                className="hover:text-[#FFFFFF] underline cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileInstallBanner;

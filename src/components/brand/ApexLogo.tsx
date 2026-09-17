'use client';

import React from 'react';

export interface ApexLogoProps {
  variant?: 'full' | 'compact' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ApexLogo: React.FC<ApexLogoProps> = ({
  variant = 'full',
  size = 'md',
  glow = false,
  className = '',
  onClick,
}) => {
  // Dimension mappings for SVG mark & typography
  const sizeConfig = {
    sm: {
      svg: 'w-6 h-6',
      title: 'text-sm tracking-[0.2em]',
      subtitle: 'text-[8px] tracking-[0.2em]',
      gap: 'gap-2',
    },
    md: {
      svg: 'w-10 h-10',
      title: 'text-xl tracking-[0.22em]',
      subtitle: 'text-[9.5px] tracking-[0.25em]',
      gap: 'gap-3',
    },
    lg: {
      svg: 'w-16 h-16',
      title: 'text-3xl tracking-[0.25em]',
      subtitle: 'text-[11px] tracking-[0.28em]',
      gap: 'gap-4',
    },
    xl: {
      svg: 'w-24 h-24',
      title: 'text-5xl tracking-[0.28em]',
      subtitle: 'text-xs tracking-[0.3em]',
      gap: 'gap-5',
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  const glowStyle = glow
    ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]'
    : '';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${currentSize.gap} select-none font-mono ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* 1. Pure Inline SVG Apex Chevron & Nested Alpine Mountain Mark */}
      <div className={`relative shrink-0 ${currentSize.svg} ${glowStyle}`}>
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#FFFFFF]"
        >
          {/* Outer Equilateral Upward Chevron Frame */}
          <path
            d="M60 10 L108 88 L92 88 L60 36 L28 88 L12 88 L60 10 Z"
            fill="currentColor"
          />

          {/* Inner Jagged Alpine Mountain Peak Silhouette */}
          <path
            d="M60 44 L74 66 L67 74 L85 95 L35 95 L53 74 L46 66 L60 44 Z"
            fill="currentColor"
            opacity="0.9"
          />

          {/* Central Ridge Highlight Accent */}
          <path
            d="M60 44 L60 95"
            stroke="#050507"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* 2. Brand Typography & Sub-Slogan */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col justify-center">
          {/* Stylized Lambda "Λ P E X" Logotype */}
          <span
            className={`font-black text-[#FFFFFF] leading-none ${currentSize.title}`}
          >
            Λ P E X
          </span>

          {/* Slogan Sub-label */}
          {variant === 'full' && (
            <span
              className={`font-bold text-[#A0A0A5] uppercase mt-1 leading-none ${currentSize.subtitle}`}
            >
              BECOME YOUR HIGHEST POTENTIAL.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ApexLogo;

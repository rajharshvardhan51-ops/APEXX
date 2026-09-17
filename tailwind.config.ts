import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#050507',
          dark: '#030305',
          light: '#0A0A0F',
        },
        panel: {
          DEFAULT: '#0D0D11',
          hover: '#14141A',
          border: '#1E1E26',
          'border-glow': '#2A2A38',
        },
        silver: {
          DEFAULT: '#EDEDED',
          bright: '#FFFFFF',
          dim: '#A3A3A3',
        },
        muted: {
          DEFAULT: '#6B7280',
          dark: '#4B5563',
        },
        accent: {
          purple: '#7B2CBF',
          'purple-glow': '#9D4EDD',
          cyan: '#00F5D4',
          'cyan-glow': '#52B788',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        display: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        'cyber-purple': '0 0 15px -3px rgba(123, 44, 191, 0.4), 0 0 6px -2px rgba(123, 44, 191, 0.2)',
        'cyber-cyan': '0 0 15px -3px rgba(0, 245, 212, 0.4), 0 0 6px -2px rgba(0, 245, 212, 0.2)',
        'hud-panel': '0 4px 20px -2px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(0, 245, 212, 0.6))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 2px rgba(0, 245, 212, 0.2))' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

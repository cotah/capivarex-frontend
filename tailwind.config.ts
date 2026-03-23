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
        bg: '#0a0a0f',
        surface: 'rgba(255,255,255,0.03)',
        glass: 'rgba(255,255,255,0.06)',
        'glass-border': 'rgba(255,255,255,0.08)',
        text: '#e8e6e3',
        'text-muted': 'rgba(255,255,255,0.4)',
        accent: '#c9a461',
        'accent-glow': 'rgba(201,164,97,0.15)',
        'accent-soft': 'rgba(201,164,97,0.08)',
        success: '#4ade80',
        error: '#f87171',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;

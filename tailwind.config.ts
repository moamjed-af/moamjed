import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#123ba3',
          dark: '#0d2d8a',
          light: '#1e4fc4',
          glow: '#2a5fe8',
          muted: 'rgba(18, 59, 163, 0.12)',
        },
        violet: {
          DEFAULT: '#7C3AED',
          dark: '#5B21B6',
          light: '#8B5CF6',
          soft: '#A78BFA',
          pale: '#F5F3FF',
          muted: 'rgba(124, 58, 237, 0.12)',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F8F7FF',
          card: '#FFFFFF',
          elevated: '#F1EEFF',
          border: '#E5E7EB',
          'border-accent': '#DDD6FE',
        },
        ink: {
          DEFAULT: '#1E1B4B',
          body: '#374151',
          muted: '#6B7280',
          faint: '#9CA3AF',
        },
        // Keep dark for hero/footer
        hero: {
          DEFAULT: '#1E0A3C',
          mid: '#0D1D6B',
          edge: '#2D1B69',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #123ba3 0%, #0d2d8a 100%)',
        'gradient-violet': 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1E0A3C 0%, #2D1B69 40%, #0d2d8a 100%)',
        'gradient-brand-violet': 'linear-gradient(135deg, #123ba3 0%, #7C3AED 100%)',
        'gradient-surface': 'linear-gradient(180deg, #FFFFFF 0%, #F8F7FF 100%)',
        'gradient-glow-violet': 'radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)',
        'gradient-glow-brand': 'radial-gradient(ellipse at center, rgba(18,59,163,0.1) 0%, transparent 70%)',
      },
      boxShadow: {
        brand: '0 4px 24px rgba(18, 59, 163, 0.25)',
        'brand-sm': '0 2px 12px rgba(18, 59, 163, 0.18)',
        'brand-lg': '0 8px 40px rgba(18, 59, 163, 0.35)',
        violet: '0 4px 24px rgba(124, 58, 237, 0.25)',
        'violet-sm': '0 2px 12px rgba(124, 58, 237, 0.18)',
        'violet-lg': '0 8px 40px rgba(124, 58, 237, 0.35)',
        card: '0 2px 20px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 40px rgba(124, 58, 237, 0.15)',
        soft: '0 1px 8px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Signature palette: deep indigo base, violet-to-cyan gradient accent
        ink: {
          950: '#05060F',
          900: '#0A0D1C',
          800: '#0F1428',
          700: '#161B34',
          600: '#212745',
        },
        mist: {
          50: '#F7F7FC',
          100: '#EDEEF9',
          200: '#DFE1F2',
        },
        violet: {
          400: '#9B8CFF',
          500: '#7C5CFF',
          600: '#6440E8',
        },
        cyan: {
          300: '#7EE8F0',
          400: '#4FD8E5',
          500: '#22D3EE',
        },
        coral: {
          400: '#FF8A7A',
          500: '#FF6B5B',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'aurora-gradient': 'radial-gradient(120% 120% at 10% 0%, #7C5CFF33 0%, transparent 50%), radial-gradient(100% 100% at 90% 20%, #22D3EE2E 0%, transparent 50%), radial-gradient(120% 120% at 50% 100%, #FF6B5B22 0%, transparent 55%)',
        'brand-gradient': 'linear-gradient(135deg, #7C5CFF 0%, #4FD8E5 100%)',
        'brand-gradient-vertical': 'linear-gradient(180deg, #7C5CFF 0%, #4FD8E5 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(10, 13, 28, 0.25)',
        'glow-violet': '0 0 40px -8px rgba(124, 92, 255, 0.55)',
        'glow-cyan': '0 0 40px -8px rgba(34, 211, 238, 0.45)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        wave: 'wave 1.2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: { DEFAULT: '#05010f', deep: '#0a0420', mid: '#120a2e' },
        ogun: { DEFAULT: '#ff6b1a', ember: '#c1121f', iron: '#3a2b2b' },
        kente: { gold: '#f5b301', copper: '#c96f2b', clay: '#8c3b1e' },
        nebula: { fuchsia: '#c026d3', violet: '#7c3aed', indigo: '#4338ca' },
        myco: { glow: '#6ee7a8', spore: '#a3e635', deep: '#0f2e22' },
        sirius: { blue: '#67e8f9', white: '#e0f2fe' },
        psy: { acid: '#d9f99d', hot: '#ff2fb9', sun: '#ffd166' },
      },
      fontFamily: {
        display: ['"Bungee"', '"Impact"', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(192,38,211,0.45)',
        gold: '0 0 20px rgba(245,179,1,0.4)',
        myco: '0 0 26px rgba(110,231,168,0.45)',
      },
      keyframes: {
        drift: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-14px)' } },
        pulseGlow: { '0%,100%': { opacity: '0.55' }, '50%': { opacity: '1' } },
        spinSlow: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        shimmer: { '0%': { backgroundPosition: '0% 50%' }, '100%': { backgroundPosition: '200% 50%' } },
      },
      animation: {
        drift: 'drift 7s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3.4s ease-in-out infinite',
        spinSlow: 'spinSlow 40s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
};

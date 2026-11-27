/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        k: {
          ink: 'rgb(var(--k-ink) / <alpha-value>)',
          deep: 'rgb(var(--k-deep) / <alpha-value>)',
          panel: 'rgb(var(--k-panel) / <alpha-value>)',
          line: 'rgb(var(--k-line) / <alpha-value>)',
          forest: 'rgb(var(--k-forest) / <alpha-value>)',
          paper: 'rgb(var(--k-paper) / <alpha-value>)',
          text: 'rgb(var(--k-text) / <alpha-value>)',
          muted: 'rgb(var(--k-muted) / <alpha-value>)',
          dim: 'rgb(var(--k-dim) / <alpha-value>)',
          gold: 'rgb(var(--k-gold) / <alpha-value>)',
          glint: 'rgb(var(--k-glint) / <alpha-value>)',
          sand: 'rgb(var(--k-sand) / <alpha-value>)',
          bronze: 'rgb(var(--k-bronze) / <alpha-value>)',
          ember: 'rgb(var(--k-ember) / <alpha-value>)',
          forge: 'rgb(var(--k-forge) / <alpha-value>)',
          moss: 'rgb(var(--k-moss) / <alpha-value>)',
          mint: 'rgb(var(--k-mint) / <alpha-value>)',
          light: 'rgb(var(--k-light) / <alpha-value>)',
        },
        void: { DEFAULT: '#081310', deep: '#0c1914', mid: '#12211a' },
        ogun: { DEFAULT: '#f2853a', ember: '#c7432a', iron: '#3a2b2b' },
        kente: { gold: '#f7c77c', copper: '#c96f2b', clay: '#8c3b1e' },
        nebula: { fuchsia: '#e0782f', violet: '#b8863f', indigo: '#2f6b5f' },
        myco: { glow: '#a6eb9b', spore: '#a3e635', deep: '#0f2e22' },
        sirius: { blue: '#81dcd4', white: '#dff3ef' },
        psy: { acid: '#d9f99d', hot: '#ff8a4c', sun: '#f7c77c' },
      },
      // Kamitron shape language: crisp corners rather than pill-soft panels.
      borderRadius: { lg: '4px', xl: '6px', '2xl': '8px', '3xl': '10px' },
      fontFamily: {
        display: ['"Unbounded"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(224,120,47,0.45)',
        gold: '0 0 20px rgba(247,199,124,0.4)',
        myco: '0 0 26px rgba(166,235,155,0.45)',
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

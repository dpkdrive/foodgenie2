/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:        '#faf8f5',
        cream2:       '#f2ede4',
        green:        '#113227',
        'green-mid':  '#22483d',
        'green-light':'#3a695a',
        'green-pale': '#e6f0ed',
        gold:         '#c5a35d',
        'gold-light': '#d8c191',
        'gold-pale':  '#f7f4ec',
        terracotta:   '#ab4b37',
        'text-main':  '#0e1f1a',
        'text-mid':   '#2c3b36',
        'text-muted': '#5b6e68',
        border:       '#d0dbd6',
        'border-dark':'#acbeb5',
      },
      fontFamily: {
        playfair: ['var(--font-cormorant)', 'serif'],
        cinzel:   ['var(--font-cinzel)', '"Palatino Linotype"', 'serif'],
        inter:    ['var(--font-jost)', 'sans-serif'],
        dm: ['var(--font-jost)', 'sans-serif'],
      },
      keyframes: {
        fadeUp:   { from:{ opacity:'0', transform:'translateY(20px)' }, to:{ opacity:'1', transform:'none' } },
        fadeDown: { from:{ opacity:'0', transform:'translateY(-20px)' }, to:{ opacity:'1', transform:'none' } },
        marqueeA: { from:{ transform:'translateX(0)' }, to:{ transform:'translateX(-50%)' } },
        floatY:   { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-7px)' } },
      },
      animation: {
        'fade-up':   'fadeUp 0.7s ease both',
        'fade-up-1': 'fadeUp 0.7s 0.1s ease both',
        'fade-up-2': 'fadeUp 0.7s 0.2s ease both',
        'fade-up-3': 'fadeUp 0.7s 0.35s ease both',
        'fade-up-4': 'fadeUp 0.7s 0.5s ease both',
        'fade-up-5': 'fadeUp 0.7s 0.65s ease both',
        'fade-down': 'fadeDown 0.6s ease both',
        marquee:     'marqueeA 24s linear infinite',
        floatY:      'floatY 4s ease-in-out infinite',
        'floatY-d':  'floatY 5s ease-in-out 1s infinite',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({ '.scrollbar-hide': { '-ms-overflow-style': 'none', 'scrollbar-width': 'none', '&::-webkit-scrollbar': { display: 'none' } } })
    },
  ],
}

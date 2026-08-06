/** @type {import('tailwindcss').Config} */

// Builds a Tailwind-compatible color entry from an OKLCH triplet that still
// supports opacity modifiers (e.g. bg-gold-500/60).
function oklchScale(hue, stops) {
  const scale = {}
  for (const [key, [l, c]] of Object.entries(stops)) {
    scale[key] = ({ opacityValue }) =>
      opacityValue === undefined ? `oklch(${l} ${c} ${hue})` : `oklch(${l} ${c} ${hue} / ${opacityValue})`
  }
  return scale
}

// Palette ported 1:1 from the golden-east-africa-tours design system
// (warm cream + gold light theme, Playfair Display + Outfit typography).
const gold = oklchScale(65, {
  50: [0.97, 0.02],
  100: [0.94, 0.045],
  200: [0.9, 0.075],
  300: [0.86, 0.11],
  400: [0.8, 0.15],
  500: [0.78, 0.17], // == --gold / --primary
  600: [0.68, 0.16],
  700: [0.58, 0.14],
  800: [0.46, 0.11],
  900: [0.36, 0.08],
  950: [0.24, 0.05],
})

const safari = oklchScale(150, {
  50: [0.96, 0.02],
  100: [0.91, 0.045],
  200: [0.82, 0.07],
  300: [0.72, 0.09],
  400: [0.62, 0.1],
  500: [0.52, 0.1],
  600: [0.44, 0.09],
  700: [0.36, 0.075],
  800: [0.28, 0.06],
  900: [0.21, 0.045],
  950: [0.14, 0.03],
})

const ink = oklchScale(60, {
  50: [0.97, 0.005],
  100: [0.93, 0.006],
  200: [0.85, 0.008],
  300: [0.74, 0.01],
  400: [0.6, 0.015],
  500: [0.48, 0.018],
  600: [0.38, 0.02],
  700: [0.3, 0.02],
  800: [0.22, 0.02],
  850: [0.18, 0.02], // == light-mode --foreground
  900: [0.15, 0.015],
  950: [0.1, 0.01],
})

const sand = oklchScale(80, {
  50: [0.985, 0.01], // == --background
  100: [0.96, 0.02], // == --secondary / --muted
  200: [0.93, 0.04], // == --accent
  300: [0.9, 0.02], // == --border
})

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Outfit"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: { gold, safari, ink, sand },
      boxShadow: {
        card: '0 1px 2px rgba(20,23,23,0.04), 0 8px 24px -4px rgba(20,23,23,0.08)',
        elevated: '0 4px 12px rgba(20,23,23,0.06), 0 16px 40px -8px rgba(20,23,23,0.14)',
        gold: '0 10px 40px -10px oklch(0.78 0.17 65 / 0.4)',
        'gold-lg': '0 0 50px -5px oklch(0.85 0.19 75 / 0.55)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, oklch(0.8 0.15 65) 0%, oklch(0.78 0.17 65) 55%, oklch(0.58 0.14 60) 100%)',
        'gold-radial':
          'radial-gradient(circle at 20% 30%, oklch(0.78 0.17 65 / 0.18), transparent 60%), radial-gradient(circle at 85% 80%, oklch(0.78 0.17 65 / 0.12), transparent 55%)',
      },
      keyframes: {
        fadeInUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeSlideUp: { from: { opacity: 0, transform: 'translateY(28px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.92)' }, to: { opacity: 1, transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease-out both',
        'fade-slide-up': 'fadeSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}

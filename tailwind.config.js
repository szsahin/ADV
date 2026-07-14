/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          950: '#0f1117',
          900: '#111318',
          850: '#161922',
          800: '#1a1d26',
          750: '#202330',
          700: '#2a2d3a',
          600: '#3a3d4a',
          500: '#6b7280',
          400: '#9ca3af',
          300: '#d1d5db',
          200: '#e5e7eb',
          100: '#f3f4f6',
        },
        blue: {
          900: '#1e3a5f',
          800: '#1e40af',
          700: '#1d4ed8',
          600: '#2563eb',
          500: '#3b82f6',
          400: '#60a5fa',
          300: '#93c5fd',
        },
        emerald: {
          900: '#064e3b',
          800: '#065f46',
          700: '#047857',
          600: '#059669',
          500: '#10b981',
          400: '#34d399',
          300: '#6ee7b7',
        },
        yellow: {
          900: '#713f12',
          800: '#854d0e',
          700: '#a16207',
          600: '#ca8a04',
          500: '#eab308',
          400: '#fbbf24',
          300: '#fcd34d',
          200: '#fde68a',
        },
        red: {
          900: '#450a0a',
          800: '#7f1d1d',
          700: '#b91c1c',
          600: '#dc2626',
          500: '#ef4444',
          400: '#f87171',
          300: '#fca5a5',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

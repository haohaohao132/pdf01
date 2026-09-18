/** @type {import('tailwindcss').Config} */
// 主题集中在此文件：修改 brand / ink 颜色即可整体换肤。
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        ink: {
          900: '#050508',
          850: '#08080f',
          800: '#0b0b12',
          700: '#11121a',
          600: '#171927',
          500: '#1f2230',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(99,102,241,0.25), 0 8px 40px -12px rgba(99,102,241,0.45)',
      },
    },
  },
  plugins: [],
}

import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
    './types.ts'
  ],
  theme: {
    extend: {
      colors: {
        pakistan: {
          green: '#01411C',
          lightgreen: '#115740',
          white: '#FFFFFF',
          accent: '#00A651',
          bg: '#F5FAF7'
        }
      },
      animation: {
      },
      keyframes: {
      }
    }
  },
  plugins: []
};

export default config;

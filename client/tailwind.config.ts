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
        india: {
          saffron: '#FF9933',
          white: '#FFFFFF',
          green: '#138808',
          blue: '#000080',
          bg: '#FDFBF7'
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

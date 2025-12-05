import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React
          'react-vendor': ['react', 'react-dom'],
          // Router chunk
          'router': ['react-router-dom'],
        },
      },
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 500,
    // Enable source maps for production debugging (optional)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});

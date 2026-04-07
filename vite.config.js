import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/MentorMuni-React-Frontend/',
  plugins: [react()],
  /** Dev: keep this process running — edits to source/CSS hot-reload without restart. */
  server: {
    port: 5173,
    strictPort: false,
    open: false,
    /** Fast refresh + HMR (default on; explicit for clarity) */
    hmr: true,
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          /** Separate long-lived cache chunk (~animation lib) */
          motion: ['framer-motion'],
          icons: ['lucide-react'],
        },
      },
    },
    cssCodeSplit: true,
    sourcemap: false,
  },
})

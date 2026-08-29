import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE_PATH || '/';

  return {
    // Default to root for Vercel/Netlify; override for subpath hosting when needed.
    base,
    plugins: [react()],
    /** Dev: keep this process running — edits to source/CSS hot-reload without restart. */
    server: {
      /** Honour an assigned PORT (preview/CI runners set it) so a second dev
          server can run alongside one already holding 5173. Bare `npm run dev`
          leaves PORT unset and still gets the usual 5173. */
      port: Number(process.env.PORT) || 5173,
      strictPort: false,
      open: false,
      /** Allow medicaps.localhost:5173 college-tenant testing */
      host: true,
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
  };
})

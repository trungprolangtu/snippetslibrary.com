import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@client": path.resolve(__dirname, "./src"),
      "@server": path.resolve(__dirname, "../server/src"),
      "@shared": path.resolve(__dirname, "../shared/src"),
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React and core dependencies
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor';
          }
          
          // UI components library
          if (id.includes('@radix-ui') || id.includes('class-variance-authority') || 
              id.includes('clsx') || id.includes('tailwind-merge')) {
            return 'ui-vendor';
          }
          
          // Language parsers from Shiki - split by language groups
          if (id.includes('shiki') || id.includes('@shikijs')) {
            // Web languages
            if (id.includes('javascript') || id.includes('typescript') || id.includes('jsx') || 
                id.includes('tsx') || id.includes('html') || id.includes('css') || id.includes('scss')) {
              return 'web-langs';
            }
            // System languages
            if (id.includes('cpp') || id.includes('c-') || id.includes('rust') || id.includes('go') || 
                id.includes('java') || id.includes('csharp') || id.includes('python')) {
              return 'system-langs';
            }
            // Other languages
            if (id.includes('lang') || id.includes('grammar')) {
              return 'other-langs';
            }
            // Core shiki functionality
            return 'syntax-vendor';
          }
          
          // Form and validation
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
            return 'form-vendor';
          }
          
          // Utility libraries
          if (id.includes('lucide-react') || id.includes('react-hot-toast') || id.includes('use-debounce')) {
            return 'utils-vendor';
          }
          
          // Node modules (fallback)
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})

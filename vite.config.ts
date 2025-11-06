import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Lamp to My Feet - Biblical Guidance and Learning',
          description: 'Discover biblical wisdom and guidance through interactive learning, Bible search, and spiritual growth resources.'
        }
      }
    })
  ],
  // Tu configuración existente de preview
  preview: {
    allowedHosts: [
      'lamp-to-my-feet-4.onrender.com',
      // any other hosts you want to allow
    ]
  },
  // Configuración para producción
  build: {
    // Optimizar chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['bootstrap', 'framer-motion']
        }
      }
    }
  }
})
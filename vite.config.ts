import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      'lamp-to-my-feet-4.onrender.com',
      // any other hosts you want to allow
    ]
  }
})

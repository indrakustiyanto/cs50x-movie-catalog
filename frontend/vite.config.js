import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'


export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: true, // atau '0.0.0.0'
     allowedHosts: ['.ngrok-free.app']
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        movies: resolve(__dirname, 'movies.html'),
        series: resolve(__dirname, 'series.html'),
        faq: resolve(__dirname, 'faq.html'),
        detailed: resolve(__dirname, 'detailed.html'),
        collections: resolve(__dirname, 'collections.html'),
        
      }
    }
  }
})
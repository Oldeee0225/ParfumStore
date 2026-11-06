import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// Las fotos originales pesan 1–3 MB y miden hasta 2400 px. Al compilar se
// convierten a WebP y se reducen al tamaño que realmente se muestra; los
// archivos de src/assets no se modifican.
const MAX_WIDTH = 1200
const MAX_WIDTH_HERO = 1920

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    imagetools({
      include: /^[^?]+\/src\/assets\/.+\.(jpe?g|png)$/i,
      defaultDirectives: url => new URLSearchParams({
        format: 'webp',
        quality: '80',
        w: String(url.pathname.includes('HeroHome') ? MAX_WIDTH_HERO : MAX_WIDTH),
      }),
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

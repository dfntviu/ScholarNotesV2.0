import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const raiz = (ruta) => fileURLToPath(new URL(ruta, import.meta.url));

export default defineConfig({
  // Rutas relativas: el build funciona en GitHub Pages, Netlify o una subcarpeta del portafolio.
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: raiz('./index.html'),
        graficas: raiz('./templates/graficas.html'),
        asistencia: raiz('./templates/asistencia.html'),
      },
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
});

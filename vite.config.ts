import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, renameSync } from 'fs';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'chrome-extension-build',
      closeBundle() {
        // Rename index.html to popup.html
        const indexPath = resolve(__dirname, 'dist/index.html');
        const popupPath = resolve(__dirname, 'dist/popup.html');
        if (existsSync(indexPath)) {
          renameSync(indexPath, popupPath);
        }

        // Copy manifest.json
        copyFileSync(
          resolve(__dirname, 'public/manifest.json'),
          resolve(__dirname, 'dist/manifest.json')
        );

        // Copy icons
        const iconsDir = resolve(__dirname, 'dist/icons');
        if (!existsSync(iconsDir)) {
          mkdirSync(iconsDir, { recursive: true });
        }
        ['icon16.png', 'icon48.png', 'icon128.png'].forEach(icon => {
          copyFileSync(
            resolve(__dirname, `public/icons/${icon}`),
            resolve(__dirname, `dist/icons/${icon}`)
          );
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    emptyDirBeforeWrite: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background/index.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'background' ? 'background.js' : '[name].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
});

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
      'cloudflare:workers': new URL('./tests/stubs/cloudflare-workers.ts', import.meta.url).pathname,
    },
  },
});

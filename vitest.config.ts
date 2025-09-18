import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: ['./e2e/*'],
    include: ['./app/**/*.test.ts'],
  },
});


import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'stubs'),
      '@test': resolve(__dirname, 'test'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: [
      'stubs/**/*.{test,spec}.{ts,js}',
      'pages/**/*.{test,spec}.{ts,js}',
      'test/**/*.{test,spec}.{ts,js}',
    ],
    exclude: ['node_modules', 'dist'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['stubs/**/*.{ts,js}', 'pages/**/*.{ts,js}'],
      exclude: [
        'node_modules',
        'dist',
        '**/*.{test,spec}.{ts,js}',
        'test/**',
        'scripts/**',
        'vite.config.ts',
        'vitest.config.ts',
      ],
    },
  },
})

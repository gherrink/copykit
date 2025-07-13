import uidoc from '@ui-doc/vite'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig(async ({ command }) => {
  return {
    // No root configuration - works from project root

    build: {
      rollupOptions: {
        input: {
          // UI-Doc required entries only
          style: resolve(__dirname, 'stubs/ui-doc-style.css'),
          app: resolve(__dirname, 'stubs/ui-doc-app.ts'),
        },
        output: {
          dir: './dist/ui-doc',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      },
    },

    resolve: {
      alias: {
        '@': resolve(__dirname, 'stubs'),
      },
    },

    plugins: [
      uidoc({
        output: {
          baseUri: command === 'serve' ? undefined : '.',
        },
        source: [
          'stubs/*/styles/**/*.css',
          'stubs/*/scripts/services/**/*.ts',
          'stubs/**/scripts/app.ts',
        ],
        settings: {
          generate: {
            logo: () => 'CopyKit',
          },
          texts: {
            title: 'CopyKit',
          },
        },
        assets: {
          static: './assets',
          example: [
            {
              name: 'style',
              fromInput: true,
            },
            {
              name: 'app',
              fromInput: true,
              attrs: {
                type: 'module',
              },
            },
          ],
        },
      }),
    ],
  }
})

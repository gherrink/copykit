/* eslint-disable sort-keys */
import uidoc from '@ui-doc/vite'
import { glob } from 'glob'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig(async ({ command }) => {
  return {
    root: 'pages',

    build: {
      rollupOptions: {
        // TODO: fix works ony when running dev but not when build
        input: {
          style: 'style.css',
          app: 'app.ts',
          main: resolve(__dirname, 'pages/index.html'),
          ...(await glob(resolve(__dirname, 'pages/[a-z0-9-_][a-z0-9-_]*/index.html'))),
        },
        output: {
          dir: './dist',
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
            logo: () => 'WebBase',
          },
          texts: {
            title: 'WebBase',
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

import { glob } from 'glob'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig(async () => {
  // Get all page directories and create proper entry names
  const pageFiles = await glob('pages/[a-z0-9-_][a-z0-9-_]*/index.html')
  const pageEntries = pageFiles.reduce((entries: Record<string, string>, file) => {
    // Extract page name from path (e.g., 'pages/basic/index.html' -> 'basic')
    const pageName = file.split('/')[1]
    entries[pageName] = resolve(__dirname, file)
    return entries
  }, {})

  return {
    root: 'pages',

    build: {
      rollupOptions: {
        input: {
          // Main page entries only
          main: resolve(__dirname, 'pages/index.html'),
          ...pageEntries,
        },
        output: {
          dir: './dist/pages',
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
  }
})

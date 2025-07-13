import { glob } from 'glob'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { readFileSync, writeFileSync, unlinkSync, rmdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'

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
    base: './',

    plugins: [
      {
        name: 'flat-html-output',
        writeBundle(options: any, bundle: any) {
          // Collect page names for index.html injection
          const pageLinks: { href: string; name: string }[] = []

          // Custom logic to move HTML files after build
          // Move subpage HTML files to root level
          Object.keys(bundle).forEach(fileName => {
            if (fileName.endsWith('/index.html') && fileName !== 'index.html') {
              const sourcePath = join(options.dir, fileName)
              const pageName = fileName.replace('/index.html', '')
              const targetPath = join(options.dir, `${pageName}.html`)

              // Add to page links list
              pageLinks.push({
                href: `./${pageName}.html`,
                name: pageName,
              })

              if (existsSync(sourcePath)) {
                // Read, update asset paths, and write to new location
                let content = readFileSync(sourcePath, 'utf8')
                // Update relative paths from ../assets/ to ./assets/
                content = content.replace(/href="\.\.\/assets\//g, 'href="./assets/')
                content = content.replace(/src="\.\.\/assets\//g, 'src="./assets/')
                content = content.replace(/href="\.\.\/"/g, 'href="./"')

                writeFileSync(targetPath, content)

                // Remove the original file and directory if empty
                unlinkSync(sourcePath)
                try {
                  rmdirSync(dirname(sourcePath))
                } catch {
                  // Directory not empty, that's fine
                }
              }
            }
          })

          // Update index.html with page links
          const indexPath = join(options.dir, 'index.html')
          if (existsSync(indexPath)) {
            let indexContent = readFileSync(indexPath, 'utf8')

            // Generate HTML for page links
            const linksHtml = pageLinks
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(page => `<a href="${page.href}">${page.name}</a>`)
              .join('')

            // Replace the empty data-links div with populated links
            indexContent = indexContent.replace(
              /<div[^>]*data-links="[^"]*"[^>]*><\/div>/,
              `<div class="flex column gap mt" style="--mt-space: var(--space-base)" data-links="">${linksHtml}</div>`,
            )

            writeFileSync(indexPath, indexContent)
          }
        },
      },
    ],

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

// Hybrid approach: use build-time injected links if available,
// otherwise fall back to dynamic discovery for development mode

const linksContainer = document.querySelector('[data-links]')

if (linksContainer) {
  // Check if links were already injected during build
  const existingLinks = linksContainer.querySelectorAll('a')

  if (existingLinks.length === 0) {
    // Development mode: dynamically discover pages using import.meta.glob
    const pages = import.meta.glob('/[a-z0-9][a-z0-9-_]*/index.html')

    Object.keys(pages).forEach(src => {
      const link = document.createElement('a')
      const href = src.replace('index.html', '')

      link.href = href
      link.innerText = href.replace('/', '')
      linksContainer.appendChild(link)
    })
  }
  // Production mode: links are already injected by the build plugin, do nothing
}

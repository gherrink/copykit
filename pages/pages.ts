const pages = import.meta.glob('/[a-z0-9][a-z0-9-_]*/index.html')
const links = document.querySelector('[data-links]')

if (links) {
  Object.keys(pages).forEach(src => {
    const link = document.createElement('a')
    const href = src.replace('index.html', '')

    link.href = href
    link.innerText = href.replace('/', '')
    links.appendChild(link)
  })
}

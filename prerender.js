// Pre-render the app into static HTML.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { format } from 'prettier'

// import { createServer as createViteServer } from 'vite'
// const vite = await createViteServer({
//   server: { middlewareMode: true, open: false },
//   appType: 'custom'
// })
// const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')
// vite.close()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render } = await import('./dist/server/assets/js/entry-server.js')

// determine routes to pre-render from src/pages
const routesToPrerender = fs
  .readdirSync(toAbsolute('src/pages'))
  .filter((file) => file.endsWith('.jsx'))
  .map((file) => {
    const name = file
      .replace(/\.jsx$/, '')
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase()
    return name === 'home' ? `/` : `/${name}`
  })

;(async () => {
  // pre-render each route...
  for (const url of routesToPrerender) {
    const appHtml = await render(url)

    const html = template
      .replace(`<!--app-html-->`, appHtml.body)
      .replace(`<!--app-head-->`, appHtml.head)

    const filePath = `dist${url === '/' ? '/index' : url}.html`
    fs.writeFileSync(
      toAbsolute(filePath),
      format(html, { printWidth: 100, parser: 'html' })
    )
    console.log('pre-rendered:', filePath)
  }
})()

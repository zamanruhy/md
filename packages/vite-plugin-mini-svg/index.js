import fs from 'fs/promises'
import path from 'path'
import { optimize, loadConfig } from 'svgo'
import svgToMiniDataURI from 'mini-svg-data-uri'

export default function svgPlugin({ svgoConfig } = {}) {
  // const fileRegex = /\.(svg)$/
  const fileRegex = /\.svg(\?.*)?$/
  let config

  return {
    name: 'mini-svg',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig
      // console.log(
      //   `resolvedConfig===${JSON.stringify(resolvedConfig, null, 2)}===`
      // )
    },
    async load(id) {
      if (!fileRegex.test(id)) {
        return null
      }

      const [, qs] = id.split('?')
      const qp = new URLSearchParams(qs)
      const svgPath = id.replace(/\?.*$/, '')
      let svgContent = ''
      let srcToExport = ''

      if (qp.has('metadata') || qp.has('datauri') || config.isProduction) {
        svgContent = await fs.readFile(svgPath, 'utf8')
        svgContent = await optimizeSvg(svgContent, svgPath, svgoConfig)
      }

      if (qp.has('datauri')) {
        srcToExport = svgToMiniDataURI(svgContent)
      } else if (config.isProduction) {
        const referenceId = this.emitFile({
          type: 'asset',
          name: path.basename(svgPath),
          source: svgContent
        })
        srcToExport = `__VITE_ASSET__${referenceId}__`
      } else {
        srcToExport = svgPath.slice(config.root.length)
      }

      if (qp.has('metadata')) {
        let width, height
        const svgRoot = svgContent.match(/<svg\s.+?>/)[0]
        const wMatch = svgRoot.match(/\swidth=(['"])(.+?)\1/)
        const hMatch = svgRoot.match(/\sheight=(['"])(.+?)\1/)
        if (wMatch && hMatch) {
          ;[width, height] = [parseFloat(wMatch[2]), parseFloat(hMatch[2])]
        } else {
          const vbMatch = svgRoot.match(/\sviewBox=(['"])(.+?)\1/i)
          if (vbMatch) {
            ;[width, height] = vbMatch[2].split(' ').slice(-2).map(parseFloat)
          }
        }
        return `export default ${JSON.stringify({
          src: srcToExport,
          width,
          height
        })}`
      }

      return `export default ${JSON.stringify(srcToExport)}`

      // const referenceId = this.emitFile({
      //   type: 'asset',
      //   name: path.basename(_path),
      //   source: await fs.readFile(_path)
      // })
      // return `export default "__VITE_ASSET__${referenceId}__"`

      // console.log('\n===this.emitFile', this.emitFile, '===\n')

      // return `export default "/src/images/click.svg?adsf"`
    },
    transform(src, id) {
      if (fileRegex.test(id)) {
        // console.log('\n===', src, '===', id, process.cwd())
        // const url = src.match(/".+?"/)[0]
        // return `export default { src: ${url} }`
      }
    }
    // writeBundle(options, bundle) {
    //   console.log('===', options, '===\n')
    // }
  }
}

async function optimizeSvg(content, path, svgoConfig) {
  const config = svgoConfig || (await loadConfig()) || {}
  delete config.datauri
  const { data } = await optimize(content, { ...config, path })
  return data
}

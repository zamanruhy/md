import type { OptimizeOptions } from 'svgo'
import type { Plugin } from 'vite'

interface Options {
  svgoConfig: OptimizeOptions
  // /**
  //  * Requires the use of ".svg?component" instead of just ".svg"
  //  * @default true
  //  */
  // requireSuffix: boolean
}

export default function (options?: Options): Plugin

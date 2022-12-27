# Vite Plugin Mini SVG

Vite plugin to optimize svg assets or create datauri from them.

## Features:

- [SVGO](https://github.com/svg/svgo) optimization of all imported svg assets
- Support for `?datauri` and `?metadata` query string

## Install

```bash
npm i -D vite-plugin-mini-svg
```

```bash
pnpm add -D vite-plugin-mini-svg
```

```bash
yarn add --dev vite-plugin-mini-svg
```

## Setup

```js
// vite.config.js
import { defineConfig } from 'vite'
import miniSvg from 'vite-plugin-mini-svg'

export default defineConfig({
  plugins: [miniSvg()]
})
```

## Options

```js
miniSvg({
  // SVGO configuration object
  svgoConfig: {}
})
```

## Usage

```js
import srcAsUri from './images/example.svg?datauri'

const img = document.createElement('img')
img.src = srcAsUri
document.body.appendChild(img)
```

```js
import imgData from './images/example.svg?metadata'

const img = document.createElement('img')
img.src = imgData.src
img.width = imgData.width
img.height = imgData.height
document.body.appendChild(img)
```

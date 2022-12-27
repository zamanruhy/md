const maxWidth = 1280
const screens = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

function getIndex(a) {
  const order = ['avif', 'webp']
  const i = order.indexOf(a)
  return i === -1 ? order.length : i
}

function normalizeScr(src) {
  return src.startsWith('/') ? src.slice(1) : src
}

function formatSizes(sizes) {
  if (sizes.includes(',')) return sizes
  return sizes
    .trim()
    .split(/\s+/)
    .reverse()
    .reduce((acc, cur, i) => {
      const m = cur.match(/^(\w+):(\w+)$/)
      return m
        ? [
            ...(i === 0 &&
            m[2].replace(/([\d.]+)/, '') === 'vw' &&
            maxWidth > screens[m[1]]
              ? [
                  `(min-width: ${maxWidth}px) ${Math.round(
                    maxWidth / (100 / parseFloat(m[2]))
                  )}px`
                ]
              : acc),
            `(min-width: ${screens[m[1]]}px) ${m[2]}`
          ]
        : [...acc, cur]
    }, [])
    .join(', ')
}

export default function Image({ src, sizes, ...rest }) {
  if (!Array.isArray(src)) {
    const obj =
      typeof src === 'string'
        ? { src: normalizeScr(src) }
        : {
            src: normalizeScr(src.src),
            width: src.width,
            height: Math.round(src.height)
          }
    return <img {...obj} {...rest} />
  }

  const formatEntries = Object.entries(
    src.reduce((acc, cur) => {
      acc[cur.format] = (acc[cur.format] || [])
        .concat(cur)
        .sort((a, b) => a.width - b.width)
      return acc
    }, {})
  ).sort((a, b) => getIndex(a[0]) - getIndex(b[0]))

  if (formatEntries.length === 1) {
    const arr = formatEntries[0][1]
    return (
      <img
        {...{
          src: normalizeScr(arr[arr.length - 1].src),
          srcset: arr
            .map((o) => `${normalizeScr(o.src)} ${o.width}w`)
            .join(', '),
          sizes: sizes ? formatSizes(sizes) : null,
          width: arr[arr.length - 1].width,
          height: Math.round(arr[arr.length - 1].height)
        }}
        {...rest}
      />
    )
  }

  return (
    <picture>
      {formatEntries.map(([format, arr], i) =>
        formatEntries.length - 1 > i ? (
          <source
            srcset={
              arr.length > 1
                ? arr
                    .map((o) => `${normalizeScr(o.src)} ${o.width}w`)
                    .join(', ')
                : arr[0].src
            }
            type={`image/${format}`}
          />
        ) : (
          <img
            {...{
              src: normalizeScr(arr[arr.length - 1].src),
              srcset:
                arr.length > 1
                  ? arr
                      .map((o) => `${normalizeScr(o.src)} ${o.width}w`)
                      .join(', ')
                  : null,
              sizes: sizes ? formatSizes(sizes) : null,
              width: arr[arr.length - 1].width,
              height: Math.round(arr[arr.length - 1].height)
            }}
            {...rest}
          />
        )
      )}
    </picture>
  )
}

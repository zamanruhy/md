// export { default as customElement } from './custom-element'

export function camelize(str: string): string {
  return str.replace(/-(\w)/g, (_, c) => {
    return c ? c.toUpperCase() : ''
  })
}

export function hyphenate(str: string): string {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}

export function uid(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function hasOwn(obj: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

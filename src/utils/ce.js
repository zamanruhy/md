/*!
 * Some things are borrowed from
 * https://github.com/solidjs/solid/tree/main/packages/solid-element
 * https://github.com/ryansolid/component-register
 */

import { createRoot, getOwner } from 'solid-js'
import { insert } from 'solid-js/web'
import { createMutable } from 'solid-js/store'

export default function customElement(name, Component, propList = []) {
  const attrList = propList.map(hyphenate)

  class SolidElement extends HTMLElement {
    constructor() {
      super()
      this.solidProps = null
      this._dispose = null
      this._props = {}
    }

    _upgradeProps() {
      propList.forEach((prop) => {
        if (Object.prototype.hasOwnProperty.call(this, prop)) {
          const value = this[prop]
          delete this[prop]
          this._props[prop] = value
        }
      })
    }

    _handleAttributes() {
      if (this._attributesHandled) {
        return
      }
      this._attributesHandled = true

      for (const attribute of this.attributes) {
        let { name, value } = attribute

        if (name.startsWith('.')) {
          name = name.slice(1)
          value = new Function(`return ${value}`)()
        }

        if (attrList.includes(name)) {
          name = camelize(name)
        }

        this._props[name] = value
      }
    }

    _handleChildren() {
      if (this._childrenHandled) {
        return
      }
      this._childrenHandled = true

      const children = Array.from(this.childNodes)
      if (children.length === 0) return
      this.textContent = ''

      children.forEach((child) => {
        const name =
          child.nodeType !== Node.ELEMENT_NODE || !child.hasAttribute('slot')
            ? 'children'
            : child.getAttribute('slot')
        const wrapChild = () => {
          if (child instanceof HTMLElement) {
            child._$owner = getOwner()
          }
          return child
        }
        this._props[name] = (this._props[name] || []).concat(wrapChild)
      })
    }

    _lookupContext() {
      if (this._$owner) return this._$owner
      let next = this.parentNode
      while (next && !next._$owner) next = next.parentNode
      return next ? next._$owner : this._$owner
    }

    connectedCallback() {
      if (this.solidProps) return

      this._handleAttributes()
      this._handleChildren()
      this._upgradeProps()

      createRoot((dispose) => {
        this.solidProps = createMutable(this._props)
        this._dispose = dispose
        return insert(this, Component(this.solidProps))
      }, this._lookupContext())

      this.dispatchEvent(new CustomEvent('mount'))
    }

    async disconnectedCallback() {
      // wait to check if it's a move or a removal
      await Promise.resolve()
      if (this.isConnected) return

      this._dispose()
      this.solidProps = this._dispose = null
      this.textContent = ''

      this.dispatchEvent(new CustomEvent('destroy'))
    }
  }

  propList.forEach((prop) => {
    Object.defineProperty(SolidElement.prototype, prop, {
      get() {
        if (this.solidProps) {
          return this.solidProps[prop]
        } else {
          return this._props[prop]
        }
      },
      set(value) {
        this._props[prop] = value

        if (this.solidProps) {
          this.solidProps[prop] = value
        }
      }
    })
  })

  if (!window.customElements.get(name)) {
    window.customElements.define(name, SolidElement)
  }
}

function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => {
    return c ? c.toUpperCase() : ''
  })
}

function hyphenate(str) {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}

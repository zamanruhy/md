import { onMount, splitProps } from 'solid-js'

import './Hamburger.css'

function script() {
  const el = document.querySelector('.hamburger')
  if (!el) return

  let active = false

  el.addEventListener('click', (e) => {
    window.dispatchEvent(new CustomEvent('toggle-nav', { detail: !active }))
  })

  window.addEventListener('toggle-nav', (e) => {
    active = e.detail
    el.classList.toggle('hamburger_active', e.detail)
  })
}

if (import.meta.env.PROD && !import.meta.env.SSR) {
  script()
}

export default function Hamburger(props) {
  onMount(script)
  const [, rest] = splitProps(props, ['active', 'class', 'classList'])

  return (
    <button
      class="hamburger"
      classList={{ [props.class]: Boolean(props.class), ...props.classList }}
      type="button"
      aria-label="Toggle menu"
      {...rest}
    >
      <span class="hamburger__bar" />
      <span class="hamburger__bar" />
      <span class="hamburger__bar" />
    </button>
  )
}

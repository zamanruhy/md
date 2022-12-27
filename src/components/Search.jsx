import MagIcon from '../icons/mag.svg?component'
import CloseIcon from '../icons/close.svg?component'
import { onMount } from 'solid-js'

import './Search.css'

function script() {
  const el = document.querySelector('.search')
  if (!el) return

  const inputEl = el.querySelector('.search__input')
  const closeEl = el.querySelector('.search__close')

  window.addEventListener('open-search', (e) => {
    el.classList.add('search_open')
    inputEl.focus()
  })

  closeEl.addEventListener('click', (e) => {
    el.classList.remove('search_open')
  })
}

if (import.meta.env.PROD && !import.meta.env.SSR) {
  script()
}

export default function Search() {
  onMount(script)
  return (
    <form className="search">
      <div className="search__inner">
        <input
          type="text"
          name="q"
          required
          className="search__input"
          placeholder="Я ищу"
        />
        <div className="search__actions">
          <button type="submit" className="search__button">
            <MagIcon />
          </button>
          <span className="search__divider" />
          <button type="button" className="search__close">
            <CloseIcon />
          </button>
        </div>
      </div>
    </form>
  )
}

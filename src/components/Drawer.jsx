import PinIcon from '../icons/pin.svg?component'
import CalendarIcon from '../icons/calendar.svg?component'
import PhoneIcon from '../icons/phone.svg?component'

import { links } from './Nav'

import './Drawer.css'
import { onMount } from 'solid-js'

function script() {
  const el = document.querySelector('.drawer')
  if (!el) return

  const linkEls = Array.from(el.querySelectorAll('.drawer__link'))

  window.addEventListener('toggle-nav', (e) => {
    el.classList.toggle('drawer_open', e.detail)
  })

  linkEls.forEach((linkEl) => {
    linkEl.addEventListener('click', (e) => {
      window.dispatchEvent(new CustomEvent('toggle-nav', { detail: false }))
    })
  })
}

if (import.meta.env.PROD && !import.meta.env.SSR) {
  script()
}

export default function Drawer() {
  onMount(script)
  return (
    <div className="drawer">
      <nav className="drawer__nav">
        <ul className="drawer__list">
          {links.map(({ href, text }) => (
            <li className="drawer__item">
              <a href={href} className="drawer__link">
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="drawer__footer">
        <div className="drawer__pin">
          <PinIcon className="drawer__pin-icon" />
          <span className="drawer__pin-text">
            Чебоксары, <br />
            Энтузиастов 1А
          </span>
        </div>

        <div className="drawer__work">
          <CalendarIcon className="drawer__work-icon" />
          <span className="drawer__work-text">
            <span className="drawer__work-time">с 09:00 - 20:00</span>
            <span className="drawer__work-suf">пн-сб</span>
          </span>
        </div>

        <a href="tel:+79003331040" className="drawer__phone">
          <PhoneIcon className="drawer__phone-icon" />
          <span className="drawer__phone-text">+7900 333 10 40</span>
        </a>
      </div>
    </div>
  )
}

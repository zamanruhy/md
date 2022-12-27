import Nav from './Nav'
import Social from './Social'

import PinIcon from '../icons/pin.svg?component'
import CalendarIcon from '../icons/calendar.svg?component'
import PhoneIcon from '../icons/phone.svg?component'
import MagIcon from '../icons/mag.svg?component'

import Button from './Button'
import Search from './Search'
import Hamburger from './Hamburger'

import './Header.css'
import Drawer from './Drawer'
import { onMount } from 'solid-js'

function script() {
  const el = document.querySelector('.header')
  if (!el) return

  const searchBtnEl = document.querySelector('.header__search-button')

  searchBtnEl.addEventListener('click', (e) => {
    window.dispatchEvent(new CustomEvent('open-search'))
  })
}

if (import.meta.env.PROD && !import.meta.env.SSR) {
  script()
}

export default function Header() {
  onMount(script)
  return (
    <header class="header">
      <div class="container">
        <div className="header__inner">
          <div className="header__left">
            <Social className="header__social" />
            <Nav className="header__nav" />

            <Search />
            <button type="button" className="header__search-button">
              <MagIcon />
            </button>
          </div>

          <div className="header__spacer" />

          <div className="header__pin">
            <PinIcon className="header__pin-icon" />
            <span className="header__pin-text">
              Чебоксары, <br />
              Энтузиастов 1А
            </span>
          </div>

          <div className="header__work">
            <CalendarIcon className="header__work-icon" />
            <span className="header__work-text">
              <span className="header__work-time">с 09:00 - 20:00</span>
              <span className="header__work-suf">пн-сб</span>
            </span>
          </div>

          <a href="tel:+79003331040" className="header__phone">
            <PhoneIcon className="header__phone-icon" />
            <span className="header__phone-text">+7900 333 10 40</span>
          </a>

          <button className="header__mobile-callback">
            <PhoneIcon className="header__mobile-callback-icon" />
          </button>

          <Button type="button" variant="primary" className="header__callback">
            Заказать звонок
          </Button>

          <Hamburger />
        </div>
      </div>
      <Drawer />
    </header>
  )
}

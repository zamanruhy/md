import { onMount } from 'solid-js'
import Service from './Service'

import TreatmentIcon from '../icons/treatment.svg?component'
import HygieneIcon from '../icons/hygiene.svg?component'
import BraceIcon from '../icons/brace.svg?component'
import PediatricIcon from '../icons/pediatric.svg?component'
import ImplantIcon from '../icons/implant.svg?component'
import VeneerIcon from '../icons/veneer.svg?component'
import CrownIcon from '../icons/crown.svg?component'
import SurgeryIcon from '../icons/surgery.svg?component'

import './Services.css'

const items = [
  { name: 'Лечение зубов', Icon: TreatmentIcon, size: 'h-[61px]' },
  { name: 'Гигиена', Icon: HygieneIcon, size: 'h-[62px]' },
  { name: 'Брекеты', Icon: BraceIcon, size: 'h-[44px]' },
  { name: 'Детская стоматология', Icon: PediatricIcon, size: 'h-[62px]' },
  { name: 'Импланты', Icon: ImplantIcon, size: 'h-[77px]' },
  { name: 'Виниры', Icon: VeneerIcon, size: 'h-[47px]' },
  { name: 'Коронки', Icon: CrownIcon, size: 'h-[66px]' },
  { name: 'Хирургия', Icon: SurgeryIcon, size: 'h-[80px]' }
]

function script() {
  const els = Array.from(document.querySelectorAll('.service'))
  if (!els.length) return

  els.forEach((el) => {
    const buttonEl = el.querySelector('.service__button')

    buttonEl.addEventListener('click', (e) => {
      if (el.classList.contains('service_open')) {
        el.classList.remove('service_open')
      } else {
        els.forEach((node) => node.classList.remove('service_open'))
        el.classList.add('service_open')
      }
    })
  })
}

if (import.meta.env.PROD && !import.meta.env.SSR) {
  script()
}

export default function Services() {
  onMount(script)
  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="title services__title">Услуги</h2>
        <p className="services__lead">
          Мы постарались сделать прайс, максимально простым и понятным.
        </p>
        <div className="services__items">
          {items.map((item, i) => (
            <Service {...item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

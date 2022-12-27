import awardsImg from '../images/awards-slide.jpg?jpg'
import Image from './Image'
import EmblaCarousel from 'embla-carousel'

import './Awards.css'
import { onMount } from 'solid-js'

function script() {
  const el = document.querySelector('.awards')
  if (!el) return

  const sliderEl = el.querySelector('.awards__slider')
  const prevEl = el.querySelector('.awards__slider-prev')
  const nextEl = el.querySelector('.awards__slider-next')

  const embla = EmblaCarousel(sliderEl, {
    loop: false,
    containScroll: 'trimSnaps',
    align: 'start',
    slidesToScroll: 1,
    speed: 20,
    skipSnaps: true
  })

  function update() {
    prevEl.disabled = !embla.canScrollPrev()
    nextEl.disabled = !embla.canScrollNext()
  }

  embla.on('select', update)
  embla.on('init', update)

  prevEl.addEventListener('click', (e) => embla.scrollPrev())
  nextEl.addEventListener('click', (e) => embla.scrollNext())
}

if (import.meta.env.PROD && !import.meta.env.SSR) {
  script()
}

export default function Awards() {
  onMount(script)
  return (
    <section class="awards">
      <div class="awards__container container">
        <h2 class="awards__title title">Сертификаты, награды и дипломы</h2>
        <div class="awards__slider-wrap">
          <div class="awards__slider-controls">
            <button class="control control_prev awards__slider-prev"></button>
            <button class="control control_next awards__slider-next"></button>
          </div>
          <div class="awards__slider">
            <div class="awards__slider-wrapper">
              {Array.from({ length: 4 }).map((_) => (
                <div class="awards__slider-slide">
                  <div class="awards__slider-image">
                    <Image src={awardsImg} loading="lazy" alt="Slide" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

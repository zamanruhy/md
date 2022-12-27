import logoImg from '../images/logo.svg?metadata'
import company1Img from '../images/company-1.png?png'
import company2Img from '../images/company-2.png?png'
import company3Img from '../images/company-3.png?png'
import aboutSlideImg from '../images/about-slide.jpg?jpg'

import EmblaCarousel from 'embla-carousel'

import Image from './Image'

import './About.css'
import { onMount } from 'solid-js'

function script() {
  const el = document.querySelector('.about')
  if (!el) return

  const sliderEl = el.querySelector('.about__slider')
  const prevEl = el.querySelector('.about__slider-prev')
  const nextEl = el.querySelector('.about__slider-next')

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

export default function About() {
  onMount(script)
  return (
    <section id="about" class="about">
      <div class="about__container container">
        <h2 class="title about__title">Лечение у нас</h2>
        <div class="about__desc">
          Просто и безболезненно, с предоставлением всего спектра
          стоматологических услуг
        </div>
        <div class="about__grid">
          <div class="about__info">
            <div class="about__logo">
              <Image
                class="about__logo-icon"
                src={logoImg}
                alt="MD"
                loading="lazy"
              />
              <span class="about__logo-legend">клиника</span>
            </div>
            <p>
              предоставляет весь спектр <br />
              стоматологических услуг таких как :{' '}
            </p>
            <div class="about__tags">
              <div class="about__tags-item">Терапия</div>
              <div class="about__tags-item">Хирургия</div>
              <div class="about__tags-item">Ортодонтия</div>
              <div class="about__tags-item">Детская стоматология</div>
              <div class="about__tags-item">Ортопедия</div>
            </div>
            <p>
              Приоритетным направлением является восстановление функциональных
              возможностей зубочелюстной системы и профилактика заболевания
              полости рта.
            </p>
            <div class="about__companies">
              <Image
                class="about__company"
                src={company1Img}
                alt="Voxel"
                loading="lazy"
              />
              <Image
                class="about__company"
                src={company2Img}
                alt="Ortholight"
                loading="lazy"
              />
              <Image
                class="about__company"
                src={company3Img}
                alt="RocadaMed"
                loading="lazy"
              />
            </div>
          </div>
          <div class="about__slider-wrap">
            <div class="about__slider-controls">
              <button class="control control_prev about__slider-prev"></button>
              <button class="control control_next about__slider-next"></button>
            </div>
            <div class="about__slider">
              <div class="about__slider-wrapper">
                {Array.from({ length: 3 }).map((_) => (
                  <div class="about__slider-slide">
                    <div class="about__slider-image">
                      <Image src={aboutSlideImg} alt="Slide" loading="lazy" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import introImg from '../images/intro.jpg?jpg'

import DoctorIcon from '../icons/doctor.svg?component'
import ChairIcon from '../icons/chair.svg?component'
import LocationIcon from '../icons/location.svg?component'

import Button from './Button'
import Image from './Image'

import './Intro.css'

export default function Intro() {
  return (
    <section className="intro">
      <div className="container">
        <div className="intro__inner">
          <Image
            src={introImg}
            alt=""
            fetchpriority="high"
            className="intro__img"
          />
          <div className="intro__content">
            <div className="intro__caption">
              <span className="intro__legend">— Стоматология в Чебоксарах</span>
              <h1 className="intro__title">
                Лечение зубов <br />в тот же день
              </h1>
              <p className="intro__text">
                Мы проведем полную консультацию, профессиональную гигиену
                полости рта, лечение зубов и десен
              </p>
              <Button
                as="a"
                href="#"
                variant="primary"
                className="intro__button"
              >
                Записаться на приём
              </Button>
            </div>
          </div>

          <div className="intro__nav">
            <a href="#" className="intro__nav-link">
              <DoctorIcon classList={{ 'h-[39px]': true }} />
              <span className="intro__nav-text">
                Команда квалифицированных <br />
                специалистов
              </span>
            </a>
            <a href="#" className="intro__nav-link">
              <ChairIcon classList={{ 'h-[40px]': true }} />
              <span className="intro__nav-text">
                3 стоматологических <br />
                кабинета
              </span>
            </a>
            <a href="#" className="intro__nav-link">
              <LocationIcon classList={{ 'h-[43px]': true }} />
              <span className="intro__nav-text">
                Удобное <br />
                расположение
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

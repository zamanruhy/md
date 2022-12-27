import aboutSlideImg from '../images/about-slide.jpg?jpg'
import Image from './Image'

import './Persons.css'

export default function Persons() {
  return (
    <section id="persons" class="persons">
      <div class="persons__container container">
        <h2 class="persons__title title">Специалисты</h2>
        <div class="persons__desc">
          Просто и безболезненно, с предоставлением всего спектра
          стоматологических услуг
        </div>
        <div class="persons__grid">
          <div class="person">
            <div class="person__info">
              <h3 class="person__title">
                Шац Дарья <br />
                Сергеевна{' '}
              </h3>
              <div class="person__legend">
                Директор, Главный врач , Врач ортодонт
              </div>
              <div class="person__legend">Стаж работы 11 лет </div>
            </div>
            <div class="person__image">
              <Image src={aboutSlideImg} loading="lazy" alt="Дарья" />
            </div>
          </div>
          <div class="person">
            <div class="person__info">
              <h3 class="person__title">
                Оленина Марина <br />
                Николаевна
              </h3>
              <div class="person__legend">
                Зам директора, Врач стоматолог терапевт
              </div>
              <div class="person__legend">Стаж работы более 25 лет </div>
            </div>
            <div class="person__image">
              <Image src={aboutSlideImg} loading="lazy" alt="Дарья" />
            </div>
          </div>
          <div class="person">
            <div class="person__info">
              <h3 class="person__title">
                Лыщиков Павел <br />
                Анатольевич
              </h3>
              <div class="person__legend">
                Врач стоматолог ортопед, хирург-имплантолог
              </div>
              <div class="person__legend">Стаж работы более 15 лет</div>
            </div>
            <div class="person__image">
              <Image src={aboutSlideImg} loading="lazy" alt="Дарья" />
            </div>
          </div>
          <div class="person">
            <div class="person__info">
              <h3 class="person__title">
                Жирнов Дмитрий <br />
                Александрович{' '}
              </h3>
              <div class="person__legend">
                Врач стоматолог ортопед, хирург-имплантолог
              </div>
              <div class="person__legend">Стаж более 10 лет</div>
            </div>
            <div class="person__image">
              <Image src={aboutSlideImg} loading="lazy" alt="Дарья" />
            </div>
          </div>
          <div class="person">
            <div class="person__info">
              <h3 class="person__title">
                Терушкина Елена <br />
                Дмитриевна
              </h3>
              <div class="person__legend">Врач стоматолог детский</div>
              <div class="person__legend">Стаж работы более 10 лет </div>
            </div>
            <div class="person__image">
              <Image src={aboutSlideImg} loading="lazy" alt="Дарья" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import Button from './Button'
import Image from './Image'
import Input from './Input'
import './Request.css'

export default function Request({ className, title, src }) {
  return (
    <section class="request" classList={{ [className]: Boolean(className) }}>
      <div class="request__container container">
        <div class="request__info">
          <h2 class="title request__title">{title}</h2>
          <div class="request__desc">
            Укажите вой номер телефона, мы перезвоним и подберем для вас удобное
            время приёма. Или позвоните нам сами —{' '}
            <a href="tel:+7 900 333 10 40" target="_blank">
              +7 900 333 10 40
            </a>
          </div>
        </div>
        <form class="request__form">
          <Input placeholder="Телефон" required />

          <Button variant="primary" className="request__button" type="submit">
            Записаться на прием
          </Button>
        </form>
        <div class="request__note">
          Записываясь на услугу вы даёте согласие на{' '}
          <a href="#" target="_blank">
            обработку своих персональных данных
          </a>
        </div>
        <div class="request__image">
          <Image src={src} alt="" loading="lazy" />
        </div>
      </div>
    </section>
  )
}

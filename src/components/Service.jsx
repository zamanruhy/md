import TreatmentIcon from '../icons/treatment.svg?component'

import CaretIcon from '../icons/caret.svg?component'

import Button from './Button'

import './Service.css'

export default function Service({ name, Icon, size, index }) {
  return (
    <article className="service" classList={{ service_open: index === '0' }}>
      <button type="button" className="service__button">
        <span className="service__caption">
          <span className="service__pic">
            <Icon className={`service__icon ${size}`} />
          </span>
          <span className="service__name">{name}</span>
        </span>
        <span className="service__pointer">
          <CaretIcon className="service__pointer-icon" />
        </span>
      </button>
      <div className="service__info">
        {Array.from({ length: 2 }).map((_, i) => (
          <div className="service__info-item">
            <details className="service__info-details">
              <summary className="service__info-summary">
                Световая пломба {index + 1}
              </summary>
              <div className="service__info-extra">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Omnis, rerum sit necessitatibus voluptas ducimus excepturi
                  modi reprehenderit pariatur inventore laborum. Reiciendis
                  voluptatum sit laboriosam magni sunt ipsa, quam perspiciatis
                  earum? Lorem ipsum dolor sit amet, consectetur adipisicing
                  elit. Omnis, rerum sit necessitatibus voluptas ducimus
                  excepturi modi reprehenderit pariatur inventore laborum.
                  Reiciendis voluptatum sit laboriosam magni sunt ipsa, quam
                  perspiciatis earum?
                </p>
                <Button
                  as="a"
                  href="#"
                  variant="primary"
                  className="service__info-button md:hidden"
                >
                  Записаться
                </Button>
              </div>
            </details>
            <Button
              as="a"
              href="#"
              variant="primary"
              className="service__info-button max-md:hidden"
            >
              Записаться
            </Button>
          </div>
        ))}
      </div>
    </article>
  )
}

import logoImg from '../images/logo.svg?metadata'
import Social from './Social'
import './Footer.css'
import Image from './Image'

export default function Footer() {
  return (
    <footer class="footer">
      <div class="footer__container container">
        <Social lg />
        <div class="footer__copyright">
          ООО «Дент», лицензия №ЛО-86-8681-01868686047 от 13.02.2099 <br />©
          2018-2021
        </div>
        <a href="#" class="footer__link">
          Политика в отношении обработки <br />
          персональных данных
        </a>
        <div class="footer__logo">
          <Image src={logoImg} alt="MD" loading="lazy" />
        </div>
      </div>
    </footer>
  )
}

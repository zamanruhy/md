import './Nav.css'

export const links = [
  { href: '#about', text: 'О нас' },
  { href: '#services', text: 'Услуги' },
  { href: '#persons', text: 'Специалисты' },
  { href: '#', text: 'Пациентам' },
  { href: '#', text: 'Контакты' }
]

export default function Nav({ className }) {
  return (
    <nav className="nav" classList={{ [className]: Boolean(className) }}>
      <ul className="nav__list">
        {links.map(({ href, text }) => (
          <li className="nav__item">
            <a href={href} className="nav__link">
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

import GoogleIcon from '../icons/google.svg?component'
import InstIcon from '../icons/inst.svg?component'
import InvIcon from '../icons/inv.svg?component'

import './Social.css'

export default function Social({ className, lg }) {
  return (
    <ul
      className="social"
      classList={{ [className]: Boolean(className), social_lg: lg }}
    >
      <li className="social__item">
        <a href="#" target="_blank" className="social__link">
          <GoogleIcon />
        </a>
      </li>
      <li className="social__item">
        <a href="#" target="_blank" className="social__link">
          <InstIcon />
        </a>
      </li>
      <li className="social__item">
        <a href="#" target="_blank" className="social__link">
          <InvIcon />
        </a>
      </li>
    </ul>
  )
}

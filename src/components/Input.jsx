import { splitProps } from 'solid-js'

import './Input.css'

export default function Input(props) {
  const [, rest] = splitProps(props, ['className'])

  return (
    <div className="input">
      <input
        className="input__input"
        classList={{ [props.className]: Boolean(props.className) }}
        type="text"
        {...rest}
      />
    </div>
  )
}

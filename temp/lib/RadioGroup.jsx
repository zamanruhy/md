import {
  createContext,
  createEffect,
  createSignal,
  mergeProps,
  splitProps
} from 'solid-js'

export const RadioGroupContext = createContext({})

export default function RadioGroup(props) {
  const [, rest] = splitProps(props, ['name', 'value', 'onChange'])
  const [localValue, setLocalValue] = createSignal(props.value)

  createEffect(() => setLocalValue(props.value))

  return (
    <div role="radiogroup" {...rest}>
      <RadioGroupContext.Provider
        value1={mergeProps(props, { value: localValue() })}
        value={{
          get name() {
            return props.name
          },
          get value() {
            return localValue()
          },
          onChange(e) {
            setLocalValue(e.target.value)
            props.onChange?.(e)
          }
        }}
      >
        {props.children}
      </RadioGroupContext.Provider>
    </div>
  )
}

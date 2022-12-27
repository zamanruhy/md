import {
  createEffect,
  createMemo,
  createSignal,
  splitProps,
  useContext
} from 'solid-js'
import { RadioGroupContext } from './RadioGroup.jsx'

export default function Checkbox(props) {
  const [, rest] = splitProps(props, [
    'class',
    'classList',
    'style',
    'label',
    'checked',
    'disabled',
    'value',
    'name',
    'onChange'
  ])
  const context = useContext(RadioGroupContext)
  const checked = createMemo(() =>
    'value' in context ? props.value === context.value : props.checked
  )
  const [localChecked, setLocalChecked] = createSignal(checked())

  createEffect(() => setLocalChecked(checked()))

  return (
    <label
      class="relative isolate flex w-fit cursor-pointer select-none items-center"
      classList={{
        [props.class]: Boolean(props.class),
        ...props.classList,
        'pointer-events-none': props.disabled
      }}
      style={props.style}
    >
      <input
        class="peer sr-only"
        type="radio"
        checked={localChecked()}
        disabled={props.disabled}
        value={props.value}
        name={context.name ?? props.name}
        onChange={(e) => {
          setLocalChecked(e.target.checked)
          context.onChange?.(e) ?? props.onChange?.(e)
        }}
        {...rest}
      />
      <span
        class="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 peer-focus-visible:ring peer-focus-visible:ring-blue-500/50 peer-focus-visible:ring-offset-2"
        classList={{
          'border-slate-200': props.disabled,
          'bg-slate-200': localChecked() && props.disabled,
          'bg-blue-500': localChecked() && !props.disabled,
          'border-0': localChecked()
        }}
        aria-hidden="true"
      >
        <span class="absolute top-1/2 left-1/2 -z-10 h-full min-h-9 w-full min-w-9 -translate-y-1/2 -translate-x-1/2 rounded-[inherit]" />
        {localChecked() && (
          <span class="h-2 w-2 shrink-0 rounded-[inherit] bg-white" />
        )}
      </span>
      {props.label && (
        <span class="ml-2" classList={{ 'opacity-60': props.disabled }}>
          {props.label}
        </span>
      )}
    </label>
  )
}

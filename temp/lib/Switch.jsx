import { createEffect, createSignal, splitProps } from 'solid-js'

export default function Switch(props) {
  const [, rest] = splitProps(props, [
    'class',
    'classList',
    'style',
    'label',
    'checked',
    'disabled',
    'onChange'
  ])
  const [localChecked, setLocalChecked] = createSignal(props.checked)

  createEffect(() => setLocalChecked(props.checked))

  return (
    <label
      class="relative isolate flex w-fit cursor-pointer select-none items-center"
      classList={{
        [props.class]: Boolean(props.class),
        ...props.classList,
        'pointer-events-none cursor-default opacity-60': props.disabled
      }}
      style={props.style}
    >
      <input
        class="peer sr-only"
        type="checkbox"
        checked={localChecked()}
        disabled={props.disabled}
        onChange={(e) => {
          setLocalChecked(e.target.checked)
          props.onChange?.(e)
        }}
        {...rest}
      />
      <span
        class="relative h-5 w-10 shrink-0 rounded-full transition peer-focus-visible:ring peer-focus-visible:ring-blue-500/50 peer-focus-visible:ring-offset-2"
        classList={{
          'bg-slate-300': !localChecked(),
          'bg-blue-500': localChecked()
        }}
        aria-hidden="true"
      >
        <span class="absolute top-1/2 left-1/2 -z-10 h-full min-h-9 w-full min-w-9 -translate-y-1/2 -translate-x-1/2 rounded-[inherit]" />
        <span
          class="absolute top-0.5 left-0.5 h-4 w-4 rounded-[inherit] bg-white transition"
          classList={{ 'translate-x-5': localChecked() }}
        />
      </span>
      {props.label && <span class="ml-2">{props.label}</span>}
    </label>
  )
}

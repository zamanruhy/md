import { createEffect, createSignal, splitProps } from 'solid-js'

export default function Checkbox(props) {
  const [, rest] = splitProps(props, [
    'class',
    'classList',
    'style',
    'label',
    'checked',
    'onChange',
    'disabled',
    'indeterminate'
  ])
  const [localChecked, setLocalChecked] = createSignal(props.checked)

  createEffect(() => setLocalChecked(props.checked))

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
        type="checkbox"
        checked={localChecked()}
        disabled={props.disabled}
        indeterminate={props.indeterminate}
        onChange={(e) => {
          setLocalChecked(e.target.checked)
          props.onChange?.(e)
        }}
        {...rest}
      />
      <span
        class="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-sm border border-slate-300 peer-focus-visible:ring peer-focus-visible:ring-blue-500/50 peer-focus-visible:ring-offset-2"
        classList={{
          'border-slate-200': props.disabled,
          'bg-slate-200':
            (localChecked() || props.indeterminate) && props.disabled,
          'bg-blue-500':
            (localChecked() || props.indeterminate) && !props.disabled,
          'border-0': localChecked() || props.indeterminate
        }}
        aria-hidden="true"
      >
        <span class="absolute top-1/2 left-1/2 -z-10 h-full min-h-9 w-full min-w-9 -translate-y-1/2 -translate-x-1/2 rounded-[inherit]" />
        {(props.indeterminate && (
          <svg viewBox="0 0 16 16" class="h-full w-full fill-white">
            <path d="M3 7h10v2H3z" />
          </svg>
        )) ||
          (localChecked() && (
            <svg viewBox="0 0 16 16" class="h-full w-full fill-white">
              <path d="M6 13 1 8l1.41-1.41L6 10.17l7.59-7.59L15 4Z" />
            </svg>
          ))}
      </span>
      {props.label && (
        <span class="ml-2" classList={{ 'opacity-60': props.disabled }}>
          {props.label}
        </span>
      )}
    </label>
  )
}

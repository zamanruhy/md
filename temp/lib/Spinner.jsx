import { mergeProps, splitProps } from 'solid-js'

export default function Spinner(props) {
  props = mergeProps({ size: 40, thickness: 4 }, props)
  const [, rest] = splitProps(props, [
    'size',
    'thickness',
    'class',
    'classList',
    'style'
  ])

  return (
    <div
      class="relative"
      classList={{ [props.class]: Boolean(props.class), ...props.classList }}
      style={{
        ...props.style,
        width: `${props.size}px`,
        height: `${props.size}px`
      }}
      role="progressbar"
      {...rest}
    >
      <svg
        class="absolute top-0 left-0 h-full w-full animate-[spin_0.8s_linear_infinite]"
        fill="transparent"
      >
        <circle
          class="opacity-20"
          cx="50%"
          cy="50%"
          r={`${(props.size - props.thickness) / 2}px`}
          stroke="currentColor"
          stroke-width={`${props.thickness}px`}
        />
        <circle
          cx="50%"
          cy="50%"
          r={`${(props.size - props.thickness) / 2}px`}
          stroke="currentColor"
          stroke-width={`${props.thickness}px`}
          pathLength="1"
          stroke-dasharray="0.4 0.6"
        />
      </svg>
    </div>
  )
}

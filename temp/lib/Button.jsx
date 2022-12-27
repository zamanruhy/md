import { splitProps, mergeProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import Spinner from './Spinner'

export default function Button(props) {
  props = mergeProps({ as: 'button' }, props)
  const [, rest] = splitProps(props, [
    'class',
    'classList',
    'as',
    'variant',
    'size',
    'disabled',
    'loading',
    'spinner',
    'children',
    'href'
  ])

  return (
    <Dynamic
      component={props.as}
      class="relative inline-flex cursor-pointer items-center justify-center text-center align-middle transition focus:outline-none"
      classList={{
        [props.class]: Boolean(props.class),
        ...props.classList,
        'bg-blue-500 text-white hover:bg-blue-400 focus-visible:ring focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 active:bg-blue-600':
          props.variant === 'primary' && !props.disabled,
        'text-slate-500 bg-slate-300 pointer-events-none': props.disabled,
        'pointer-events-none': props.loading,
        'min-h-10 py-1 px-5 text-base rounded': props.size === 'md'
      }}
      href={props.disabled || props.loading ? null : props.href}
      disabled={props.disabled || props.loading}
      {...rest}
    >
      {props.loading ? (
        <>
          <span class="invisible contents">{props.children}</span>
          <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {props.spinner || <Spinner size={22} thickness={2} />}
          </span>
        </>
      ) : (
        props.children
      )}
    </Dynamic>
  )
}

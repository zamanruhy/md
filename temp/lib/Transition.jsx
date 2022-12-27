import {
  createContext,
  createEffect,
  createSignal,
  Show,
  useContext
} from 'solid-js'
import { Dynamic } from 'solid-js/web'

const TransitionRootContext = createContext()

function useTransitionRootContext(componentName) {
  const context = useContext(TransitionRootContext)

  if (context) {
    return context
  }
  throw new Error(`<${componentName}> must be used inside a <Transition>`)
}
function addClassList(ref, classes) {
  const filtered = classes.filter((value) => value)
  if (filtered.length) {
    ref.classList.add(...filtered)
  }
}
function removeClassList(ref, classes) {
  const filtered = classes.filter((value) => value)
  if (filtered.length) {
    ref.classList.remove(...filtered)
  }
}

export function TransitionChild(props) {
  const values = useTransitionRootContext('TransitionChild')

  const [visible, setVisible] = createSignal(values.show)
  const [ref, setRef] = createSignal()

  let initial = true

  function transition(element, shouldEnter) {
    if (shouldEnter) {
      if (initial) {
        const enter = props.enter?.split(' ') ?? []
        const enterFrom = props.enterFrom?.split(' ') ?? []
        const enterTo = props.enterTo?.split(' ') ?? []
        const entered = props.entered?.split(' ') ?? []

        const endTransition = () => {
          removeClassList(element, enter)
          removeClassList(element, enterTo)
          addClassList(element, entered)
          props.afterEnter?.()
        }

        props.beforeEnter?.()
        addClassList(element, enter)
        addClassList(element, enterFrom)

        requestAnimationFrame(() => {
          removeClassList(element, enterFrom)
          addClassList(element, enterTo)
          element.addEventListener('transitionend', endTransition, {
            once: true
          })
          element.addEventListener('animationend', endTransition, {
            once: true
          })
        })
      }
    } else {
      const leave = props.leave?.split(' ') ?? []
      const leaveFrom = props.leaveFrom?.split(' ') ?? []
      const leaveTo = props.leaveTo?.split(' ') ?? []
      const entered = props.entered?.split(' ') ?? []
      props.beforeLeave?.()
      removeClassList(element, entered)
      addClassList(element, leave)
      addClassList(element, leaveFrom)
      requestAnimationFrame(() => {
        removeClassList(element, leaveFrom)
        addClassList(element, leaveTo)
      })
      const endTransition = () => {
        removeClassList(element, leave)
        removeClassList(element, leaveTo)
        setVisible(false)
        props.afterLeave?.()
      }
      element.addEventListener('transitionend', endTransition, { once: true })
      element.addEventListener('animationend', endTransition, { once: true })
    }
  }

  createEffect(() => {
    const shouldShow = values.show

    if (shouldShow) {
      setVisible(true)
    }

    const internalRef = ref()
    if (internalRef instanceof HTMLElement) {
      transition(internalRef, shouldShow)
    } else {
      // Ref is missing, reset initial
      initial = true
    }
  })

  return (
    <Show
      when={props.unmount ?? true}
      fallback={
        <Dynamic
          component={props.as ?? 'div'}
          {...omitProps(props, [
            'as',
            'enter',
            'enterFrom',
            'enterTo',
            'leave',
            'leaveFrom',
            'leaveTo',
            'unmount',
            'afterEnter',
            'afterLeave',
            'appear',
            'beforeEnter',
            'beforeLeave',
            'entered',
            'ref'
          ])}
          ref={createRef(props, (e) => {
            setRef(() => e)
          })}
        >
          {props.children}
        </Dynamic>
      }
    >
      <Show when={visible()}>
        <Dynamic
          component={props.as ?? 'div'}
          {...omitProps(props, [
            'as',
            'enter',
            'enterFrom',
            'enterTo',
            'leave',
            'leaveFrom',
            'leaveTo',
            'unmount',
            'afterEnter',
            'afterLeave',
            'appear',
            'beforeEnter',
            'beforeLeave',
            'entered',
            'ref'
          ])}
          ref={createRef(props, (e) => {
            setRef(() => e)
          })}
        >
          {props.children}
        </Dynamic>
      </Show>
    </Show>
  )
}

export function Transition(props) {
  const excludedProps = omitProps(props, ['show'])
  return (
    <TransitionRootContext.Provider
      value={{
        get show() {
          return props.show
        }
      }}
    >
      <TransitionChild {...excludedProps} />
    </TransitionRootContext.Provider>
  )
}

function isRefFunction(callback) {
  return typeof callback === 'function'
}
export function createRef(props, callback) {
  return (e) => {
    if ('ref' in props && isRefFunction(props.ref)) {
      props.ref(e)
    }
    callback(e)
  }
}

function omitProps(value, keys) {
  const newObject = {}
  const currentKeys = Object.keys(value)
  for (let i = 0, len = currentKeys.length; i < len; i += 1) {
    const key = currentKeys[i]
    if (!keys.includes(key)) {
      Object.defineProperty(newObject, key, {
        get() {
          return value[key]
        },
        configurable: true,
        enumerable: true
      })
    }
  }
  return newObject
}

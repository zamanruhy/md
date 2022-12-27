import {
  mergeProps,
  splitProps,
  onMount,
  onCleanup,
  createSignal,
  createMemo
} from 'solid-js'
import Backdrop from './Backdrop.jsx'
import { Transition, TransitionChild } from './Transition.jsx'
import useModal from '@/hooks/use-modal'

export default function Dialog(props) {
  props = mergeProps(
    {
      open: false,
      closeOnBackdrop: true,
      closeOnEscape: true
    },
    props
  )
  const [, rest] = splitProps(props, [
    'class',
    'classList',
    'open',
    'closeOnBackdrop',
    'closeOnEscape',
    'header',
    'children',
    'footer'
  ])
  const [mounted, setMounted] = createSignal(false)
  const open = createMemo(() => props.open && mounted())
  const { registerModal, unregisterModal, trapFocus } = useModal()
  let el
  let returnFocusEl = null
  const dialog = {}

  async function onBeforeEnter() {
    props.onOpen?.()
    queueMicrotask(() => {
      returnFocusEl = returnFocusEl || document.activeElement
      registerModal(dialog)
    })
  }
  function onAfterEnter() {
    props.onOpened?.()
    setFocus()
  }
  function onBeforeLeave() {
    props.onClose?.()
  }
  async function onAfterLeave() {
    props.onClosed?.()
    returnFocusEl.focus?.()
    returnFocusEl = null
    unregisterModal(dialog)
  }
  function onEscape(e) {
    if (props.closeOnEscape && e.key === 'Escape') {
      props.onClose()
    }
  }
  function setFocus() {
    if (!el.contains(document.activeElement)) {
      el.focus()
    }
  }

  onMount(() => {
    setMounted(true)

    onCleanup(() => {
      unregisterModal(dialog)
    })
  })

  return (
    <Transition appear show={open()}>
      <Backdrop open={open()} onClick={props.onClose} />
      <TransitionChild
        class="fixed inset-y-0 right-0 z-[2000] max-h-full w-96 max-w-full bg-white outline-none "
        classList={{
          'shadow-xl': open(),
          [props.class]: Boolean(props.class),
          ...props.classList
        }}
        role="dialog"
        aria-modal="true"
        {...rest}
        tabindex="-1"
        ref={el}
        onKeydown={(e) => {
          onEscape(e)
          trapFocus(e)
        }}
        enter="transition duration-200 ease-out"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition duration-150 ease-in"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
        beforeEnter={onBeforeEnter}
        afterEnter={onAfterEnter}
        beforeLeave={onBeforeLeave}
        afterLeave={onAfterLeave}
      >
        <div class="relative flex h-full flex-col">
          {props.header && (
            <div class="flex shrink-0 items-center justify-between py-4 px-6">
              {props.header}
            </div>
          )}
          <button
            class="absolute top-4 right-4 z-10 rounded p-3 transition hover:bg-slate-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500/50"
            type="button"
            aria-label="Close"
            onClick={props.onClose}
          >
            <svg class="h-4 w-4" viewBox="0 0 371.23 371.23" aria-hidden="true">
              <path
                d="M371.23 21.213L350.018 0 185.615 164.402 21.213 0 0
                      21.213l164.402 164.402L0 350.018l21.213 21.212
                      164.402-164.402L350.018 371.23l21.212-21.212-164.402-164.403z"
              />
            </svg>
          </button>
          <div class="grow overflow-y-auto overflow-x-hidden py-2 px-6">
            {props.children}
          </div>
          {props.footer && (
            <div class="flex shrink-0 items-center justify-end py-4 px-6">
              {props.footer}
            </div>
          )}
        </div>
      </TransitionChild>
    </Transition>
  )
}

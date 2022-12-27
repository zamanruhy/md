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
import { Portal } from 'solid-js/web'

export default function Dialog(props) {
  props = mergeProps(
    {
      open: false,
      closeOnBackdrop: true,
      closeOnEscape: true,
      scrollable: false
    },
    props
  )
  const [, rest] = splitProps(props, [
    'class',
    'classList',
    'open',
    'closeOnBackdrop',
    'closeOnEscape',
    'scrollable',
    'header',
    'children',
    'footer'
  ])
  const [mounted, setMounted] = createSignal(false)
  const open = createMemo(() => props.open && mounted())
  const { registerModal, unregisterModal, trapFocus } = useModal()
  let el
  let contentEl
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
  function onClickOut(e) {
    if (props.closeOnBackdrop && !contentEl.contains(e.target)) {
      props.onClose()
    }
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
    <>
      {/* <Transition appear show={open()}>
        <TransitionChild
          class="fixed inset-0 z-[2000] bg-black/50"
          enter="transition-opacity duration-200 ease-in-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150 ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        ></TransitionChild>
      </Transition> */}
      <Transition show={open()}>
        {/* <Backdrop open={open()} /> */}
        {/* <span></span> */}
        <TransitionChild></TransitionChild>
        <Portal>
          <div
            class="fixed inset-0 z-[2000] flex overflow-x-hidden p-2 outline-0 [scrollbar-gutter:both-edges_stable] sm:p-6"
            classList={{
              [props.class]: Boolean(props.class),
              ...props.classList
            }}
            role="dialog"
            aria-modal="true"
            {...rest}
            tabindex="-1"
            ref={el}
            onClick={onClickOut}
            onKeydown={(e) => {
              onEscape(e)
              trapFocus(e)
            }}
          >
            <TransitionChild
              class="m-auto min-w-0"
              classList={{ 'flex max-h-full': props.scrollable }}
              enter="transition duration-200 ease-out"
              enterFrom="scale-90 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="transition duration-150 ease-in"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-90 opacity-0"
              beforeEnter={onBeforeEnter}
              afterEnter={onAfterEnter}
              beforeLeave={onBeforeLeave}
              afterLeave={onAfterLeave}
            >
              <div
                class="relative flex w-[710px] max-w-full flex-col rounded bg-white shadow-xl"
                ref={contentEl}
              >
                {props.header && (
                  <div class="flex shrink-0 items-center justify-between rounded-tl-[inherit] rounded-tr-[inherit] py-4 px-6">
                    {props.header}
                  </div>
                )}
                <button
                  class="absolute top-4 right-4 z-10 rounded p-3 transition hover:bg-slate-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500/50"
                  type="button"
                  aria-label="Close"
                  onClick={props.onClose}
                >
                  <svg
                    class="h-4 w-4"
                    viewBox="0 0 371.23 371.23"
                    aria-hidden="true"
                  >
                    <path
                      d="M371.23 21.213L350.018 0 185.615 164.402 21.213 0 0
                      21.213l164.402 164.402L0 350.018l21.213 21.212
                      164.402-164.402L350.018 371.23l21.212-21.212-164.402-164.403z"
                    />
                  </svg>
                </button>
                <div
                  class="grow overflow-y-auto overflow-x-hidden py-2 px-6"
                  classList={{
                    'overflow-y-auto overflow-x-hidden': props.scrollable
                  }}
                >
                  {props.children}
                </div>
                {props.footer && (
                  <div class="flex shrink-0 items-center justify-end rounded-bl-[inherit] rounded-br-[inherit] py-4 px-6">
                    {props.footer}
                  </div>
                )}
              </div>
            </TransitionChild>
          </div>
        </Portal>
      </Transition>
    </>
  )
}

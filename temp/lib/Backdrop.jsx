import { Portal } from 'solid-js/web'
import { TransitionChild } from './Transition.jsx'

export default function Backdrop(props) {
  return (
    // <Portal>
    <TransitionChild
      class="fixed inset-0 z-[2000] bg-black/50"
      onClick={props.onClick}
      // show={props.open}
      enter="transition-opacity duration-200 ease-in-out"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150 ease-in-out"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    ></TransitionChild>
    // </Portal>
  )
}

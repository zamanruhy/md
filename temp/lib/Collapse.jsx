import { Transition } from './Transition.jsx'

export default function Collapse(props) {
  let el

  function onEnter() {
    el.style.height = 0
    el.offsetHeight
    el.style.height = `${el.scrollHeight}px`
    props.onOpen?.()
  }
  function onAfterEnter() {
    el.style.height = null
    props.onOpened?.()
  }
  function onLeave() {
    el.style.height = `${el.scrollHeight}px`
    el.offsetHeight
    el.style.height = 0
    props.onClose?.()
  }
  function onAfterLeave() {
    el.style.height = null
    props.onClosed?.()
  }

  return (
    <Transition
      show={props.open}
      ref={el}
      enter="overflow-hidden transition-[height] duration-300 ease-in-out"
      enterFrom=""
      enterTo=""
      leave="overflow-hidden transition-[height] duration-300 ease-in-out"
      leaveFrom=""
      leaveTo=""
      beforeEnter={onEnter}
      afterEnter={onAfterEnter}
      beforeLeave={onLeave}
      afterLeave={onAfterLeave}
    >
      <div id={props.id}>{props.children}</div>
    </Transition>
  )
}

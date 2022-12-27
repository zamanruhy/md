import { createSignal } from 'solid-js'
import Input from './Input'

export default function PasswordInput(props) {
  const [show, setShow] = createSignal(false)

  return (
    <div class="relative flex">
      <Input class="pr-[74px]" {...props} type={show() ? 'text' : 'password'} />
      <div class="absolute inset-y-0 right-0 flex w-[74px] items-center justify-center">
        <button
          class="h-7 rounded bg-slate-200 px-3 text-sm font-semibold text-gray-700"
          type="button"
          onClick={() => setShow(!show())}
        >
          {show() ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  )
}

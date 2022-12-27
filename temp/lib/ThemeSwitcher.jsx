import useMediaQuery from '../../hooks/use-media-query'
import {
  createMemo,
  createSignal,
  splitProps,
  onMount,
  createEffect
} from 'solid-js'

export default function ThemeSwitcher(props) {
  const [, rest] = splitProps(props, ['class', 'classList'])

  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [forcedTheme, setForcedTheme] = createSignal(null)
  const theme = createMemo(
    () => forcedTheme() || (prefersDark() ? 'dark' : 'light')
  )
  let colorSchemeEl, themeColorEl

  onMount(() => {
    colorSchemeEl = document.head.querySelector('meta[name="color-scheme"]')
    themeColorEl = document.head.querySelector('meta[name="theme-color"]')
    setForcedTheme(window.localStorage.getItem('theme'))
  })

  createEffect(() => {
    forcedTheme()
      ? window.localStorage.setItem('theme', forcedTheme())
      : window.localStorage.removeItem('theme')
  })

  createEffect(() => {
    document.documentElement.classList.toggle('dark', theme() === 'dark')
    colorSchemeEl && (colorSchemeEl.content = theme())
    themeColorEl &&
      (themeColorEl.content = theme() === 'dark' ? '#333333' : '#bbbbbb')
  })

  function onChange(e) {
    const { checked } = e.target
    if (checked !== prefersDark()) {
      setForcedTheme(checked ? 'dark' : 'light')
    } else {
      setForcedTheme(null)
    }
  }

  return (
    <label
      class="relative isolate flex w-fit cursor-pointer select-none items-center"
      classList={{
        [props.class]: Boolean(props.class),
        ...props.classList,
        'pointer-events-none opacity-60': props.disabled
      }}
    >
      <input
        class="sr-only"
        type="checkbox"
        checked={theme() === 'dark'}
        onChange={onChange}
        {...rest}
      />
      <span
        class="relative h-5 w-12 shrink-0 rounded-full bg-slate-300 transition"
        aria-hidden="true"
      >
        <span class="absolute top-1/2 left-1/2 -z-10 h-full min-h-9 w-full min-w-9 -translate-y-1/2 -translate-x-1/2 rounded-[inherit]" />
        <span
          class="absolute -top-1.5 -left-0.5 flex h-8 w-8 items-center justify-center
        rounded-[inherit] bg-slate-800 shadow transition dark:translate-x-5
        dark:bg-blue-800 [input:focus-visible+*>&]:ring-[6px] [input:focus-visible+*>&]:ring-slate-500/40
        dark:[input:focus-visible+*>&]:ring-slate-100/40"
        >
          <svg
            class="hidden h-5 w-5 fill-white dark:inline"
            viewBox="0 0 20 20"
          >
            <path d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z" />
          </svg>
          <svg class="h-5 w-5 fill-white dark:hidden" viewBox="0 0 20 20">
            <path d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z" />
          </svg>
        </span>
      </span>
      <span class="sr-only">
        Enable <span class="dark:hidden">dark</span>
        <span class="hidden dark:inline">light</span> theme
      </span>
    </label>
  )
}

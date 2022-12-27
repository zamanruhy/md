import {
  mergeProps,
  splitProps,
  createContext,
  onCleanup,
  createSignal,
  createUniqueId,
  createEffect,
  on,
  useContext,
  createMemo
} from 'solid-js'

const TabsContext = createContext()

export function Tabs(props) {
  props = mergeProps({ index: 0, vertical: false, rtl: false }, props)
  const [, rest] = splitProps(props, [
    'index',
    'vertical',
    'rtl',
    'children',
    'onUpdate'
  ])

  const [activeTab, setActiveTab] = createSignal(null)
  const [activePanel, setActivePanel] = createSignal(null)
  const [localIndex, setLocalIndex] = createSignal(props.index)
  const tabs = []
  const panels = []
  const counter = { tab: 1, panel: 1 }
  const cid = createUniqueId()
  const context = {
    registerTab(tab) {
      tabs.push(tab)

      if (tabs.indexOf(tab) === localIndex()) {
        setActiveTab(tab)
      }

      onCleanup(() => {
        const i = tabs.indexOf(tab)
        tabs.splice(i, 1)

        if (activeTab() === tab) {
          setActiveTab(tabs[i] || tabs[tabs.length - 1])
        }
      })

      return `tab-${cid}-${counter.tab++}`
    },
    registerPanel(panel) {
      panels.push(panel)

      if (panels.indexOf(panel) === localIndex()) {
        setActivePanel(panel)
      }

      onCleanup(() => {
        const i = panels.indexOf(panel)
        panels.splice(i, 1)
      })

      return `tab-${cid}-${counter.panel++}`
    },
    activeTab,
    setActiveTab,
    activePanel,
    onTabKeydown
  }

  createEffect(() => setLocalIndex(props.index))
  createEffect(() => props.onUpdate?.(localIndex()))

  createEffect(() => setActivePanel(panels[localIndex()]))
  createEffect(() => setActiveTab(tabs[localIndex()]))
  createEffect(() => setLocalIndex(tabs.indexOf(activeTab())))

  createEffect(on(activeTab, () => focusActiveTab(), { defer: true }))

  function focusActiveTab() {
    // console.log(activeTab())
    // const activeTabEl = $activeTab.el
    // const listEl = activeTabEl.closest('.tabs__list')
    // const scrollLeft = listEl.scrollLeft
    activeTab().el.focus({ preventScroll1: true })
    // listEl.scrollLeft = scrollLeft
  }
  function onTabKeydown(e, tab) {
    const key = e.key
    const i = tabs.indexOf(tab)
    const lessArrows = [
      props.vertical ? 'ArrowUp' : props.rtl ? 'ArrowRight' : 'ArrowLeft'
    ]
    const moreArrows = [
      props.vertical ? 'ArrowDown' : props.rtl ? 'ArrowLeft' : 'ArrowRight'
    ]

    if (key === ' ') {
      e.preventDefault()
      setLocalIndex(i)
    } else if (lessArrows.includes(key)) {
      e.preventDefault()
      setLocalIndex(Math.max(localIndex() - 1, 0))
    } else if (moreArrows.includes(key)) {
      e.preventDefault()
      setLocalIndex(Math.min(localIndex() + 1, tabs.length - 1))
    } else if (key === 'Home') {
      e.preventDefault()
      setLocalIndex(0)
    } else if (key === 'End') {
      e.preventDefault()
      setLocalIndex(tabs.length - 1)
    }
  }

  return (
    <TabsContext.Provider value={context}>
      <div {...rest}>{props.children}</div>
    </TabsContext.Provider>
  )
}

export function Tab(props) {
  const [, rest] = splitProps(props, [
    'children',
    'onClick',
    'onKeyDown',
    'ref'
  ])
  const { registerTab, activeTab, setActiveTab, onTabKeydown } =
    useContext(TabsContext)
  const tab = {}
  const id = registerTab(tab)
  const selected = createMemo(() => activeTab() === tab)

  function onClick(e) {
    e.preventDefault()
    props.onClick?.()
    setActiveTab(tab)
  }

  function onKeyDown(e) {
    props.onKeyDown?.()
    onTabKeydown(e, tab)
  }

  return (
    <button
      class={
        typeof props.class === 'function'
          ? props.class({ selected })
          : props.class
      }
      type="button"
      role="tab"
      aria-selected={selected() + ''}
      id={id}
      tabindex={!selected() ? -1 : null}
      ref={(el) => {
        tab.el = el
        props.ref?.(el)
      }}
      onClick={onClick}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {typeof props.children === 'function'
        ? props.children({ selected })
        : props.children}
    </button>
  )
}

export function TabPanel(props) {
  const [, rest] = splitProps(props, ['children'])
  const { registerPanel, activePanel } = useContext(TabsContext)
  const panel = {}
  const id = registerPanel(panel)

  return (
    <>
      {activePanel() === panel && (
        <div role="tabpanel" aria-labelledby={id} {...rest}>
          {props.children}
        </div>
      )}
    </>
  )
}

export function TabList(props) {
  const [, rest] = splitProps(props, ['children'])

  return (
    <div role="tablist" {...rest}>
      {props.children}
    </div>
  )
}

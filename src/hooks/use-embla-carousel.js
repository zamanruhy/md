import { createEffect, createSignal, on, untrack } from 'solid-js'
import EmblaCarousel from 'embla-carousel'

export default function useEmblaCarousel(options = {}, plugins = []) {
  const optionsHandler = EmblaCarousel.optionsHandler()
  const [embla, setEmbla] = createSignal()
  const [viewport, setViewport] = createSignal()

  const [prevEnabled, setPrevEnabled] = createSignal(false)
  const [nextEnabled, setNextEnabled] = createSignal(false)
  const [selectedIndex, setSelectedIndex] = createSignal(0)
  const [scrollSnaps, setScrollSnaps] = createSignal([])

  const getOptions = () => (typeof options === 'function' ? options() : options)
  const getPlugins = () => (typeof plugins === 'function' ? plugins() : plugins)
  let storedOptions = getOptions()
  let storedPlugins = getPlugins()

  function reInit() {
    embla() && embla().reInit(storedOptions, storedPlugins)
  }

  function onSelect() {
    if (!embla()) return
    setSelectedIndex(embla().selectedScrollSnap())
    setPrevEnabled(embla().canScrollPrev())
    setNextEnabled(embla().canScrollNext())
  }

  function onInit() {
    if (!embla()) return
    onSelect()
    setScrollSnaps(embla().scrollSnapList())
  }

  createEffect(() => {
    if (canUseDOM() && viewport()) {
      EmblaCarousel.globalOptions = useEmblaCarousel.globalOptions
      const newEmbla = EmblaCarousel(viewport(), storedOptions, storedPlugins)
      setEmbla(newEmbla)
      return () => newEmbla.destroy()
    } else {
      setEmbla(undefined)
    }
  })

  createEffect(() => {
    if (optionsHandler.areEqual(storedOptions, getOptions())) return
    storedOptions = getOptions()
    reInit()
  })

  createEffect(() => {
    if (arePluginsEqual(storedPlugins, getPlugins())) return
    storedPlugins = getPlugins()
    reInit()
  })

  createEffect(() => {
    if (!embla()) return
    onInit()
    embla().on('select', onSelect)
    embla().on('reInit', onInit)
  })

  return [
    setViewport,
    { embla, prevEnabled, nextEnabled, selectedIndex, scrollSnaps }
  ]
}

useEmblaCarousel.globalOptions = undefined

// Utils
function canUseDOM() {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  )
}

function sortAndMapPluginToOptions(plugins) {
  return plugins
    .concat()
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .map((plugin) => plugin.options)
}

function arePluginsEqual(pluginsA, pluginsB) {
  if (pluginsA.length !== pluginsB.length) return false
  const { areEqual } = EmblaCarousel.optionsHandler()
  const optionsA = sortAndMapPluginToOptions(pluginsA)
  const optionsB = sortAndMapPluginToOptions(pluginsB)
  return optionsA.every((optionA, index) => {
    const optionB = optionsB[index]
    return areEqual(optionA, optionB)
  })
}

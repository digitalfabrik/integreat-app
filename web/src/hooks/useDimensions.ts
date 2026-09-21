import { useContext, useEffect, useMemo, useSyncExternalStore } from 'react'

import {
  BOTTOM_NAVIGATION_ELEMENT_ID,
  BREAKPOINTS,
  TOOLBAR_ELEMENT_ID,
  TTS_PLAYER_ELEMENT_ID,
} from '../constants/layout'
import { TtsContext } from '../contexts/TtsContext'

export const bottomSheetHandleHeight = 80
const midSnapPercentage = 0.5
const mapIconsHeight = 60

type WindowDimensions = {
  width: number
  height: number
}

type BottomSheetDimensions = {
  snapPoints: {
    min: number
    medium: number
    large: number
    max: number
    all: number[]
  }
}

export type Dimensions = {
  window: WindowDimensions
  bottomSheet: BottomSheetDimensions

  headerHeight: number
  ttsPlayerHeight: number
  bottomNavigationHeight: number | undefined
  toolbarWidth: number

  mobile: boolean
  desktop: boolean
  xsmall: boolean
  small: boolean
  medium: boolean
  large: boolean
  xlarge: boolean
}

export type ScrollDimensions = Dimensions & {
  window: WindowDimensions & {
    scrollX: number
    scrollY: number
  }

  stickyTop: number
  visibleFooterHeight: number
}

type Metrics = {
  width: number
  height: number
  headerHeight: number
  ttsPlayerHeight: number
  bottomNavigationHeight: number | undefined
  toolbarWidth: number
}

type ScrollMetrics = {
  scrollX: number
  scrollY: number
  stickyTop: number
  visibleFooterHeight: number
}

const measureMetrics = (): Metrics => ({
  width: window.innerWidth,
  height: window.innerHeight,
  headerHeight: document.querySelector('header')?.offsetHeight ?? 0,
  ttsPlayerHeight: document.getElementById(TTS_PLAYER_ELEMENT_ID)?.getBoundingClientRect().height ?? 0,
  bottomNavigationHeight: document.getElementById(BOTTOM_NAVIGATION_ELEMENT_ID)?.getBoundingClientRect().height,
  toolbarWidth: document.getElementById(TOOLBAR_ELEMENT_ID)?.getBoundingClientRect().width ?? 0,
})

const measureScrollMetrics = (): ScrollMetrics => {
  const { innerHeight: height, scrollX, scrollY } = window
  const footerHeight = document.querySelector('footer')?.offsetHeight ?? 0
  const documentHeight = document.body.offsetHeight
  const stickyTop = Math.max(0, document.querySelector('header')?.getBoundingClientRect().bottom ?? 0)

  return {
    scrollX,
    scrollY,
    stickyTop,
    visibleFooterHeight: Math.max(0, height + scrollY + footerHeight - documentHeight),
  }
}

const toDimensions = (metrics: Metrics): Dimensions => {
  const { width, height, headerHeight, bottomNavigationHeight } = metrics
  const snapPoints = {
    min: bottomSheetHandleHeight + (bottomNavigationHeight ?? 0),
    medium: height * midSnapPercentage,
    large: height - headerHeight - mapIconsHeight,
    max: height - headerHeight,
  }

  return {
    window: { width, height },
    bottomSheet: {
      snapPoints: {
        ...snapPoints,
        all: [snapPoints.min, snapPoints.medium, snapPoints.large, snapPoints.max],
      },
    },

    headerHeight,
    ttsPlayerHeight: metrics.ttsPlayerHeight,
    bottomNavigationHeight,
    toolbarWidth: metrics.toolbarWidth,

    mobile: width <= BREAKPOINTS.md,
    desktop: width > BREAKPOINTS.md,
    xsmall: width < BREAKPOINTS.sm,
    small: width >= BREAKPOINTS.sm && width < BREAKPOINTS.md,
    medium: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    large: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
    xlarge: width >= BREAKPOINTS.xl,
  }
}

const toScrollDimensions = (dimensions: Dimensions, scrollMetrics: ScrollMetrics): ScrollDimensions => ({
  ...dimensions,
  window: { ...dimensions.window, scrollX: scrollMetrics.scrollX, scrollY: scrollMetrics.scrollY },
  stickyTop: scrollMetrics.stickyTop,
  visibleFooterHeight: scrollMetrics.visibleFooterHeight,
})

const shallowEqual = <T extends Record<string, unknown>>(first: T, second: T): boolean =>
  Object.keys(first).every(key => first[key] === second[key])

type Listener = () => void

// A single store shared by all consumers: the DOM is measured once per frame instead of once per component.
const listeners = new Set<Listener>()
let metricsSnapshot = measureMetrics()
let scrollMetricsSnapshot = measureScrollMetrics()
let resizeObserver: ResizeObserver | null = null

const measure = (): void => {
  const newMetrics = measureMetrics()
  const newScrollMetrics = measureScrollMetrics()
  const dimensionsChanged = !shallowEqual(newMetrics, metricsSnapshot)
  const scrollChanged = !shallowEqual(newScrollMetrics, scrollMetricsSnapshot)

  if (!dimensionsChanged && !scrollChanged) {
    return
  }

  if (dimensionsChanged) {
    metricsSnapshot = newMetrics
  }
  if (scrollChanged) {
    scrollMetricsSnapshot = newScrollMetrics
  }
  listeners.forEach(listener => listener())
}

const subscribe = (listener: Listener): (() => void) => {
  if (listeners.size === 0) {
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, { passive: true })
    // Observe changes to the DOM body and recalculate all dimensions (e.g. for adding/removing the tts player)
    resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(document.body)
    measure()
  }
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
      resizeObserver?.disconnect()
      resizeObserver = null
    }
  }
}

const useDimensionsSnapshot = <T>(getSnapshot: () => T): T => useSyncExternalStore(subscribe, getSnapshot)

const getMetrics = (): Metrics => metricsSnapshot
const getScrollMetrics = (): ScrollMetrics => scrollMetricsSnapshot

/** Dimensions without the scroll position, therefore not rerendering the consuming component while scrolling. */
const useDimensions = (): Dimensions => {
  const metrics = useDimensionsSnapshot(getMetrics)
  return useMemo(() => toDimensions(metrics), [metrics])
}

/**
 * Dimensions including the scroll position. Rerenders the consuming component on every scroll.
 * Use {@link useDimensions} instead if the scroll position is not needed.
 */
export const useScrollDimensions = (): ScrollDimensions => {
  const dimensions = useDimensions()
  const scrollMetrics = useDimensionsSnapshot(getScrollMetrics)
  const { visible } = useContext(TtsContext)

  useEffect(measure, [visible])

  return useMemo(() => toScrollDimensions(dimensions, scrollMetrics), [dimensions, scrollMetrics])
}

export default useDimensions

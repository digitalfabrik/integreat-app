import { useCallback, useEffect, useState } from 'react'
import { BackHandler } from 'react-native'

import usePreviousProp from './usePreviousProp'

type UseLocalHistoryParams<S extends {}, T> = {
  params: S
  historyFromParams: (route: S) => T[]
  resetHistory: T
}

export type UseLocalHistoryReturn<T> = {
  current: T
  history: T[]
  push: (newHistory: Partial<T>) => void
  pushReset: (newHistory: Partial<T>) => void
  pop: () => void
  reset: (newHistory?: T[]) => void
}

/**
 * Create and manage a local stack history for cases where the default react-navigation navigation stack is not suitable
 * This might be if you need a stack history, but pushing new screens would cause unwanted rerenders (e.g. map with bottom sheet)
 * If possible, please always prefer a react-navigation stack and only use this if actually necessary.
 * WARNING: Make sure to correctly handle non-system back navigation (e.g. in the header)!
 */
const useLocalStackHistory = <S extends {}, T>({
  params,
  historyFromParams,
  resetHistory,
}: UseLocalHistoryParams<S, T>): UseLocalHistoryReturn<T> => {
  const [history, setHistory] = useState<T[]>(historyFromParams(params))
  const current = history[history.length - 1] ?? resetHistory

  const push = (newHistory: Partial<T>) => setHistory(previous => [...previous, { ...current, ...newHistory }])

  const pushReset = (newHistory: Partial<T>) =>
    setHistory(previous => [...previous, { ...resetHistory, ...newHistory }])

  const pop = useCallback(() => setHistory(previous => [...previous.slice(0, previous.length - 1)]), [])

  const reset = useCallback((newHistory?: T[]) => setHistory(newHistory ?? [resetHistory]), [resetHistory])

  useEffect(
    () =>
      BackHandler.addEventListener('hardwareBackPress', () => {
        const canGoBack = history.length > 1
        if (canGoBack) {
          pop()
          // Prevent navigating back
          return true
        }
        // Reset the local pois history on back navigation to start with the pois list next time
        reset()
        // Navigate back
        return false
      }).remove,
    [history, pop, reset],
  )

  // When linking to this tab reset the history to the linked params to allow for consistent back navigation
  usePreviousProp({ prop: params, onPropChange: () => setHistory(historyFromParams(params)) })

  return { current, history, push, pushReset, pop, reset }
}

export default useLocalStackHistory

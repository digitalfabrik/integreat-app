import { useState, useCallback } from 'react'

import { reportError } from '../utils/sentry'

type UseLocalStorageProps<T> = {
  key: string
  initialValue: T
}

type UseLocalStorageReturn<T> = {
  value: T
  updateLocalStorageItem: (newValue: T) => void
}

const useLocalStorage = <T>({ key, initialValue }: UseLocalStorageProps<T>): UseLocalStorageReturn<T> => {
  const [value, setValue] = useState<T>(() => {
    try {
      const localStorageItem = localStorage.getItem(key)
      if (localStorageItem) {
        return JSON.parse(localStorageItem)
      }
      localStorage.setItem(key, JSON.stringify(initialValue))
    } catch (e) {
      // Prevent the following error crashing the app if the browser blocks access to local storage (see #2924)
      // SecurityError: Failed to read the 'localStorage' property from 'Window': Access is denied for this document.
      const accessDenied = e instanceof Error && e.message.includes('Access is denied for this document')
      if (!accessDenied) {
        reportError(e)
      }
    }
    return initialValue
  })

  const updateLocalStorageItem = useCallback(
    (newValue: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (e) {
        // Prevent the following error crashing the app if the browser blocks access to local storage (see #2924)
        // SecurityError: Failed to read the 'localStorage' property from 'Window': Access is denied for this document.
        const accessDenied = e instanceof Error && e.message.includes('Access is denied for this document')
        if (!accessDenied) {
          reportError(e)
        }
      }
      setValue(newValue)
    },
    [key],
  )

  return { value, updateLocalStorageItem }
}

export default useLocalStorage

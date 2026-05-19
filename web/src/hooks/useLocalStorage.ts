import { useCallback, useState } from 'react'

import { reportError } from '../utils/sentry'

type UseLocalStorageProps<T> = {
  key: string
  initialValue: T
  isSessionStorage?: boolean
}

type UseLocalStorageReturn<T> = {
  value: T
  updateLocalStorageItem: (newValue: T | ((oldValue: T) => T)) => void
}

const useLocalStorage = <T>({
  key,
  initialValue,
  isSessionStorage = false,
}: UseLocalStorageProps<T>): UseLocalStorageReturn<T> => {
  const storage = isSessionStorage ? sessionStorage : localStorage

  const [value, setValue] = useState<T>(() => {
    try {
      const storageItem = storage.getItem(key)
      if (storageItem) {
        return JSON.parse(storageItem)
      }
      storage.setItem(key, JSON.stringify(initialValue))
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
    (newValue: T | ((oldValue: T) => T)) => {
      setValue(oldValue => {
        const resolvedNewValue = typeof newValue === 'function' ? (newValue as (oldValue: T) => T)(oldValue) : newValue
        try {
          storage.setItem(key, JSON.stringify(resolvedNewValue))
        } catch (e) {
          // Prevent the following error crashing the app if the browser blocks access to local storage (see #2924)
          // SecurityError: Failed to read the 'localStorage' property from 'Window': Access is denied for this document.
          const accessDenied = e instanceof Error && e.message.includes('Access is denied for this document')
          if (!accessDenied) {
            reportError(e)
          }
        }
        return resolvedNewValue
      })
    },
    [storage, key],
  )

  return { value, updateLocalStorageItem }
}

export default useLocalStorage

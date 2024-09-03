import { useState, useCallback } from 'react'

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
    const localStorageItem = localStorage.getItem(key)
    if (localStorageItem) {
      return JSON.parse(localStorageItem)
    }
    localStorage.setItem(key, JSON.stringify(initialValue))
    return initialValue
  })

  const updateLocalStorageItem = useCallback(
    (newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue))
      setValue(newValue)
    },
    [key],
  )

  return { value, updateLocalStorageItem }
}

export default useLocalStorage

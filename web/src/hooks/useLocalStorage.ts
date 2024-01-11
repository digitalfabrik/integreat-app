import { useState, useCallback } from 'react'

type UseLocalStorageReturnType<T> = {
  value: T
  updateLocalStorageItem: (newValue: T) => void
  removeLocalStorageItem: () => void
}
const useLocalStorage = <T>(name: string): UseLocalStorageReturnType<T> => {
  const [value, setValue] = useState<string | null>(localStorage.getItem(name))

  const updateLocalStorageItem = useCallback(
    (newValue: T) => {
      localStorage.setItem(name, JSON.stringify(newValue))
      setValue(JSON.stringify(newValue))
    },
    [name],
  )

  const removeLocalStorageItem = useCallback(() => {
    localStorage.removeItem(name)
    setValue('')
  }, [name])

  return { value: value ? JSON.parse(value) : {}, updateLocalStorageItem, removeLocalStorageItem }
}

export default useLocalStorage

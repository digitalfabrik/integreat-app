import { useState, useEffect } from 'react'

export const DEBOUNCE_TIMEOUT = 250

const useDebounce = <T>(value: T, delay = DEBOUNCE_TIMEOUT): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const debouncedValueTimeout = setTimeout(() => setDebouncedValue(value), delay)

    return () => clearTimeout(debouncedValueTimeout)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce

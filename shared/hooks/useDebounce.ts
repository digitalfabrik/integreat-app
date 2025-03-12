import { useState, useEffect } from 'react'

const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const debouncedValueTimeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(debouncedValueTimeout)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce

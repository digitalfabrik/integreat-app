import { useEffect, useRef } from 'react'

// This hook returns the prevState of a passed value https://blog.logrocket.com/accessing-previous-props-state-react-hooks/
const usePrevious = <T>(value: T): T => {
  const ref = useRef<any>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
export default usePrevious

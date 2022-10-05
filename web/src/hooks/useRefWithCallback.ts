import { RefObject, useCallback, useRef, useState } from 'react'

type UseRefWithCallbackReturnProps<T> = {
  /** indicator for useEffect to check if node has changed, since ref.current is unsafe */
  toggle: boolean
  /** the callback of the ref to pass to the html container */
  refCallback: (node: T | null) => void
  /** refObject */
  ref: RefObject<T>
}

const useRefWithCallback = <
  T extends HTMLSpanElement | HTMLDivElement | HTMLParagraphElement
>(): UseRefWithCallbackReturnProps<T> => {
  const [toggle, setToggle] = useState<boolean>(false)
  const ref = useRef<T | null>(null)
  const refCallback = useCallback(node => {
    ref.current = node
    setToggle(val => !val)
  }, [])
  return { toggle, refCallback, ref }
}
export default useRefWithCallback

import { RefObject, useCallback, useRef } from 'react'

type UseRefWithCallbackReturnProps<T> = {
  current: T | null
  ref: (node: T | null) => void
}

const useCallbackRef = <T extends HTMLSpanElement | HTMLDivElement | HTMLParagraphElement>(
  callback: (ref: RefObject<T>) => void
): UseRefWithCallbackReturnProps<T> => {
  const ref = useRef<T | null>(null)
  const refCallback = useCallback(
    (node: T | null) => {
      ref.current = node
      callback(ref)
    },
    [callback]
  )
  return { ref: refCallback, current: ref.current }
}
export default useCallbackRef

import { useCallback, useState } from 'react'

type UseElementRectReturn = {
  rect: DOMRect | null
  ref: (node: Element | null) => void
}

const useElementRect = (): UseElementRectReturn => {
  const [rect, setRect] = useState<DOMRect | null>(null)

  const ref = useCallback((node: Element | null) => {
    if (node !== null) {
      setRect(node.getBoundingClientRect())
    }
  }, [])

  return { rect, ref }
}

export default useElementRect

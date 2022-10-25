import { useEffect } from 'react'

const useOnClickOutside = (ref: { current: HTMLElement | null }, callback: () => void): void => {
  useEffect(() => {
    const isOutside = (target: EventTarget | null) =>
      target instanceof Node && ref.current && !ref.current.contains(target)

    const handleClickOutside = (event: MouseEvent) => {
      if (isOutside(event.target)) {
        callback()
      }
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback()
      } else if (event.key === 'Enter' && isOutside(event.target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [ref, callback])
}

export default useOnClickOutside

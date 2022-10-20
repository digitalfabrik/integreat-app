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
      const KEY_ENTER = 'Enter'
      const KEY_ESCAPE = 'Escape'
      if (event.code === KEY_ESCAPE) {
        callback()
      } else if (event.code === KEY_ENTER && isOutside(event.target)) {
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

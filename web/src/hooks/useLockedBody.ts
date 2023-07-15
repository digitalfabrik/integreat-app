import { useEffect, useLayoutEffect, useState } from 'react'

const useLockedBody = (initialLocked = false): void => {
  const [locked, setLocked] = useState<boolean>(initialLocked)

  useLayoutEffect(() => {
    const originalOverflow = document.body.style.overflow
    if (initialLocked) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [initialLocked, locked])

  useEffect(() => {
    if (locked !== initialLocked) {
      setLocked(initialLocked)
    }
  }, [initialLocked, locked])
}

export default useLockedBody

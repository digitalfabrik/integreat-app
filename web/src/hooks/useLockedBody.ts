import { useEffect, useLayoutEffect, useState } from 'react'

type UseLockedBodyProps = { locked: boolean; setLocked: (locked: boolean) => void }

const useLockedBody = (initialLocked = false): UseLockedBodyProps => {
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

  return { locked, setLocked }
}

export default useLockedBody

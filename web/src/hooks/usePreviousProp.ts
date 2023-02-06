import { useEffect, useState } from 'react'

type UsePreviousPropProps<T> = {
  prop: T
  onPropChange?: (newProp: T, oldProp: T) => void
}

const usePreviousProp = <T>({ prop, onPropChange }: UsePreviousPropProps<T>): T => {
  const [previousProp, setPreviousProp] = useState<T>(prop)

  useEffect(() => {
    if (previousProp !== prop) {
      if (onPropChange) {
        onPropChange(prop, previousProp)
      }
      setPreviousProp(prop)
    }
  }, [previousProp, prop, onPropChange])

  return previousProp
}

export default usePreviousProp

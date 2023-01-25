import { useEffect, useState } from 'react'

type UseOnPropChangeProps<T> = {
  prop: T
  onPropChange?: (newProp: T, oldProp: T) => void
}

const useOnPropChange = <T>({ prop, onPropChange }: UseOnPropChangeProps<T>): T => {
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

export default useOnPropChange

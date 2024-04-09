import { useEffect, useState } from 'react'
import { Keyboard, KeyboardEvent } from 'react-native'

const useKeyboardHeight = (): number => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const onKeyboardWillShow = (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height)
    }

    const subscription = Keyboard.addListener('keyboardWillShow', onKeyboardWillShow)

    return () => {
      subscription.remove()
    }
  }, [])

  return keyboardHeight
}

export default useKeyboardHeight

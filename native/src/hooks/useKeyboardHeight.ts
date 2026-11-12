import { useEffect, useState } from 'react'
import { Keyboard, KeyboardEvent } from 'react-native'

const useKeyboardHeight = (): number => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const onKeyboardWillShow = (event: KeyboardEvent) => setKeyboardHeight(event.endCoordinates.height)
    const onKeyboardWillHide = () => setKeyboardHeight(0)

    const showSubscription = Keyboard.addListener('keyboardWillShow', onKeyboardWillShow)
    const hideSubscription = Keyboard.addListener('keyboardWillHide', onKeyboardWillHide)

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  return keyboardHeight
}

export default useKeyboardHeight

import { useEffect, useState } from 'react'
import { Keyboard, KeyboardEvent, Platform } from 'react-native'

const useKeyboardHeight = (): number => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const onKeyboardShow = (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height)
    }
    const onKeyboardHide = () => {
      setKeyboardHeight(0)
    }

    const showSubscription = Keyboard.addListener(showEvent, onKeyboardShow)
    const hideSubscription = Keyboard.addListener(hideEvent, onKeyboardHide)

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  return keyboardHeight
}

export default useKeyboardHeight

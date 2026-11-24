import { useEffect, useState } from 'react'
import { Keyboard, KeyboardEvent, Platform } from 'react-native'

const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

const useKeyboardHeight = (): number => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const showSubscription = Keyboard.addListener(showEvent, (event: KeyboardEvent) =>
      setKeyboardHeight(event.endCoordinates.height),
    )
    const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0))

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  return keyboardHeight
}

export default useKeyboardHeight

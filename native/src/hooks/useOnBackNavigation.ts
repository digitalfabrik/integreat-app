import { NavigationAction, useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'

const useOnBackNavigation = (onBackNavigation?: (action: NavigationAction) => void): void => {
  const navigation = useNavigation()

  useEffect(
    () =>
      navigation.addListener('beforeRemove', event => {
        if (onBackNavigation) {
          event.preventDefault()
          onBackNavigation(event.data.action)
        }
      }),
    [navigation, onBackNavigation]
  )
}

export default useOnBackNavigation

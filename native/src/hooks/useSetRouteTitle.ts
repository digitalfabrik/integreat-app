import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'

import { BaseNavigationProps } from '../constants/NavigationTypes'

/**
 * Sets the title of the current route
 * The route title is used in the header of the afterwards opened route to show the user where he would navigate back to
 */
const useSetRouteTitle = (title: string | undefined): void => {
  const navigation = useNavigation<BaseNavigationProps>()

  useEffect(() => {
    if (title === undefined) {
      return
    }
    navigation.setParams({ title })
  }, [navigation, title])
}

export default useSetRouteTitle

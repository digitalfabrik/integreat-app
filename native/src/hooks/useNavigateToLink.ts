import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import createNavigate from '../navigation/createNavigate'
import navigateToLinkFn from '../navigation/navigateToLink'

const useNavigateToLink = (): ((url: string, language: string, shareUrl: string) => Promise<void>) => {
  const dispatch = useDispatch()
  const navigation = useNavigation<NavigationPropType<RoutesType>>()
  return useCallback(
    async (url: string, language: string, shareUrl: string) => {
      const navigateTo = createNavigate(dispatch, navigation)
      navigateToLinkFn(url, navigation, language, navigateTo, shareUrl)
    },
    [dispatch, navigation]
  )
}

export default useNavigateToLink

import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import createNavigate from '../navigation/createNavigate'
import navigateToLinkFn from '../navigation/navigateToLink'
import useSnackbar from './useSnackbar'

const useNavigateToLink = (): ((url: string, language: string, shareUrl: string) => void) => {
  const dispatch = useDispatch()
  const navigation = useNavigation<NavigationProps<RoutesType>>()
  const showSnackbar = useSnackbar()
  return useCallback(
    (url: string, language: string, shareUrl: string) => {
      const navigateTo = createNavigate(dispatch, navigation)
      navigateToLinkFn(url, navigation, language, navigateTo, shareUrl).catch((error: Error) =>
        showSnackbar(error.message)
      )
    },
    [dispatch, navigation, showSnackbar]
  )
}

export default useNavigateToLink

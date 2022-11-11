import { useCallback } from 'react'

import navigateToLink from '../navigation/navigateToLink'
import useNavigate from './useNavigate'
import useSnackbar from './useSnackbar'

const useNavigateToLink = (): ((url: string, language: string, shareUrl: string) => void) => {
  const { navigateTo, navigation } = useNavigate()
  const showSnackbar = useSnackbar()

  return useCallback(
    (url: string, language: string, shareUrl: string) => {
      navigateToLink(url, navigation, language, navigateTo, shareUrl).catch((error: Error) =>
        showSnackbar(error.message)
      )
    },
    [navigation, showSnackbar, navigateTo]
  )
}

export default useNavigateToLink

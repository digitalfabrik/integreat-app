import { useNavigation } from '@react-navigation/native'
import { useContext, useMemo } from 'react'

import { RouteInformationType } from 'api-client'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import { AppContext } from '../contexts/AppContextProvider'
import createNavigate from '../navigation/createNavigate'

type UseNavigateReturn = {
  navigateTo: (routeInformation: RouteInformationType) => void
  navigation: NavigationProps<RoutesType>
}

const useNavigate = (): UseNavigateReturn => {
  const navigation = useNavigation<NavigationProps<RoutesType>>()
  const { cityCode, languageCode } = useContext(AppContext)
  const navigateTo = useMemo(
    () => createNavigate(navigation, cityCode, languageCode),
    [navigation, cityCode, languageCode]
  )

  return { navigateTo, navigation }
}

export default useNavigate

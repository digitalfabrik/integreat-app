import { useEffect } from 'react'

import { NonNullableRouteInformationType } from 'api-client'

import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import urlFromRouteInformation from '../navigation/url'

type NavigationType = NavigationPropType<RoutesType>

// Sets the share url of the current route information to allow usage in header components
const useSetShareUrl = (navigation: NavigationType, routeInformation: NonNullableRouteInformationType): void => {
  useEffect(() => {
    navigation.setParams({ shareUrl: urlFromRouteInformation(routeInformation) })
  }, [navigation, routeInformation])
}

export default useSetShareUrl

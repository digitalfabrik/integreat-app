import { useEffect } from 'react'

import { NonNullableRouteInformationType } from 'api-client'

import { NavigationPropType, RoutePropType, RoutesType } from '../constants/NavigationTypes'
import urlFromRouteInformation from '../navigation/url'

type Props = {
  route: RoutePropType<RoutesType>
  navigation: NavigationPropType<RoutesType>
  routeInformation: NonNullableRouteInformationType
}

// Sets the share url of the current route information to allow usage in header components
const useSetShareUrl = ({ route, navigation, routeInformation }: Props): void => {
  useEffect(() => {
    const shareUrl = urlFromRouteInformation(routeInformation)
    if (shareUrl !== route.params?.shareUrl) {
      navigation.setParams({ shareUrl })
    }
  }, [route, navigation, routeInformation])
}

export default useSetShareUrl

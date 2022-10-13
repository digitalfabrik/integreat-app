import { useEffect } from 'react'

import { NonNullableRouteInformationType } from 'api-client'

import { NavigationProps, RouteProps, RoutesType } from '../constants/NavigationTypes'
import urlFromRouteInformation from '../navigation/url'

type ShareProps =
  | {
      routeInformation: NonNullableRouteInformationType
    }
  | {
      shareUrl: string
      routeInformation: null
    }

type useSetShareUrlProps = {
  route: RouteProps<RoutesType>
  navigation: NavigationProps<RoutesType>
} & ShareProps

// Sets the share url of the current route information to allow usage in header components
const useSetShareUrl = ({ route, navigation, ...rest }: useSetShareUrlProps): void => {
  const url = rest.routeInformation ? urlFromRouteInformation(rest.routeInformation) : rest.shareUrl

  useEffect(() => {
    if (url !== route.params?.shareUrl) {
      navigation.setParams({ shareUrl: url })
    }
  }, [route, navigation, url])
}

export default useSetShareUrl

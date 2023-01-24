import React, { ReactElement, useEffect } from 'react'

import { RedirectRouteType } from 'api-client'

import { NavigationProps, RouteProps, RoutesType } from '../constants/NavigationTypes'
import useNavigateToDeepLink from '../hooks/useNavigateToDeepLink'
import Layout from './Layout'

const TIMEOUT = 10
const INTERVAL_TIMEOUT = 500

type RedirectContainerProps = {
  route: RouteProps<RedirectRouteType>
  navigation: NavigationProps<RoutesType>
}

const RedirectContainer = ({ route, navigation }: RedirectContainerProps): ReactElement => {
  const navigateToDeepLink = useNavigateToDeepLink()
  const { url } = route.params

  useEffect(() => {
    // If navigate is called to early it fails and nothing happens
    // Therefore we wait for a short time period and try again if the component is still rendered
    // https://github.com/react-navigation/react-navigation/issues/8537
    const timeout = setTimeout(() => {
      navigateToDeepLink(url)
    }, TIMEOUT)
    return () => clearTimeout(timeout)
  }, [url, navigation, navigateToDeepLink])

  useEffect(() => {
    // To support potentially older devices taking longer we setup a separate interval to retry the navigation
    const interval = setInterval(() => {
      navigateToDeepLink(url)
    }, INTERVAL_TIMEOUT)
    return () => clearInterval(interval)
  }, [url, navigation, navigateToDeepLink])

  return <Layout />
}

export default RedirectContainer

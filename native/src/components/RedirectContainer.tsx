import React, { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { RedirectRouteType } from 'api-client'

import { NavigationProps, RouteProps, RoutesType } from '../constants/NavigationTypes'
import useSnackbar from '../hooks/useSnackbar'
import navigateToDeepLink from '../navigation/navigateToDeepLink'
import Layout from './Layout'

const TIMEOUT = 10
const INTERVAL_TIMEOUT = 500

type RedirectContainerProps = {
  route: RouteProps<RedirectRouteType>
  navigation: NavigationProps<RoutesType>
}

const RedirectContainer = ({ route, navigation }: RedirectContainerProps): ReactElement => {
  const showSnackbar = useSnackbar()
  const { i18n } = useTranslation()
  const { language } = i18n
  const { url } = route.params

  useEffect(() => {
    // If navigate is called to early it fails and nothing happens
    // Therefore we wait for a short time period and try again if the component is still rendered
    // https://github.com/react-navigation/react-navigation/issues/8537
    const timeout = setTimeout(() => {
      navigateToDeepLink({ navigation, url, language, showSnackbar })
    }, TIMEOUT)
    return () => clearTimeout(timeout)
  }, [url, showSnackbar, navigation, route, language])

  useEffect(() => {
    // To support potentially older devices taking longer we setup a separate interval to retry the navigation
    const interval = setInterval(() => {
      navigateToDeepLink({ navigation, url, language, showSnackbar })
    }, INTERVAL_TIMEOUT)
    return () => clearInterval(interval)
  }, [url, showSnackbar, navigation, route, language])

  return <Layout />
}

export default RedirectContainer

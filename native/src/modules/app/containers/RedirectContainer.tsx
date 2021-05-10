import React, { useEffect } from 'react'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import { RedirectRouteType } from 'api-client'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import LayoutContainer from '../../layout/containers/LayoutContainer'
import navigateToDeepLink from '../../navigation/navigateToDeepLink'
const TIMEOUT = 10
const INTERVAL_TIMEOUT = 500
type PropsType = {
  route: RoutePropType<RedirectRouteType>
  navigation: NavigationPropType<RedirectRouteType>
}

const RedirectContainer = ({ route, navigation }: PropsType) => {
  const dispatch = useDispatch()
  const { i18n } = useTranslation()
  const { language } = i18n
  const { url } = route.params
  useEffect(() => {
    // If actions are dispatched/navigate is called to early it fails and nothing happens
    // Therefore we wait for a short time period and try again if the component is still rendered
    // https://github.com/react-navigation/react-navigation/issues/8537
    const timeout = setTimeout(() => {
      navigateToDeepLink(dispatch, navigation, url, language)
    }, TIMEOUT)
    return () => clearTimeout(timeout)
  }, [url, dispatch, navigation, route, language])
  useEffect(() => {
    // To support potentially older devices taking longer we setup a separate interval to retry the navigation
    const interval = setInterval(() => {
      navigateToDeepLink(dispatch, navigation, url, language)
    }, INTERVAL_TIMEOUT)
    return () => clearInterval(interval)
  }, [url, dispatch, navigation, route, language])
  return <LayoutContainer />
}

export default RedirectContainer

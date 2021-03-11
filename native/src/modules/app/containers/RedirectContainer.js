// @flow

import React, { useEffect } from 'react'
import type { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import type { RedirectRouteType } from 'api-client'
import createNavigate from '../../navigation/createNavigate'
import navigateToLink from '../../navigation/navigateToLink'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import LayoutContainer from '../../layout/containers/LayoutContainer'

const TIMEOUT = 50

type PropsType = {|
  route: RoutePropType<RedirectRouteType>,
  navigation: NavigationPropType<RedirectRouteType>
|}

const RedirectContainer = ({ route, navigation }: PropsType) => {
  const dispatch = useDispatch()
  const { i18n } = useTranslation()
  const { language } = i18n
  const { url } = route.params

  useEffect(() => {
    // If actions are dispatched/navigate is called to early it fails and nothing happens
    // Therefore we wait for a short time period
    // https://github.com/react-navigation/react-navigation/issues/8537
    const timeout = setTimeout(() => {
      const navigateTo = createNavigate(dispatch, navigation, true)
      navigateToLink(url, navigation, language, navigateTo, url)
    }, TIMEOUT)
    return () => clearTimeout(timeout)
  }, [url, dispatch, navigation, route, language])

  return <LayoutContainer />
}

export default RedirectContainer

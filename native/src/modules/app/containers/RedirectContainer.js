// @flow

import React, { useEffect } from 'react'
import type { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import type { RedirectRouteType } from 'api-client'
import createNavigate from '../../navigation/createNavigate'
import navigateToLink from '../../navigation/navigateToLink'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import LayoutContainer from '../../layout/containers/LayoutContainer'

type PropsType = {|
  route: RoutePropType<RedirectRouteType>,
  navigation: NavigationPropType<RedirectRouteType>
|}

const RedirectContainer = ({ route, navigation }: PropsType) => {
  const dispatch = useDispatch()
  const { i18n } = useTranslation()
  const { language } = i18n
  const { url } = route.params

  useEffect(() => { // TODO Listen for ready state instead of timeout
    const timeout = setTimeout(() => {
      const navigateTo = createNavigate(dispatch, navigation, true)
      navigateToLink(url, navigation, language, navigateTo, url)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [url, dispatch, navigation, route, language])

  return <LayoutContainer />
}

export default RedirectContainer

// @flow

import withLayout from '../layout/hocs/withLayout'
import DashboardContainer from '../../routes/dashboard/containers/DashboardContainer'
import CategoriesContainer from '../../routes/categories/containers/CategoriesContainer'
import type {
  HeaderProps,
  NavigationComponent,
  NavigationContainer,
  NavigationRouteConfig,
  NavigationRouteConfigMap
} from 'react-navigation'
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation'
import TransparentHeaderContainer from '../layout/containers/TransparentHeaderContainer'
import HeaderContainer from '../layout/containers/HeaderContainer'
import ExtrasContainer from '../../routes/extras/containers/ExtrasContainer'
import { EXTERNAL_EXTRA_ROUTE, SPRUNGBRETT_ROUTE, WOHNEN_ROUTE } from '../../routes/extras/constants'
import WohnenExtraContainer from '../../routes/wohnen/containers/WohnenExtraContainer'
import SprungbrettExtraContainer from '../../routes/sprungbrett/containers/SprungbrettExtraContainer'
import ExternalExtraContainer from '../../routes/external-extra/containers/ExternalExtraContainer'
import EventsContainer from '../../routes/events/containers/EventsContainer'
import SettingsContainer from '../../routes/settings/container/SettingsContainer'
import ChangeLanguageModalContainer from '../../routes/language/containers/ChangeLanguageModalContainer'
import SearchModalContainer from '../../routes/search/containers/SearchModalContainer'
import ImageViewModal from '../../routes/image/components/ImageViewModal'
import PDFViewModal from '../../routes/pdf/components/PDFViewModal'
import FeedbackModalContainer from '../../routes/feedback/containers/FeedbackModalContainer'
import LandingContainer from '../../routes/landing/containers/LandingContainer'
import React from 'react'
import DisclaimerContainer from '../../routes/disclaimer/DisclaimerContainer'

const LayoutedDashboardContainer = withLayout(DashboardContainer)
const LayoutedCategoriesContainer = withLayout(CategoriesContainer)

const createNavigationRouteConfig = (Component: NavigationComponent, header = null): NavigationRouteConfig => ({
  screen: Component,
  navigationOptions: {
    header: header
  }
})

const transparentHeader = (headerProps: HeaderProps) =>
  <TransparentHeaderContainer scene={headerProps.scene} scenes={headerProps.scenes} />

const defaultHeader = (headerProps: HeaderProps) =>
  <HeaderContainer scene={headerProps.scene} scenes={headerProps.scenes} />

const cityContentRouteConfigMap: NavigationRouteConfigMap = {
  'Dashboard': createNavigationRouteConfig(LayoutedDashboardContainer, defaultHeader),
  'Categories': createNavigationRouteConfig(LayoutedCategoriesContainer, defaultHeader),
  'Extras': createNavigationRouteConfig(ExtrasContainer, defaultHeader),
  [WOHNEN_ROUTE]: createNavigationRouteConfig(WohnenExtraContainer, defaultHeader),
  [SPRUNGBRETT_ROUTE]: createNavigationRouteConfig(SprungbrettExtraContainer, defaultHeader),
  [EXTERNAL_EXTRA_ROUTE]: createNavigationRouteConfig(ExternalExtraContainer, defaultHeader),
  'Events': createNavigationRouteConfig( // $FlowFixMe We don't know why this fails.
    EventsContainer, defaultHeader
  ),
  'Settings': createNavigationRouteConfig(SettingsContainer, defaultHeader),
  'Disclaimer': createNavigationRouteConfig(DisclaimerContainer, defaultHeader),
  'ChangeLanguageModal': createNavigationRouteConfig(ChangeLanguageModalContainer),
  'SearchModal': createNavigationRouteConfig(SearchModalContainer),
  'ImageViewModal': createNavigationRouteConfig(ImageViewModal, transparentHeader),
  'PDFViewModal': createNavigationRouteConfig(PDFViewModal, transparentHeader),
  'FeedbackModal': createNavigationRouteConfig(FeedbackModalContainer, transparentHeader)
}

export type CreateNavigationContainerParamsType =
  {| initialRouteName: 'Landing' |} |
  {|
    initialRouteName: 'CityContent',
    cityCode: string,
    language: string,
    clearCategory: (key: string) => void,
    key: string
  |}

const createCityContentNavigator = (params: CreateNavigationContainerParamsType) => {
  if (params.initialRouteName === 'Landing') {
    return createStackNavigator(cityContentRouteConfigMap)
  } else {
    const { clearCategory, key, cityCode, language } = params
    return createStackNavigator(cityContentRouteConfigMap,
      {
        initialRouteName: 'Dashboard',
        initialRouteKey: key,
        initialRouteParams: {
          onRouteClose: () => clearCategory(key),
          sharePath: `/${cityCode}/${language}`
        }
      })
  }
}

const createAppNavigationContainer = (params: CreateNavigationContainerParamsType): NavigationContainer<*, *, *> => {
  const cityContentNavigator = createCityContentNavigator(params)
  return createAppContainer(
    createSwitchNavigator({
      'Landing': LandingContainer,
      'CityContent': cityContentNavigator
    }, { initialRouteName: params.initialRouteName }))
}

export default createAppNavigationContainer

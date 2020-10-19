// @flow

import withLayout from '../layout/hocs/withLayout'
import DashboardContainer from '../../routes/dashboard/containers/DashboardContainer'
import CategoriesContainer from '../../routes/categories/containers/CategoriesContainer'
import type {
  HeaderProps,
  NavigationComponent,
  NavigationContainer,
  NavigationNavigator,
  NavigationRouteConfig,
  NavigationRouteConfigMap,
  NavigationRouter,
  NavigationScreenProp
} from 'react-navigation'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import TransparentHeaderContainer from '../layout/containers/TransparentHeaderContainer'
import SettingsHeaderContainer from '../layout/containers/SettingsHeaderContainer'
import HeaderContainer from '../layout/containers/HeaderContainer'
import OffersContainer from '../../routes/offers/containers/OffersContainer'
import { EXTERNAL_OFFER_ROUTE, SPRUNGBRETT_ROUTE, WOHNEN_ROUTE } from '../../routes/offers/constants'
import WohnenOfferContainer from '../../routes/wohnen/containers/WohnenOfferContainer'
import SprungbrettOfferContainer from '../../routes/sprungbrett/containers/SprungbrettOfferContainer'
import ExternalOfferContainer from '../../routes/external-offer/containers/ExternalOfferContainer'
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
import IntroContainer from '../../routes/intro/IntroContainer'
import PermissionSnackbarContainer from '../layout/containers/PermissionSnackbarContainer'
import NewsContainer from '../../routes/news/containers/NewsContainer'
import PoisContainer from '../../routes/pois/containers/PoisContainer'

const LayoutedDashboardContainer = withLayout(DashboardContainer)
const LayoutedCategoriesContainer = withLayout(CategoriesContainer)

const createNavigationRouteConfig = (Component: NavigationComponent, header = null): NavigationRouteConfig => ({
  screen: Component,
  navigationOptions: {
    header: header
  }
})

const transparentStaticHeader = (headerProps: HeaderProps) =>
  <TransparentHeaderContainer scene={headerProps.scene} scenes={headerProps.scenes} float={false} />

const transparentFloatingHeader = (headerProps: HeaderProps) =>
  <TransparentHeaderContainer scene={headerProps.scene} scenes={headerProps.scenes} float />

const settingsHeader = (headerProps: HeaderProps) =>
  <SettingsHeaderContainer scene={headerProps.scene} scenes={headerProps.scenes} />

const defaultHeader = (headerProps: HeaderProps) =>
  <HeaderContainer scene={headerProps.scene} scenes={headerProps.scenes} />

const cityContentRouteConfigMap: NavigationRouteConfigMap = {
  Dashboard: createNavigationRouteConfig(LayoutedDashboardContainer, defaultHeader),
  Categories: createNavigationRouteConfig(LayoutedCategoriesContainer, defaultHeader),
  Offers: createNavigationRouteConfig(OffersContainer, defaultHeader),
  [WOHNEN_ROUTE]: createNavigationRouteConfig(WohnenOfferContainer, defaultHeader),
  [SPRUNGBRETT_ROUTE]: createNavigationRouteConfig(SprungbrettOfferContainer, defaultHeader),
  [EXTERNAL_OFFER_ROUTE]: createNavigationRouteConfig(ExternalOfferContainer, defaultHeader),
  Pois: createNavigationRouteConfig(// $FlowFixMe We don't know why this fails.
    PoisContainer, defaultHeader),
  Events: createNavigationRouteConfig( // $FlowFixMe We don't know why this fails.
    EventsContainer, defaultHeader
  ),
  News: createNavigationRouteConfig( // $FlowFixMe Me either don't know why this fails.
    NewsContainer, defaultHeader
  ),
  PDFViewModal: createNavigationRouteConfig( // $FlowFixMe We don't know why this fails.
    PDFViewModal, transparentFloatingHeader
  ),
  ChangeLanguageModal: createNavigationRouteConfig(ChangeLanguageModalContainer, transparentStaticHeader),
  SearchModal: createNavigationRouteConfig(SearchModalContainer),
  ImageViewModal: createNavigationRouteConfig(ImageViewModal, transparentFloatingHeader),
  FeedbackModal: createNavigationRouteConfig(FeedbackModalContainer, transparentFloatingHeader),
  Settings: createNavigationRouteConfig(SettingsContainer, settingsHeader),
  Disclaimer: createNavigationRouteConfig(DisclaimerContainer, defaultHeader)
}

export type CreateNavigationContainerParamsType = {|
  initialRouteName: 'Landing'
|} | {|
  initialRouteName: 'Intro'
|} | {|
  initialRouteName: 'CityContent',
  cityCode: string,
  language: string,
  clearCategory: (key: string) => void,
  key: string
|}

const createCityContentNavigator = (params: CreateNavigationContainerParamsType) => {
  if (params.initialRouteName === 'Landing') {
    return createStackNavigator(cityContentRouteConfigMap)
  } else if (params.initialRouteName === 'Intro') {
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

type NavigatorPropsType = {|
  navigation: NavigationScreenProp<*>
|}

const createSwitchNavigatorWithSnackbar = (
  params: CreateNavigationContainerParamsType
): NavigationNavigator<*, *, *> => {
  const cityContentNavigator = createCityContentNavigator(params)
  const SwitchNavigator = createSwitchNavigator({
    Intro: IntroContainer,
    Landing: LandingContainer,
    CityContent: cityContentNavigator
  }, { initialRouteName: params.initialRouteName })

  class SwitchNavigatorWithSnackbar extends React.Component<NavigatorPropsType> {
    static router: NavigationRouter<*, *> = SwitchNavigator.router
    static navigationOptions = SwitchNavigator.navigationOptions

    render () {
      const { navigation } = this.props

      return <>
        <SwitchNavigator navigation={navigation} />
        <PermissionSnackbarContainer navigation={navigation} />
      </>
    }
  }

  return SwitchNavigatorWithSnackbar
}

const createContainer = (params: CreateNavigationContainerParamsType): NavigationContainer<*, *, *> =>
  createAppContainer(createSwitchNavigatorWithSnackbar(params))

export default createContainer

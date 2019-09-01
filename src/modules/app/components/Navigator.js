// @flow

import * as React from 'react'
import type {
  HeaderProps,
  NavigationComponent,
  NavigationContainer,
  NavigationRouteConfig,
  NavigationState
} from 'react-navigation'
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
  NavigationActions,
  StackActions
} from 'react-navigation'
import CategoriesContainer from '../../../routes/categories/containers/CategoriesContainer'
import LandingContainer from '../../../routes/landing/containers/LandingContainer'
import DashboardContainer from '../../../routes/dashboard/containers/DashboardContainer'
import withLayout from '../../layout/hocs/withLayout'
import HeaderContainer from '../../layout/containers/HeaderContainer'
import PDFViewModal from '../../../routes/pdf/components/PDFViewModal'
import ImageViewModal from '../../../routes/image/components/ImageViewModal'
import ChangeLanguageModalContainer from '../../../routes/language/containers/ChangeLanguageModalContainer'
import TransparentHeaderContainer from '../../layout/containers/TransparentHeaderContainer'
import ExtrasContainer from '../../../routes/extras/containers/ExtrasContainer'
import WohnenExtraContainer from '../../../routes/wohnen/containers/WohnenExtraContainer'
import SprungbrettExtraContainer from '../../../routes/sprungbrett/containers/SprungbrettExtraContainer'
import { EXTERNAL_EXTRA_ROUTE, SPRUNGBRETT_ROUTE, WOHNEN_ROUTE } from '../../../routes/extras/constants'
import EventsContainer from '../../../routes/events/containers/EventsContainer'
import SearchModalContainer from '../../../routes/search/containers/SearchModalContainer'
import ExternalExtraContainer from '../../../routes/external-extra/containers/ExternalExtraContainer'
import SettingsContainer from '../../../routes/settings/container/SettingsContainer'
import FeedbackModalContainer from '../../../routes/feedback/containers/FeedbackModalContainer'
import { generateKey } from '../generateRouteKey'
import AppSettings from '../../settings/AppSettings'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../StoreActionType'

const LayoutedDashboardContainer = withLayout(DashboardContainer)
const LayoutedCategoriesContainer = withLayout(CategoriesContainer)

const createNavigationRouteConfig = (Component: NavigationComponent, header = null): NavigationRouteConfig => ({
  screen: Component,
  navigationOptions: {
    header: header
  }
})

const transparentHeader = (headerProps: HeaderProps) =>
  <TransparentHeaderContainer scene={headerProps.scene}
                              scenes={headerProps.scenes} />

const defaultHeader = (headerProps: HeaderProps) =>
  <HeaderContainer scene={headerProps.scene} scenes={headerProps.scenes} />

/*
 The app behaves pretty weird when you have a StackNavigator -> SwitchNavigator -> StackNavigator
 Therefore I removed the StackNavigator in the root and moved the routes to the other StackNavigator.
 We can not set the modal prop, but this is good enough atm.
 */
export const AppStack = createStackNavigator(
  {
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
    'ChangeLanguageModal': createNavigationRouteConfig(ChangeLanguageModalContainer),
    'SearchModal': createNavigationRouteConfig(SearchModalContainer),
    'ImageViewModal': createNavigationRouteConfig(ImageViewModal, transparentHeader),
    'PDFViewModal': createNavigationRouteConfig(PDFViewModal, transparentHeader),
    'FeedbackModal': createNavigationRouteConfig(FeedbackModalContainer, transparentHeader)
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
)

export const LandingStack = createSwitchNavigator({
  'Loading': () => null,
  'Landing': LandingContainer,
  'App': AppStack
})

const AppContainer: NavigationContainer<NavigationState, {}, {}> = createAppContainer(LandingStack)

type PropsType = {|
  setContentLanguage: (language: string) => void,
  fetchCategory: (cityCode: string, language: string, key: string) => void,
  clearCategory: (key: string) => void,
  fetchCities: (forceRefresh: boolean) => void
|}

class Navigator extends React.Component<PropsType> {
  appSettings: AppSettings = new AppSettings()
  navigator: {
    current: null | { ...React$ElementRef<NavigationContainer<NavigationState, {}, {}>>, dispatch: Dispatch<StoreActionType> }
  } = React.createRef()

  componentDidMount () {
    this.props.fetchCities(false)
    this.loadSelectedCity()
  }

  async loadSelectedCity () {
    const selectedCity = await this.appSettings.loadSelectedCity()
    const contentLanguage: ?string = await this.appSettings.loadContentLanguage()

    if (!contentLanguage) {
      throw new Error('ContentLanguage must be set!')
    }
    this.props.setContentLanguage(contentLanguage)

    if (!this.navigator.current) {
      throw new Error('Ref must not be null!')
    }

    if (selectedCity) {
      this.navigateToDashboard(selectedCity, contentLanguage)
    } else {
      this.navigator.current.dispatch(NavigationActions.navigate({
        routeName: 'Landing'
      }))
    }
  }

  navigateToDashboard (cityCode: string, language: string) {
    const path = `/${cityCode}/${language}`
    const key = generateKey()

    const navigateToDashboard = StackActions.replace({
      routeName: 'Dashboard',
      params: {
        sharePath: path,
        onRouteClose: () => this.props.clearCategory(key)
      },
      newKey: key
    })

    if (!this.navigator.current) {
      throw new Error('Ref must not be null!')
    }
    this.navigator.current.dispatch(NavigationActions.navigate({
      routeName: 'App',
      // $FlowFixMe For some reason action is not allowed to be a StackAction
      action: navigateToDashboard
    }))

    this.props.fetchCategory(cityCode, language, key)
  }

  render () {
    return <AppContainer ref={this.navigator} />
  }
}

export default Navigator

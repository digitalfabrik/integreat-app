// @flow

import * as React from 'react'
import type { HeaderProps, NavigationContainer, NavigationState, NavigationComponent } from 'react-navigation'
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
  StackActions,
  NavigationActions,
  type NavigationRouteConfig
} from 'react-navigation'
import CategoriesContainer from '../../../routes/categories/containers/CategoriesContainer'
import LandingContainer from '../../../routes/landing/containers/LandingContainer'
import DashboardContainer from '../../../routes/dashboard/containers/DashboardContainer'
import withLayout from '../../layout/hocs/withLayout'
import HeaderContainer from '../../layout/containers/HeaderContainer'
import PDFViewModal from '../../../routes/pdf/components/PDFViewModal'
import ImageViewModal from '../../../routes/image/components/ImageViewModal'
import ChangeLanguageModalContainer from '../../../routes/language/containers/ChangeLanguageModalContainer'
import MapViewModal from '../../../routes/map/components/MapViewModal'
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
    'Events': createNavigationRouteConfig(EventsContainer, defaultHeader),
    'Settings': createNavigationRouteConfig(SettingsContainer, defaultHeader),
    'MapViewModal': createNavigationRouteConfig(MapViewModal),
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
  fetchCategory: (cityCode: string, language: string, key: string) => void,
  clearCategory: (key: string) => void,
  fetchCities: () => void
|}

class Navigator extends React.Component<PropsType> {
  appSettings: AppSettings
  navigator: {current: null | React$ElementRef<NavigationContainer<NavigationState, {}, {}>>}

  constructor (props: PropsType) {
    super(props)
    this.appSettings = new AppSettings()
    this.navigator = React.createRef()
  }

  componentWillMount () {
    this.props.fetchCities()
  }

  componentDidMount () {
    this.loadSelectedCity()
  }

  async loadSelectedCity () {
    const selectedCity = await this.appSettings.loadSelectedCity()
    const contentLanguage: ?string = await this.appSettings.loadContentLanguage()

    if (!contentLanguage) {
      throw new Error('ContentLanguage must be set!')
    } else if (!this.navigator) {
      throw new Error('Ref must not be null!')
    }

    if (selectedCity) {
      this.navigateToDashboard(selectedCity, contentLanguage)
    } else {
      // $FlowFixMe dispatch is missing in tpe
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
        cityCode,
        key,
        sharePath: path,
        onRouteClose: () => this.props.clearCategory(key)
      },
      newKey: key
    })

    // $FlowFixMe dispatch is missing in type, https://github.com/react-navigation/react-navigation/issues/3842
    this.navigator.current.dispatch(NavigationActions.navigate({
      routeName: 'App',
      action: navigateToDashboard
    }))

    this.props.fetchCategory(cityCode, language, key)
  }

  render () {
    return <AppContainer ref={this.navigator} />
  }
}

export default Navigator

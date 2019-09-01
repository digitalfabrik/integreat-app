// @flow

import * as React from 'react'
import type {
  HeaderProps,
  NavigationComponent,
  NavigationContainer,
  NavigationRouteConfig,
  NavigationState,
  StackNavigatorConfig
} from 'react-navigation'
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation'
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

/*
 The app behaves pretty weird when you have a StackNavigator -> SwitchNavigator -> StackNavigator
 Therefore I removed the StackNavigator in the root and moved the routes to the other StackNavigator.
 We can not set the modal prop, but this is good enough atm.
 */
const createCityContentStack = (config?: StackNavigatorConfig) => createStackNavigator(
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
  config
)

const createMainSwitch = (
  selectedCity: ?string,
  contentLanguage: string,
  clearCategory: (key: string) => void,
  fetchDashboard: ({ city: string, language: string, key: string }) => void
) => {
  if (!selectedCity) {
    return createSwitchNavigator({
      'Landing': LandingContainer,
      'CityContent': createCityContentStack({})
    }, { initialRouteName: 'Landing' })
  } else {
    const key = generateKey()
    const cityContentStack = createCityContentStack(
      {
        initialRouteName: 'Dashboard',
        initialRouteKey: key,
        initialRouteParams: {
          onRouteClose: () => {},
          sharePath: `/${selectedCity}/${contentLanguage}`
        }
      })
    fetchDashboard({ city: selectedCity, language: contentLanguage, key })

    return createSwitchNavigator({
      'Landing': LandingContainer,
      'CityContent': cityContentStack
    }, { initialRouteName: 'CityContent' })
  }
}

type PropsType = {|
  setContentLanguage: (language: string) => void,
  clearCategory: (key: string) => void,
  fetchDashboard: ({ city: string, language: string, key: string }) => void,
  fetchCities: (forceRefresh: boolean) => void,
  selectedCity: ?string,
  contentLanguage: string
|}

class Navigator extends React.Component<PropsType> {
  appContainer: NavigationContainer<NavigationState, {}, {}>

  constructor (props: PropsType) {
    super(props)
    this.appContainer = createAppContainer(
      createMainSwitch(props.selectedCity, props.contentLanguage, props.clearCategory, props.fetchDashboard)
    )
  }

  componentDidMount () {
    this.props.fetchCities(false)
  }

  render () {
    const AppContainer = this.appContainer
    return <AppContainer />
  }
}

export default Navigator

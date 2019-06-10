// @flow

import * as React from 'react'
import type { HeaderProps, NavigationContainer, NavigationState } from 'react-navigation'
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation'
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

const LayoutedDashboardContainer = withLayout(DashboardContainer)
const LayoutedCategoriesContainer = withLayout(CategoriesContainer)

const createNavigationScreen = (component, header = null) => {
  return {
    screen: component,
    navigationOptions: {
      header: header
    }
  }
}

const transparentHeader = (headerProps: HeaderProps) =>
  <TransparentHeaderContainer scene={headerProps.scene}
                              scenes={headerProps.scenes} />

const defaultHeader = (headerProps: HeaderProps) =>
  <HeaderContainer scene={headerProps.scene} scenes={headerProps.scenes} />

export const ExtrasStack = createStackNavigator(
  {
    'Extras': ExtrasContainer,
    [WOHNEN_ROUTE]: WohnenExtraContainer,
    [SPRUNGBRETT_ROUTE]: SprungbrettExtraContainer,
    [EXTERNAL_EXTRA_ROUTE]: ExternalExtraContainer
  },
  {
    initialRouteName: 'Extras',
    defaultNavigationOptions: {
      header: null
    }
  }
)
/*
 The app behaves pretty weird when you have a StackNavigator -> SwitchNavigator -> StackNavigator
 Therefore I removed the StackNavigator in the root and moved the routes to the other StackNavigator.
 We can not set the modal prop, but this is good enough atm.
 */
export const AppStack = createStackNavigator(
  {
    'Dashboard': createNavigationScreen(LayoutedDashboardContainer, defaultHeader),
    'Categories': createNavigationScreen(LayoutedCategoriesContainer, defaultHeader),
    'Extras': createNavigationScreen(ExtrasStack, defaultHeader),
    'Events': createNavigationScreen(EventsContainer, defaultHeader),
    'Settings': createNavigationScreen(SettingsContainer, defaultHeader),
    'MapViewModal': createNavigationScreen(MapViewModal),
    'ChangeLanguageModal': createNavigationScreen(ChangeLanguageModalContainer),
    'SearchModal': createNavigationScreen(SearchModalContainer),
    'ImageViewModal': createNavigationScreen(ImageViewModal, transparentHeader),
    'PDFViewModal': createNavigationScreen(PDFViewModal, transparentHeader),
    'FeedbackModal': createNavigationScreen(FeedbackModalContainer, transparentHeader)
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
)

export const LandingStack = createSwitchNavigator(
  {
    //            The translate() HOC does not calculate props correctly right now. Because the connect
    // $FlowFixMe in LandingContainer needs the translation HOC there is a flow error here. (NATIVE-53)
    'Landing': LandingContainer,
    'App': AppStack
  }
)

const AppContainer: NavigationContainer<NavigationState, {}, {}> = createAppContainer(LandingStack)
export default AppContainer

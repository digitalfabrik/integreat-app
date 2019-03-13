// @flow

import * as React from 'react'
import type { HeaderProps, NavigationContainer, NavigationState } from 'react-navigation'
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation'
import CategoriesContainer from '../../../routes/categories/containers/CategoriesContainer'
import LandingContainer from '../../../routes/landing/containers/LandingContainer'
import DashboardContainer from '../../../routes/dashboard/containers/DashboardContainer'
import withLayout from '../../layout/hocs/withLayout'
import HeaderContainer from '../../layout/containers/HeaderContainer'
import PDFViewModal from '../../../routes/pdf/components/PDFViewModal'
import ImageViewModal from '../../../routes/image/components/ImageViewModal'
import ChangeLanguageModalContainer from '../../../routes/language/containers/ChangeLanguageModalContainer'
import MapViewModal from '../../../routes/map/components/MapViewModal'
import ModalHeaderContainer from '../../layout/containers/TransparentHeaderContainer'
import ExtrasContainer from '../../extras/containers/ExtrasContainer'
import WohnenExtraContainer from '../../wohnen/containers/WohnenExtraContainer'
import SprungbrettExtraContainer from '../../sprungbrett/containers/SprungbrettExtraContainer'
import { SPRUNGBRETT_ROUTE, WOHNEN_ROUTE } from '../../extras/constants/index'
import EventsContainer from '../../events/containers/EventsContainer'

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
  <ModalHeaderContainer scene={headerProps.scene}
                        scenes={headerProps.scenes} />

const defaultHeader = (headerProps: HeaderProps) =>
  <HeaderContainer scene={headerProps.scene} scenes={headerProps.scenes} />

export const ExtrasStack = createStackNavigator(
  {
    'Extras': ExtrasContainer,
    [WOHNEN_ROUTE]: WohnenExtraContainer,
    [SPRUNGBRETT_ROUTE]: SprungbrettExtraContainer
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
    'MapViewModal': createNavigationScreen(MapViewModal),
    'ChangeLanguageModal': createNavigationScreen(ChangeLanguageModalContainer),
    'ImageViewModal': createNavigationScreen(ImageViewModal, transparentHeader),
    'PDFViewModal': createNavigationScreen(PDFViewModal, transparentHeader)
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
)

export const LandingStack = createSwitchNavigator(
  {
    'Landing': LandingContainer,
    'App': AppStack
  }
)

const AppContainer: NavigationContainer<NavigationState, {}, {}> = createAppContainer(LandingStack)
export default AppContainer

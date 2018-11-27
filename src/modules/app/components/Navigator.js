// @flow

import * as React from 'react'
import type { HeaderProps } from 'react-navigation'
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

const transparentHeader = (headerProps: HeaderProps) => <ModalHeaderContainer scene={headerProps.scene}
                                                                              scenes={headerProps.scenes} />

export const AppStack = createStackNavigator(
  {
    'Dashboard': LayoutedDashboardContainer,
    'Categories': LayoutedCategoriesContainer
  },
  {
    initialRouteName: 'Dashboard',
    defaultNavigationOptions: {
      header: (headerProps: HeaderProps) => <HeaderContainer scene={headerProps.scene} scenes={headerProps.scenes} />
    }
  }
)

export const LandingStack = createSwitchNavigator(
  {
    'Landing': LandingContainer,
    'App': AppStack
  },
  {
    initialRouteName: 'Landing',
    navigationOptions: {
      header: null
    }
  }
)

const MainStack = createStackNavigator(
  {
    'LandingStack': createNavigationScreen(LandingStack),
    'ChangeLanguageModal': createNavigationScreen(ChangeLanguageModalContainer),
    'MapViewModal': createNavigationScreen(MapViewModal),
    'ImageViewModal': createNavigationScreen(ImageViewModal, transparentHeader),
    'PDFViewModal': createNavigationScreen(PDFViewModal, transparentHeader)
  },
  {
    mode: 'modal'
  }
)
export default createAppContainer(MainStack)

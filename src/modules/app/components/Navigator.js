// @flow

import * as React from 'react'
import type { HeaderProps } from 'react-navigation'
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import CategoriesContainer from '../../../routes/categories/containers/CategoriesContainer'
import LandingContainer from '../../../routes/landing/containers/LandingContainer'
import DashboardContainer from '../../../routes/dashboard/containers/DashboardContainer'
import withLayout from '../../layout/hocs/withLayout'
import HeaderContainer from '../../layout/containers/HeaderContainer'
import PDFViewModal from '../../../routes/pdf/components/PDFViewModal'
import ImageViewModalContainer from '../../../routes/image/containers/ImageViewModalContainer'
import ChangeLanguageModalContainer from '../../../routes/language/containers/ChangeLanguageModalContainer'
import MapViewModal from '../../../routes/map/components/MapViewModal'
import ModalHeaderContainer from '../../layout/containers/ModalHeaderContainer'

const LayoutedDashboardContainer = withLayout(DashboardContainer)
const LayoutedCategoriesContainer = withLayout(CategoriesContainer)

const createHeaderNavigatorItem = (component, header = null) => {
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
    navigationOptions: {
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
    initialRouteName: 'Landing'
  }
)

export default createStackNavigator(
  {
    'LandingStack': createHeaderNavigatorItem(LandingStack),
    'ChangeLanguageModal': createHeaderNavigatorItem(ChangeLanguageModalContainer),
    'MapViewModal': createHeaderNavigatorItem(MapViewModal),
    'ImageViewModal': createHeaderNavigatorItem(ImageViewModalContainer, transparentHeader),
    'PDFViewModal': createHeaderNavigatorItem(PDFViewModal, transparentHeader)
  },
  {
    mode: 'modal'
  }
)

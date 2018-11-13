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
import ImageViewModal from '../../../routes/image/components/ImageViewModal'
import ChangeLanguageModalContainer from '../../../routes/language/containers/ChangeLanguageModalContainer'
import MapViewModal from '../../../routes/map/components/MapViewModal'
import ModalHeaderContainer from '../../layout/containers/ModalHeaderContainer'

const LayoutedDashboardContainer = withLayout(DashboardContainer)
const LayoutedCategoriesContainer = withLayout(CategoriesContainer)

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
    'LandingStack': {
      screen: LandingStack,
      navigationOptions: {
        header: null
      }
    },
    'ChangeLanguageModal': {
      screen: ChangeLanguageModalContainer,
      navigationOptions: {
        header: null
      }
    },
    'MapViewModal': {
      screen: MapViewModal,
      navigationOptions: {
        header: null
      }
    },
    'ImageViewModal': {
      screen: ImageViewModal,
      navigationOptions: {
        header: (headerProps: HeaderProps) => <ModalHeaderContainer scene={headerProps.scene}
                                                                    scenes={headerProps.scenes} />
      }
    },
    'PDFViewModal': {
      screen: PDFViewModal,
      navigationOptions: {
        header: (headerProps: HeaderProps) => <ModalHeaderContainer scene={headerProps.scene}
                                                                    scenes={headerProps.scenes} />
      }
    }
  },
  {
    mode: 'modal'
  }
)

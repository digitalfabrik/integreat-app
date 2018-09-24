// @flow

import * as React from 'react'
import type { HeaderProps } from 'react-navigation'
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import CategoriesContainer from 'routes/categories/containers/CategoriesContainer'
import LandingContainer from 'routes/landing/containers/LandingContainer'
import DashboardContainer from 'routes/dashboard/containers/DashboardContainer'
import withLayout from '../../layout/hocs/withLayout'
import HeaderContainer from '../../layout/containers/HeaderContainer'
import PDF from '../../../routes/pdf/components/PDF'

const LayoutedDashboardContainer = withLayout(DashboardContainer)
const LayoutedCategoriesContainer = withLayout(CategoriesContainer)

export const AppStack = createStackNavigator(
  {
    'PDF': PDF,
    'Dashboard': LayoutedDashboardContainer,
    'Categories': LayoutedCategoriesContainer
  },
  {
    initialRouteName: 'Dashboard',
    navigationOptions: {
      header: (headerProps: HeaderProps) => <HeaderContainer scene={headerProps.scene} />
    }
  }
)

export default createSwitchNavigator(
  {
    'Landing': LandingContainer,
    'App': AppStack
  },
  {
    initialRouteName: 'Landing'
  }
)

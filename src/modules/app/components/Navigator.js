// @flow

import * as React from 'react'
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import CategoriesContainer from 'screens/categories/containers/CategoriesContainer'
import LandingContainer from 'screens/landing/containers/LandingContainer'
import DashboardContainer from 'screens/dashboard/containers/DashboardContainer'
import withLayout from '../../layout/hocs/withLayout'
import HeaderContainer from '../../layout/container/HeaderContainer'

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
      header: headerProps => <HeaderContainer scene={headerProps.scene} />
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

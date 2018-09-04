import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import Header from '../../layout/components/Header'
import CategoriesContainer from 'screens/categories/containers/CategoriesContainer'
import LandingContainer from 'screens/landing/containers/LandingContainer'
import DashboardContainer from 'screens/dashboard/containers/DashboardContainer'
import withLayout from '../../layout/hocs/withLayout'

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
      header: Header
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

import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import Dashboard from '../../../screens/dashboard/components/Dashboard'
import Header from '../../layout/components/Header'
import CategoriesContainer from '../../../screens/categories/container/CategoriesContainer'
import LandingContainer from '../../../screens/landing/containers/LandingContainer'
import theme from 'modules/layout/constants/theme'

const AppStack = createStackNavigator(
  {
    'Dashboard': Dashboard,
    'Categories': CategoriesContainer
  },
  {
    initialRouteName: 'Dashboard',
    navigationOptions: {
      header: Header
    },
    cardStyle: {
      backgroundColor: theme.colors.backgroundColor
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

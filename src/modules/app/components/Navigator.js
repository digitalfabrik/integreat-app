import { createStackNavigator } from 'react-navigation'
import Dashboard from '../../../screens/dashboard/components/Dashboard'
import Header from '../../layout/components/Header'
import CategoriesContainer from '../../../screens/categories/container/CategoriesContainer'
import LandingContainer from '../../../screens/landing/containers/LandingContainer'
import theme from 'modules/layout/constants/theme'

export default createStackNavigator(
  {
    'Landing': LandingContainer,
    'Dashboard': Dashboard,
    'Categories': CategoriesContainer
  },
  {
    initialRouteName: 'Landing',
    navigationOptions: {
      header: Header
    },
    cardStyle: { backgroundColor: theme.colors.backgroundColor }
  }
)

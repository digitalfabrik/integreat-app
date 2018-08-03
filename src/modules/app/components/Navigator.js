import { createStackNavigator } from 'react-navigation'
import Dashboard from '../../../screens/dashboard/components/Dashboard'
import Categories from '../../../screens/categories/components/Categories'
import Header from '../../layout/components/Header'

export default createStackNavigator(
  {
    'Dashboard': Dashboard,
    'Categories': Categories
  },
  {
    initialRouteName: 'Dashboard',
    navigationOptions: {
      header: Header
    }
  }
)

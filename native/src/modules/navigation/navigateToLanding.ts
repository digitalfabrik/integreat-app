import { Dispatch } from 'redux'
import { StoreActionType } from '../app/StoreActionType'
import { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { LANDING_ROUTE } from 'api-client/src/routes'

const navigateToLanding = <T extends RoutesType>({
  dispatch,
  navigation
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationPropType<T>
}) => {
  // We have to clear the whole navigation state if navigating to the landing route.
  // Otherwise there would still be open routes from the last city in the new city.
  navigation.reset({
    index: 0,
    routes: [
      {
        name: LANDING_ROUTE
      }
    ]
  })
  dispatch({
    type: 'CLEAR_CITY'
  })
}

export default navigateToLanding

import { Dispatch } from 'redux'
import { StoreActionType } from '../redux/StoreActionType'
import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import { JPAL_TRACKING_ROUTE } from 'api-client'

const navigateToJpalTracking = <T extends RoutesType>({
  dispatch,
  navigation,
  trackingCode
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationPropType<T>
  trackingCode: string | null
}) => {
  navigation.navigate({
    name: JPAL_TRACKING_ROUTE,
    params: {
      trackingCode
    }
  })
}

export default navigateToJpalTracking

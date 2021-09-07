import { Dispatch } from 'redux'

import { JPAL_TRACKING_ROUTE } from 'api-client'

import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import { StoreActionType } from '../redux/StoreActionType'

const navigateToJpalTracking = <T extends RoutesType>({
  navigation,
  trackingCode
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationPropType<T>
  trackingCode: string | null
}): void => {
  navigation.navigate({
    name: JPAL_TRACKING_ROUTE,
    params: {
      trackingCode
    }
  })
}

export default navigateToJpalTracking

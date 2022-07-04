import { Dispatch } from 'redux'

import { JPAL_TRACKING_ROUTE } from 'api-client'

import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import { StoreActionType } from '../redux/StoreActionType'

const navigateToJpalTracking = <T extends RoutesType>({
  navigation,
  trackingCode,
  disableTracking
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationPropType<T>
  trackingCode: string | null
  disableTracking?: boolean
}): void => {
  navigation.navigate({
    name: JPAL_TRACKING_ROUTE,
    params: {
      trackingCode,
      disableTracking
    }
  })
}

export default navigateToJpalTracking

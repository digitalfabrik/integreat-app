// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from '../app/StoreActionType'
import type { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { JPAL_EVALUATION_ROUTE } from 'api-client'

const navigateToJpalEvaluation = <T: RoutesType>({
  dispatch,
  navigation,
  trackingCode
}: {|
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>,
  trackingCode: string | null
|}) => {
  navigation.navigate({ name: JPAL_EVALUATION_ROUTE, params: { trackingCode } })
}

export default navigateToJpalEvaluation

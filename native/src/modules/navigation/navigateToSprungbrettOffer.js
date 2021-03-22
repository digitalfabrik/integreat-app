// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from '../app/StoreActionType'
import type { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { SPRUNGBRETT_OFFER_ROUTE } from 'api-client/src/routes'

const navigateToSprungbrettOffer = <T: RoutesType>({
  dispatch,
  navigation,
  cityCode,
  languageCode
}: {|
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>,
  cityCode: string,
  languageCode: string
|}) => {
  navigation.navigate({
    name: SPRUNGBRETT_OFFER_ROUTE,
    params: {
      cityCode,
      languageCode
    }
  })
}

export default navigateToSprungbrettOffer

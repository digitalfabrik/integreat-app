// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from '../app/StoreActionType'
import type { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { OFFERS_ROUTE } from 'api-client/src/routes'
import { cityContentUrl } from './url'

const navigateToOffers = <T: RoutesType>({ dispatch, navigation, cityCode, languageCode }: {|
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>,
  cityCode: string,
  languageCode: string
|}) => {
  navigation.navigate({
    name: OFFERS_ROUTE,
    params: {
      cityCode,
      languageCode,
      shareUrl: cityContentUrl({ cityCode, languageCode, route: OFFERS_ROUTE })
    }
  })
}

export default navigateToOffers

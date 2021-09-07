import { Dispatch } from 'redux'

import { OFFERS_ROUTE } from 'api-client/src/routes'

import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import { StoreActionType } from '../redux/StoreActionType'

const navigateToOffers = <T extends RoutesType>({
  navigation,
  cityCode,
  languageCode
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationPropType<T>
  cityCode: string
  languageCode: string
}): void => {
  navigation.navigate({
    name: OFFERS_ROUTE,
    params: {
      cityCode,
      languageCode
    }
  })
}

export default navigateToOffers

import { Dispatch } from 'redux'

import { SPRUNGBRETT_OFFER_ROUTE } from 'api-client/src/routes'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import { StoreActionType } from '../redux/StoreActionType'

const navigateToSprungbrettOffer = <T extends RoutesType>({
  navigation,
  cityCode,
  languageCode,
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationProps<T>
  cityCode: string
  languageCode: string
}): void => {
  navigation.navigate({
    name: SPRUNGBRETT_OFFER_ROUTE,
    params: {
      cityCode,
      languageCode,
    },
  })
}

export default navigateToSprungbrettOffer

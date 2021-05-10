import { Dispatch } from 'redux'
import { StoreActionType } from '../app/StoreActionType'
import { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { OFFERS_ROUTE } from 'api-client/src/routes'

const navigateToOffers = <T extends RoutesType>({
  dispatch,
  navigation,
  cityCode,
  languageCode
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationPropType<T>
  cityCode: string
  languageCode: string
}) => {
  navigation.navigate({
    name: OFFERS_ROUTE,
    params: {
      cityCode,
      languageCode
    }
  })
}

export default navigateToOffers

import { Dispatch } from 'redux'
import { StoreActionType } from '../app/StoreActionType'
import { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { DISCLAIMER_ROUTE } from 'api-client/src/routes'

const navigateToDisclaimer = <T extends RoutesType>({
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
    name: DISCLAIMER_ROUTE,
    params: {
      cityCode,
      languageCode
    }
  })
}

export default navigateToDisclaimer

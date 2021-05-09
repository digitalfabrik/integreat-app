import type { Dispatch } from 'redux'
import type { StoreActionType } from '../app/StoreActionType'
import type { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { SEARCH_ROUTE } from 'api-client/src/routes'

const navigateToSearch = <T extends RoutesType>({
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
    name: SEARCH_ROUTE
  })
}

export default navigateToSearch

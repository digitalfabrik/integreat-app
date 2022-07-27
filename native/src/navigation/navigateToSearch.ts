import { Dispatch } from 'redux'

import { SEARCH_ROUTE } from 'api-client/src/routes'

import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import { StoreActionType } from '../redux/StoreActionType'

const navigateToSearch = <T extends RoutesType>({
  navigation,
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationPropType<T>
  cityCode: string
  languageCode: string
}): void => {
  navigation.navigate({
    name: SEARCH_ROUTE,
    params: undefined,
  })
}

export default navigateToSearch

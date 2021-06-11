import { Dispatch } from 'redux'
import { StoreActionType } from '../redux/StoreActionType'
import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import { SEARCH_ROUTE } from 'api-client/src/routes'

const navigateToSearch = <T extends RoutesType>({
  navigation
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationPropType<T>
  cityCode: string
  languageCode: string
}): void => {
  navigation.navigate({
    name: SEARCH_ROUTE,
    params: undefined
  })
}

export default navigateToSearch

import { Dispatch } from 'redux'
import { FetchEventActionType, StoreActionType } from '../app/StoreActionType'
import { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { generateKey } from '../app/generateRouteKey'
import { EVENTS_ROUTE } from 'api-client/src/routes'

const navigateToEvents = <T extends RoutesType>({
  navigation,
  dispatch,
  cityCode,
  languageCode,
  cityContentPath,
  key = generateKey(),
  forceRefresh = false
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationPropType<T>
  cityCode: string
  languageCode: string
  cityContentPath: string | null | undefined
  key?: string
  forceRefresh?: boolean
}) => {
  navigation.navigate({
    name: EVENTS_ROUTE,
    key
  })
  const fetchEvent: FetchEventActionType = {
    type: 'FETCH_EVENT',
    params: {
      city: cityCode,
      language: languageCode,
      path: cityContentPath,
      key,
      criterion: {
        forceUpdate: forceRefresh,
        shouldRefreshResources: forceRefresh
      }
    }
  }
  dispatch(fetchEvent)
}

export default navigateToEvents

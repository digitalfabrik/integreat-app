import { Dispatch } from 'redux'

import { EVENTS_ROUTE } from 'api-client/src/routes'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import { FetchEventActionType, StoreActionType } from '../redux/StoreActionType'
import { generateRouteKey } from '../utils/helpers'

const navigateToEvents = <T extends RoutesType>({
  navigation,
  dispatch,
  cityCode,
  languageCode,
  cityContentPath,
  key = generateRouteKey(),
  forceRefresh = false,
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationProps<T>
  cityCode: string
  languageCode: string
  cityContentPath: string | null | undefined
  key?: string
  forceRefresh?: boolean
}): void => {
  navigation.navigate({
    name: EVENTS_ROUTE,
    params: {
      cityCode,
      languageCode,
    },
    key,
  })
  // const fetchEvent: FetchEventActionType = {
  //   type: 'FETCH_EVENT',
  //   params: {
  //     city: cityCode,
  //     language: languageCode,
  //     path: cityContentPath,
  //     key,
  //     criterion: {
  //       forceUpdate: forceRefresh,
  //       shouldRefreshResources: forceRefresh,
  //     },
  //   },
  // }
  // dispatch(fetchEvent)
}

export default navigateToEvents

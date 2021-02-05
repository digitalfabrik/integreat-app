// @flow

import type { Dispatch } from 'redux'
import type { FetchEventActionType, StoreActionType } from './StoreActionType'
import type { NavigationPropType, RoutesType } from './constants/NavigationTypes'
import { generateKey } from './generateRouteKey'
import { EVENTS_ROUTE } from './constants/NavigationTypes'

export type NavigateToEventParamsType =
  {| cityCode: string, language: string, cityContentPath: ?string, key?: string, forceRefresh?: boolean |}

const createNavigateToEvent = <T: RoutesType>(
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>
) => ({
    cityCode,
    language,
    cityContentPath,
    key = generateKey(),
    forceRefresh = false
  }: NavigateToEventParamsType) => {
    navigation.navigate({
      name: EVENTS_ROUTE,
      key
    })

    const fetchEvent: FetchEventActionType = {
      type: 'FETCH_EVENT',
      params: {
        city: cityCode,
        language,
        path: cityContentPath,
        key,
        criterion: { forceUpdate: forceRefresh, shouldRefreshResources: forceRefresh }
      }
    }

    dispatch(fetchEvent)
  }

export default createNavigateToEvent

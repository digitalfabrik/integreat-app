// @flow

import type { Dispatch } from 'redux'
import type { FetchEventActionType, StoreActionType } from './StoreActionType'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'
import { generateKey } from './generateRouteKey'
import { EVENTS_ROUTE } from './components/NavigationTypes'
import { cityContentUrl } from '../common/url'

export type NavigateToEventParamsType =
  {| cityCode: string, language: string, path: ?string, key?: string, forceRefresh?: boolean |}

const createNavigateToEvent = <T: RoutesType>(
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>
) => ({ cityCode, language, path, key = generateKey(), forceRefresh = false }: NavigateToEventParamsType) => {
    navigation.navigate({
      name: EVENTS_ROUTE,
      params: {
        shareUrl: cityContentUrl({ cityCode, languageCode: language, route: EVENTS_ROUTE, path })
      },
      key
    })

    const fetchEvent: FetchEventActionType = {
      type: 'FETCH_EVENT',
      params: {
        city: cityCode,
        language,
        path,
        key,
        criterion: { forceUpdate: forceRefresh, shouldRefreshResources: forceRefresh }
      }
    }

    dispatch(fetchEvent)
  }

export default createNavigateToEvent

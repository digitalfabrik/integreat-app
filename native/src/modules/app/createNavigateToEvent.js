// @flow

import type { Dispatch } from 'redux'
import type { FetchEventActionType, StoreActionType } from './StoreActionType'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'
import { generateKey } from './generateRouteKey'
import { EVENTS_ROUTE } from './components/NavigationTypes'
import { cityContentUrl, url } from '../common/url'

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
    const shareUrl = cityContentPath
      ? url(cityContentPath)
      : cityContentUrl({ cityCode, languageCode: language, route: EVENTS_ROUTE })
    navigation.navigate({
      name: EVENTS_ROUTE,
      params: {
        shareUrl
      },
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

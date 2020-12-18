// @flow

import type { Dispatch } from 'redux'
import type { FetchNewsActionType, StoreActionType } from './StoreActionType'
import type { NewsType } from './StateType'
import { generateKey } from './generateRouteKey'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'

export const NEWS_ROUTE_NAME = 'News'

export type NavigateToNewsParamsType = {|
  cityCode: string,
  language: string,
  newsId: ?string,
  key?: string,
  forceRefresh?: boolean,
  type: NewsType
|}

const createNavigateToNews = <T: RoutesType>(
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>
) => ({
    cityCode, type, language, newsId, key = generateKey(), forceRefresh = false
  }: NavigateToNewsParamsType) => {
    navigation.navigate({
      routeName: NEWS_ROUTE_NAME,
      key
    })
    const fetchNews: FetchNewsActionType = {
      type: 'FETCH_NEWS',
      params: {
        city: cityCode,
        language,
        newsId,
        type,
        key,
        criterion: { forceUpdate: forceRefresh, shouldRefreshResources: forceRefresh }
      }
    }

    dispatch(fetchNews)
  }

export default createNavigateToNews

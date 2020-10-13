// @flow

import type { Dispatch } from 'redux'
import type { FetchNewsActionType, StoreActionType } from './StoreActionType'
import type { NewsType } from './StateType'
import type { NavigationScreenProp } from 'react-navigation'
import { generateKey } from './generateRouteKey'

export const NEWS_ROUTE_NAME = 'News'

export type NavigateToNewsParamsType = {|
  cityCode: string,
  language: string,
  newsId: ?string,
  key?: string,
  forceRefresh?: boolean,
  type: NewsType
|}

export default (dispatch: Dispatch<StoreActionType>, navigation: NavigationScreenProp<*>) => ({
  cityCode, type, language, newsId, key = generateKey(), forceRefresh = false
}: NavigateToNewsParamsType) => {
  navigation.navigate({
    routeName: NEWS_ROUTE_NAME,
    params: {
      onRouteClose: () => dispatch({ type: 'CLEAR_NEWS', params: { key, city: cityCode } })
    },
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

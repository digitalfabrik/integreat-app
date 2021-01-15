// @flow

import type { Dispatch } from 'redux'
import type { FetchNewsActionType, StoreActionType } from './StoreActionType'
import type { NewsType } from './StateType'
import { generateKey } from './generateRouteKey'
import type { NavigationPropType, RoutesType } from './constants/NavigationTypes'
import { cityContentUrl } from '../common/url'
import { NEWS_ROUTE } from './constants/NavigationTypes'

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
      name: NEWS_ROUTE,
      params: { shareUrl: cityContentUrl({ cityCode, languageCode: language, route: NEWS_ROUTE, path: type }) },
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

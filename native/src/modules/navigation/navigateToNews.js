// @flow

import type { Dispatch } from 'redux'
import type { FetchNewsActionType, StoreActionType } from '../app/StoreActionType'
import { generateKey } from '../app/generateRouteKey'
import type { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { cityContentUrl } from './url'
import { NEWS_ROUTE } from 'api-client/src/routes'
import type { NewsType } from 'api-client/src/routes'

const navigateToNews = <T: RoutesType>({
  navigation,
  dispatch,
  cityCode,
  languageCode,
  type,
  newsId,
  key = generateKey(),
  forceRefresh = false
}: {|
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>,
  cityCode: string,
  languageCode: string,
  type: NewsType,
  newsId: ?string,
  key?: string,
  forceRefresh?: boolean
|}) => {
  navigation.navigate({
    name: NEWS_ROUTE,
    params: { shareUrl: cityContentUrl({ cityCode, languageCode, route: NEWS_ROUTE, path: type }) },
    key
  })
  const fetchNews: FetchNewsActionType = {
    type: 'FETCH_NEWS',
    params: {
      city: cityCode,
      language: languageCode,
      newsId,
      type,
      key,
      criterion: { forceUpdate: forceRefresh, shouldRefreshResources: forceRefresh }
    }
  }

  dispatch(fetchNews)
}

export default navigateToNews

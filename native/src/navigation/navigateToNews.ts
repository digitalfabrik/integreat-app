import { Dispatch } from 'redux'
import { FetchNewsActionType, StoreActionType } from '../redux/StoreActionType'
import { generateRouteKey } from '../utils/helpers'
import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import { NewsType, NEWS_ROUTE } from 'api-client/src/routes'

const navigateToNews = <T extends RoutesType>({
  navigation,
  dispatch,
  cityCode,
  languageCode,
  type,
  newsId,
  key = generateRouteKey(),
  forceRefresh = false
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationPropType<T>
  cityCode: string
  languageCode: string
  type: NewsType
  newsId: string | null | undefined
  key?: string
  forceRefresh?: boolean
}): void => {
  navigation.navigate({
    name: NEWS_ROUTE,
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
      criterion: {
        forceUpdate: forceRefresh,
        shouldRefreshResources: forceRefresh
      }
    }
  }
  dispatch(fetchNews)
}

export default navigateToNews

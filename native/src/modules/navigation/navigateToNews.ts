import { Dispatch } from 'redux'
import { FetchNewsActionType, StoreActionType } from '../app/StoreActionType'
import { generateKey } from '../app/generateRouteKey'
import { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { NewsType, NEWS_ROUTE } from 'api-client/src/routes'

const navigateToNews = <T extends RoutesType>({
  navigation,
  dispatch,
  cityCode,
  languageCode,
  type,
  newsId,
  key = generateKey(),
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
}) => {
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

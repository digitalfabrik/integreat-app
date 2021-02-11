// @flow

import type { Dispatch } from 'redux'
import type { FetchCategoryActionType, StoreActionType } from '../app/StoreActionType'
import { generateKey } from '../app/generateRouteKey'
import type {
  NavigationPropType,
  RoutesType
} from '../app/constants/NavigationTypes'
import type { CategoriesRouteType, DashboardRouteType } from 'api-client/src/routes'

const navigateToCategory = <T: RoutesType>({
  navigation,
  dispatch,
  routeName,
  cityCode,
  languageCode,
  cityContentPath,
  key = generateKey(),
  forceRefresh = false
}: {|
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>,
  routeName: CategoriesRouteType | DashboardRouteType,
  cityCode: string,
  languageCode: string,
  cityContentPath: string,
  key?: string,
  forceRefresh?: boolean
|}) => {
  navigation.navigate({
    name: routeName,
    params: { cityCode, languageCode },
    key
  })

  const fetchCategory: FetchCategoryActionType = {
    type: 'FETCH_CATEGORY',
    params: {
      city: cityCode,
      language: languageCode,
      path: cityContentPath,
      depth: 2,
      key,
      criterion: { forceUpdate: forceRefresh, shouldRefreshResources: forceRefresh }
    }
  }

  dispatch(fetchCategory)
}

export default navigateToCategory

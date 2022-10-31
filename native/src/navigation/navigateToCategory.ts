import { Dispatch } from 'redux'

import { CategoriesRouteType, DashboardRouteType } from 'api-client/src/routes'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import { FetchCategoryActionType, StoreActionType } from '../redux/StoreActionType'
import { generateRouteKey } from '../utils/helpers'

const navigateToCategory = <T extends RoutesType>({
  navigation,
  dispatch,
  routeName,
  cityCode,
  languageCode,
  cityContentPath,
  key = generateRouteKey(),
  forceRefresh = false,
  resetNavigation = false,
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationProps<T>
  routeName: CategoriesRouteType | DashboardRouteType
  cityCode: string
  languageCode: string
  cityContentPath: string
  key?: string
  forceRefresh?: boolean
  resetNavigation?: boolean
}): void => {
  const route = {
    name: routeName,
    key,
  }

  if (resetNavigation) {
    navigation.reset({
      index: 0,
      routes: [route],
    })
    dispatch({
      type: 'CLEAR_CITY',
    })
  } else {
    navigation.navigate(route)
  }

  const fetchCategory: FetchCategoryActionType = {
    type: 'FETCH_CATEGORY',
    params: {
      city: cityCode,
      language: languageCode,
      path: cityContentPath,
      depth: 2,
      key,
      criterion: {
        forceUpdate: forceRefresh,
        shouldRefreshResources: forceRefresh,
      },
    },
  }
  dispatch(fetchCategory)
}

export default navigateToCategory

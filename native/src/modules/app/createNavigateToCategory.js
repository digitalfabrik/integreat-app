// @flow

import type { Dispatch } from 'redux'
import type { FetchCategoryActionType, StoreActionType } from './StoreActionType'
import { generateKey } from './generateRouteKey'
import type {
  CategoriesRouteType,
  DashboardRouteType,
  NavigationPropType,
  RoutesType
} from './constants/NavigationTypes'
import { url } from '../common/url'

export type NavigateToCategoryParamsType = {|
  cityCode: string,
  language: string,
  cityContentPath: string,
  key?: string,
  forceRefresh?: boolean
|}

const createNavigateToCategory = <T: RoutesType>(
  routeName: CategoriesRouteType | DashboardRouteType,
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>
) => ({
    cityCode,
    language,
    cityContentPath,
    key = generateKey(),
    forceRefresh = false
  }: NavigateToCategoryParamsType) => {
    navigation.navigate({
      name: routeName,
      params: {
        shareUrl: url(cityContentPath),
        cityCode,
        languageCode: language
      },
      key
    })

    const fetchCategory: FetchCategoryActionType = {
      type: 'FETCH_CATEGORY',
      params: {
        city: cityCode,
        language,
        path: cityContentPath,
        depth: 2,
        key,
        criterion: { forceUpdate: forceRefresh, shouldRefreshResources: forceRefresh }
      }
    }

    dispatch(fetchCategory)
  }

export default createNavigateToCategory

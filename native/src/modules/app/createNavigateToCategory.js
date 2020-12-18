// @flow

import type { Dispatch } from 'redux'
import type { FetchCategoryActionType, StoreActionType } from './StoreActionType'
import { generateKey } from './generateRouteKey'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'

export type NavigateToCategoryParamsType = {|
  cityCode: string, language: string, path: string, key?: string, forceRefresh?: boolean
|}

const createNavigateToCategory = <T: RoutesType>(
  routeName: 'Categories' | 'Dashboard',
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>
) => ({ cityCode, language, path, key = generateKey(), forceRefresh = false }: NavigateToCategoryParamsType) => {
    navigation.navigate({
      routeName,
      key
    })

    const fetchCategory: FetchCategoryActionType = {
      type: 'FETCH_CATEGORY',
      params: {
        city: cityCode,
        language,
        path,
        depth: 2,
        key,
        criterion: { forceUpdate: forceRefresh, shouldRefreshResources: forceRefresh }
      }
    }

    dispatch(fetchCategory)
  }

export default createNavigateToCategory

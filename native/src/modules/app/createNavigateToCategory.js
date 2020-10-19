// @flow

import type { Dispatch } from 'redux'
import type { FetchCategoryActionType, StoreActionType } from './StoreActionType'
import type { NavigationStackProp } from 'react-navigation-stack'
import { generateKey } from './generateRouteKey'

export type NavigateToCategoryParamsType = {|
  cityCode: string, language: string, path: string, key?: string, forceRefresh?: boolean
|}

export default (
  routeName: 'Categories' | 'Dashboard',
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationStackProp<*>
) => ({ cityCode, language, path, key = generateKey(), forceRefresh = false }: NavigateToCategoryParamsType) => {
  navigation.navigate({
    routeName,
    params: {
      onRouteClose: () => dispatch({ type: 'CLEAR_CATEGORY', params: { key } }),
      sharePath: path
    },
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

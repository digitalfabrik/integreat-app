// @flow

import type { Dispatch } from 'redux'
import type { FetchCategoryActionType, StoreActionType } from './StoreActionType'
import type { NavigationScreenProp } from 'react-navigation'
import { generateKey } from './generateRouteKey'

export type NavigateToCategoryParamsType = {|
  cityCode: string, language: string, path: string, key?: string, forceUpdate?: boolean
|}

export default (
  routeName: 'Categories' | 'Dashboard',
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationScreenProp<*>
) => ({cityCode, language, path, key = generateKey(), forceUpdate = false}: NavigateToCategoryParamsType) => {
  navigation.navigate({
    routeName,
    params: {
      cityCode,
      key,
      onRouteClose: () => dispatch({type: 'CLEAR_CATEGORY', params: {key}}),
      sharePath: path
    },
    key
  })

  const fetchCategory: FetchCategoryActionType = {
    type: 'FETCH_CATEGORY',
    params: {city: cityCode, language, path, depth: 2, forceUpdate, key, shouldRefreshResources: false}
  }

  dispatch(fetchCategory)
}

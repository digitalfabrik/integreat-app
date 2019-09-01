// @flow

import type { Dispatch } from 'redux'
import type { FetchCategoryActionType, StoreActionType } from './StoreActionType'
import { type NavigationAction, NavigationActions, StackActions } from 'react-navigation'
import { generateKey } from './generateRouteKey'

export type NavigateToCityContentParamsType = {|
  cityCode: string, language: string, shouldRefreshResources?: boolean
|}

export default (
  dispatch: Dispatch<StoreActionType>
) => ({ cityCode, language, shouldRefreshResources = false }: NavigateToCityContentParamsType): NavigationAction => {
  const key = generateKey()
  const path = `/${cityCode}/${language}`

  const navigateToDashboard = StackActions.replace({
    routeName: 'Dashboard',
    params: {
      sharePath: path,
      onRouteClose: () => dispatch({ type: 'CLEAR_CATEGORY', params: { key } })
    },
    newKey: key
  })
  const navigateToCityContent = NavigationActions.navigate({
    routeName: 'CityContent',
    // $FlowFixMe For some reason action is not allowed to be a StackAction
    action: navigateToDashboard
  })

  const fetchCategory: FetchCategoryActionType = {
    type: 'FETCH_CATEGORY',
    params: {
      city: cityCode,
      language,
      path,
      depth: 2,
      key,
      criterion: { forceUpdate: false, shouldRefreshResources }
    }
  }

  dispatch(fetchCategory)
  return navigateToCityContent
}

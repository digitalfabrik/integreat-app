import { useEffect } from 'react'
import { Dispatch } from 'redux'

import { RouteProps, RoutesType } from '../constants/NavigationTypes'
import { StoreActionType } from '../redux/StoreActionType'

const useClearRouteOnClose = (
  route: RouteProps<RoutesType>,
  dispatch: Dispatch<StoreActionType>,
  clearRouteOnClose: boolean
): void => {
  useEffect(
    () => () => {
      if (clearRouteOnClose) {
        dispatch({
          type: 'CLEAR_ROUTE',
          params: {
            key: route.key,
          },
        })
      }
    },
    [route.key, dispatch, clearRouteOnClose]
  )
}

export default useClearRouteOnClose

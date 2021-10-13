import { useEffect } from 'react'
import { Dispatch } from 'redux'

import { RoutePropType, RoutesType } from '../constants/NavigationTypes'
import { StoreActionType } from '../redux/StoreActionType'

const useClearRouteOnClose = (route: RoutePropType<RoutesType>, dispatch: Dispatch<StoreActionType>): void => {
  useEffect(
    () => () => {
      dispatch({
        type: 'CLEAR_ROUTE',
        params: {
          key: route.key
        }
      })
    },
    [route.key, dispatch]
  )
}

export default useClearRouteOnClose

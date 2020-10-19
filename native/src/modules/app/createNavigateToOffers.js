// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from './StoreActionType'
import type { NavigationStackProp } from 'react-navigation-stack'

export default (dispatch: Dispatch<StoreActionType>, navigation: NavigationStackProp<*>) =>
  ({ cityCode, language }: {| cityCode: string, language: string |}) => {
    navigation.navigate({
      routeName: 'Offers',
      params: {
        cityCode,
        sharePath: `/${cityCode}/${language}/offers`
      }
    })
  }

// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from './StoreActionType'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'

export default (dispatch: Dispatch<StoreActionType>, navigation: NavigationPropType<RoutesType>) =>
  ({ cityCode, language }: {| cityCode: string, language: string |}) => {
    navigation.navigate({
      name: 'Offers',
      params: {
        cityCode,
        sharePath: `/${cityCode}/${language}/offers`
      }
    })
  }

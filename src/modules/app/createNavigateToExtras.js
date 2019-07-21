// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from './StoreActionType'
import type { NavigationScreenProp } from 'react-navigation'

export default (dispatch: Dispatch<StoreActionType>, navigation: NavigationScreenProp<*>) =>
  ({ cityCode, language }: {| cityCode: string, language: string |}) => {
    navigation.navigate('Extras', {
      cityCode,
      sharePath: `/${cityCode}/${language}/extras`
    })
  }

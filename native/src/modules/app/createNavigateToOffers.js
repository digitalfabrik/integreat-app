// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from './StoreActionType'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'
import { OFFERS_ROUTE } from './components/NavigationTypes'

const createNavigateToOffer = <T: RoutesType>(dispatch: Dispatch<StoreActionType>, navigation: NavigationPropType<T>) =>
  ({ cityCode, language }: {| cityCode: string, language: string |}) => {
    navigation.navigate({
      name: OFFERS_ROUTE,
      params: {
        cityCode,
        sharePath: `/${cityCode}/${language}/offers`
      }
    })
  }

export default createNavigateToOffer

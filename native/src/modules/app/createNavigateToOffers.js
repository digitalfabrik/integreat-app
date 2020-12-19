// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from './StoreActionType'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'
import { OFFERS_ROUTE } from './components/NavigationTypes'
import { cityContentUrl } from '../common/url'

const createNavigateToOffer = <T: RoutesType>(dispatch: Dispatch<StoreActionType>, navigation: NavigationPropType<T>) =>
  ({ cityCode, language }: {| cityCode: string, language: string |}) => {
    navigation.navigate({
      name: OFFERS_ROUTE,
      params: {
        cityCode,
        shareUrl: cityContentUrl({ cityCode, languageCode: language, route: OFFERS_ROUTE })
      }
    })
  }

export default createNavigateToOffer

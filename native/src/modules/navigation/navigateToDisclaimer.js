// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from '../app/StoreActionType'
import type { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { DISCLAIMER_ROUTE } from 'api-client/src/routes'
import { cityContentUrl } from './url'

const navigateToDisclaimer = <T: RoutesType>({ dispatch, navigation, cityCode, languageCode }: {|
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>,
  cityCode: string,
  languageCode: string
|}) => {
  navigation.navigate({
    name: DISCLAIMER_ROUTE,
    params: {
      cityCode,
      languageCode,
      shareUrl: cityContentUrl({ cityCode, languageCode, route: DISCLAIMER_ROUTE })
    }
  })
}

export default navigateToDisclaimer

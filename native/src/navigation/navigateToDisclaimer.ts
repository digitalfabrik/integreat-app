import { Dispatch } from 'redux'

import { DISCLAIMER_ROUTE } from 'api-client/src/routes'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import { StoreActionType } from '../redux/StoreActionType'

const navigateToDisclaimer = <T extends RoutesType>({
  navigation,
  cityCode,
  languageCode,
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationProps<T>
  cityCode: string
  languageCode: string
}): void => {
  navigation.navigate({
    name: DISCLAIMER_ROUTE,
    params: {
      cityCode,
      languageCode,
    },
  })
}

export default navigateToDisclaimer

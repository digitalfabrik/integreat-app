import { OFFERS_ROUTE } from 'api-client/src/routes'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'

const navigateToOffers = <T extends RoutesType>({
  navigation,
  cityCode,
  languageCode,
}: {
  navigation: NavigationProps<T>
  cityCode: string
  languageCode: string
}): void => {
  navigation.navigate({
    name: OFFERS_ROUTE,
    params: {
      cityCode,
      languageCode,
    },
  })
}

export default navigateToOffers

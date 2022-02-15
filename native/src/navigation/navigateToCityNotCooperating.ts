import { CITY_NOT_COOPERATING_ROUTE } from 'api-client'

import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'

const navigateToCityNotCooperating = <T extends RoutesType>({
  navigation
}: {
  navigation: NavigationPropType<T>
}): void => {
  navigation.navigate(CITY_NOT_COOPERATING_ROUTE)
}

export default navigateToCityNotCooperating

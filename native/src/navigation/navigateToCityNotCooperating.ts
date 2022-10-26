import { CITY_NOT_COOPERATING_ROUTE } from 'api-client'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'

const navigateToCityNotCooperating = <T extends RoutesType>({
  navigation,
}: {
  navigation: NavigationProps<T>
}): void => {
  navigation.navigate(CITY_NOT_COOPERATING_ROUTE)
}

export default navigateToCityNotCooperating

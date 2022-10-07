import React, { ReactElement } from 'react'

import { ErrorRouteType } from 'api-client'

import Failure from '../components/Failure'
import {
  /* NavigationPropType, */
  RoutePropType,
} from '../constants/NavigationTypes'

type PropsType = {
  route: RoutePropType<ErrorRouteType>
  navigation: NavigationPropType<ErrorRouteType>
}

const ErrorRoute = ({ route, navigation }: PropsType): ReactElement => (
  <Failure code={route.params.code} goBack={navigation.goBack} />
)

export default ErrorRoute

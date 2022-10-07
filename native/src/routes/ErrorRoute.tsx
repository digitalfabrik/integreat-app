import React, { ReactElement } from 'react'

import { ErrorRouteType } from 'api-client'
import { /* NavigationPropType, */ RoutePropType } from '../constants/NavigationTypes'
import Failure from '../components/Failure'

type PropsType = {
  route: RoutePropType<ErrorRouteType>
  navigation: NavigationPropType<ErrorRouteType>
}


const ErrorRoute = ({ route, navigation }: PropsType): ReactElement => (
    <Failure code={route.params.code} goBack={navigation.goBack}/>
  )

export default ErrorRoute

// @flow

import React from 'react'
import { Text } from 'react-native'
import type { NavigationPropType, RoutePropType } from '../../modules/app/constants/NavigationTypes'
import type { JpalEvaluationRouteType } from 'api-client'

type PropsType = {|
  route: RoutePropType<JpalEvaluationRouteType>,
  navigation: NavigationPropType<JpalEvaluationRouteType>
|}

// TODO IGAPP-526 Implement jpal evaluation screen
const JpalEvaluationContainer = ({ route }: PropsType) => {
  return <Text>JpalEvaluationContainer {route.params.trackingCode}</Text>
}

export default JpalEvaluationContainer

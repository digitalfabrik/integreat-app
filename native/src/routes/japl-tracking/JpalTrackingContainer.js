// @flow

import React from 'react'
import { Text } from 'react-native'
import type { NavigationPropType, RoutePropType } from '../../modules/app/constants/NavigationTypes'
import type { JpalTrackingRouteType } from 'api-client'

type PropsType = {|
  route: RoutePropType<JpalTrackingRouteType>,
  navigation: NavigationPropType<JpalTrackingRouteType>
|}

// TODO IGAPP-526 Implement jpal tracking screen
const JpalTrackingContainer = ({ route }: PropsType) => {
  return <Text>JpalTrackingContainer {route.params.trackingCode}</Text>
}

export default JpalTrackingContainer

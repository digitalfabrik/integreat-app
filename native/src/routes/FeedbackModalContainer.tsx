import React, { ReactElement } from 'react'

import { FeedbackModalRouteType } from 'api-client'

import FeedbackContainer from '../components/FeedbackContainer'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'

type FeedbackModalContainerProps = {
  route: RouteProps<FeedbackModalRouteType>
  navigation: NavigationProps<FeedbackModalRouteType>
}

const FeedbackModalContainer = ({ route }: FeedbackModalContainerProps): ReactElement => (
  <FeedbackContainer {...route.params} />
)

export default FeedbackModalContainer

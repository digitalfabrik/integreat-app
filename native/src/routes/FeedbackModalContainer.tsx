import React, { ReactElement, useContext } from 'react'
import { ThemeContext } from 'styled-components'

import { FeedbackModalRouteType } from 'api-client'

import FeedbackContainer from '../components/FeedbackContainer'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'

type FeedbackModalContainerProps = {
  route: RoutePropType<FeedbackModalRouteType>
  navigation: NavigationPropType<FeedbackModalRouteType>
}

const FeedbackModalContainer = ({ route }: FeedbackModalContainerProps): ReactElement => {
  const theme = useContext(ThemeContext)
  return <FeedbackContainer isSearchFeedback={false} theme={theme} {...route.params} />
}

export default FeedbackModalContainer

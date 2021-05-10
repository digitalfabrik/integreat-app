import React, { useContext } from 'react'
import type { FeedbackModalRouteType } from 'api-client'
import type { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import FeedbackContainer from '../../../modules/feedback/FeedbackContainer'
import { ThemeContext } from 'styled-components'
type PropsType = {
  route: RoutePropType<FeedbackModalRouteType>
  navigation: NavigationPropType<FeedbackModalRouteType>
}

const FeedbackModalContainer = ({ route }: PropsType) => {
  const theme = useContext(ThemeContext)
  return <FeedbackContainer isSearchFeedback={false} theme={theme} {...route.params} />
}

export default FeedbackModalContainer

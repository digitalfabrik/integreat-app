import React, { useContext } from 'react'
import { FeedbackModalRouteType } from 'api-client'
import { NavigationPropType, RoutePropType } from '../../../constants/NavigationTypes'
import FeedbackContainer from '../../../components/FeedbackContainer'
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

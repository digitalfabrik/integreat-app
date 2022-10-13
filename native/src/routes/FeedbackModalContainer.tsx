import React, { ReactElement, useContext } from 'react'
import { ThemeContext } from 'styled-components'

import { FeedbackModalRouteType } from 'api-client'

import FeedbackContainer from '../components/FeedbackContainer'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'

type FeedbackModalContainerProps = {
  route: RouteProps<FeedbackModalRouteType>
  navigation: NavigationProps<FeedbackModalRouteType>
}

const FeedbackModalContainer = ({ route }: FeedbackModalContainerProps): ReactElement => {
  const theme = useContext(ThemeContext)
  return <FeedbackContainer isSearchFeedback={false} theme={theme} {...route.params} />
}

export default FeedbackModalContainer

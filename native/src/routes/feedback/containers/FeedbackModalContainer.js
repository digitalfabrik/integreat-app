// @flow

import React, { useContext } from 'react'
import type { FeedbackModalRouteType } from 'api-client'
import type { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import FeedbackContainer from '../../../modules/feedback/FeedbackContainer'
import { ThemeContext } from 'styled-components'

type PropsType = {|
  route: RoutePropType<FeedbackModalRouteType>,
  navigation: NavigationPropType<FeedbackModalRouteType>
|}

const FeedbackModalContainer = (props: PropsType) => {
  const { routeType, language, cityCode, isPositiveFeedback } = props.route.params
  const theme = useContext(ThemeContext)

  return (
    <FeedbackContainer
      routeType={routeType}
      isPositiveFeedback={isPositiveFeedback}
      isSearchFeedback={false}
      language={language}
      cityCode={cityCode}
      theme={theme}
    />
  )
}

export default FeedbackModalContainer

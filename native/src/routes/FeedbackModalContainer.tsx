import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { FeedbackModalRouteType } from 'shared'

import FeedbackContainer from '../components/FeedbackContainer'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useSetRouteTitle from '../hooks/useSetRouteTitle'

type FeedbackModalContainerProps = {
  route: RouteProps<FeedbackModalRouteType>
  navigation: NavigationProps<FeedbackModalRouteType>
}

const FeedbackModalContainer = ({ route }: FeedbackModalContainerProps): ReactElement => {
  const { t } = useTranslation()
  useSetRouteTitle(t($ => $.feedback.title))

  return <FeedbackContainer {...route.params} />
}

export default FeedbackModalContainer

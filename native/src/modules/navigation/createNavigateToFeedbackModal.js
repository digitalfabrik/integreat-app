// @flow

import type { FeedbackInformationType } from '../../routes/feedback/containers/FeedbackModalContainer'
import { FEEDBACK_MODAL_ROUTE } from 'api-client/src/routes'
import type { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'

const createNavigateToFeedbackModal = <T: RoutesType>(navigation: NavigationPropType<T>) =>
  (feedbackInformation: FeedbackInformationType) => {
    navigation.navigate({
      name: FEEDBACK_MODAL_ROUTE,
      params: feedbackInformation
    })
  }

export default createNavigateToFeedbackModal

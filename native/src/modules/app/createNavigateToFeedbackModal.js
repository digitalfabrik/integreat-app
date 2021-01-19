// @flow

import type { FeedbackInformationType } from '../../routes/feedback/containers/FeedbackModalContainer'
import type { NavigationPropType, RoutesType } from './constants/NavigationTypes'
import { FEEDBACK_MODAL_ROUTE } from './constants/NavigationTypes'

const createNavigateToFeedbackModal = <T: RoutesType>(navigation: NavigationPropType<T>) =>
  (feedbackInformation: FeedbackInformationType) => {
    navigation.navigate({
      name: FEEDBACK_MODAL_ROUTE,
      params: feedbackInformation
    })
  }

export default createNavigateToFeedbackModal

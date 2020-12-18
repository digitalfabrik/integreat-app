// @flow

import type { FeedbackInformationType } from '../../routes/feedback/containers/FeedbackModalContainer'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'
import { FEEDBACK_MODAL_ROUTE } from './components/NavigationTypes'

const createNavigateToFeedbackModal = <T: RoutesType>(navigation: NavigationPropType<T>) =>
  (feedbackInformation: FeedbackInformationType) => {
    navigation.navigate({
      name: FEEDBACK_MODAL_ROUTE,
      params: feedbackInformation
    })
  }

export default createNavigateToFeedbackModal

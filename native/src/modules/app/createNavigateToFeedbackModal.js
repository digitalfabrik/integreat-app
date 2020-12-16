// @flow

import type { FeedbackInformationType } from '../../routes/feedback/containers/FeedbackModalContainer'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'

const createNavigateToFeedbackModal = <T: RoutesType>(navigation: NavigationPropType<T>) =>
  (feedbackInformation: FeedbackInformationType) => {
    navigation.navigate({
      name: 'FeedbackModal',
      params: { ...feedbackInformation }
    })
  }

export default createNavigateToFeedbackModal

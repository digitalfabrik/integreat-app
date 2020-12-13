// @flow

import type { FeedbackInformationType } from '../../routes/feedback/containers/FeedbackModalContainer'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'

export default (navigation: NavigationPropType<RoutesType>) =>
  (feedbackInformation: FeedbackInformationType) => {
    navigation.navigate({
      name: 'FeedbackModal',
      params: { ...feedbackInformation }
    })
  }

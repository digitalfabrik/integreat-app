// @flow

import type { NavigationScreenProp } from 'react-navigation'
import type { FeedbackInformationType } from '../../routes/feedback/containers/FeedbackModalContainer'

export default (navigation: NavigationScreenProp<*>) =>
  (feedbackInformation: FeedbackInformationType) => {
    navigation.navigate({
      routeName: 'FeedbackModal',
      params: { ...feedbackInformation }
    })
  }

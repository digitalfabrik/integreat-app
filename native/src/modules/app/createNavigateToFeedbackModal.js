// @flow

import type { NavigationScreenProp } from 'react-navigation'
import type { Dispatch } from 'redux'
import type { FeedbackInformationType } from '../../routes/feedback/containers/FeedbackModalContainer'
import type { StoreActionType } from './StoreActionType'

export default (navigation: NavigationScreenProp<*>) =>
  (feedbackInformation: FeedbackInformationType) => {
    navigation.navigate({
      routeName: 'FeedbackModal',
      params: { ...feedbackInformation }
    })
  }

import { OPEN_PAGE_SIGNAL_NAME } from 'api-client'
import { FEEDBACK_MODAL_ROUTE } from 'api-client/src/routes'

import { FeedbackInformationType } from '../components/FeedbackContainer'
import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import sendTrackingSignal from '../utils/sendTrackingSignal'

const createNavigateToFeedbackModal =
  <T extends RoutesType>(navigation: NavigationProps<T>) =>
  (feedbackInformation: FeedbackInformationType): void => {
    sendTrackingSignal({
      signal: {
        name: OPEN_PAGE_SIGNAL_NAME,
        pageType: FEEDBACK_MODAL_ROUTE,
        url: '',
      },
    })
    navigation.navigate({
      name: FEEDBACK_MODAL_ROUTE,
      params: feedbackInformation,
    })
  }

export default createNavigateToFeedbackModal

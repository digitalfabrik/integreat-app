import { FeedbackRouteType, OPEN_PAGE_SIGNAL_NAME } from 'api-client'
import { FEEDBACK_MODAL_ROUTE } from 'api-client/src/routes'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import sendTrackingSignal from '../utils/sendTrackingSignal'

type CreateNavigateToFeedbackModelProps = {
  routeType: FeedbackRouteType
  language: string
  cityCode: string
  slug?: string
}

const createNavigateToFeedbackModal =
  <T extends RoutesType>(navigation: NavigationProps<T>) =>
  (feedbackInformation: CreateNavigateToFeedbackModelProps): void => {
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

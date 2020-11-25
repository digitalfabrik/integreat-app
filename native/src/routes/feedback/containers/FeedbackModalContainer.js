// @flow

import * as React from 'react'
import type { NavigationStackProp } from 'react-navigation-stack'
import { withTranslation } from 'react-i18next'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FeedbackModal from '../components/FeedbackModal'
import FeedbackVariant from '../FeedbackVariant'
import { createFeedbackEndpoint } from 'api-client'
import type { FeedbackParamsType } from 'api-client'
import determineApiUrl from '../../../modules/endpoint/determineApiUrl'

const TranslatedFeedbackModal = withTranslation('feedback')(withTheme(FeedbackModal))

class FeedbackModalContainer extends React.Component<{| navigation: NavigationStackProp<*> |}> {
  closeModal = () => this.props.navigation.goBack()

  sendFeedback = async (feedbackData: FeedbackParamsType) => {
    const apiUrl = await determineApiUrl()
    const feedbackEndpoint = createFeedbackEndpoint(apiUrl)
    await feedbackEndpoint.request(feedbackData)
  }

  render () {
    const { navigation } = this.props
    const feedbackItems: Array<FeedbackVariant> = navigation.getParam('feedbackItems')
    const isPositiveFeedback: boolean = navigation.getParam('isPositiveFeedback')
    return <TranslatedFeedbackModal closeModal={this.closeModal} feedbackItems={feedbackItems}
                                    isPositiveFeedback={isPositiveFeedback} sendFeedback={this.sendFeedback} />
  }
}

export default FeedbackModalContainer

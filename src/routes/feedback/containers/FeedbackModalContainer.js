// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import { translate } from 'react-i18next'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FeedbackModal from '../components/FeedbackModal'
import FeedbackVariant from '../FeedbackVariant'
import { createFeedbackEndpoint } from '@integreat-app/integreat-api-client'
import { baseUrl } from '../../../modules/endpoint/constants'
import type { FeedbackParamsType } from '@integreat-app/integreat-api-client/index'
import AppSettings from '../../../modules/settings/AppSettings'

const TranslatedFeedbackModal = translate('feedback')(withTheme()(FeedbackModal))

class FeedbackModalContainer extends React.Component<{| navigation: NavigationScreenProp<*> |}> {
  closeModal = () => this.props.navigation.goBack()

  sendFeedback = async (feedbackData: FeedbackParamsType) => {
    const appSettings = new AppSettings()
    const apiUrlOverride = await appSettings.loadApiUrlOverride()
    const feedbackEndpoint = createFeedbackEndpoint(apiUrlOverride || baseUrl)
    feedbackEndpoint.request(feedbackData)
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

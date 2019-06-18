// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import { translate } from 'react-i18next'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FeedbackModal from '../components/FeedbackModal'
import FeedbackVariant from '../FeedbackVariant'

const TranslatedFeedbackModal = translate('feedback')(withTheme()(FeedbackModal))

class FeedbackModalContainer extends React.Component<{| navigation: NavigationScreenProp<*> |}> {
  closeModal = () => this.props.navigation.goBack()

  render () {
    const {navigation} = this.props
    const feedbackItems: Array<FeedbackVariant> = navigation.getParam('feedbackItems')
    const isPositiveFeedback: boolean = navigation.getParam('isPositiveFeedback')
    return <TranslatedFeedbackModal closeModal={this.closeModal} feedbackItems={feedbackItems}
                                    isPositiveFeedback={isPositiveFeedback} />
  }
}

export default FeedbackModalContainer

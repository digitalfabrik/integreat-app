// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import { type TFunction, translate } from 'react-i18next'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FeedbackModal from '../components/FeedbackModal'
import FeedbackDropdownItem from '../FeedbackDropdownItem'

const TranslatedFeedbackModal = translate('feedback')(withTheme()(FeedbackModal))

class FeedbackModalContainer extends React.Component<{| navigation: NavigationScreenProp<*>, t: TFunction |}> {
  closeModal = () => this.props.navigation.goBack()

  render () {
    const {t, navigation} = this.props
    const feedbackItems: Array<FeedbackDropdownItem> = navigation.getParam('feedbackItems')
    const isPositiveFeedback: boolean = navigation.getParam('isPositiveFeedback')
    return <TranslatedFeedbackModal t={t} closeModal={this.closeModal} feedbackItems={feedbackItems}
                                    isPositiveFeedback={isPositiveFeedback} />
  }
}

export default translate('feedback')(FeedbackModalContainer)

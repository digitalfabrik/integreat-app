// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import { translate } from 'react-i18next'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FeedbackModal from '../components/FeedbackModal'
import FeedbackDropDownItem from '../FeedbackDropDownItem'

const TranslatedFeedbackModal = translate('feedback')(withTheme()(FeedbackModal))

class FeedbackModalContainer extends React.Component<{| navigation: NavigationScreenProp<*> |}> {
  closeModal = () => this.props.navigation.goBack()

  render () {
    const feedbackItems = [
      new FeedbackDropDownItem('Tmp1', 'ft:Tmp1'),
      new FeedbackDropDownItem('Tmp2', 'ft:Tmp2'),
      new FeedbackDropDownItem('Tmp3', 'ft:Tmp3'),
      new FeedbackDropDownItem('Tmp4', 'ft:Tmp4')
    ]
    return <TranslatedFeedbackModal
      closeModal={this.closeModal}
      feedbackItems={feedbackItems}
    />
  }
}

export default FeedbackModalContainer

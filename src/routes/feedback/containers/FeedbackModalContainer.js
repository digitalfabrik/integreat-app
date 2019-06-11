// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'
import { translate } from 'react-i18next'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FeedbackModal from '../components/FeedbackModal'
import FeedbackDropdownItem from '../FeedbackDropdownItem'

const TranslatedFeedbackModal = translate('feedback')(withTheme()(FeedbackModal))

class FeedbackModalContainer extends React.Component<{| navigation: NavigationScreenProp<*>, t: TFunction |}> {
  closeModal = () => this.props.navigation.goBack()

  render () {
    const {t} = this.props
    const feedbackItems = [
      new FeedbackDropdownItem('Tmp1', 'ft:Tmp1'),
      new FeedbackDropdownItem('Tmp2', 'ft:Tmp2'),
      new FeedbackDropdownItem('Tmp3', 'ft:Tmp3'),
      new FeedbackDropdownItem('Tmp4', 'ft:Tmp4')
    ]
    return <TranslatedFeedbackModal
      closeModal={this.closeModal}
      feedbackItems={feedbackItems}
    />
  }
}

export default FeedbackModalContainer

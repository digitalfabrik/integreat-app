// @flow

import React from 'react'
import { Description, StyledFeedbackBox } from './FeedbackBox'
import ModalHeader from './ModalHeader'
import type { TFunction } from 'react-i18next'
import { withNamespaces } from 'react-i18next'

type PropsType = {|
  closeFeedbackModal: () => void,
  t: TFunction
|}

export class FeedbackThanksMessage extends React.Component<PropsType> {
  render () {
    const {closeFeedbackModal, t} = this.props
    return (
      <StyledFeedbackBox>
        <ModalHeader closeFeedbackModal={closeFeedbackModal} title={t('feedbackSent')} />
        <Description>{t('thanksMessage')}</Description>
      </StyledFeedbackBox>
    )
  }
}

export default withNamespaces('feedback')(FeedbackThanksMessage)

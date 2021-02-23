// @flow

import React from 'react'
import { Description, StyledFeedbackBox } from './FeedbackBox'
import ModalHeader from './ModalHeader'
import { withTranslation, TFunction } from 'react-i18next'
import buildConfig from '../../app/constants/buildConfig'

type PropsType = {|
  closeFeedbackModal: () => void,
  t: typeof TFunction
|}

export class FeedbackThanksMessage extends React.PureComponent<PropsType> {
  render () {
    const { closeFeedbackModal, t } = this.props
    return (
      <StyledFeedbackBox>
        <ModalHeader t={t} closeFeedbackModal={closeFeedbackModal} title={t('feedbackSent')} />
        <Description>{t('thanksMessage', { appName: buildConfig().appName })}</Description>
      </StyledFeedbackBox>
    )
  }
}

export default withTranslation('feedback')(FeedbackThanksMessage)

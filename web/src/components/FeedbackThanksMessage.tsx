import React, { ReactNode } from 'react'
import { Description, StyledFeedback } from './Feedback'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import buildConfig from '../constants/buildConfig'

type PropsType = {
  closeModal?: () => void
  t: TFunction
}

export class FeedbackThanksMessage extends React.PureComponent<PropsType> {
  render(): ReactNode {
    const { closeModal, t } = this.props
    return (
      <StyledFeedback>
        {/*        <ModalHeader t={t} closeModal={closeModal} title={t('feedbackSent')} />*/}
        <Description>
          {t('thanksMessage', {
            appName: buildConfig().appName
          })}

        </Description>
      </StyledFeedback>
    )
  }
}

export default withTranslation('feedback')(FeedbackThanksMessage)

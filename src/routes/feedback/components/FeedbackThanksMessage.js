// @flow

import React from 'react'
import { Description, StyledFeedbackBox } from './FeedbackBox'
import ModalHeader from './ModalHeader'
import type { LocationState } from 'redux-first-router'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'

type PropsType = {
  location: LocationState,
  t: TFunction
}

export class FeedbackThanksMessage extends React.Component<PropsType> {
  render () {
    const {location, t} = this.props
    return (
      <StyledFeedbackBox>
        <ModalHeader location={location} title={t('feedbackSent')} />
        <Description>{t('thanksMessage')}</Description>
      </StyledFeedbackBox>
    )
  }
}

export default translate('feedback')(FeedbackThanksMessage)

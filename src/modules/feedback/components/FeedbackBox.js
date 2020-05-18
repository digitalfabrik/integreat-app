// @flow

import * as React from 'react'

import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import styled from 'styled-components'
import ModalHeader from './ModalHeader'
import FeedbackComment from './FeedbackComment'
import FeedbackVariant from '../FeedbackVariant'
import TextButton from '../../common/components/TextButton'
import type { ThemeType } from '../../theme/constants/theme'
import Dropdown from '../../common/components/Dropdown'

export const StyledFeedbackBox = styled.div`
  display: flex;
  width: 400px;
  height: auto;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  border-radius: 10px;
  border-color: #585858;
  font-size: ${props => props.theme.fonts.contentFontSize};
`

export const Description = styled.div`
  padding: 10px 0 5px;
`
type SendingStatusType = 'IDLE' | 'SUCCESS' | 'ERROR'

type PropsType = {|
  isPositiveRatingSelected: boolean,
  feedbackOptions: Array<FeedbackVariant>,
  selectedFeedbackOption: FeedbackVariant,
  comment: string,
  onCommentChanged: SyntheticInputEvent<HTMLTextAreaElement> => void,
  onFeedbackOptionChanged: FeedbackVariant => void,
  feedbackSent: SendingStatusType,
  onSubmit: (feedbackSent?: SendingStatusType) => void,
  t: TFunction,
  closeFeedbackModal: () => void,
  theme: ThemeType
|}

/**
 * Renders all necessary inputs for a Feedback and posts the data to the feedback endpoint
 */
export class FeedbackBox extends React.PureComponent<PropsType> {
  handleClick = () => {
    const { feedbackSent, onSubmit } = this.props
    feedbackSent !== 'ERROR' ? onSubmit('SUCCESS') : onSubmit('ERROR')
  }

  render () {
    const {
      selectedFeedbackOption,
      feedbackOptions,
      t,
      isPositiveRatingSelected,
      onFeedbackOptionChanged,
      onCommentChanged,
      comment,
      closeFeedbackModal,
      theme,
      feedbackSent
    } = this.props

    let errorMessage
    if (['ERROR'].includes(feedbackSent)) {
      errorMessage = <Description>{t('failedSendingFeedback')}</Description>
    }

    return (
      <StyledFeedbackBox>
        <ModalHeader t={t} closeFeedbackModal={closeFeedbackModal} title={t('feedback')} />
        <Description>{t('feedbackType')}</Description>
        <Dropdown items={feedbackOptions}
                  selectedItem={selectedFeedbackOption}
                  onOptionChanged={onFeedbackOptionChanged}
                  theme={theme} />
        <FeedbackComment
          comment={comment}
          commentMessage={isPositiveRatingSelected ? t('positiveComment') : t('negativeComment')}
          onCommentChanged={onCommentChanged}
          required={!isPositiveRatingSelected} />
        {errorMessage}
        <TextButton
          disabled={!isPositiveRatingSelected && !comment}
          onClick={this.handleClick}
          text={t('send')} />
      </StyledFeedbackBox>
    )
  }
}

export default withTranslation('feedback')(FeedbackBox)

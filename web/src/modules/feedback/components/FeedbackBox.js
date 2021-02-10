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
import type { SendingStatusType } from './FeedbackModal'

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

const TextInput = styled.input.attrs({ type: 'text' })`
  resize: none;
`

export const Description = styled.div`
  padding: 10px 0 5px;
`

type PropsType = {|
  isPositiveRatingSelected: boolean,
  feedbackOptions: Array<FeedbackVariant>,
  selectedFeedbackOption: FeedbackVariant,
  comment: string,
  onCommentChanged: SyntheticInputEvent<HTMLTextAreaElement> => void,
  onFeedbackOptionChanged: FeedbackVariant => void,
  onMailChanged: SyntheticInputEvent<HTMLInputElement> => void,
  onSubmit: () => void,
  t: TFunction,
  closeFeedbackModal: () => void,
  theme: ThemeType,
  sendingStatus: SendingStatusType
|}

/**
 * Renders all necessary inputs for a Feedback and posts the data to the feedback endpoint
 */
export class FeedbackBox extends React.PureComponent<PropsType> {
  render () {
    const {
      selectedFeedbackOption,
      feedbackOptions,
      t,
      isPositiveRatingSelected,
      onFeedbackOptionChanged,
      onCommentChanged,
      onContactMailChanged,
      onSubmit,
      comment,
      closeFeedbackModal,
      theme,
      sendingStatus
    } = this.props

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
        <Description>{t('contactMailAdress')}</Description>
        <TextInput 
          onChange={onContactMailChanged}
        />
        {sendingStatus === 'ERROR' && <Description>{t('failedSendingFeedback')}</Description>}
        <TextButton
          disabled={!isPositiveRatingSelected && !comment}
          onClick={onSubmit}
          text={t('send')} />
      </StyledFeedbackBox>
    )
  }
}

export default withTranslation('feedback')(FeedbackBox)

// @flow

import * as React from 'react'
import { type TFunction, withTranslation } from 'react-i18next'
import styled, { type StyledComponent } from 'styled-components'
import ModalHeader from './ModalHeader'
import FeedbackComment from './FeedbackComment'
import TextButton from '../../common/components/TextButton'
import type { ThemeType } from 'build-configs/ThemeType'
import type { SendingStatusType } from './FeedbackModal'

export const StyledFeedbackBox: StyledComponent<{||}, ThemeType, *> = styled.div`
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

const TextInput: StyledComponent<{||}, ThemeType, *> = styled.input.attrs({ type: 'text' })`
  resize: none;
`

export const Description: StyledComponent<{||}, ThemeType, *> = styled.div`
  padding: 10px 0 5px;
`

type PropsType = {|
  isPositiveRatingSelected: boolean,
  comment: string,
  contactMail: string,
  onCommentChanged: (SyntheticInputEvent<HTMLTextAreaElement>) => void,
  onContactMailChanged: (SyntheticInputEvent<HTMLInputElement>) => void,
  onSubmit: () => void,
  t: TFunction,
  closeFeedbackModal: () => void,
  sendingStatus: SendingStatusType
|}

/**
 * Renders all necessary inputs for a Feedback and posts the data to the feedback endpoint
 */
export const FeedbackBox = ({
  t,
  isPositiveRatingSelected,
  onCommentChanged,
  onContactMailChanged,
  onSubmit,
  contactMail,
  comment,
  closeFeedbackModal,
  sendingStatus
}: PropsType) => (
  <StyledFeedbackBox>
    <ModalHeader t={t} closeFeedbackModal={closeFeedbackModal} title={t('feedback')} />
    <FeedbackComment
      comment={comment}
      commentMessage={isPositiveRatingSelected ? t('positiveComment') : t('negativeComment')}
      onCommentChanged={onCommentChanged}
      required={!isPositiveRatingSelected}
    />
    <Description>
      {t('contactMailAddress')} ({t('optionalInfo')})
    </Description>
    <TextInput onChange={onContactMailChanged} value={contactMail} />
    {sendingStatus === 'ERROR' && <Description>{t('failedSendingFeedback')}</Description>}
    <TextButton disabled={!isPositiveRatingSelected && !comment} onClick={onSubmit} text={t('send')} />
  </StyledFeedbackBox>
)

export default withTranslation<PropsType>('feedback')(FeedbackBox)

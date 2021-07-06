import * as React from 'react'
import { ReactElement } from 'react'
import type { TFunction } from 'react-i18next'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import FeedbackComment from './FeedbackComment'
import TextButton from './TextButton'
import type { SendingStatusType } from './FeedbackContainer'
import { ThemeType } from 'build-configs'

export const StyledFeedback = styled.div`
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
const TextInput = styled.input.attrs({
  type: 'text'
})`
  resize: none;
`
export const Description = styled.div`
  padding: 10px 0 5px;
`
type PropsType = {
  isPositiveFeedback: boolean
  isSearchFeedback: boolean
  comment: string
  contactMail: string
  onCommentChanged: (comment: string) => void
  onContactMailChanged: (contactMail: string) => void
  onSubmit: () => void
  sendingStatus: SendingStatusType
}

export const Feedback = (props: PropsType): ReactElement => {
  const {
    isPositiveFeedback,
    comment,
    contactMail,
    sendingStatus,
    onSubmit,
    onCommentChanged,
    onContactMailChanged
  } = props
  const { t } = useTranslation('feedback')
  return (
    <StyledFeedback>
      <FeedbackComment
        comment={comment}
        commentMessage={isPositiveFeedback ? t('positiveComment') : t('negativeComment')}
        onCommentChanged={onCommentChanged}
        required={!isPositiveFeedback}
      />
      <Description>
        {t('contactMailAddress')} ({t('optionalInfo')})
      </Description>
      <TextInput onChange={event => onContactMailChanged(event.target.value)} value={contactMail} />
      {sendingStatus === 'ERROR' && <Description>{t('failedSendingFeedback')}</Description>}
      <TextButton disabled={!isPositiveFeedback && !comment} onClick={onSubmit} text={t('send')} />
    </StyledFeedback>
  )
}

export default Feedback

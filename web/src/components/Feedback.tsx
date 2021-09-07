import * as React from 'react'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { SendingState } from './FeedbackContainer'
import TextButton from './TextButton'

export const Container = styled.div`
  display: flex;
  width: 400px;
  height: auto;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  border-radius: 10px;
  border-color: ${props => props.theme.colors.textSecondaryColor};
  font-size: ${props => props.theme.fonts.contentFontSize};
`

const CommentField = styled.textarea`
  resize: none;
`

const TextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TextInput = styled.input.attrs({
  type: 'text'
})`
  resize: none;
`

export const Description = styled.div`
  padding: 10px 0 5px;
  font-weight: 700;
`

type PropsType = {
  isPositiveFeedback: boolean
  isSearchFeedback: boolean
  comment: string
  contactMail: string
  onCommentChanged: (comment: string) => void
  onContactMailChanged: (contactMail: string) => void
  onSubmit: () => void
  sendingStatus: SendingState
}

const Feedback = (props: PropsType): ReactElement => {
  const {
    isPositiveFeedback,
    isSearchFeedback,
    comment,
    contactMail,
    sendingStatus,
    onSubmit,
    onCommentChanged,
    onContactMailChanged
  } = props
  const { t } = useTranslation('feedback')
  const feedbackModalDescription = isPositiveFeedback ? 'positiveComment' : 'negativeComment'
  const description = isSearchFeedback ? 'wantedInformation' : feedbackModalDescription

  return (
    <Container>
      <TextContainer>
        <Description>{t(description)}</Description>
        {isPositiveFeedback && <div>({t('optionalInfo')})</div>}
      </TextContainer>
      <CommentField rows={7} value={comment} onChange={event => onCommentChanged(event.target.value)} />

      <TextContainer>
        <Description>{t('contactMailAddress')}</Description>
        <div>({t('optionalInfo')})</div>
      </TextContainer>
      <TextInput onChange={event => onContactMailChanged(event.target.value)} value={contactMail} />

      {sendingStatus === SendingState.ERROR && <Description>{t('failedSendingFeedback')}</Description>}
      <TextButton disabled={!isPositiveFeedback && !comment} onClick={onSubmit} text={t('send')} />
    </Container>
  )
}

export default Feedback

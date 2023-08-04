import * as React from 'react'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { NegativeFeedbackIcon, NoteIcon, PositiveFeedbackIcon } from '../assets'
import dimensions from '../constants/dimensions'
import { SendingState } from './FeedbackContainer'
import TextButton from './TextButton'
import TextInput from './TextInput'

export const Container = styled.div`
  display: flex;
  flex: 1;
  max-height: 80vh;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  border-radius: 10px;
  border-color: ${props => props.theme.colors.textSecondaryColor};
  font-size: ${props => props.theme.fonts.contentFontSize};
  overflow: auto;
  align-self: center;
  @media ${dimensions.mediumLargeViewport} {
    width: 400px;
  }
`

const CommentField = styled.textarea`
  margin-top: 8px;
  resize: none;
  min-height: 60px;
`

const TextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 5px;
`

export const Description = styled.label`
  font-weight: 700;
`

export const ErrorSendingStatus = styled.div`
  padding: 10px 0 5px;
  font-weight: 700;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
  gap: 16px;
`

const NoteContainer = styled.div<{ showContainer: boolean }>`
  display: flex;
  margin-top: 12px;
  background-color: ${props => props.theme.colors.themeColor};
  padding: 12px;
  opacity: ${props => (props.showContainer ? 1 : 0)};
`

const NoteText = styled.span`
  margin-left: 12px;
  font-size: ${props => props.theme.fonts.decorativeFontSizeSmall};
`

type FeedbackProps = {
  isPositiveFeedback: boolean | null
  isSearchFeedback: boolean
  comment: string
  contactMail: string
  onCommentChanged: (comment: string) => void
  onContactMailChanged: (contactMail: string) => void
  onFeedbackChanged: (isPositiveFeedback: boolean | null) => void
  onSubmit: () => void
  sendingStatus: SendingState
}

const Feedback = (props: FeedbackProps): ReactElement => {
  const {
    isPositiveFeedback,
    isSearchFeedback,
    comment,
    contactMail,
    sendingStatus,
    onSubmit,
    onCommentChanged,
    onContactMailChanged,
    onFeedbackChanged,
  } = props
  const { t } = useTranslation('feedback')

  const description = isSearchFeedback ? 'wantedInformation' : 'commentHeadline'
  const sendFeedbackDisabled = isPositiveFeedback === null && comment.trim().length === 0

  return (
    <Container>
      <TextContainer>
        <div>{t('description')}</div>
      </TextContainer>
      <ButtonContainer>
        <TextButton
          type='tile'
          onClick={() => onFeedbackChanged(isPositiveFeedback ? null : true)}
          active={isPositiveFeedback === true}
          icon={PositiveFeedbackIcon}
          text={t('useful')}
        />
        <TextButton
          type='tile'
          onClick={() => onFeedbackChanged(isPositiveFeedback === false ? null : false)}
          active={isPositiveFeedback === false}
          icon={NegativeFeedbackIcon}
          text={t('notUseful')}
        />
      </ButtonContainer>
      <TextContainer>
        <Description htmlFor='comment'>{t(description)}</Description>
        <div>({t('optionalInfo')})</div>
      </TextContainer>
      <TextContainer>
        <div>{t('commentDescription')}</div>
      </TextContainer>
      <CommentField id='comment' rows={7} value={comment} onChange={event => onCommentChanged(event.target.value)} />
      <TextContainer>
        <Description htmlFor='email'>{t('contactMailAddress')}</Description>
        <div>({t('optionalInfo')})</div>
      </TextContainer>
      <TextInput
        id='email'
        type='email'
        onChange={event => onContactMailChanged(event.target.value)}
        value={contactMail}
      />

      {sendingStatus === SendingState.ERROR && (
        <ErrorSendingStatus role='alert'>{t('failedSendingFeedback')}</ErrorSendingStatus>
      )}

      <NoteContainer showContainer={sendFeedbackDisabled}>
        <img src={NoteIcon} alt='' />
        <NoteText>{t('note')}</NoteText>
      </NoteContainer>

      <TextButton type='primary' disabled={sendFeedbackDisabled} onClick={onSubmit} text={t('send')} />
    </Container>
  )
}

export default Feedback

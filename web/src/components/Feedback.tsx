import * as React from 'react'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { NegativeFeedbackIcon, NoteIcon, PositiveFeedbackIcon } from '../assets'
import dimensions from '../constants/dimensions'
import { SendingState } from './FeedbackContainer'
import StyledSmallViewTip from './StyledSmallViewTip'
import TextButton from './TextButton'
import TextInput from './TextInput'

export const Container = styled.div`
  display: flex;
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
`

const FeedbackButton = styled.button<{ $active: boolean | null }>`
  border: none;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25), 0px 1px 4px 1px rgba(0, 0, 0, 0.15);
  border-radius: 18px;
  width: 100px;
  height: 80px;
  background-color: ${props => (props.$active ? `${props.theme.colors.themeColor}` : 'transparent')};
  &:not(:last-child) {
    margin-right: 14px;
  }
`

const NoteContainer = styled.div<{ showContainer: boolean }>`
  display: flex;
  margin-top: 12px;
  background-color: ${props => props.theme.colors.themeColor};
  padding: 8px;
  opacity: ${props => (props.showContainer ? 1 : 0)};
`

const NoteText = styled(StyledSmallViewTip)`
  margin: 0 0 0 12px !important;
`

const FeedbackRatingTooltip = styled(StyledSmallViewTip)`
  margin-bottom: 0 !important;
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
        <FeedbackButton
          type='button'
          aria-label={t('useful')}
          onClick={() => onFeedbackChanged(isPositiveFeedback ? null : true)}
          $active={isPositiveFeedback}>
          <img src={PositiveFeedbackIcon} alt='' />
          <FeedbackRatingTooltip>{t('useful')}</FeedbackRatingTooltip>
        </FeedbackButton>
        <FeedbackButton
          type='button'
          aria-label={t('notUseful')}
          onClick={() => onFeedbackChanged(isPositiveFeedback === false ? null : false)}
          $active={isPositiveFeedback === false}>
          <img src={NegativeFeedbackIcon} alt='' />
          <FeedbackRatingTooltip>{t('notUseful')}</FeedbackRatingTooltip>
        </FeedbackButton>
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

      <TextButton disabled={sendFeedbackDisabled} onClick={onSubmit} text={t('send')} />
    </Container>
  )
}

export default Feedback

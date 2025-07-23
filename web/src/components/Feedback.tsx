import SendIcon from '@mui/icons-material/Send'
import { FormControl, FormHelperText, InputLabel } from '@mui/material'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Rating, DEFAULT_ROWS_NUMBER } from 'shared'

import buildConfig from '../constants/buildConfig'
import FeedbackButtons from './FeedbackButtons'
import { SendingStatusType } from './FeedbackContainer'
import Note from './Note'
import PrivacyCheckbox from './PrivacyCheckbox'
import Input from './base/Input'

export const Container = styled('div')<{ fullWidth?: boolean }>`
  display: flex;
  flex: 1;
  max-height: 80vh;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  border-radius: 10px;
  border-color: ${props => props.theme.legacy.colors.textSecondaryColor};
  font-size: ${props => props.theme.legacy.fonts.contentFontSize};
  overflow: auto;
  align-self: center;
  gap: 16px;

  ${props => props.theme.breakpoints.up('md')} {
    width: ${props => (props.fullWidth ? 'auto' : '400px')};
  }
`

const ErrorSendingStatus = styled('div')`
  font-weight: bold;
`

type FeedbackProps = {
  language: string
  rating: Rating | null
  comment: string
  contactMail: string
  onCommentChanged: (comment: string) => void
  onContactMailChanged: (contactMail: string) => void
  setRating?: (rating: Rating | null) => void
  onSubmit: () => void
  sendingStatus: SendingStatusType
  searchTerm: string | undefined
  setSearchTerm: (newTerm: string) => void
  closeFeedback: (() => void) | undefined
}

const Feedback = ({
  language,
  rating,
  comment,
  contactMail,
  sendingStatus,
  onSubmit,
  onCommentChanged,
  onContactMailChanged,
  setRating,
  searchTerm,
  setSearchTerm,
  closeFeedback,
}: FeedbackProps): ReactElement => {
  const { t } = useTranslation('feedback')

  const isSearchFeedback = searchTerm !== undefined
  const commentTitle = isSearchFeedback ? 'wantedInformation' : 'commentHeadline'
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
  const feedbackFilled = rating === null && comment.trim().length === 0 && !searchTerm
  const submitFeedbackDisabled = feedbackFilled || !privacyPolicyAccepted

  if (sendingStatus === 'successful') {
    return (
      <Container>
        <div>{t('thanksMessage')}</div>
        {!!closeFeedback && !isSearchFeedback && <Button onClick={closeFeedback}>{t('common:close')}</Button>}
      </Container>
    )
  }

  return (
    <Container fullWidth={isSearchFeedback}>
      {isSearchFeedback ? (
        <FormControl>
          <FormHelperText id={searchTerm}>{t('searchTermDescription')}</FormHelperText>
          <InputLabel htmlFor='searchTerm' />
          <Input id='searchTerm' value={searchTerm} aria-describedby={searchTerm} onChange={setSearchTerm} />
        </FormControl>
      ) : (
        setRating && <FeedbackButtons rating={rating} setRating={setRating} />
      )}
      <FormControl>
        <InputLabel htmlFor='comment'>{t(commentTitle)}</InputLabel>
        <Input
          id='comment'
          value={comment}
          aria-describedby={comment}
          onChange={onCommentChanged}
          rows={DEFAULT_ROWS_NUMBER}
        />
        <FormHelperText id={comment}>{t('commentDescription', { appName: buildConfig().appName })}</FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor='email'>{t('contactMailAddress')}</InputLabel>
        <Input id='email' value={contactMail} onChange={onContactMailChanged} />
      </FormControl>
      <PrivacyCheckbox language={language} checked={privacyPolicyAccepted} setChecked={setPrivacyPolicyAccepted} />
      {submitFeedbackDisabled && <Note text={t(feedbackFilled ? 'noteFillFeedback' : 'notePrivacyPolicy')} />}
      {sendingStatus === 'failed' && <ErrorSendingStatus role='alert'>{t('failedSendingFeedback')}</ErrorSendingStatus>}
      <Button onClick={onSubmit} variant='contained' startIcon={<SendIcon />} disabled={submitFeedbackDisabled}>
        {t('send')}
      </Button>
    </Container>
  )
}

export default Feedback

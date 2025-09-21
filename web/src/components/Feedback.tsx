import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DEFAULT_ROWS_NUMBER, Rating } from 'shared'

import buildConfig from '../constants/buildConfig'
import FeedbackButtons from './FeedbackButtons'
import { SendingStatusType } from './FeedbackContainer'
import PrivacyCheckbox from './PrivacyCheckbox'

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

  ${props => props.theme.breakpoints.up('md')} {
    width: ${props => (props.fullWidth ? 'auto' : '400px')};
  }
`

const OptionalHint = styled('p')`
  text-align: end;
`

const PrivacyFormControl = styled(FormControl)`
  margin: 8px 0;
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
  setRating: (rating: Rating | null) => void
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
  const [showErrors, setShowErrors] = useState(false)

  const handleSubmit = () => {
    setShowErrors(true)
    if (!submitFeedbackDisabled) {
      onSubmit()
    }
  }

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
        <TextField
          id='searchTerm'
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          label={t('searchTermDescription')}
          required
          fullWidth
          error={showErrors && !searchTerm}
          helperText={showErrors && !searchTerm ? t('noteFillFeedback') : undefined}
        />
      ) : (
        <FormControl error={showErrors && rating === null}>
          <FeedbackButtons rating={rating} setRating={setRating} />
          {showErrors && rating === null && (
            <FormHelperText>
              <Typography component='span' variant='body2'>
                {t('noteFillFeedback')}
              </Typography>
            </FormHelperText>
          )}
        </FormControl>
      )}
      <OptionalHint>({t('common:optional')})</OptionalHint>
      <TextField
        id='comment'
        value={comment}
        onChange={event => onCommentChanged(event.target.value)}
        label={t(commentTitle)}
        variant='outlined'
        multiline
        rows={DEFAULT_ROWS_NUMBER}
        helperText={t('commentDescription', { appName: buildConfig().appName })}
      />
      <OptionalHint>({t('common:optional')})</OptionalHint>
      <TextField
        id='email'
        value={contactMail}
        onChange={event => onContactMailChanged(event.target.value)}
        label={t('contactMailAddress')}
        variant='outlined'
      />
      <PrivacyFormControl error={showErrors && !privacyPolicyAccepted} required>
        <PrivacyCheckbox language={language} checked={privacyPolicyAccepted} setChecked={setPrivacyPolicyAccepted} />
        {showErrors && !privacyPolicyAccepted && (
          <FormHelperText component='span'>
            <Typography variant='body2'>{t('common:notePrivacyPolicy')}</Typography>
          </FormHelperText>
        )}
      </PrivacyFormControl>
      {sendingStatus === 'failed' && <ErrorSendingStatus role='alert'>{t('failedSendingFeedback')}</ErrorSendingStatus>}
      <Button onClick={handleSubmit} variant='contained' startIcon={<SendIcon />}>
        {t('send')}
      </Button>
    </Container>
  )
}

export default Feedback

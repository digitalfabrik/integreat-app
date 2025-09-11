import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Rating } from 'shared'

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
    if (submitFeedbackDisabled) {
      return
    }
    onSubmit()
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
        <FormControl error={showErrors && !searchTerm} variant='outlined' margin='dense'>
          <FormHelperText id='searchTermDescription' component='span'>
            <Typography variant='body2'>
              {showErrors && !searchTerm ? t('noteFillFeedback') : t('searchTermDescription')}
            </Typography>
          </FormHelperText>
          <InputLabel htmlFor='searchTerm' />
          <OutlinedInput
            id='searchTerm'
            value={searchTerm}
            aria-describedby='searchTermDescription'
            onChange={e => setSearchTerm(e.target.value)}
            fullWidth
            required
          />
        </FormControl>
      ) : (
        <FormControl error={showErrors && rating === null}>
          <FeedbackButtons rating={rating} setRating={setRating} />
          {showErrors && rating === null && (
            <FormHelperText>
              <Typography component='p' variant='body2'>
                {t('noteFillFeedback')}
              </Typography>
            </FormHelperText>
          )}
        </FormControl>
      )}
      <OptionalHint>({t('common:optional')})</OptionalHint>
      <FormControl fullWidth variant='outlined'>
        <InputLabel htmlFor='comment'>{t(commentTitle)}</InputLabel>
        <OutlinedInput
          id='comment'
          value={comment}
          onChange={e => onCommentChanged(e.target.value)}
          aria-describedby='commentDescription'
          label={t(commentTitle)}
          multiline
          rows={4}
        />
        <FormHelperText id='commentDescription' component='div' sx={{ margin: 0 }}>
          <Typography variant='body2' component='span' sx={{ margin: 0 }}>
            {t('commentDescription', { appName: buildConfig().appName })}
          </Typography>
        </FormHelperText>
      </FormControl>
      <OptionalHint>({t('common:optional')})</OptionalHint>
      <FormControl fullWidth variant='outlined' margin='dense'>
        <InputLabel htmlFor='email'>{t('contactMailAddress')}</InputLabel>
        <OutlinedInput
          id='email'
          value={contactMail}
          onChange={e => onContactMailChanged(e.target.value)}
          label={t('contactMailAddress')}
        />
      </FormControl>
      <FormControl error={showErrors && !privacyPolicyAccepted} required sx={{ margin: '8px 0' }}>
        <PrivacyCheckbox language={language} checked={privacyPolicyAccepted} setChecked={setPrivacyPolicyAccepted} />
        {showErrors && !privacyPolicyAccepted && (
          <FormHelperText component='span'>
            <Typography variant='body2'>{t('notePrivacyPolicy')}</Typography>
          </FormHelperText>
        )}
      </FormControl>
      {sendingStatus === 'failed' && <ErrorSendingStatus role='alert'>{t('failedSendingFeedback')}</ErrorSendingStatus>}
      <Button onClick={handleSubmit} variant='contained' startIcon={<SendIcon />}>
        {t('send')}
      </Button>
    </Container>
  )
}

export default Feedback

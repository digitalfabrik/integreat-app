import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'

import { Rating } from 'shared'

import buildConfig from '../constants/buildConfig'
import FeedbackButtons from './FeedbackButtons'
import { SendingStatusType } from './FeedbackContainer'
import Link from './base/Link'

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

  & [class*='MuiFormHelperText-root'] {
    font-size: ${props => props.theme.legacy.fonts.hintFontSize};
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
  url?: string | null
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
  url,
}: FeedbackProps): ReactElement => {
  const { t } = useTranslation('feedback')

  const isSearchFeedback = searchTerm !== undefined
  const commentTitle = isSearchFeedback ? 'wantedInformation' : 'commentHeadline'
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
  const feedbackFilled = rating === null && comment.trim().length === 0 && !searchTerm
  const submitFeedbackDisabled = feedbackFilled || !privacyPolicyAccepted
  const [submitted, setSubmitted] = useState(false)
  const { privacyUrls } = buildConfig()
  const privacyUrl = url ?? privacyUrls[language] ?? privacyUrls.default

  const handleSubmit = () => {
    setSubmitted(true)
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
        <FormControl error={submitted && !searchTerm} variant='outlined'>
          <FormHelperText id='searchTermDescription'>
            {submitted && !searchTerm ? t('noteFillFeedback') : t('searchTermDescription')}
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
        <FormControl error={submitted && rating === null}>
          <FeedbackButtons rating={rating} setRating={setRating} />
          {submitted && rating === null && <FormHelperText>{t('noteFillFeedback')}</FormHelperText>}
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
        <FormHelperText id='commentDescription'>
          {t('commentDescription', { appName: buildConfig().appName })}
        </FormHelperText>
      </FormControl>
      <OptionalHint>({t('common:optional')})</OptionalHint>
      <FormControl fullWidth variant='outlined'>
        <InputLabel htmlFor='email'>{t('contactMailAddress')}</InputLabel>
        <OutlinedInput
          id='email'
          value={contactMail}
          onChange={e => onContactMailChanged(e.target.value)}
          label={t('contactMailAddress')}
        />
      </FormControl>
      <FormControl error={submitted && !privacyPolicyAccepted} required margin='normal'>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={privacyPolicyAccepted} onChange={e => setPrivacyPolicyAccepted(e.target.checked)} />
            }
            label={
              <Trans i18nKey='common:privacyPolicy'>
                This gets replaced
                <Link to={privacyUrl} highlighted>
                  by react-i18next
                </Link>
              </Trans>
            }
          />
        </FormGroup>
        {submitted && !privacyPolicyAccepted && <FormHelperText>{t('notePrivacyPolicy')}</FormHelperText>}
      </FormControl>
      {sendingStatus === 'failed' && <ErrorSendingStatus role='alert'>{t('failedSendingFeedback')}</ErrorSendingStatus>}
      <Button onClick={handleSubmit} variant='contained' startIcon={<SendIcon />}>
        {t('send')}
      </Button>
    </Container>
  )
}

export default Feedback

import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DEFAULT_ROWS_NUMBER, Rating } from 'shared'

import buildConfig from '../constants/buildConfig'
import FeedbackButtons from './FeedbackButtons'
import PrivacyCheckbox from './PrivacyCheckbox'

const OptionalHint = styled('p')`
  text-align: end;
`

const PrivacyFormControl = styled(FormControl)`
  margin: 8px 0;
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
  searchTerm: string | undefined
  setSearchTerm: (newTerm: string) => void
}

const Feedback = ({
  language,
  rating,
  comment,
  contactMail,
  onSubmit,
  onCommentChanged,
  onContactMailChanged,
  setRating,
  searchTerm,
  setSearchTerm,
}: FeedbackProps): ReactElement => {
  const { t } = useTranslation()

  const isSearchFeedback = searchTerm !== undefined
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
  const feedbackMissing = rating === null && comment.trim().length === 0 && !searchTerm
  const submitFeedbackDisabled = feedbackMissing || !privacyPolicyAccepted
  const [showErrors, setShowErrors] = useState(false)

  const handleSubmit = () => {
    setShowErrors(true)
    if (!submitFeedbackDisabled) {
      onSubmit()
    }
  }

  return (
    <Stack>
      {isSearchFeedback ? (
        <TextField
          id='searchTerm'
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          label={t($ => $.feedback.search.searchTermDescription)}
          required
          fullWidth
          error={showErrors && !searchTerm}
          helperText={showErrors && !searchTerm ? t($ => $.feedback.required) : undefined}
        />
      ) : (
        <FormControl error={showErrors && rating === null}>
          <FeedbackButtons rating={rating} setRating={setRating} />
          {showErrors && rating === null && <FormHelperText>{t($ => $.feedback.required)}</FormHelperText>}
        </FormControl>
      )}
      <OptionalHint>({t($ => $.common.state.optional)})</OptionalHint>
      <TextField
        id='comment'
        value={comment}
        onChange={event => onCommentChanged(event.target.value)}
        label={isSearchFeedback ? t($ => $.feedback.search.wantedInformation) : t($ => $.feedback.comment.title)}
        variant='outlined'
        multiline
        rows={DEFAULT_ROWS_NUMBER}
        helperText={t($ => $.feedback.comment.description, { appName: buildConfig().appName })}
      />
      <OptionalHint>({t($ => $.common.state.optional)})</OptionalHint>
      <TextField
        id='email'
        value={contactMail}
        onChange={event => onContactMailChanged(event.target.value)}
        label={t($ => $.feedback.contactEmail)}
        variant='outlined'
      />
      <PrivacyFormControl error={showErrors && !privacyPolicyAccepted} required>
        <PrivacyCheckbox language={language} checked={privacyPolicyAccepted} setChecked={setPrivacyPolicyAccepted} />
        {showErrors && !privacyPolicyAccepted && <FormHelperText>{t($ => $.common.privacy.required)}</FormHelperText>}
      </PrivacyFormControl>
      <Button onClick={handleSubmit} variant='contained' startIcon={<SendIcon />}>
        {t($ => $.common.actions.send)}
      </Button>
    </Stack>
  )
}

export default Feedback

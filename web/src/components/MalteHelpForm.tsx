import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined'
import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { regionContentPath, DEFAULT_ROWS_NUMBER, SendingStatusType } from 'shared'
import {
  OfferModel,
  ContactChannel,
  ContactGender,
  submitMalteHelpForm,
  MALTE_HELP_FORM_MAX_COMMENT_LENGTH,
  InvalidEmailError,
} from 'shared/api'

import { captureError } from '../utils/sentry'
import PrivacyCheckbox from './PrivacyCheckbox'
import Link from './base/Link'
import RadioGroup from './base/RadioGroup'
import Snackbar from './base/Snackbar'

const Note = styled('div')`
  display: flex;
  padding-bottom: 10px;
  gap: 20px;
`

const Form = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

type MalteHelpFormProps = {
  pageTitle: string
  regionCode: string
  languageCode: string
  malteHelpFormOffer: OfferModel
}

const MalteHelpForm = ({
  pageTitle,
  languageCode,
  regionCode,
  malteHelpFormOffer,
}: MalteHelpFormProps): ReactElement => {
  const { t } = useTranslation(['malteHelpForm', 'common', 'error'])
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [contactChannel, setContactChannel] = useState<ContactChannel>('email')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [name, setName] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [contactGender, setContactGender] = useState<ContactGender>('any')
  const [comment, setComment] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const dashboardRoute = regionContentPath({ languageCode, regionCode })

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    if (
      !name.length ||
      (contactChannel === 'email' && !email.length) ||
      (contactChannel === 'telephone' && !telephone.length) ||
      !privacyPolicyAccepted
    ) {
      return
    }
    setSendingStatus('sending')
    try {
      await submitMalteHelpForm({
        url: window.location.href,
        pageTitle,
        regionCode,
        malteHelpFormOffer,
        name,
        email,
        telephone,
        roomNumber,
        contactChannel,
        contactGender,
        comment,
      })
      setSendingStatus('successful')
      setSnackbarOpen(true)
    } catch (error) {
      if (error instanceof InvalidEmailError) {
        setInvalidEmail(true)
      } else {
        await captureError(error)
        setSendingStatus('failed')
        setSnackbarOpen(true)
      }
    }
  }

  return (
    <>
      <Note>
        <PeopleOutlineOutlinedIcon />
        {t($ => $.malteHelpForm.supportNote)}
      </Note>
      <Note>
        <HealthAndSafetyOutlinedIcon />
        {t($ => $.malteHelpForm.securityNote)}
      </Note>
      <Form onSubmit={submitHandler} noValidate>
        <TextField
          id='name'
          label={t($ => $.malteHelpForm.name)}
          required
          fullWidth
          value={name}
          onChange={event => setName(event.target.value)}
          error={submitted && !name.length}
        />
        <TextField
          id='roomNumber'
          label={`${t($ => $.malteHelpForm.roomNumber)} (${t($ => $.common.optional)})`}
          fullWidth
          value={roomNumber}
          onChange={event => setRoomNumber(event.target.value)}
        />
        <RadioGroup
          caption={t($ => $.malteHelpForm.howToBeContacted)}
          groupId='contactChannel'
          selectedValue={contactChannel}
          submitted={submitted}
          onChange={setContactChannel}
          required
          values={[
            {
              key: 'email',
              label: t($ => $.malteHelpForm.eMail),
              inputProps: {
                value: email,
                onChange: setEmail,
                required: true,
                error: invalidEmail,
                helperText: invalidEmail ? t($ => $.malteHelpForm.invalidEmailAddress) : undefined,
              },
            },
            {
              key: 'telephone',
              label: t($ => $.malteHelpForm.telephone),
              inputProps: { value: telephone, onChange: setTelephone, required: true },
            },
            { key: 'personally', label: t($ => $.malteHelpForm.personally) },
          ]}
        />
        <RadioGroup
          caption={t($ => $.malteHelpForm.contactPerson)}
          groupId='contactPerson'
          selectedValue={contactGender}
          onChange={setContactGender}
          values={[
            { key: 'any', label: t($ => $.malteHelpForm.contactPersonAnyGender) },
            { key: 'female', label: t($ => $.malteHelpForm.contactPersonGenderFemale) },
            { key: 'male', label: t($ => $.malteHelpForm.contactPersonGenderMale) },
          ]}
        />
        <TextField
          id='comment'
          label={t($ => $.malteHelpForm.contactReason)}
          fullWidth
          multiline
          rows={DEFAULT_ROWS_NUMBER}
          value={comment}
          onChange={event => setComment(event.target.value)}
          helperText={t($ => $.malteHelpForm.maxCharacters, { numberOfCharacters: MALTE_HELP_FORM_MAX_COMMENT_LENGTH })}
        />
        <p>{t($ => $.malteHelpForm.responseHint)}</p>
        <FormControl required error={submitted && !privacyPolicyAccepted}>
          <PrivacyCheckbox
            language={languageCode}
            checked={privacyPolicyAccepted}
            setChecked={setPrivacyPolicyAccepted}
          />
          {submitted && !privacyPolicyAccepted && <FormHelperText>{t($ => $.common.notePrivacyPolicy)}</FormHelperText>}
        </FormControl>
        <Stack sx={{ height: 1 }} />
        <Button type='submit' startIcon={<SendIcon />} variant='contained'>
          {t($ => $.malteHelpForm.submit)}
        </Button>
      </Form>
      <Snackbar
        open={snackbarOpen}
        severity={sendingStatus === 'successful' ? 'success' : 'error'}
        onClose={() => setSnackbarOpen(false)}
        title={sendingStatus === 'failed' ? t($ => $.malteHelpForm.submitFailed) : undefined}
        message={
          sendingStatus === 'failed'
            ? t($ => $.malteHelpForm.submitFailedReasoning)
            : t($ => $.malteHelpForm.submitSuccessful)
        }
        action={
          <Button component={Link} to={dashboardRoute} size='small'>
            {t($ => $.error.goTo.categories)}
          </Button>
        }
      />
    </>
  )
}

export default MalteHelpForm

import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined'
import SendIcon from '@mui/icons-material/Send'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cityContentPath, DEFAULT_ROWS_NUMBER, SendingStatusType } from 'shared'
import {
  OfferModel,
  ContactChannel,
  ContactGender,
  submitMalteHelpForm,
  MALTE_HELP_FORM_MAX_COMMENT_LENGTH,
  InvalidEmailError,
} from 'shared/api'

import Icon from '../components/base/Icon'
import { reportError } from '../utils/sentry'
import PrivacyCheckbox from './PrivacyCheckbox'
import RadioGroup from './base/RadioGroup'
import Snackbar from './base/Snackbar'
import Spacing from './base/Spacing'

const Note = styled('div')`
  display: flex;
  padding-bottom: 10px;
  gap: 20px;
`

const StyledIcon = styled(Icon)`
  flex-shrink: 0;
`

const Form = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

type MalteHelpFormProps = {
  pageTitle: string
  cityCode: string
  languageCode: string
  malteHelpFormOffer: OfferModel
}

const MalteHelpForm = ({ pageTitle, languageCode, cityCode, malteHelpFormOffer }: MalteHelpFormProps): ReactElement => {
  const { t } = useTranslation('malteHelpForm')
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
  const dashboardRoute = cityContentPath({ languageCode, cityCode })

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    if (
      !name.length ||
      (contactChannel === 'email' && !email.length) ||
      (contactChannel === 'telephone' && !telephone.length)
    ) {
      return
    }
    setSendingStatus('sending')
    try {
      await submitMalteHelpForm({
        url: window.location.href,
        pageTitle,
        cityCode,
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
        await reportError(error)
        setSendingStatus('failed')
        setSnackbarOpen(true)
      }
    }
  }

  return (
    <>
      <Note>
        <StyledIcon src={PeopleOutlineOutlinedIcon} />
        {t('supportNote')}
      </Note>
      <Note>
        <StyledIcon src={HealthAndSafetyOutlinedIcon} />
        {t('securityNote')}
      </Note>
      <Form onSubmit={submitHandler} noValidate>
        <TextField
          id='name'
          label={t('name')}
          required
          fullWidth
          value={name}
          onChange={event => setName(event.target.value)}
          error={submitted && !name.length}
        />
        <TextField
          id='roomNumber'
          label={`${t('roomNumber')} (${t('common:optional')})`}
          fullWidth
          value={roomNumber}
          onChange={event => setRoomNumber(event.target.value)}
        />
        <RadioGroup
          caption={t('howToBeContacted')}
          groupId='contactChannel'
          selectedValue={contactChannel}
          submitted={submitted}
          onChange={setContactChannel}
          required
          values={[
            {
              key: 'email',
              label: t('eMail'),
              inputProps: { value: email, onChange: setEmail, required: true },
            },
            {
              key: 'telephone',
              label: t('telephone'),
              inputProps: { value: telephone, onChange: setTelephone, required: true },
            },
            { key: 'personally', label: t('personally') },
          ]}
        />
        <RadioGroup
          caption={t('contactPerson')}
          groupId='contactPerson'
          selectedValue={contactGender}
          onChange={setContactGender}
          values={[
            { key: 'any', label: t('contactPersonAnyGender') },
            { key: 'female', label: t('contactPersonGenderFemale') },
            { key: 'male', label: t('contactPersonGenderMale') },
          ]}
        />
        <TextField
          id='comment'
          label={t('contactReason')}
          fullWidth
          multiline
          rows={DEFAULT_ROWS_NUMBER}
          value={comment}
          onChange={event => setComment(event.target.value)}
          helperText={t('maxCharacters', { numberOfCharacters: MALTE_HELP_FORM_MAX_COMMENT_LENGTH })}
        />
        <p>{t('responseDisclaimer')}</p>
        <FormControl required error={submitted && !privacyPolicyAccepted}>
          <PrivacyCheckbox
            language={languageCode}
            checked={privacyPolicyAccepted}
            setChecked={setPrivacyPolicyAccepted}
          />
          {submitted && !privacyPolicyAccepted && <FormHelperText>{t('common:notePrivacyPolicy')}</FormHelperText>}
        </FormControl>
        {invalidEmail && (
          <Alert severity='error' role='alert'>
            <AlertTitle>{t('submitFailed')}</AlertTitle>
            {t('invalidEmailAddress')}
          </Alert>
        )}
        <Spacing />
        <Button type='submit' startIcon={<SendIcon />} variant='contained'>
          {t('submit')}
        </Button>
      </Form>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        sendingStatus={sendingStatus}
        dashboardRoute={dashboardRoute}
        title={t('submitFailed')}
        message={sendingStatus === 'successful' ? t('submitSuccessful') : t('submitFailedReasoning')}
      />
    </>
  )
}

export default MalteHelpForm

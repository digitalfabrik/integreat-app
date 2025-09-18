import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined'
import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { cityContentPath, DEFAULT_ROWS_NUMBER } from 'shared'
import {
  OfferModel,
  ContactChannel,
  ContactGender,
  submitMalteHelpForm,
  MALTE_HELP_FORM_MAX_COMMENT_LENGTH,
  InvalidEmailError,
} from 'shared/api'

import Icon from '../components/base/Icon'
import { Container } from './Feedback'
import PrivacyCheckbox from './PrivacyCheckbox'
import RadioGroup from './base/RadioGroup'
import Spacing from './base/Spacing'

const Note = styled('div')`
  display: flex;
  padding-bottom: 10px;
  gap: 20px;
`

const StyledIcon = styled(Icon)`
  flex-shrink: 0;
`

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SubmitErrorHeading = styled('h5')`
  margin: 0;
  font-size: ${props => props.theme.legacy.fonts.subTitleFontSize};
`

const ErrorSendingStatus = styled('div')`
  background-color: ${props => props.theme.legacy.colors.invalidInput}35;
  padding: 20px 10px;
  margin: 10px 0;
`

type SendingStatusType = 'idle' | 'sending' | 'invalidEmail' | 'failed' | 'successful'
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
  const dashboardRoute = cityContentPath({ languageCode, cityCode })

  const submitHandler = async () => {
    setSubmitted(true)
    if (
      !name.trim() ||
      (contactChannel === 'email' && !email.trim()) ||
      (contactChannel === 'telephone' && !telephone.trim())
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
    } catch (error) {
      if (error instanceof InvalidEmailError) {
        setSendingStatus('invalidEmail')
      } else {
        reportError(error)
        setSendingStatus('failed')
      }
    }
  }

  if (sendingStatus === 'successful') {
    return (
      <Container>
        <div>{t('submitSuccessful')}</div>
        <Link to={dashboardRoute}>{t('error:goTo.categories')}</Link>
      </Container>
    )
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
      <Wrapper>
        <FormControl required error={submitted && !name}>
          <InputLabel htmlFor='name'>{t('name')}</InputLabel>
          <Input id='name' required value={name} onChange={e => setName(e.target.value)} />
          {submitted && !name && <FormHelperText>{`${t('name')} ${t('requiredField')}`}</FormHelperText>}
        </FormControl>
        <FormControl>
          <InputLabel htmlFor='roomNumber'>{`${t('roomNumber')} (${t('common:optional')})`}</InputLabel>
          <Input id='roomNumber' value={roomNumber} onChange={e => setRoomNumber(e.target.value)} />
        </FormControl>
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
        <FormControl>
          <InputLabel htmlFor='comment'>{t('contactReason')}</InputLabel>
          <Input
            id='comment'
            aria-describedby='commentText'
            rows={DEFAULT_ROWS_NUMBER}
            value={comment}
            onChange={e => setComment(e.target.value)}
            maxRows={MALTE_HELP_FORM_MAX_COMMENT_LENGTH}
          />
          <FormHelperText id='commentText'>
            {t('maxCharacters', { numberOfCharacters: MALTE_HELP_FORM_MAX_COMMENT_LENGTH })}
          </FormHelperText>
        </FormControl>
        <p>{t('responseDisclaimer')}</p>
        <FormControl required error={submitted && !privacyPolicyAccepted}>
          <PrivacyCheckbox
            language={languageCode}
            checked={privacyPolicyAccepted}
            setChecked={setPrivacyPolicyAccepted}
          />
          {submitted && !privacyPolicyAccepted && <FormHelperText>{t('notePrivacyPolicy')}</FormHelperText>}
        </FormControl>
        {(sendingStatus === 'failed' || sendingStatus === 'invalidEmail') && (
          <ErrorSendingStatus role='alert'>
            <SubmitErrorHeading>{t('submitFailed')}</SubmitErrorHeading>
            {sendingStatus === 'invalidEmail' ? t('invalidEmailAddress') : t('submitFailedReasoning')}
          </ErrorSendingStatus>
        )}
        <Spacing />
        <Button onClick={submitHandler} startIcon={<SendIcon />} variant='contained'>
          {t('submit')}
        </Button>
      </Wrapper>
    </>
  )
}

export default MalteHelpForm

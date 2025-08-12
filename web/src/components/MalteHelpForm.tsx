import styled from '@emotion/styled'
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined'
import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button'
import React, { ReactElement, SyntheticEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { cityContentPath, DEFAULT_ROWS_NUMBER } from 'shared'
import {
  OfferModel,
  InvalidEmailError,
  ContactChannel,
  ContactGender,
  submitMalteHelpForm,
  MALTE_HELP_FORM_MAX_COMMENT_LENGTH,
} from 'shared/api'

import Icon from '../components/base/Icon'
import { Container } from './Feedback'
import PrivacyCheckbox from './PrivacyCheckbox'
import Input from './base/Input'
import InputSection from './base/InputSection'
import RadioGroup from './base/RadioGroup'
import Spacing from './base/Spacing'

const Note = styled.div`
  display: flex;
  padding-bottom: 10px;
  gap: 20px;
`

const StyledIcon = styled(Icon)`
  flex-shrink: 0;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SubmitErrorHeading = styled.h5`
  margin: 0;
  font-size: ${props => props.theme.legacy.fonts.subTitleFontSize};
`

const ErrorSendingStatus = styled.div`
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

const scrollToFirstError = (form: HTMLFormElement) => {
  const invalidInput = form.querySelector(':invalid:not(fieldset)')
  invalidInput?.scrollIntoView({ behavior: 'smooth' })
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
  const missingData =
    !name.length ||
    (!email.length && contactChannel === 'email') ||
    (!telephone.length && contactChannel === 'telephone')
  const dashboardRoute = cityContentPath({ languageCode, cityCode })

  const submitHandler = async (event: SyntheticEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    if (!form.checkValidity()) {
      event.stopPropagation()
      scrollToFirstError(form)
      setSendingStatus('idle')
    } else {
      event.preventDefault()
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
          const emailInput = form.querySelector<HTMLInputElement>('#email-input')
          emailInput?.setCustomValidity(t('invalidEmailAddress'))
          emailInput?.reportValidity()
          scrollToFirstError(form)
        } else {
          reportError(error)
          setSendingStatus('failed')
        }
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
      <Form onSubmit={submitHandler}>
        <Input id='name' label={t('name')} required value={name} onChange={setName} submitted={submitted} />
        <Input
          id='roomNumber'
          label={`${t('roomNumber')} (${t('common:optional')})`}
          value={roomNumber}
          onChange={setRoomNumber}
          submitted={submitted}
        />
        <RadioGroup
          caption={t('howToBeContacted')}
          groupId='contactChannel'
          submitted={submitted}
          selectedValue={contactChannel}
          onChange={setContactChannel}
          values={[
            {
              key: 'email',
              label: t('eMail'),
              inputProps: {
                value: email,
                onChange: setEmail,
              },
            },
            {
              key: 'telephone',
              label: t('telephone'),
              inputProps: {
                value: telephone,
                onChange: setTelephone,
              },
            },
            {
              key: 'personally',
              label: t('personally'),
            },
          ]}
        />
        <RadioGroup
          submitted={submitted}
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
        <InputSection id='comment' title={t('contactReason')}>
          <Input
            id='comment'
            label={t('maxCharacters', { numberOfCharacters: MALTE_HELP_FORM_MAX_COMMENT_LENGTH })}
            rows={DEFAULT_ROWS_NUMBER}
            value={comment}
            onChange={setComment}
            maxLength={MALTE_HELP_FORM_MAX_COMMENT_LENGTH}
            submitted={submitted}
          />
        </InputSection>
        <p>{t('responseDisclaimer')}</p>
        <PrivacyCheckbox
          language={languageCode}
          checked={privacyPolicyAccepted}
          setChecked={setPrivacyPolicyAccepted}
        />
        {(sendingStatus === 'failed' || sendingStatus === 'invalidEmail') && (
          <ErrorSendingStatus role='alert'>
            <SubmitErrorHeading>{t('submitFailed')}</SubmitErrorHeading>
            {sendingStatus !== 'invalidEmail' && t('submitFailedReasoning')}
          </ErrorSendingStatus>
        )}
        <Spacing />
        <Button
          onClick={() => setSubmitted(true)}
          startIcon={<SendIcon />}
          disabled={sendingStatus === 'sending' || missingData || !privacyPolicyAccepted}
          type='submit'
          variant='contained'>
          {t('submit')}
        </Button>
      </Form>
    </>
  )
}

export default MalteHelpForm

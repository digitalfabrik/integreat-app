import React, { ReactElement, SyntheticEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import {
  cityContentPath,
  ContactChannel,
  ContactGender,
  MALTE_HELP_FORM_MAX_COMMENT_LENGTH,
  OfferModel,
  submitHelpForm,
} from 'api-client'

import { SecurityIcon, SupportIcon } from '../assets'
import Icon from '../components/base/Icon'
import { Container } from './Feedback'
import Input from './base/Input'
import InputSection from './base/InputSection'
import RadioGroup from './base/RadioGroup'
import TextButton from './base/TextButton'

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
`

const SubmitErrorHeading = styled.h5`
  margin: 0;
  font-size: ${props => props.theme.fonts.subTitleFontSize};
`

const ErrorSendingStatus = styled.div`
  background-color: ${props => props.theme.colors.invalidInput}35;
  padding: 20px 10px;
  margin: 10px 0;
`

type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'
type MalteHelpFormProps = {
  cityCode: string
  languageCode: string
  helpButtonOffer: OfferModel
}

const MalteHelpForm = ({ languageCode, cityCode, helpButtonOffer }: MalteHelpFormProps): ReactElement => {
  const { t, i18n } = useTranslation('malteHelpForm')
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const [submitted, setSubmitted] = useState(false)
  const [contactChannel, setContactChannel] = useState<ContactChannel>('eMail')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [name, setName] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [contactGender, setContactGender] = useState<ContactGender>('any')
  const [comment, setComment] = useState('')
  const missingData =
    !name.length ||
    (!email.length && contactChannel === 'eMail') ||
    (!telephone.length && contactChannel === 'telephone')
  const dashboardRoute = cityContentPath({ languageCode, cityCode })
  const germanT = i18n.getFixedT('de', 'malteHelpForm')

  const submitHandler = async (event: SyntheticEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    if (!form.checkValidity()) {
      event.stopPropagation()
      const invalidInput = form.querySelector(':invalid:not(fieldset)')
      invalidInput?.scrollIntoView({ behavior: 'smooth' })
      setSendingStatus('idle')
    } else {
      event.preventDefault()
      setSendingStatus('sending')
      try {
        await submitHelpForm({
          cityCode,
          languageCode,
          helpButtonOffer,
          name,
          email,
          telephone,
          roomNumber,
          contactChannel,
          contactGender,
          comment,
          translate: (text: string) => germanT(text),
        })
        setSendingStatus('successful')
      } catch (error) {
        reportError(error)
        event.preventDefault()
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
        <StyledIcon src={SupportIcon} />
        {t('supportNote')}
      </Note>
      <Note>
        <StyledIcon src={SecurityIcon} />
        {t('securityNote')}
      </Note>
      <Form onSubmit={submitHandler}>
        <Input id='name' hint={t('name')} hintIsLabel required value={name} onChange={setName} submitted={submitted} />
        <Input
          id='roomNumber'
          hint={`${t('roomNumber')} (${t('common:optional')})`}
          hintIsLabel
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
              key: 'eMail',
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
              key: 'person',
              label: t('personally'),
            },
          ]}
        />
        <RadioGroup
          submitted={submitted}
          caption={t('contactPerson')}
          groupId='contactPerson'
          selectedValue={contactType}
          onChange={setContactType}
          values={[
            { key: 'any', label: t('contactPersonAnyGender') },
            { key: 'female', label: t('contactPersonGenderFemale') },
            { key: 'male', label: t('contactPersonGenderMale') },
          ]}
        />
        <InputSection id='comment' title={t('contactReason')}>
          <Input
            id='comment'
            hint={t('maxCharacters', { numberOfCharacters: MALTE_HELP_FORM_MAX_COMMENT_LENGTH })}
            multiline
            value={comment}
            onChange={setComment}
            maxLength={MALTE_HELP_FORM_MAX_COMMENT_LENGTH}
            submitted={submitted}
          />
        </InputSection>
        <p>{t('responseDisclaimer')}</p>
        {sendingStatus === 'failed' && (
          <ErrorSendingStatus role='alert'>
            <SubmitErrorHeading>{t('submitFailed')}</SubmitErrorHeading>
            {t('submitFailedReasoning')}
          </ErrorSendingStatus>
        )}
        <TextButton
          type='submit'
          disabled={sendingStatus === 'sending' || missingData}
          onClick={() => setSubmitted(true)}
          text={t('submit')}
        />
      </Form>
    </>
  )
}

export default MalteHelpForm

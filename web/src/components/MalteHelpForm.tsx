import React, { ReactElement, SyntheticEvent, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { SecurityIcon, SupportIcon } from '../assets'
import Icon from '../components/base/Icon'
import Button from './base/Button'
import InputSection from './base/InputSection'
import RadioElement, { RadioGroup } from './base/RadioElement'

const Note = styled.div`
  display: flex;
  padding-bottom: 10px;
`

const StyledIcon = styled(Icon)`
  width: 25px;
  height: 25px;
  padding-right: 20px;
  flex-shrink: 0;
`

const Divider = styled.hr`
  margin: 12px 0px;
  background-color: ${props => props.theme.colors.textSecondaryColor};
  height: 1px;
  border: none;
`

const SubmitButton = styled(Button)`
  background-color: ${props => props.theme.colors.textSecondaryColor};
  color: ${props => props.theme.colors.backgroundColor};
  border-radius: 100px;
  width: fit-content;
  align-self: center;
  padding: 15px;
  box-shadow:
    0 2px 4px rgb(0 0 0 / 15%),
    0 2px 4px rgb(0 0 0 / 15%);
  :hover {
    background-color: ${props => props.theme.colors.textSecondaryColor}D9;
  }
  :active {
    box-shadow: none;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
`

type ContactChannel = 'email' | 'telephone' | 'person'
type ContactType = 'male' | 'female' | 'any'

type MalteHelpFormProps = {
  onSubmit: () => Promise<void>
}

const MalteHelpForm = ({ onSubmit }: MalteHelpFormProps): ReactElement => {
  const { t } = useTranslation('zammad')
  const [submitted, setSubmitted] = useState(false)
  const [contactChannel, setContactChannel] = useState<ContactChannel>('email')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [name, setName] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [contactType, setContactType] = useState<ContactType>('any')
  const [comment, setComment] = useState('')

  const submitHandler = useCallback(
    (event: SyntheticEvent<HTMLFormElement>) => {
      const form = event.currentTarget
      if (!form.reportValidity()) {
        event.preventDefault()
        event.stopPropagation()
        const invalidInputs = Array.from(form.querySelectorAll(':invalid')).sort(
          (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
        )
        invalidInputs[0]?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      } else {
        onSubmit()
      }
    },
    [onSubmit],
  )

  return (
    <>
      <Note>
        <StyledIcon src={SupportIcon} />
        {t('zammad:supportNote')}
      </Note>
      <Note>
        <StyledIcon src={SecurityIcon} />
        {t('zammad:securityNote')}
      </Note>
      <Form onSubmit={submitHandler}>
        <InputSection id='name' title={t('name')} value={name} onChange={setName} compact submitted={submitted} />
        <InputSection
          id='roomNumber'
          title={t('roomNumber')}
          value={roomNumber}
          onChange={setRoomNumber}
          optional
          showOptional
          submitted={submitted}
          compact
        />
        <RadioGroup caption={t('howToBeContacted')}>
          <RadioElement
            groupId='contactChannel'
            label={t('eMail')}
            checked={contactChannel === 'email'}
            id='email'
            onChange={setContactChannel}>
            <InputSection
              id='email'
              title={t('eMail')}
              value={email}
              onChange={setEmail}
              compact
              submitted={submitted}
            />
          </RadioElement>
          <RadioElement
            groupId='contactChannel'
            label={t('telephone')}
            checked={contactChannel === 'telephone'}
            id='telephone'
            onChange={setContactChannel}>
            <InputSection
              id='telephone'
              title={t('telephoneNumber')}
              value={telephone}
              onChange={setTelephone}
              compact
              submitted={submitted}
            />
          </RadioElement>
          <RadioElement
            groupId='contactChannel'
            label={t('inPerson')}
            checked={contactChannel === 'person'}
            id='person'
            onChange={setContactChannel}
          />
        </RadioGroup>
        <Divider />
        <RadioGroup caption={t('contactPerson')}>
          <RadioElement
            groupId='contactPerson'
            label={t('contactPersonAnyGender')}
            checked={contactType === 'any'}
            id='any'
            onChange={setContactType}
          />
          <RadioElement
            groupId='contactPerson'
            label={t('contactPersonGenderFemale')}
            checked={contactType === 'female'}
            id='female'
            onChange={setContactType}
          />
          <RadioElement
            groupId='contactPerson'
            label={t('contactPersonGenderMale')}
            checked={contactType === 'male'}
            id='male'
            onChange={setContactType}
          />
        </RadioGroup>
        <Divider />
        <InputSection
          id='comment'
          title={t('causeOfContact')}
          subtitle={t('maxCharacters', { numberOfCharacters: 200 })}
          multiline
          value={comment}
          onChange={setComment}
          optional
          maxLength={200}
          submitted={submitted}
        />
        <p>{t('responseDisclaimer')}</p>
        <SubmitButton onClick={() => setSubmitted(true)} ariaLabel={t('submit')} type='submit'>
          {t('submit')}
        </SubmitButton>
      </Form>
    </>
  )
}

export default MalteHelpForm

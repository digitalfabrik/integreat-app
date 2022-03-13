import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { createShelterContactEndpoint, ShelterContactStatus } from 'api-client'

import ShelterInformationSection from './ShelterInformationSection'
import { StyledButton } from './TextButton'
import TextInput from './TextInput'

const Container = styled.div`
  padding: 0 12px;
  margin-top: 10px;
  flex-direction: column;
  display: flex;
`

const TextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledTextInput = styled(TextInput)`
  width: 50%;
`

const Label = styled.label`
  padding: 10px 0 5px;
`

const SendButton = styled(StyledButton)`
  margin-right: auto;
`

const ErrorText = styled.div`
  color: red;
  padding-top: 12px;
`

const HonigTopf = styled(TextInput)`
  position: absolute;
  height: 0;
  width: 0;
  z-index: -1;
`

type Status = ShelterContactStatus | 'idle' | 'sending' | 'error'

type PropsType = {
  shelterId: number
  cityCode: string
}

const ShelterContactRequestForm = ({ shelterId, cityCode }: PropsType): ReactElement => {
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [status, setStatus] = useState<Status>('idle')
  const [name, setName] = useState<string>('')
  const { t } = useTranslation('shelter')

  const postContactRequest = useCallback(async () => {
    if (name.length > 0) {
      // Prevent spamming by creating a simple honeypot
      return
    }
    try {
      setStatus('sending')
      const status = await createShelterContactEndpoint().request({ id: shelterId, email, phone, cityCode })
      setStatus(status.data ?? 'error')
    } catch (e) {
      setStatus('error')
    } finally {
      setPhone('')
      setEmail('')
    }
  }, [email, phone, shelterId, cityCode, name])

  const buttonDisabled = status === 'sending' || (email.length === 0 && phone.length === 0 && name.length === 0)

  return (
    <ShelterInformationSection information={[]} extended title={t('contactRequest.title')} elevated singleColumn>
      <Container>
        {t(status === 'success' ? t('contactRequest.success') : t('contactRequest.description'))}

        {['error', 'invalid_contact_data', 'invalid_accommodation'].includes(status) && (
          <ErrorText role='alert'>{t(`contactRequest.${status}`)}</ErrorText>
        )}

        {status !== 'success' && (
          <>
            <HonigTopf
              tabIndex={-1}
              id='name'
              type='text'
              value={name}
              onChange={event => setName(event.target.value)}
              autoComplete='off'
            />
            <TextContainer>
              <Label htmlFor='email'>{t('contactRequest.email')}</Label>
            </TextContainer>
            <StyledTextInput
              id='email'
              type='email'
              disabled={status === 'sending'}
              onChange={event => setEmail(event.target.value)}
              value={email}
            />

            <TextContainer>
              <Label htmlFor='phone'>{t('contactRequest.phone')}</Label>
            </TextContainer>
            <StyledTextInput
              id='phone'
              type='tel'
              disabled={status === 'sending'}
              onChange={event => setPhone(event.target.value)}
              value={phone}
            />

            <SendButton disabled={buttonDisabled} onClick={postContactRequest}>
              {t('contactRequest.send')}
            </SendButton>
          </>
        )}
      </Container>
    </ShelterInformationSection>
  )
}

export default ShelterContactRequestForm

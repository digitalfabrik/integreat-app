import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { createShelterContactEndpoint, ShelterContactStatus } from 'api-client'

import ShelterInformationSection from './ShelterInformationSection'
import { StyledButton } from './TextButton'

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

const TextInput = styled.input.attrs({
  type: 'text'
})`
  width: 50%;
  border-radius: 0.25rem;
  background-clip: padding-box;
  border: 1px solid ${props => props.theme.colors.textDisabledColor};
  padding: 0.5rem 0.75rem;
  resize: none;
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

type Status = ShelterContactStatus | 'idle' | 'sending' | 'error'

type PropsType = {
  shelterId: number
  cityCode: string
}

const ShelterContactRequestForm = ({ shelterId, cityCode }: PropsType): ReactElement => {
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [status, setStatus] = useState<Status>('idle')
  const { t } = useTranslation('shelter')

  const postContactRequest = useCallback(async () => {
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
  }, [email, phone, shelterId, cityCode])

  const buttonDisabled = status === 'sending' || (email.length === 0 && phone.length === 0)

  return (
    <ShelterInformationSection information={[]} extended title={t('contactRequest.title')} elevated singleColumn>
      <Container>
        {t(status === 'success' ? t('contactRequest.success') : t('contactRequest.description'))}

        {['error', 'invalid_contact_data', 'invalid_accommodation'].includes(status) && (
          <ErrorText role='alert'>{t(`contactRequest.${status}`)}</ErrorText>
        )}

        {status !== 'success' && (
          <>
            <TextContainer>
              <Label htmlFor='email'>{t('contactRequest.email')}</Label>
            </TextContainer>
            <TextInput
              id='email'
              disabled={status === 'sending'}
              onChange={event => setEmail(event.target.value)}
              value={email}
            />

            <TextContainer>
              <Label htmlFor='phone'>{t('contactRequest.phone')}</Label>
            </TextContainer>
            <TextInput
              id='phone'
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

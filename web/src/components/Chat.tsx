import MailLock from '@mui/icons-material/MailLock'
import SendIcon from '@mui/icons-material/Send'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import React, { KeyboardEvent, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ChatMessageModel, CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import ChatConversation from './ChatConversation'
import LoadingSpinner from './LoadingSpinner'
import PrivacyCheckbox from './PrivacyCheckbox'
import H1 from './base/H1'
import Link from './base/Link'

const Container = styled(Stack)(({ theme }) => ({
  height: '100%',
  gap: 8,

  [theme.breakpoints.up('md')]: {
    height: 600,
  },
})) as typeof Stack

type ChatProps = {
  city: CityModel
  submitMessage: (text: string) => void
  messages: ChatMessageModel[]
  hasError: boolean
  isLoading: boolean
  isTyping: boolean
  privacyPolicyAccepted: boolean
  acceptPrivacyPolicy: () => void
  languageCode: string
}

const Chat = ({
  city,
  messages,
  submitMessage,
  hasError,
  isLoading,
  isTyping,
  privacyPolicyAccepted,
  acceptPrivacyPolicy,
  languageCode,
}: ChatProps): ReactElement => {
  const { t } = useTranslation('chat')
  const [textInput, setTextInput] = useState<string>('')

  const onSubmit = () => {
    submitMessage(textInput)
    setTextInput('')
  }

  const submitDisabled = textInput.trim().length === 0 || hasError || isLoading
  const submitOnEnter = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return
    }
    event.preventDefault()
    if (!submitDisabled) {
      onSubmit()
    }
  }

  if (isLoading && !hasError) {
    return (
      <Container>
        <LoadingSpinner />
        <Stack textAlign='center'>{t('loadingText')}</Stack>
      </Container>
    )
  }

  if (!privacyPolicyAccepted) {
    return (
      <Container>
        <Stack gap={1}>
          <H1>{t('settings:privacyPolicy')}</H1>
          {t('privacyPolicyInformation', { city: city.name, appName: buildConfig().appName })}
          <PrivacyCheckbox
            language={languageCode}
            checked={false}
            setChecked={acceptPrivacyPolicy}
            url={city.chatPrivacyPolicyUrl}
          />
        </Stack>
      </Container>
    )
  }

  return (
    <Container justifyContent='space-between'>
      <ChatConversation messages={messages} isTyping={isTyping} />
      <Stack paddingInline={2} gap={1}>
        {hasError && <Alert severity='error'>{t('errorMessage')}</Alert>}
        <TextField
          id='chat-input'
          label={t('inputLabel')}
          value={textInput}
          onChange={event => setTextInput(event.target.value)}
          onKeyDown={submitOnEnter}
          multiline
          rows={2}
          placeholder={t('chatInputHelperText')}
        />
        <Stack direction='row' alignItems='center' gap={1}>
          <Button onClick={onSubmit} startIcon={<SendIcon />} variant='contained' disabled={submitDisabled} fullWidth>
            {t('sendButton')}
          </Button>
          <Tooltip title={t('layout:tooltip_privacy_policy')}>
            <IconButton
              component={Link}
              to={city.chatPrivacyPolicyUrl ?? buildConfig().privacyUrls.default}
              aria-label={t('layout:privacy')}>
              <MailLock />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Container>
  )
}

export default Chat

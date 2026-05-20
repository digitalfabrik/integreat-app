import InfoIcon from '@mui/icons-material/Info'
import MailLock from '@mui/icons-material/MailLock'
import SendIcon from '@mui/icons-material/Send'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { KeyboardEvent, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ChatMessagesReturn,
  createSendChatMessageEndpoint,
  loadAsync,
  loadFromEndpoint,
  NotFoundError,
  RegionModel,
} from 'shared/api'

import buildConfig from '../constants/buildConfig'
import { cmsApiBaseUrl } from '../constants/urls'
import useLocalStorage, {
  CHAT_HINT_VISIBLE_STORAGE_KEY,
  CHAT_PRIVACY_POLICIES_STORAGE_KEY,
} from '../hooks/useLocalStorage'
import { UseQueryFromEndpointReturn } from '../hooks/useQueryFromEndpoint'
import ChatConversation from './ChatConversation'
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
  response: UseQueryFromEndpointReturn<ChatMessagesReturn>
  chatId: string
  region: RegionModel
  languageCode: string
}

const Chat = ({ response, chatId, region, languageCode }: ChatProps): ReactElement => {
  const [sendingError, setSendingError] = useState<Error | null>(null)
  const [textInput, setTextInput] = useState<string>('')
  const { t } = useTranslation('chat')

  const [chatHintVisible, setChatHintVisible] = useLocalStorage<boolean>({
    key: CHAT_HINT_VISIBLE_STORAGE_KEY,
    initialValue: true,
    isSessionStorage: true,
  })

  const [acceptedPrivacyPolicies, setAcceptedPrivacyPolicies] = useLocalStorage<Record<string, boolean>>({
    key: CHAT_PRIVACY_POLICIES_STORAGE_KEY,
    initialValue: {},
  })
  const privacyPolicyAccepted = acceptedPrivacyPolicies[region.code] ?? false
  const acceptCustomPrivacyPolicy = () =>
    setAcceptedPrivacyPolicies({ ...acceptedPrivacyPolicies, [region.code]: true })

  const { setData, data, isPending } = response
  const botTyping = data?.botTyping ?? false
  const messages = data?.messages ?? []
  // If no message has been sent yet, fetching the messages yields a 404 not found error
  const error = sendingError ?? (response.error instanceof NotFoundError ? null : response.error)

  const submitMessage = (message: string) =>
    loadAsync(
      () =>
        loadFromEndpoint(createSendChatMessageEndpoint, cmsApiBaseUrl, {
          regionCode: region.code,
          language: languageCode,
          message,
          deviceId: chatId,
        }),
      {
        setData,
        setError: setSendingError,
      },
    ).catch(reportError)

  const onSubmit = () => {
    submitMessage(textInput)
    setTextInput('')
  }

  const submitDisabled = textInput.trim().length === 0 || error != null || isPending
  const submitOnEnter = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return
    }
    event.preventDefault()
    if (!submitDisabled) {
      onSubmit()
    }
  }

  if (!privacyPolicyAccepted) {
    return (
      <Container>
        <Stack paddingInline={3} gap={1}>
          <H1>{t('settings:privacyPolicy')}</H1>
          {t('privacyPolicyInformation')}
          <PrivacyCheckbox
            language={languageCode}
            checked={false}
            setChecked={acceptCustomPrivacyPolicy}
            url={region.chatPrivacyPolicyUrl}
          />
        </Stack>
      </Container>
    )
  }

  return (
    <Container justifyContent='space-between'>
      <ChatConversation messages={messages} isTyping={botTyping} loading={isPending} />
      <Stack paddingInline={2} gap={1}>
        {error && <Alert severity='error'>{t('errorMessage')}</Alert>}
        {chatHintVisible && (
          <Alert severity='info' icon={<InfoIcon />} onClose={() => setChatHintVisible(false)}>
            <Typography variant='body2'>{t('conversationHelperText')}</Typography>
          </Alert>
        )}
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
          <Tooltip title={t('settings:privacyPolicy')}>
            <IconButton
              component={Link}
              to={region.chatPrivacyPolicyUrl ?? buildConfig().privacyUrls.default}
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

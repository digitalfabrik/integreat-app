import InfoIcon from '@mui/icons-material/Info'
import RefreshIcon from '@mui/icons-material/Refresh'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ChatMessageModel,
  ChatMessagesReturn,
  createSendChatMessageEndpoint,
  fromError,
  loadAsync,
  loadFromEndpoint,
  NotFoundError,
  RegionModel,
  SerializedChatMessage,
} from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import useLocalStorage, {
  CHAT_HINT_VISIBLE_STORAGE_KEY,
  CHAT_PRIVACY_POLICIES_STORAGE_KEY,
} from '../hooks/useLocalStorage'
import { UseQueryFromEndpointReturn } from '../hooks/useQueryFromEndpoint'
import { captureError } from '../utils/sentry'
import ChatConversation from './ChatConversation'
import ChatInput from './ChatInput'
import PrivacyCheckbox from './PrivacyCheckbox'
import H1 from './base/H1'

const Container = styled(Stack)(({ theme }) => ({
  height: '100%',
  gap: 8,

  [theme.breakpoints.up('md')]: {
    height: 600,
  },
})) as typeof Stack

type ChatProps = {
  response: UseQueryFromEndpointReturn<ChatMessagesReturn>
  serializedUnsyncedMessages: SerializedChatMessage[]
  setUnsyncedMessages: (messages: SetStateAction<SerializedChatMessage[]>) => void
  chatId: string
  region: RegionModel
  languageCode: string
}

const Chat = ({
  response,
  setUnsyncedMessages,
  serializedUnsyncedMessages,
  chatId,
  region,
  languageCode,
}: ChatProps): ReactElement => {
  const [sendingError, setSendingError] = useState<Error | null>(null)
  const [textInput, setTextInput] = useState<string>('')
  const { t } = useTranslation(['chat', 'error'])

  const unsyncedMessages = serializedUnsyncedMessages.map(ChatMessageModel.deserialize)

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

  const { setData, data, isPending, refetch } = response
  const botTyping = data?.botTyping ?? false
  const messages = [...(data?.messages ?? []), ...unsyncedMessages].sort(
    (a, b) => a.created.toMillis() - b.created.toMillis(),
  )
  // If no message has been sent yet, fetching the messages yields a 404 not found error
  const error = response.error instanceof NotFoundError ? null : response.error

  const submitMessage = (
    message: string,
    { onSuccess, isRetry = false }: { onSuccess?: () => void; isRetry?: boolean } = {},
  ) =>
    loadAsync(
      () =>
        loadFromEndpoint(createSendChatMessageEndpoint, cmsApiBaseUrl, {
          regionCode: region.code,
          language: languageCode,
          message,
          deviceId: chatId,
        }),
      {
        setData: newData => {
          if (newData) {
            setData(newData)
            onSuccess?.()
            setSendingError(null)
            refetch().catch(captureError)
          }
        },
        setError: error => {
          setSendingError(error)
          if (error && !isRetry) {
            setUnsyncedMessages(previous => [...previous, ChatMessageModel.unsyncedMessage(message)])
          }
        },
      },
    )

  const onSubmit = () => {
    submitMessage(textInput).catch(captureError)
    setTextInput('')
  }

  const retry = async () => {
    await refetch()
    setSendingError(null)
  }

  const retrySend = (message: ChatMessageModel) => {
    submitMessage(message.content, {
      onSuccess: () => {
        setUnsyncedMessages(serializedUnsyncedMessages.filter(serialized => serialized.id !== message.id))
      },
      isRetry: true,
    }).catch(captureError)
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
      <ChatConversation retrySend={retrySend} messages={messages} isTyping={botTyping} loading={isPending} />
      <Stack paddingInline={2} gap={1}>
        {(error || sendingError) && (
          <Alert
            severity='error'
            action={
              <Tooltip title={t('error:tryAgain')}>
                <IconButton onClick={retry} aria-label={t('error:tryAgain')} size='small'>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            }>
            {t(fromError(error ?? sendingError), { ns: 'error' })}
          </Alert>
        )}
        {chatHintVisible && (
          <Alert severity='info' icon={<InfoIcon />} onClose={() => setChatHintVisible(false)}>
            <Typography variant='body2'>{t('conversationHelperText')}</Typography>
          </Alert>
        )}
        <ChatInput value={textInput} setValue={setTextInput} onSubmit={onSubmit} region={region} />
      </Stack>
    </Container>
  )
}

export default Chat

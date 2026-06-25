import { dialogContentClasses } from '@mui/material/DialogContent'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useContext, useEffect } from 'react'
import { useSearchParams } from 'react-router'

import {
  getChatName,
  CHAT_QUERY_KEY,
  CHAT_TYPING_POLLING_INTERVAL,
  CHAT_DEFAULT_POLLING_INTERVAL,
  uuid,
  parseQueryParams,
} from 'shared'
import { createChatMessagesEndpoint, RegionModel, SerializedChatMessage } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import { cmsApiBaseUrl } from '../constants/urls'
import { TtsContext } from '../contexts/TtsContext'
import useDimensions from '../hooks/useDimensions'
import useIsTabActive from '../hooks/useIsTabActive'
import useLocalStorage, { CHAT_UNSYNCED_MESSAGES_STORAGE_KEY } from '../hooks/useLocalStorage'
import useLockedBody from '../hooks/useLockedBody'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'
import useQueryParamVisibility from '../hooks/useQueryParamVisibility'
import { chatIdKey, chatSeenMessagesKey } from '../utils/chat'
import Chat from './Chat'
import ChatFab from './ChatFab'
import ChatMenu from './ChatMenu'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import { LanguageChangePath } from './LanguageSelection'
import Dialog from './base/Dialog'

const StyledDialog = styled(Dialog)({
  [`.${dialogContentClasses.root}`]: {
    padding: '0 0 16px',
  },
})

type ChatContainerProps = {
  region: RegionModel
  languageCode: string
  languageChangePaths: LanguageChangePath[] | null
}

const ChatContainer = ({ region, languageCode, languageChangePaths }: ChatContainerProps): ReactElement | null => {
  const { open, close, openUrl, visible } = useQueryParamVisibility(CHAT_QUERY_KEY)
  const externalChatId = parseQueryParams(useSearchParams()[0]).chatId
  const { xsmall } = useDimensions()
  const { visible: ttsPlayerVisible } = useContext(TtsContext)
  const isBrowserTabActive = useIsTabActive()
  useLockedBody(visible)

  const [storageChatId, setChatId] = useLocalStorage<string>({
    key: chatIdKey(region.code),
    initialValue: uuid(),
  })
  const chatId = externalChatId ?? storageChatId

  const [unsyncedMessages, setUnsyncedMessages] = useLocalStorage<SerializedChatMessage[]>({
    key: CHAT_UNSYNCED_MESSAGES_STORAGE_KEY,
    initialValue: [],
  })
  const [seenMessages, setSeenMessages] = useLocalStorage<number>({
    key: chatSeenMessagesKey(region.code),
    initialValue: 0,
  })

  const response = useQueryFromEndpoint(
    createChatMessagesEndpoint,
    cmsApiBaseUrl,
    {
      regionCode: region.code,
      languageCode,
      chatId,
    },
    { cached: false },
  )

  const { data, refetch } = response
  const botTyping = data?.botTyping
  const ticketUrl = data?.ticketUrl ?? null
  const messageCount = data?.messages.length ?? 0
  const incomingMessageCount = data?.messages.filter(message => !message.userIsAuthor).length ?? 0
  const unreadMessageCount = incomingMessageCount - seenMessages

  useEffect(() => {
    if (visible && incomingMessageCount > seenMessages) {
      setSeenMessages(incomingMessageCount)
    }
  }, [incomingMessageCount, seenMessages, setSeenMessages, visible])

  useEffect(() => {
    if (!isBrowserTabActive || messageCount === 0) {
      return undefined
    }
    const interval = setInterval(refetch, botTyping ? CHAT_TYPING_POLLING_INTERVAL : CHAT_DEFAULT_POLLING_INTERVAL)
    return () => clearInterval(interval)
  }, [refetch, isBrowserTabActive, messageCount, botTyping])

  const resetChat = () => {
    setUnsyncedMessages([])
    setChatId(uuid())
    setSeenMessages(0)
  }

  const hideChatButton = xsmall && ttsPlayerVisible
  if (hideChatButton) {
    return null
  }

  if (visible) {
    const chatName = getChatName(buildConfig().appName)
    const chatLanguageChangePaths =
      languageChangePaths?.map(({ path, ...rest }) => ({ ...rest, path: openUrl(path) })) ?? []

    return (
      <StyledDialog
        title={chatName}
        close={close}
        actions={[
          ...(languageChangePaths
            ? [
                <HeaderLanguageSelectorItem
                  key='languageChange'
                  languageChangePaths={chatLanguageChangePaths}
                  languageCode={languageCode}
                />,
              ]
            : []),
          <ChatMenu key='chatMenu' chatId={chatId} ticketUrl={ticketUrl} resetChat={resetChat} />,
        ]}>
        <Chat
          chatId={chatId}
          region={region}
          languageCode={languageCode}
          response={response}
          serializedUnsyncedMessages={unsyncedMessages}
          setUnsyncedMessages={setUnsyncedMessages}
        />
      </StyledDialog>
    )
  }

  return <ChatFab onClick={open} unreadMessageCount={unreadMessageCount} />
}

export default ChatContainer

import { dialogContentClasses } from '@mui/material/DialogContent'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useContext } from 'react'
import { useSearchParams } from 'react-router'

import { getChatName, CHAT_QUERY_KEY, parseQueryParams, toQueryParams } from 'shared'
import { RegionModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import { TtsContext } from '../contexts/TtsContext'
import useDimensions from '../hooks/useDimensions'
import useLocalStorage from '../hooks/useLocalStorage'
import useLockedBody from '../hooks/useLockedBody'
import { chatIdKey, generateChatId } from '../utils/chat'
import ChatController from './ChatController'
import ChatFab from './ChatFab'
import ChatMenu from './ChatMenu'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import { LanguageChangePath } from './LanguageList'
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
  const [queryParams, setQueryParams] = useSearchParams()
  const chatVisible = parseQueryParams(queryParams).chat ?? false
  const { xsmall } = useDimensions()
  const { visible: ttsPlayerVisible } = useContext(TtsContext)
  useLockedBody(chatVisible)

  const [chatId, setChatId] = useLocalStorage<string>({
    key: chatIdKey(region.code),
    initialValue: generateChatId(),
  })

  const openChat = () => {
    const newQueryParams = queryParams
    newQueryParams.set(CHAT_QUERY_KEY, 'true')
    setQueryParams(newQueryParams)
  }

  const closeChat = () => {
    const newQueryParams = queryParams
    newQueryParams.delete(CHAT_QUERY_KEY)
    setQueryParams(newQueryParams)
  }

  const hideChatButton = xsmall && ttsPlayerVisible
  if (hideChatButton) {
    return null
  }

  if (chatVisible) {
    const chatName = getChatName(buildConfig().appName)
    const chatQuery = toQueryParams({ chat: true }).toString()
    const chatLanguageChangePaths =
      languageChangePaths?.map(({ path, ...rest }) => ({
        ...rest,
        path: path ? `${path}?${chatQuery}` : null,
      })) ?? []

    return (
      <StyledDialog
        title={chatName}
        close={closeChat}
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
          <ChatMenu key='chatMenu' chatId={chatId} updateChatId={setChatId} />,
        ]}>
        <ChatController chatId={chatId} region={region} languageCode={languageCode} />
      </StyledDialog>
    )
  }

  return <ChatFab onClick={openChat} />
}

export default ChatContainer

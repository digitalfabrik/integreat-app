import { dialogContentClasses } from '@mui/material/DialogContent'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useContext } from 'react'

import { getChatName, CHAT_QUERY_KEY } from 'shared'
import { RegionModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import { TtsContext } from '../contexts/TtsContext'
import useDimensions from '../hooks/useDimensions'
import useLocalStorage from '../hooks/useLocalStorage'
import useLockedBody from '../hooks/useLockedBody'
import useQueryParamVisibility from '../hooks/useQueryParamVisibility'
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
  const { open, close, openUrl, visible } = useQueryParamVisibility(CHAT_QUERY_KEY)
  const { xsmall } = useDimensions()
  const { visible: ttsPlayerVisible } = useContext(TtsContext)
  useLockedBody(visible)

  const [chatId, setChatId] = useLocalStorage<string>({
    key: chatIdKey(region.code),
    initialValue: generateChatId(),
  })

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
          <ChatMenu key='chatMenu' chatId={chatId} updateChatId={setChatId} />,
        ]}>
        <ChatController chatId={chatId} region={region} languageCode={languageCode} />
      </StyledDialog>
    )
  }

  return <ChatFab onClick={open} />
}

export default ChatContainer

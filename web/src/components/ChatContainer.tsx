import { dialogClasses } from '@mui/material/Dialog'
import { dialogContentClasses } from '@mui/material/DialogContent'
import { dialogTitleClasses } from '@mui/material/DialogTitle'
import { stackClasses } from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { getChatName, CHAT_QUERY_KEY, parseQueryParams } from 'shared'
import { RegionModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import { UseChatReturn } from '../hooks/useChat'
import useLockedBody from '../hooks/useLockedBody'
import useQueryParam from '../hooks/useQueryParam'
import { openUrlInNewTab } from '../utils/openLink'
import Chat from './Chat'
import { ChatLogoAvatar } from './ChatAvatar'
import ChatMenu from './ChatMenu'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import { LanguageChangePath } from './LanguageSelection'
import Dialog from './base/Dialog'

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`.${dialogClasses.paper} > .${stackClasses.root}`]: {
    margin: 0,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.accent,
    borderBottom: `1px solid ${theme.palette.divider}`,

    [`.${dialogTitleClasses.root}`]: {
      padding: theme.spacing(1),
    },
  },
  [`.${dialogContentClasses.root}`]: {
    padding: theme.spacing(0, 0, 2),
    backgroundColor: theme.palette.background.paper,
  },
}))

type ChatContainerProps = {
  region: RegionModel
  languageCode: string
  languageChangePaths: LanguageChangePath[] | null
  chatProps: UseChatReturn
}

const ChatContainer = ({
  region,
  languageCode,
  languageChangePaths,
  chatProps,
}: ChatContainerProps): ReactElement | null => {
  const [open, setOpen] = useQueryParam(CHAT_QUERY_KEY)
  const [queryParams] = useSearchParams()
  const { t } = useTranslation()
  useLockedBody(open)

  const { chatId, response, markAsSeen, resetChat, serializedUnsyncedMessages, setUnsyncedMessages } = chatProps

  useEffect(() => {
    if (open) {
      markAsSeen()
    }
  }, [open, markAsSeen])

  if (!open) {
    return null
  }

  const externalChatId = parseQueryParams(queryParams).chatId
  const chatName = getChatName(buildConfig().appName)

  return (
    <StyledDialog
      title={chatName}
      subtitle={t($ => $.chat.subtitle)}
      icon={<ChatLogoAvatar />}
      close={() => setOpen(undefined)}
      showHeader={!externalChatId}
      minimize
      actions={[
        ...(languageChangePaths
          ? [
              <HeaderLanguageSelectorItem
                key='languageChange'
                languageChangePaths={languageChangePaths}
                languageCode={languageCode}
                feedbackAvailable
              />,
            ]
          : []),
        <ChatMenu key='chatMenu' chatId={chatId} resetChat={resetChat} />,
      ]}>
      <Chat
        chatId={chatId}
        region={region}
        languageCode={languageCode}
        response={response}
        serializedUnsyncedMessages={serializedUnsyncedMessages}
        setUnsyncedMessages={setUnsyncedMessages}
        openUrl={externalChatId ? openUrlInNewTab : null}
      />
    </StyledDialog>
  )
}

export default ChatContainer

import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined'
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import { dialogContentClasses } from '@mui/material/DialogContent'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { getChatName, CHAT_QUERY_KEY, parseQueryParams } from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'
import useLocalStorage from '../hooks/useLocalStorage'
import useLockedBody from '../hooks/useLockedBody'
import ChatController, { LOCAL_STORAGE_ITEM_CHAT_MESSAGES } from './ChatController'
import ChatMenu from './ChatMenu'
import MenuItem from './MenuItem'
import { TtsContext } from './TtsContainer'
import Dialog from './base/Dialog'

const ChatButtonContainer = styled('div')<{ bottom: number }>`
  position: fixed;
  bottom: ${props => props.bottom}px;
  inset-inline-end: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min-content;
  gap: 8px;
`

const StyledDialog = styled(Dialog)({
  [`.${dialogContentClasses.root}`]: {
    padding: '0 0 16px',
  },
})

type ChatContainerProps = {
  city: CityModel
  language: string
}

const ChatContainer = ({ city, language }: ChatContainerProps): ReactElement | null => {
  const [queryParams, setQueryParams] = useSearchParams()
  const initialChatVisibility = parseQueryParams(queryParams).chat ?? false
  const [chatVisible, setChatVisible] = useState(initialChatVisibility)
  const [messagesCount, setMessagesCount] = useState(0)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const { desktop, xsmall, visibleFooterHeight, bottomNavigationHeight } = useDimensions()
  const { visible: ttsPlayerVisible } = useContext(TtsContext)
  const { t } = useTranslation('chat')
  const chatName = getChatName(buildConfig().appName)
  useLockedBody(chatVisible)

  const { value: deviceId, updateLocalStorageItem: updateDeviceId } = useLocalStorage({
    key: `${LOCAL_STORAGE_ITEM_CHAT_MESSAGES}-${city.code}`,
    initialValue: window.crypto.randomUUID(),
  })

  const resetChatId = () => {
    if (messagesCount > 0) {
      updateDeviceId(window.crypto.randomUUID())
    }
    setConfirmDialogOpen(false)
  }

  const hideChatButton = xsmall && ttsPlayerVisible

  useEffect(() => {
    if (queryParams.has(CHAT_QUERY_KEY)) {
      const newQueryParams = queryParams
      queryParams.delete(CHAT_QUERY_KEY)
      setQueryParams(newQueryParams, { replace: true })
    }
  }, [queryParams, setQueryParams])

  if (hideChatButton) {
    return null
  }

  if (chatVisible) {
    return (
      <StyledDialog
        title={chatName}
        close={() => setChatVisible(false)}
        headerAction={
          <ChatMenu
            confirmNewChatOpen={confirmDialogOpen}
            onConfirmClose={() => setConfirmDialogOpen(false)}
            onConfirmNewChat={resetChatId}>
            <MenuItem
              text={t('newChat')}
              icon={<AddCommentOutlinedIcon fontSize='small' />}
              disabled={messagesCount === 0}
              onClick={() => setConfirmDialogOpen(true)}
            />
          </ChatMenu>
        }>
        <ChatController key={deviceId} city={city} language={language} onMessagesChange={setMessagesCount} />
      </StyledDialog>
    )
  }

  return (
    <ChatButtonContainer bottom={bottomNavigationHeight ?? visibleFooterHeight}>
      <Fab onClick={() => setChatVisible(true)} color='primary' aria-label={chatName}>
        <QuestionAnswerOutlinedIcon fontSize='large' />
      </Fab>
      {desktop && (
        <Typography textAlign='center' aria-hidden>
          {chatName}
        </Typography>
      )}
    </ChatButtonContainer>
  )
}

export default ChatContainer

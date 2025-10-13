import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import { dialogContentClasses } from '@mui/material/DialogContent'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { getChatName, CHAT_QUERY_KEY, parseQueryParams } from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'
import useLockedBody from '../hooks/useLockedBody'
import ChatController from './ChatController'
import { TtsContext } from './TtsContainer'
import Dialog from './base/Dialog'

const ChatButtonContainer = styled('div')`
  position: fixed;
  bottom: ${props => props.theme.dimensions.bottomNavigationHeight ?? props.theme.dimensions.visibleFooterHeight}px;
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
    paddingTop: 0,
  },
})

const ChatActionButton = styled(Fab)`
  &:hover {
    background-color: ${props => props.theme.palette.secondary.main};
  }
`

type ChatContainerProps = {
  city: CityModel
  language: string
}

const ChatContainer = ({ city, language }: ChatContainerProps): ReactElement | null => {
  const [queryParams, setQueryParams] = useSearchParams()
  const initialChatVisibility = parseQueryParams(queryParams).chat ?? false
  const [chatVisible, setChatVisible] = useState(initialChatVisibility)
  const { desktop, xsmall } = useDimensions()
  const { visible: ttsPlayerVisible } = useContext(TtsContext)
  const chatName = getChatName(buildConfig().appName)
  useLockedBody(chatVisible)

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
      <StyledDialog title={chatName} close={() => setChatVisible(false)}>
        <ChatController city={city} language={language} />
      </StyledDialog>
    )
  }

  return (
    <ChatButtonContainer>
      <ChatActionButton onClick={() => setChatVisible(true)} color='primary' aria-label={chatName}>
        <QuestionAnswerOutlinedIcon fontSize='large' />
      </ChatActionButton>
      {desktop && (
        <Typography textAlign='center' aria-hidden>
          {chatName}
        </Typography>
      )}
    </ChatButtonContainer>
  )
}

export default ChatContainer

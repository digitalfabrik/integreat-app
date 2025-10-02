import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import Fab from '@mui/material/Fab'
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
import Icon from './base/Icon'

const ChatButtonContainer = styled('div')`
  position: fixed;
  bottom: ${props => props.theme.dimensions.bottomNavigationHeight ?? props.theme.dimensions.visibleFooterHeight}px;
  inset-inline-end: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min-content;
`

const StyledIcon = styled(Icon)`
  display: flex;
  width: 40px;
  height: 40px;
  align-self: center;
  justify-content: center;
  color: ${props => props.theme.legacy.colors.backgroundColor};
`

const ChatTitle = styled('span')`
  text-align: center;
  margin-top: 8px;
  color: ${props => props.theme.legacy.colors.textColor};
`

const ChatActionButton = styled(Fab)`
  &:hover {
    background-color: ${props => props.theme.legacy.colors.themeColor};
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
      <Dialog title={chatName} close={() => setChatVisible(false)}>
        <ChatController city={city} language={language} />
      </Dialog>
    )
  }

  return (
    <ChatButtonContainer>
      <ChatActionButton onClick={() => setChatVisible(true)} color='primary'>
        <StyledIcon src={QuestionAnswerOutlinedIcon} title={chatName} />
      </ChatActionButton>
      {desktop && <ChatTitle>{chatName}</ChatTitle>}
    </ChatButtonContainer>
  )
}

export default ChatContainer

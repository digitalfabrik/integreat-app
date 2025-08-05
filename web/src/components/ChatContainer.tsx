import styled from '@emotion/styled'
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import Fab from '@mui/material/Fab'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { getChatName, CHAT_QUERY_KEY, parseQueryParams } from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useLockedBody from '../hooks/useLockedBody'
import useWindowDimensions from '../hooks/useWindowDimensions'
import ChatController from './ChatController'
import ChatModal from './ChatModal'
import { TtsContext } from './TtsContainer'
import Icon from './base/Icon'

const CHAT_BUTTON_SIZE = 48

const ChatButtonContainer = styled.div<{ bottom: number }>`
  position: fixed;
  bottom: ${props => props.bottom}px;
  inset-inline-end: 16px;
  margin-bottom: 8px;
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

const ChatTitle = styled.span`
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

const ChatContainer = ({ city, language }: ChatContainerProps): ReactElement => {
  const [queryParams, setQueryParams] = useSearchParams()
  const initialChatVisibility = parseQueryParams(queryParams).chat ?? false
  const [chatVisible, setChatVisible] = useState(initialChatVisibility)
  const { viewportSmall, visibleFooterHeight, width } = useWindowDimensions()
  const { visible: ttsPlayerVisible } = useContext(TtsContext)
  const chatName = getChatName(buildConfig().appName)
  useLockedBody(chatVisible)

  const bottom =
    ttsPlayerVisible && width <= dimensions.maxTtsPlayerWidth
      ? visibleFooterHeight + dimensions.ttsPlayerHeight + CHAT_BUTTON_SIZE
      : visibleFooterHeight

  useEffect(() => {
    if (queryParams.has(CHAT_QUERY_KEY)) {
      const newQueryParams = queryParams
      queryParams.delete(CHAT_QUERY_KEY)
      setQueryParams(newQueryParams, { replace: true })
    }
  }, [queryParams, setQueryParams])

  if (chatVisible) {
    return (
      <ChatModal title={chatName} closeModal={() => setChatVisible(false)}>
        <ChatController city={city} language={language} />
      </ChatModal>
    )
  }

  return (
    <ChatButtonContainer bottom={bottom}>
      <ChatActionButton onClick={() => setChatVisible(true)} color='primary'>
        <StyledIcon src={QuestionAnswerOutlinedIcon} title={chatName} />
      </ChatActionButton>
      {!viewportSmall && <ChatTitle>{chatName}</ChatTitle>}
    </ChatButtonContainer>
  )
}

export default ChatContainer

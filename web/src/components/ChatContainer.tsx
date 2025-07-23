import styled from '@emotion/styled'
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import { Fab } from '@mui/material'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { CHAT_QUERY_KEY, parseQueryParams } from 'shared'

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
  inset-inline-end: 32px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${props => props.theme.breakpoints.down('md')} {
    inset-inline-end: 12px;
  }
`

const StyledIcon = styled(Icon)`
  display: flex;
  width: 24px;
  height: 24px;
  align-self: center;
  justify-content: center;
  color: ${props => props.theme.colors.backgroundColor};

  ${props => props.theme.breakpoints.down('md')} {
    width: 40px;
    height: 40px;
  }
`

const ChatTitle = styled.span`
  margin-top: 8px;
  color: ${props => props.theme.colors.textColor};
`

const ChatActionButton = styled(Fab)`
  &:hover {
    background-color: ${props => props.theme.colors.themeColor};
  }
`

type ChatContainerProps = {
  city: string
  language: string
}

const ChatContainer = ({ city, language }: ChatContainerProps): ReactElement => {
  const [queryParams, setQueryParams] = useSearchParams()
  const initialChatVisibility = parseQueryParams(queryParams).chat ?? false
  const [chatVisible, setChatVisible] = useState(initialChatVisibility)
  const { viewportSmall, visibleFooterHeight, width } = useWindowDimensions()
  const { visible: ttsPlayerVisible } = useContext(TtsContext)
  const { t } = useTranslation('chat')
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
      <ChatModal title={t('header', { appName: buildConfig().appName })} closeModal={() => setChatVisible(false)}>
        <ChatController city={city} language={language} />
      </ChatModal>
    )
  }

  return (
    <ChatButtonContainer bottom={bottom}>
      <ChatActionButton onClick={() => setChatVisible(true)} color='primary'>
        <StyledIcon src={QuestionAnswerOutlinedIcon} title={t('chat')} />
      </ChatActionButton>
      {!viewportSmall && <ChatTitle>{t('chat')}</ChatTitle>}
    </ChatButtonContainer>
  )
}

export default ChatContainer

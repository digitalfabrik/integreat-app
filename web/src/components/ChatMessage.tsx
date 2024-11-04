import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import ChatMessageModel from 'shared/api/models/ChatMessageModel'

import { ChatBot, ChatPerson } from '../assets'
import RemoteContent from './RemoteContent'
import Icon from './base/Icon'

const Message = styled.div`
  border-radius: 5px;
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.textDecorationColor};
  flex-basis: 70%;

  & > div > a {
    line-break: anywhere;
  }
`

const Container = styled.div<{ $isAuthor: boolean }>`
  display: flex;
  ${props => (props.$isAuthor ? 'flex-direction:row-reverse' : 'flex-direction:row')};
  margin-bottom: 12px;
  gap: 8px;
`

const IconContainer = styled.div<{ $visible: boolean }>`
  opacity: ${props => (props.$visible ? 1 : 0)};
  height: 25px;
  width: 25px;
  display: flex;
`

const Circle = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.textColor};
  border-radius: 50%;
  height: 18px;
  width: 18px;
  color: ${props => props.theme.colors.backgroundColor};
  justify-content: center;
  align-items: center;
  padding: 4px;
  font-size: ${props => props.theme.fonts.decorativeFontSizeSmall};
`

type ChatMessageProps = { message: ChatMessageModel; showIcon: boolean }

const getIcon = (userIsAuthor: boolean, isAutomaticAnswer: boolean, t: TFunction<'chat'>): ReactElement => {
  if (userIsAuthor) {
    return <Circle>{t('user')}</Circle>
  }
  const icon = isAutomaticAnswer ? ChatBot : ChatPerson
  return <Icon src={icon} />
}

const ChatMessage = ({ message, showIcon }: ChatMessageProps): ReactElement => {
  const navigate = useNavigate()
  const { t } = useTranslation('chat')
  const { body, userIsAuthor, isAutomaticAnswer } = message

  return (
    <Container $isAuthor={userIsAuthor}>
      <IconContainer $visible={showIcon}>{getIcon(userIsAuthor, isAutomaticAnswer, t)}</IconContainer>
      <Message data-testid={message.id}>
        <RemoteContent html={body} onInternalLinkClick={navigate} smallText />
      </Message>
    </Container>
  )
}

export default ChatMessage

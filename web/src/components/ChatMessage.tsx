import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import buildConfig from '../constants/buildConfig'
import RemoteContent from './RemoteContent'
import { ChatMessageType } from './__mocks__/ChatMessages'
import Icon from './base/Icon'

const Message = styled.div<{ isAuthor: boolean }>`
  border-radius: 5px;
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.textDecorationColor};
  flex-basis: 70%;
`

const Container = styled.div<{ isAuthor: boolean }>`
  display: flex;
  ${props => (props.isAuthor ? 'flex-direction:row-reverse' : 'flex-direction:row')};
  margin-bottom: 12px;
  gap: 8px;
`

const IconContainer = styled.div<{ visible: boolean }>`
  opacity: ${props => (props.visible ? 1 : 0)};
  height: 24px;
  width: 24px;
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

type ChatMessageProps = { message: ChatMessageType; showIcon: boolean }

const ChatMessage = ({ message, showIcon }: ChatMessageProps): ReactElement => {
  const { icons } = buildConfig()
  const navigate = useNavigate()
  const { t } = useTranslation('chatbot')
  const { body, userIsAuthor } = message
  return (
    <Container isAuthor={userIsAuthor}>
      <IconContainer visible={showIcon}>
        {userIsAuthor ? <Circle>{t('user')}</Circle> : <Icon src={icons.appLogoMobile} />}
      </IconContainer>
      <Message isAuthor={userIsAuthor}>
        <RemoteContent html={body} onInternalLinkClick={navigate} smallText />
      </Message>
    </Container>
  )
}

export default ChatMessage

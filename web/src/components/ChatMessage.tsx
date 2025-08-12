import styled from '@emotion/styled'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ChatMessageModel } from 'shared/api'

import RemoteContent from './RemoteContent'
import Icon from './base/Icon'

export const Message = styled.div`
  color: ${props => props.theme.legacy.colors.textColor};
  border-radius: 5px;
  padding: 8px;
  border: 1px solid ${props => props.theme.legacy.colors.textDecorationColor};
  max-width: 70%;
  width: max-content;

  & > div > a {
    line-break: anywhere;
  }
`
const StyledChatIcon = styled(Icon)`
  background-color: ${props => props.theme.legacy.colors.themeColor};
  color: black;
  border-radius: 4px;
`

const Container = styled.div<{ isAuthor: boolean }>`
  display: flex;
  flex-direction: ${props => (props.isAuthor ? 'row-reverse' : 'row')};
  margin-bottom: 12px;
  gap: 8px;
`

const IconContainer = styled.div<{ visible: boolean }>`
  opacity: ${props => (props.visible ? 1 : 0)};
`

const Circle = styled.div`
  display: flex;
  background-color: ${props => props.theme.legacy.colors.textColor};
  border-radius: 50%;
  height: 18px;
  width: 18px;
  color: ${props => props.theme.legacy.colors.backgroundColor};
  justify-content: center;
  align-items: center;
  padding: 4px;
  font-size: ${props => props.theme.legacy.fonts.decorativeFontSizeSmall};
`

const getIcon = (userIsAuthor: boolean, isAutomaticAnswer: boolean, t: TFunction<'chat'>): ReactElement => {
  if (userIsAuthor) {
    return <Circle>{t('user')}</Circle>
  }
  const icon = isAutomaticAnswer ? SmartToyOutlinedIcon : PersonOutlinedIcon
  return <StyledChatIcon src={icon} title={isAutomaticAnswer ? t('bot') : t('human')} />
}

type InnerChatMessageProps = {
  userIsAuthor: boolean
  showIcon: boolean
  isAutomaticAnswer: boolean
  content: string
  messageId: number
}

export const InnerChatMessage = ({
  userIsAuthor,
  showIcon,
  isAutomaticAnswer,
  content,
  messageId,
}: InnerChatMessageProps): ReactElement => {
  const { t } = useTranslation('chat')
  return (
    <Container isAuthor={userIsAuthor}>
      <IconContainer visible={showIcon}>{getIcon(userIsAuthor, isAutomaticAnswer, t)}</IconContainer>
      <Message data-testid={messageId}>
        <RemoteContent html={content} smallText />
      </Message>
    </Container>
  )
}

type ChatMessageProps = { message: ChatMessageModel; previousMessage: ChatMessageModel | undefined }

const ChatMessage = ({ message, previousMessage }: ChatMessageProps): ReactElement => {
  const { content, userIsAuthor, isAutomaticAnswer } = message
  const hasAuthorChanged = message.userIsAuthor !== previousMessage?.userIsAuthor
  const hasAutomaticAnswerChanged = message.isAutomaticAnswer !== previousMessage?.isAutomaticAnswer
  const showIcon = hasAuthorChanged || hasAutomaticAnswerChanged

  return (
    <InnerChatMessage
      userIsAuthor={userIsAuthor}
      showIcon={showIcon}
      isAutomaticAnswer={isAutomaticAnswer}
      content={content}
      messageId={message.id}
    />
  )
}

export default ChatMessage

import shouldForwardProp from '@emotion/is-prop-valid'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import RefreshIcon from '@mui/icons-material/Refresh'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ChatMessageModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import RemoteContent from './RemoteContent'
import Svg from './base/Svg'

export const Message = styled('div', { shouldForwardProp })<{ userIsAuthor: boolean }>(({ theme, userIsAuthor }) => ({
  maxWidth: '70%',
  width: 'max-content',
  padding: 16,
  borderRadius: 8,
  wordBreak: 'break-word',
  ...(theme.isContrastTheme
    ? {
        backgroundColor: userIsAuthor ? theme.palette.background.accent : theme.palette.background.chatMessage,
        border: `1px solid ${theme.palette.divider}`,
      }
    : { backgroundColor: userIsAuthor ? theme.palette.grey[100] : theme.palette.background.accent }),
}))

const RetryButton = styled(IconButton)({
  height: 40,
  alignSelf: 'center',
})

const StyledAvatar = styled(Avatar, { shouldForwardProp })<{ visible: boolean }>(({ theme, visible }) => ({
  opacity: visible ? 1 : 0,
  width: 40,
  height: 40,
  backgroundColor: theme.isContrastTheme ? theme.palette.text.primary : theme.palette.tertiary.dark,
}))

const CenteredSvg = styled(Svg)({
  '& svg': {
    display: 'block',
  },
})

type MessageAvatarProps = {
  userIsAuthor: boolean
  isAutomaticAnswer: boolean
  visible: boolean
}

const MessageAvatar = ({ userIsAuthor, isAutomaticAnswer, visible }: MessageAvatarProps): ReactElement => {
  const { t } = useTranslation('chat')
  const theme = useTheme()
  const label = t(isAutomaticAnswer ? 'bot' : 'consultant')
  const appLogo = buildConfig().icons.appLogoMobileInverted

  if (userIsAuthor) {
    return <StyledAvatar visible={visible} aria-label={t('user')} />
  }

  let avatarIcon: ReactElement
  if (isAutomaticAnswer && appLogo) {
    avatarIcon = (
      <CenteredSvg src={appLogo} width={40} height={40} overrideFillColors={theme.palette.background.paper} />
    )
  } else if (isAutomaticAnswer) {
    avatarIcon = <SmartToyOutlinedIcon />
  } else {
    avatarIcon = <PersonOutlinedIcon />
  }

  return (
    <Tooltip title={label} disableHoverListener={!visible}>
      <StyledAvatar visible={visible} aria-label={label}>
        {avatarIcon}
      </StyledAvatar>
    </Tooltip>
  )
}

type InnerChatMessageProps = {
  userIsAuthor: boolean
  showAvatar: boolean
  isAutomaticAnswer: boolean
  children: ReactElement
  hint?: ReactElement | null
}

export const InnerChatMessage = ({
  userIsAuthor,
  showAvatar,
  isAutomaticAnswer,
  children,
  hint,
}: InnerChatMessageProps): ReactElement => (
  <Stack direction={userIsAuthor ? 'row-reverse' : 'row'} gap={1}>
    <MessageAvatar userIsAuthor={userIsAuthor} isAutomaticAnswer={isAutomaticAnswer} visible={showAvatar} />
    <Message userIsAuthor={userIsAuthor}>
      <Typography variant='body2' component='div'>
        {children}
      </Typography>
    </Message>
    {hint}
  </Stack>
)

type ChatMessageProps = {
  retrySend: (message: ChatMessageModel) => void
  message: ChatMessageModel
  previousMessage: ChatMessageModel | undefined
  openUrl: ((url: string) => void) | null
}

const ChatMessage = ({ retrySend, message, previousMessage, openUrl }: ChatMessageProps): ReactElement => {
  const { t } = useTranslation('chat')

  const hasAuthorChanged = message.userIsAuthor !== previousMessage?.userIsAuthor
  const hasAutomaticAnswerChanged = message.isAutomaticAnswer !== previousMessage?.isAutomaticAnswer
  const showIcon = hasAuthorChanged || hasAutomaticAnswerChanged

  return (
    <InnerChatMessage
      userIsAuthor={message.userIsAuthor}
      showAvatar={showIcon}
      isAutomaticAnswer={message.isAutomaticAnswer}
      hint={
        !message.synced ? (
          <Tooltip title={t('error:tryAgain')}>
            <RetryButton onClick={() => retrySend(message)} aria-label={t('error:tryAgain')} color='error' size='small'>
              <RefreshIcon />
            </RetryButton>
          </Tooltip>
        ) : null
      }>
      <RemoteContent html={message.content} onLinkClick={openUrl ?? undefined} smallText />
    </InnerChatMessage>
  )
}

export default ChatMessage

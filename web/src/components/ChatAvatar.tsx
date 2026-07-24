import shouldForwardProp from '@emotion/is-prop-valid'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import Svg from './base/Svg'

const DEFAULT_AVATAR_SIZE = 40

const ChatAvatar = styled(Avatar, { shouldForwardProp })<{
  size?: number
  visible?: boolean
}>(({ theme, size = DEFAULT_AVATAR_SIZE, visible = true }) => ({
  opacity: visible ? 1 : 0,
  width: size,
  height: size,
  backgroundColor: theme.isContrastTheme ? theme.palette.text.primary : theme.palette.tertiary.dark,
}))

const CenteredSvg = styled(Svg)({
  '& svg': {
    display: 'block',
  },
})

type ChatLogoAvatarProps = {
  size?: number
  visible?: boolean
}

export const ChatLogoAvatar = ({ size = DEFAULT_AVATAR_SIZE, visible }: ChatLogoAvatarProps): ReactElement => {
  const theme = useTheme()
  const appLogo = buildConfig().icons.appLogoInverted

  return (
    <ChatAvatar size={size} visible={visible}>
      <CenteredSvg src={appLogo} width={size} height={size} overrideFillColors={theme.palette.background.paper} />
    </ChatAvatar>
  )
}

type MessageAvatarProps = {
  userIsAuthor: boolean
  isAutomaticAnswer: boolean
  visible: boolean
}

export const MessageAvatar = ({ userIsAuthor, isAutomaticAnswer, visible }: MessageAvatarProps): ReactElement => {
  const { t } = useTranslation('chat')
  const theme = useTheme()
  const label = t(isAutomaticAnswer ? 'bot' : 'consultant')
  const appLogo = buildConfig().icons.appLogoInverted

  if (userIsAuthor) {
    return <ChatAvatar visible={visible} aria-label={t('user')} />
  }

  return (
    <Tooltip title={label} disableHoverListener={!visible}>
      <ChatAvatar visible={visible} aria-label={label}>
        {isAutomaticAnswer ? (
          <CenteredSvg
            src={appLogo}
            width={DEFAULT_AVATAR_SIZE}
            height={DEFAULT_AVATAR_SIZE}
            overrideFillColors={theme.palette.background.paper}
          />
        ) : (
          <PersonOutlinedIcon />
        )}
      </ChatAvatar>
    </Tooltip>
  )
}

export default ChatAvatar

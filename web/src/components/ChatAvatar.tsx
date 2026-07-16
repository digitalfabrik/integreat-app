import Avatar from '@mui/material/Avatar'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import buildConfig from '../constants/buildConfig'
import Svg from './base/Svg'

export const ChatAvatar = styled(Avatar, { shouldForwardProp: prop => prop !== 'size' })<{
  size: number
  visible?: boolean
}>(({ theme, size, visible = true }) => ({
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

type AppLogoIconProps = {
  size: number
}

export const AppLogoIcon = ({ size }: AppLogoIconProps): ReactElement | null => {
  const theme = useTheme()
  const appLogo = buildConfig().icons.appLogoMobileInverted

  if (!appLogo) {
    return null
  }

  return <CenteredSvg src={appLogo} width={size} height={size} overrideFillColors={theme.palette.background.paper} />
}

import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'

import buildConfig from '../constants/buildConfig'

type FooterProps = {
  children: ReactNode[] | ReactNode
  overlay?: boolean
}

const MarginRightSpacing = 6

const FooterContainer = styled('footer')<{ overlay: boolean }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: ${props => (props.overlay ? 0 : props.theme.spacing(2))};
  padding: ${props => props.theme.spacing(2)};
  box-shadow: ${props => (props.overlay ? '0 2px 3px 3px rgb(0 0 0 / 10%)' : 'none')};
  background-color: ${props => {
    if (props.overlay) {
      return `rgba(255, 255, 255, 0.5)`
    }
    return props.theme.legacy.colors.backgroundAccentColor
  }};

  ${props => props.theme.breakpoints.up('md')} {
    background-color: ${props => (props.overlay ? undefined : props.theme.palette.secondary.light)};
    padding: ${props => (props.overlay ? `0 ${props.theme.spacing(1)}` : '0px 4px')};
    margin-inline-end: ${props => (props.overlay ? props.theme.spacing(MarginRightSpacing) : 0)};
  }
`

/**
 * The standard footer which can supplied to a Layout. Displays a list of links from the props and adds the version
 * number if it's a dev build.
 */

const Footer = ({ children, overlay = false }: FooterProps): ReactElement => (
  <FooterContainer overlay={overlay}>
    {children}
    {buildConfig().featureFlags.developerFriendly && (
      <Typography variant='body2'>
        {__VERSION_NAME__}+{__COMMIT_SHA__}
      </Typography>
    )}
  </FooterContainer>
)

export default Footer

import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'

import buildConfig from '../constants/buildConfig'

type FooterProps = {
  children: ReactNode[] | ReactNode
}

const FooterContainer = styled('footer')`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: ${props => props.theme.spacing(2)};
  background-color: ${props => props.theme.legacy.colors.backgroundAccentColor};
  padding-bottom: ${props => props.theme.spacing(2)};

  ${props => props.theme.breakpoints.up('md')} {
    background-color: ${props => props.theme.palette.secondary.light};
    padding: 0 4px;
  }
`

/**
 * The standard footer which can supplied to a Layout. Displays a list of links from the props and adds the version
 * number if it's a dev build.
 */

const Footer = ({ children }: FooterProps): ReactElement => (
  <FooterContainer>
    {children}
    {buildConfig().featureFlags.developerFriendly && (
      <Typography variant='body2'>
        {__VERSION_NAME__}+{__COMMIT_SHA__}
      </Typography>
    )}
  </FooterContainer>
)

export default Footer

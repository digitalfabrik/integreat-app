import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import buildConfig from '../constants/buildConfig'

type PropsType = {
  children: Array<ReactNode>
  overlay?: boolean
}

const FooterContainer = styled.footer<{ overlay: boolean }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: ${props => (props.overlay ? '0 0 0 10px' : '15px 5px')};
  margin-top: auto;
  background-color: ${props => (props.overlay ? `rgba(255, 255, 255, 0.5)` : props.theme.colors.backgroundAccentColor)};
  box-shadow: 0 2px 3px 3px rgba(0, 0, 0, 0.1);

  ${props => (props.overlay ? 'color: rgba(0, 0, 0, 0.75);' : '')}
  & > * {
    margin: ${props => (props.overlay ? 0 : '5px')};
  }

  & > *:after {
    padding-right: 10px;
    content: '';
  }

  & > *:last-child::after {
    content: '';
  }
`

/**
 * The standard footer which can supplied to a Layout. Displays a list of links from the props and adds the version
 * number if it's a dev build.
 */

const Footer = ({ children, overlay = false }: PropsType): ReactElement => (
  <FooterContainer overlay={overlay}>
    {children}
    {buildConfig().featureFlags.developerFriendly && (
      <span>
        {__VERSION_NAME__}+{__COMMIT_SHA__}
      </span>
    )}
  </FooterContainer>
)

export default Footer

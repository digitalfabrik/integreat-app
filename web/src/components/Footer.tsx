import React, { ReactNode } from 'react'
import styled from 'styled-components'

import buildConfig from '../constants/buildConfig'

type PropsType = {
  children: Array<ReactNode>
}

const FooterContainer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 15px 5px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  box-shadow: 0 2px 3px 3px rgba(0, 0, 0, 0.1);

  & > * {
    @mixin remove-a;
    margin: 5px;
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
class Footer extends React.PureComponent<PropsType> {
  static getVersion(): ReactNode {
    if (buildConfig().featureFlags.developerFriendly) {
      return (
        <span>
          {__VERSION_NAME__}+{__COMMIT_SHA__}
        </span>
      )
    }
    return null
  }

  render(): ReactNode {
    const { children } = this.props
    return (
      <FooterContainer>
        {children}
        {Footer.getVersion()}
      </FooterContainer>
    )
  }
}

export default Footer

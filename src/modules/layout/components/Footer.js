// @flow

import type { Node } from 'react'
import * as React from 'react'
import styled from 'styled-components'

type PropsType = {
  children: Array<React.Node>
}

const FooterContainer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 15px 5px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  
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
class Footer extends React.Component<PropsType> {
  static getVersion (): Node {
    if (__DEV__) {
      return <span>{__VERSION__}</span>
    }
    return null
  }

  render () {
    return <FooterContainer>
      {this.props.children}
      {Footer.getVersion()}
    </FooterContainer>
  }
}

export default Footer

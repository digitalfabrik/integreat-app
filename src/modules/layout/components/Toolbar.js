// @flow

import type { Node } from 'react'
import React from 'react'
import styled from 'styled-components'

const ToolbarContainer = styled.div`
  display: flex;
  width: 75px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
  
  & > * {
    opacity: 0.7;
    font-size: 1.5rem;
    transition: 0.2s opacity;
  }

  & > *:hover {
    opacity: 1;
  }

  @media ${props => props.theme.dimensions.smallViewport} {
    width: 100%;
    flex-direction: row;
    justify-content: center;
  }
`

type PropsType = {|
  className?: string,
  children?: Node
|}

class Toolbar extends React.Component<PropsType> {
  render () {
    return <ToolbarContainer className={this.props.className}>
      {this.props.children}
    </ToolbarContainer>
  }
}

export default Toolbar

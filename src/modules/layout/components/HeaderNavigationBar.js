// @flow

import * as React from 'react'
import { isEmpty } from 'lodash/lang'

import styled from 'styled-components'

type PropsType = {|
  className?: string,
  children?: React.Node
|}

export const NavigationBarContainer = styled.div`
  display: ${props => props.hidden ? 'none' : 'flex'};
  align-items: center;
  justify-content: center;
`

/**
 * Designed to work with Header. In the MenuBar you can display textual links. Should be used for navigating as a
 * main menu.
 */
class HeaderNavigationBar extends React.PureComponent<PropsType> {
  render () {
    const { className, children } = this.props
    return <NavigationBarContainer hidden={isEmpty(children)} className={className}>{children}</NavigationBarContainer>
  }
}

export default HeaderNavigationBar

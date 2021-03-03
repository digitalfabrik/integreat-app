// @flow

import * as React from 'react'
import styled, { type StyledComponent } from 'styled-components'
import type { ThemeType } from 'build-configs/ThemeType'

const StyledAnchor: StyledComponent<{||}, ThemeType, *> = styled.a`
  color: inherit;
  text-decoration: none;
`

type PropsType = {|
  href: string,
  children: React.Node,
  ariaLabel?: string,
  className?: string
|}

class CleanAnchor extends React.PureComponent<PropsType> {
  render () {
    const { href, children, className, ariaLabel } = this.props
    return (
      <StyledAnchor aria-label={ariaLabel} className={className} href={href}>
        {children}
      </StyledAnchor>
    )
  }
}

export default CleanAnchor

// @flow

import * as React from 'react'
import styled from 'styled-components'

const StyledAnchor = styled.a`
  color: inherit;
  text-decoration: none;
`

type PropsType = {|
  newTab?: boolean,
  href: string,
  children: React.Node,
  ariaLabel?: string,
  className?: string
|}

class CleanAnchor extends React.PureComponent<PropsType> {
  static defaultProps = {
    newTab: true
  }

  render () {
    const { newTab, href, children, className, ariaLabel } = this.props
    return (
      <StyledAnchor aria-label={ariaLabel} className={className} href={href} {...newTab ? { target: '_blank', rel: 'noreferrer' } : {}}>
        {children}
      </StyledAnchor>
    )
  }
}

export default CleanAnchor

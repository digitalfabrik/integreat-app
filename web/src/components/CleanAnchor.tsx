import React, { ReactNode } from 'react'
import styled from 'styled-components'

const StyledAnchor = styled.a`
  color: inherit;
  text-decoration: none;
`

type CleanAnchorProps = {
  href: string
  children: ReactNode
  ariaLabel?: string
  className?: string
}

class CleanAnchor extends React.PureComponent<CleanAnchorProps> {
  render(): ReactNode {
    const { href, children, className, ariaLabel } = this.props
    return (
      <StyledAnchor aria-label={ariaLabel} className={className} href={href}>
        {children}
      </StyledAnchor>
    )
  }
}

export default CleanAnchor

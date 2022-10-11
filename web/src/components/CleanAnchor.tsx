import React, { ReactNode } from 'react'
import styled from 'styled-components'

const StyledAnchor = styled.a`
  color: inherit;
  text-decoration: none;
`

type CleanAnchorPropsType = {
  href: string
  children: ReactNode
  ariaLabel?: string
  className?: string
}

class CleanAnchor extends React.PureComponent<CleanAnchorPropsType> {
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

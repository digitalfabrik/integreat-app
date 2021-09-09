import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { isExternalUrl } from '../utils/UrlCheck'

const StyledCleanLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`
const StyledCleanAnchor = styled.a`
  color: inherit;
  text-decoration: none;
`

type CleanLinkProps = {
  to: string
  children: ReactNode
  ariaLabel?: string
  className?: string
}

const CleanLink: React.FC<CleanLinkProps> = ({ to, children, ariaLabel, className }: CleanLinkProps) => {
  return (
    <>
      {isExternalUrl(to) ? (
        <StyledCleanAnchor href={to} aria-label={ariaLabel} className={className} data-testid={'externalLink'}>
          {children}
        </StyledCleanAnchor>
      ) : (
        <StyledCleanLink to={to} data-testid={'internalLink'}>
          {children}
        </StyledCleanLink>
      )}
    </>
  )
}

export default CleanLink

import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { isExternalUrl } from '../utils/UrlCheck'

const StyledCleanLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  display: flex;
`

type CleanLinkProps = {
  to: string
  children: ReactNode
  ariaLabel?: string
  className?: string
}

const CleanLink: React.FC<CleanLinkProps> = ({ to, children, ariaLabel, className }: CleanLinkProps) => (
  <>
    {isExternalUrl(to) ? (
      <StyledCleanLink href={to} aria-label={ariaLabel} className={className} data-testid='externalLink' as='a'>
        {children}
      </StyledCleanLink>
    ) : (
      <StyledCleanLink to={to} data-testid='internalLink'>
        {children}
      </StyledCleanLink>
    )}
  </>
)

export default CleanLink

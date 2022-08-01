import React, { ReactNode, ReactElement } from 'react'
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
  newTab?: boolean
}

const CleanLink: React.FC<CleanLinkProps> = ({
  to,
  children,
  ariaLabel,
  className,
  newTab,
}: CleanLinkProps): ReactElement => {
  const newTabProps = newTab && { target: '_blank', rel: 'noopener noreferrer' }
  if (isExternalUrl(to)) {
    return (
      <StyledCleanLink
        href={to}
        aria-label={ariaLabel}
        className={className}
        data-testid='externalLink'
        as='a'
        {...newTabProps}>
        {children}
      </StyledCleanLink>
    )
  }
  return (
    <StyledCleanLink to={to} data-testid='internalLink' {...newTabProps}>
      {children}
    </StyledCleanLink>
  )
}

export default CleanLink

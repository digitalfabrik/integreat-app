import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { isExternalUrl } from '../utils/UrlCheck'

const StyledCleanLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`
const StyledCleanAnchor = styled.a`
  color: inherit;
  text-decoration: none;
`

interface CleanLinkProps {
  to: string
  children: ReactNode
  ariaLabel?: string
  className?: string
}

const CleanLink: React.FC<CleanLinkProps> = ({ to, children, ariaLabel, className }: CleanLinkProps) => {
  return (
    <>
      {isExternalUrl(to) ? (
        <StyledCleanAnchor href={to} aria-label={ariaLabel} className={className}>
          {children}
        </StyledCleanAnchor>
      ) : (
        <StyledCleanLink to={to}>{children}</StyledCleanLink>
      )}
    </>
  )
}

export default CleanLink

import React, { ReactNode, ReactElement } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import isExternalUrl from '../utils/isExternalUrl'

export const StyledCleanLink = styled(Link)`
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

const CleanLink = ({ to, children, ariaLabel, className, newTab }: CleanLinkProps): ReactElement => {
  const newTabProps = newTab && { target: '_blank', rel: 'noopener noreferrer' }
  if (isExternalUrl(to)) {
    return (
      // @ts-expect-error wrong types from polymorphic 'as', see https://github.com/styled-components/styled-components/issues/4112
      <StyledCleanLink
        as='a'
        href={to}
        aria-label={ariaLabel}
        className={className}
        data-testid='externalLink'
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

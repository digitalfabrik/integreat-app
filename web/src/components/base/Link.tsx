import React, { ReactNode, ReactElement } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

import { helpers } from '../../constants/theme'
import isExternalUrl from '../../utils/isExternalUrl'

// StyledLink component that uses the helpers conditionally
const StyledLink = styled(RouterLink)<{ $removeHighlight?: boolean; $adaptiveFontSize?: boolean }>`
  color: inherit;
  text-decoration: none;
  display: flex;

  ${props => props.$removeHighlight && helpers.removeLinkHighlighting}
  ${props => props.$adaptiveFontSize && helpers.adaptiveFontSize}
`

const StyledAnchor = styled.a`
  color: inherit;
  text-decoration: none;
`

type LinkProps = {
  to: string
  children: ReactNode
  ariaLabel?: string
  className?: string
  newTab?: boolean
  removeHighlight?: boolean
  adaptiveFontSize?: boolean
  href?: string
  isCleanAnchor?: boolean
}

const Link = ({
  to,
  href,
  children,
  ariaLabel,
  isCleanAnchor,
  className,
  newTab,
  removeHighlight,
  adaptiveFontSize,
}: LinkProps): ReactElement => {
  const newTabProps = newTab && { target: '_blank', rel: 'noopener noreferrer' }

  if (isCleanAnchor) {
    return (
      <StyledAnchor aria-label={ariaLabel} className={className} href={href || to} data-testid='anchorLink'>
        {children}
      </StyledAnchor>
    )
  }

  if (isExternalUrl(to)) {
    return (
      // @ts-expect-error wrong types from polymorphic 'as', see https://github.com/styled-components/styled-components/issues/4112
      <StyledLink
        as='a'
        href={href || to}
        aria-label={ariaLabel}
        className={className}
        data-testid='externalLink'
        $removeHighlight={removeHighlight}
        $adaptiveFontSize={adaptiveFontSize}
        {...newTabProps}>
        {children}
      </StyledLink>
    )
  }

  return (
    <StyledLink
      to={href || to}
      aria-label={ariaLabel}
      className={className}
      data-testid='internalLink'
      $removeHighlight={removeHighlight}
      $adaptiveFontSize={adaptiveFontSize}
      {...newTabProps}>
      {children}
    </StyledLink>
  )
}

export default Link

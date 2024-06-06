import React, { ReactElement, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

import { helpers } from '../../constants/theme'
import isExternalUrl from '../../utils/isExternalUrl'

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
  to?: string
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
  const newTabProps = { target: '_blank', rel: 'noopener noreferrer' }

  const getUrl = () => {
    if (to) {
      return to
    }
    if (href) {
      return href
    }
    return '/'
  }

  const url = getUrl()

  if (isCleanAnchor) {
    return (
      <StyledAnchor aria-label={ariaLabel} className={className} href={url} data-testid='anchorLink'>
        {children}
      </StyledAnchor>
    )
  }

  if (isExternalUrl(url)) {
    return (
      // @ts-expect-error wrong types from polymorphic 'as', see https://github.com/styled-components/styled-components/issues/4112
      <StyledLink
        as='a'
        href={url}
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
      to={url}
      aria-label={ariaLabel}
      className={className}
      data-testid='internalLink'
      $removeHighlight={removeHighlight}
      $adaptiveFontSize={adaptiveFontSize}
      {...(newTab ? newTabProps : {})}>
      {children}
    </StyledLink>
  )
}

export default Link

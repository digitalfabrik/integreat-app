import shouldForwardProp from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import React, { ReactElement, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router'

import { UiDirectionType } from 'translations'

import { isInternalLink, NEW_TAB, NEW_TAB_FEATURES } from '../../utils/openLink'

const InternalLink = styled(RouterLink, { shouldForwardProp })<{ highlightedLink: boolean }>`
  color: ${props => (props.highlightedLink ? props.theme.legacy.colors.linkColor : 'inherit')};
  text-decoration: ${props => (props.highlightedLink ? 'underline' : 'none')};
`

const ExternalLink = styled.a<{ highlightedLink: boolean }>`
  color: ${props => (props.highlightedLink ? props.theme.legacy.colors.linkColor : 'inherit')};
  text-decoration: ${props => (props.highlightedLink ? 'underline' : 'none')};
`

type LinkProps = {
  to: string
  children: ReactNode
  ariaLabel?: string
  className?: string
  dir?: UiDirectionType | 'auto'
  id?: string
  highlighted?: boolean
  onClick?: () => void
}

const Link = ({
  to,
  children,
  ariaLabel,
  className,
  dir,
  id,
  highlighted = false,
  onClick,
}: LinkProps): ReactElement => {
  const commonProps = {
    'aria-label': ariaLabel,
    className,
    dir,
    highlightedLink: highlighted,
    id,
    onClick,
  }
  if (isInternalLink(to)) {
    return (
      <InternalLink to={to} {...commonProps}>
        {children}
      </InternalLink>
    )
  }
  return (
    <ExternalLink href={to} target={NEW_TAB} rel={NEW_TAB_FEATURES} {...commonProps}>
      {children}
    </ExternalLink>
  )
}

export default Link

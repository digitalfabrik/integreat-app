import styled from '@emotion/styled'
import React, { ReactElement, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { UiDirectionType } from 'translations'

import { isInternalLink, NEW_TAB, NEW_TAB_FEATURES } from '../../utils/openLink'

const InternalLink = styled(RouterLink)<{ $highlighted: boolean }>`
  color: ${props => (props.$highlighted ? props.theme.colors.linkColor : 'inherit')};
  text-decoration: ${props => (props.$highlighted ? 'underline' : 'none')};
`

const ExternalLink = styled.a<{ $highlighted: boolean }>`
  color: ${props => (props.$highlighted ? props.theme.colors.linkColor : 'inherit')};
  text-decoration: ${props => (props.$highlighted ? 'underline' : 'none')};
`

type LinkProps = {
  to: string
  children: ReactNode
  ariaLabel?: string
  className?: string
  dir?: UiDirectionType | 'auto'
  id?: string
  highlighted?: boolean
}

const Link = ({ to, children, ariaLabel, className, dir, id, highlighted = false }: LinkProps): ReactElement => {
  const commonProps = {
    'aria-label': ariaLabel,
    className,
    dir,
    highlighted,
    id,
  }
  if (isInternalLink(to)) {
    return (
      <InternalLink to={to} $highlighted={highlighted} {...commonProps}>
        {children}
      </InternalLink>
    )
  }
  return (
    <ExternalLink href={to} target={NEW_TAB} rel={NEW_TAB_FEATURES} $highlighted={highlighted} {...commonProps}>
      {children}
    </ExternalLink>
  )
}

export default Link

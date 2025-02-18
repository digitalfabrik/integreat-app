import React, { ReactElement, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

import { UiDirectionType } from 'translations'

import { isInternalLink, NEW_TAB, NEW_TAB_FEATURES } from '../../utils/openLink'

const StyledLink = styled(RouterLink)<{ $highlighted: boolean }>`
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
  const linkProps = isInternalLink(to) ? { to } : { as: 'a', href: to, target: NEW_TAB, rel: NEW_TAB_FEATURES }

  return (
    // @ts-expect-error wrong types from polymorphic 'as', see https://github.com/styled-components/styled-components/issues/4112
    <StyledLink
      id={id}
      aria-label={ariaLabel}
      className={className}
      {...linkProps}
      dir={dir}
      $highlighted={highlighted}>
      {children}
    </StyledLink>
  )
}

export default Link

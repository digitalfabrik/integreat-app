import React, { ReactElement, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

import { UiDirectionType } from 'translations'

import isExternalUrl from '../../utils/isExternalUrl'

const StyledLink = styled(RouterLink)`
  color: inherit;
  text-decoration: none;
`

type LinkProps = {
  to: string
  children: ReactNode
  ariaLabel?: string
  className?: string
  newTab?: boolean
  dir?: UiDirectionType | 'auto'
  id?: string
}

const Link = ({ to, children, ariaLabel, className, newTab, dir, id }: LinkProps): ReactElement => {
  const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  const linkProps = isExternalUrl(to) ? { as: 'a', href: to } : { to }

  return (
    // @ts-expect-error wrong types from polymorphic 'as', see https://github.com/styled-components/styled-components/issues/4112
    <StyledLink id={id} aria-label={ariaLabel} className={className} {...newTabProps} {...linkProps} dir={dir}>
      {children}
    </StyledLink>
  )
}

export default Link

import React, { ReactElement, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

import { helpers } from '../../constants/theme'
import isExternalUrl from '../../utils/isExternalUrl'

const StyledLink = styled(RouterLink)`
  color: inherit;
  text-decoration: none;
  display: flex;
`

type LinkProps = {
  to: string
  children: ReactNode
  ariaLabel?: string
  className?: string
  newTab?: boolean
}

const Link = ({ to, children, ariaLabel, className, newTab }: LinkProps): ReactElement => {
  const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  const linkProps = isExternalUrl(to) ? { as: 'a', href: to } : { to }

  return (
    // @ts-expect-error wrong types from polymorphic 'as', see https://github.com/styled-components/styled-components/issues/4112
    <StyledLink aria-label={ariaLabel} className={className} {...newTabProps} {...linkProps}>
      {children}
    </StyledLink>
  )
}

export default Link

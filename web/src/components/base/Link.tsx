import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link'
import { useTheme } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { isInternalLink, NEW_TAB, NEW_TAB_FEATURES } from '../../utils/openLink'

type LinkProps = Omit<MuiLinkProps, 'href'> & {
  to: string
  children?: ReactNode
  className?: string
  highlighted?: boolean
}

const Link = ({ to, children, className, highlighted = false, ...props }: LinkProps): ReactElement => {
  const { contentDirection } = useTheme()
  const commonProps: MuiLinkProps = {
    className,
    underline: highlighted ? 'always' : 'none',
    color: highlighted ? 'primary' : 'inherit',
    ...props,
    dir: contentDirection,
  }

  if (isInternalLink(to)) {
    return (
      <MuiLink component={RouterLink} to={to} {...commonProps}>
        {children}
      </MuiLink>
    )
  }
  return (
    <MuiLink href={to} target={NEW_TAB} rel={NEW_TAB_FEATURES} {...commonProps}>
      {children}
    </MuiLink>
  )
}

export default Link

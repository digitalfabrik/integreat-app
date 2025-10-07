import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { openStreeMapCopyright } from 'shared'

import Link from './base/Link'

const Attribution = styled(Typography)({
  display: 'flex',
  gap: 4,
  paddingInline: 4,
  alignItems: 'center',
})

const StyledLink = styled(Link)({
  textDecoration: 'underline',
})

type MapAttributionProps = {
  className?: string
}

const MapAttribution = ({ className }: MapAttributionProps): ReactElement => {
  const { icon, linkText, url, label } = openStreeMapCopyright
  return (
    <Attribution fontSize={8} lineHeight={2} className={className} color='black'>
      {icon}
      <StyledLink to={url}>{linkText}</StyledLink>
      {label}
    </Attribution>
  )
}

export default MapAttribution

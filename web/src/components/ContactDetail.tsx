import { SvgIconProps } from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ElementType, ReactElement } from 'react'

import Link from './base/Link'

const StyledLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  overflowWrap: 'anywhere',
})

type ContactDetailProps = {
  icon: ElementType<SvgIconProps>
  link: string
  content: string
  iconEnd?: ElementType<SvgIconProps>
}

const ContactDetail = ({ icon, link, content, iconEnd }: ContactDetailProps): ReactElement => {
  const Icon = icon
  const IconEnd = iconEnd
  return (
    <StyledLink to={link}>
      <Icon fontSize='small' />
      <Typography variant='body2' color='primary'>
        {content}
      </Typography>
      {IconEnd !== undefined && <IconEnd color='primary' fontSize='small' />}
    </StyledLink>
  )
}

export default ContactDetail

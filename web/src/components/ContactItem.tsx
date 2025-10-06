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

type ContactItemProps = {
  Icon: ElementType<SvgIconProps>
  link: string
  content: string
  IconEnd?: ElementType<SvgIconProps>
}

const ContactItem = ({ Icon, link, content, IconEnd }: ContactItemProps): ReactElement => (
  <StyledLink to={link}>
    <Icon />
    <Typography variant='body2' color='primary'>
      {content}
    </Typography>
    {IconEnd !== undefined && <IconEnd color='primary' fontSize='small' />}
  </StyledLink>
)

export default ContactItem

import { SvgIconProps } from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ElementType, ReactElement } from 'react'

import Icon from './base/Icon'
import Link from './base/Link'

const Marker = styled(Icon)`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  object-fit: contain;
`

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  padding-top: 4px;
  gap: 8px;
  overflow-wrap: anywhere;
  color: ${props => props.theme.palette.primary.main};
`

const StyledSecondIcon = styled(Icon)`
  width: 14px;
  height: 14px;
  color: ${props => props.theme.palette.primary.main};
`

type ContactItemProps = {
  iconSource: string | ElementType<SvgIconProps>
  iconAlt: string
  link: string
  content: string
  sourceIconEnd?: string | ElementType<SvgIconProps>
}

const ContactItem = ({ iconSource, iconAlt, link, content, sourceIconEnd }: ContactItemProps): ReactElement => (
  <StyledLink to={link}>
    <Marker src={iconSource} title={iconAlt} />
    <Typography variant='label1'>{content}</Typography>
    {sourceIconEnd !== undefined && <StyledSecondIcon src={sourceIconEnd} title='' directionDependent />}
  </StyledLink>
)

export default ContactItem

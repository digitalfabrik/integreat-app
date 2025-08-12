import styled from '@emotion/styled'
import { SvgIconProps } from '@mui/material/SvgIcon'
import React, { ElementType, ReactElement } from 'react'

import { helpers } from '../constants/theme'
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
  color: ${props => props.theme.legacy.colors.linkColor};
  ${helpers.adaptiveFontSize};
`

const StyledSecondIcon = styled(Icon)`
  width: 14px;
  height: 14px;
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
    {content}
    {sourceIconEnd !== undefined && <StyledSecondIcon src={sourceIconEnd} title='' directionDependent />}
  </StyledLink>
)

export default ContactItem

import styled from '@emotion/styled'
import React, { ReactElement } from 'react'

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
  color: ${props => props.theme.colors.linkColor};
  ${helpers.adaptiveFontSize};
`

const StyledSecondIcon = styled(Icon)`
  width: 14px;
  height: 14px;
`

type ContactItemProps = {
  iconSource: string
  iconAlt: string
  link: string
  content: string
  secondIconSource?: string
}

const ContactItem = ({ iconSource, iconAlt, link, content, secondIconSource }: ContactItemProps): ReactElement => (
  <StyledLink to={link}>
    <Marker src={iconSource} title={iconAlt} />
    {content}
    {!!secondIconSource && <StyledSecondIcon src={secondIconSource} title='' />}
  </StyledLink>
)

export default ContactItem

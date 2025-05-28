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
  ${helpers.adaptiveFontSize};
`

type ContactItemProps = {
  iconSrc: string
  iconAlt: string
  link: string
  content: string
}

const ContactItem = ({ iconSrc, iconAlt, link, content }: ContactItemProps): ReactElement => (
  <StyledLink to={link}>
    <Marker src={iconSrc} title={iconAlt} />
    {content}
  </StyledLink>
)

export default ContactItem

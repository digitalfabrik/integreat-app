import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { helpers } from '../constants/theme'
import Link from './base/Link'

const Marker = styled.img`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  object-fit: contain;
`

const StyledLink = styled(Link)`
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
    <Marker src={iconSrc} alt={iconAlt} />
    {content}
  </StyledLink>
)

export default ContactItem

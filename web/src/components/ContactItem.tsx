import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { helpers } from '../constants/theme'
import CleanLink from './CleanLink'

const Marker = styled.img`
  inline-size: 20px;
  block-size: 20px;
  flex-shrink: 0;
  object-fit: contain;
`

const Link = styled(CleanLink)`
  align-items: center;
  padding-block-start: 4px;
  gap: 8px;
  ${helpers.adaptiveFontSize};
`

type ContactItemProps = {
  iconSrc: string
  iconAlt: string
  link: string
  content: string
}

const ContactItem = ({ iconSrc, iconAlt, link, content }: ContactItemProps): ReactElement => (
  <Link to={link}>
    <Marker src={iconSrc} alt={iconAlt} />
    {content}
  </Link>
)

export default ContactItem

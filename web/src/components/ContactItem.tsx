import React, { ReactElement } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import CleanLink from './CleanLink'

const Marker = styled.img`
  width: 20px;
  height: 20px;
  flex-shrink: 0;

  @media ${dimensions.mediumLargeViewport} {
    padding: 0 8px;
  }
  object-fit: contain;
`

const Link = styled(CleanLink)`
  align-items: center;
  padding-top: 4px;
  font-size: clamp(
    ${props => props.theme.fonts.adaptiveFontSizeSmall.min},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.value},
    ${props => props.theme.fonts.adaptiveFontSizeSmall.max}
  );

  @media ${dimensions.smallViewport} {
    gap: 8px;
  }
`

type ContactItemProps = {
  iconSrc: string
  iconAlt: string
  link: string
  content: string
}

const ContactItem: React.FC<ContactItemProps> = ({
  iconSrc,
  iconAlt,
  link,
  content,
}: ContactItemProps): ReactElement => (
  <Link to={link}>
    <Marker src={iconSrc} alt={iconAlt} />
    {content}
  </Link>
)

export default ContactItem

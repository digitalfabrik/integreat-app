import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { ExternalLinkIcon } from '../assets'
import { helpers } from '../constants/theme'
import isExternalLink from './Contact'
import Link from './base/Link'

const Marker = styled.img`
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

// Новый Styled компонент для кнопки с иконкой внешней ссылки
const StyledExternalLinkIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  object-fit: contain;
  margin-left: 8px; // Добавляем отступ между текстом и иконкой
`

type ContactItemProps = {
  iconSrc: string
  iconAlt: string
  link: string
  content: string
  isExternalLink?: boolean // Дополнительный проп для отображения иконки только для веб-сайта
}

const ContactItem = ({ iconSrc, iconAlt, link, content, isExternalLink }: ContactItemProps): ReactElement => (
  <StyledLink to={link}>
    <Marker src={iconSrc} alt={iconAlt} />
    {content}

    {isExternalLink && <StyledExternalLinkIcon alt=' ' src={ExternalLinkIcon} />}
  </StyledLink>
)

export default ContactItem

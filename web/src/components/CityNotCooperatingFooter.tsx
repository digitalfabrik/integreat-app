import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { CITY_NOT_COOPERATING_ROUTE } from 'api-client/src'

import placeholderIcon2 from '../assets/location-icon.svg'
import placeholderIcon from '../assets/magnifier.svg'
import { createPath } from '../routes'

const FooterContainer = styled.div`
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid black;
`

const IconContainer = styled.div``

const Icon = styled.img`
  width: calc(20px + 5vw);
  height: calc(20px + 5vw);
  flex-shrink: 0;
  padding: 8px;
  /* object-fit: contain; */
`

const Button = styled(Link)`
  background-color: ${props => props.theme.colors.themeColor};
  text-decoration: none;
  color: ${props => props.theme.colors.textColor};
  padding: 5px 20px;
  margin: 15px;
`

const Question = styled.p`
  font: ${props => props.theme.fonts.web.decorativeFont};
  font-weight: 400;
`

type PropsType = {
  languageCode: string
}

const CityNotCooperatingFooter = ({ languageCode }: PropsType): ReactElement => {
  const { t } = useTranslation('landing')

  return (
    <FooterContainer>
      <IconContainer>
        <Icon alt='' src={placeholderIcon} />
        <Icon alt='' src={placeholderIcon2} />
      </IconContainer>

      <Question>{t('cityNotCooperating')}</Question>

      <Button to={createPath(CITY_NOT_COOPERATING_ROUTE, { languageCode })}>{t('cityNotCooperatingButton')}</Button>
    </FooterContainer>
  )
}

export default CityNotCooperatingFooter

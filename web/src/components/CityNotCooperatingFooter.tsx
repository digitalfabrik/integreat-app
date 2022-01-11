import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { CITY_NOT_COOPERATING_ROUTE } from 'api-client/src'

import cityNotCooperatingIcon from '../assets/cityNotCooperating.svg'
import { createPath } from '../routes'

const FooterContainer = styled.div`
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid black;
`

const Icon = styled.img`
  width: calc(30px + 8vw);
  height: calc(30px + 8vw);
  flex-shrink: 0;
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
      <Icon alt='' src={cityNotCooperatingIcon} />
      <Question>{t('cityNotCooperating')}</Question>
      <Button to={createPath(CITY_NOT_COOPERATING_ROUTE, { languageCode })}>{t('cityNotCooperatingButton')}</Button>
    </FooterContainer>
  )
}

export default CityNotCooperatingFooter

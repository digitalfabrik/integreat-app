import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { CITY_NOT_COOPERATING_ROUTE, pathnameFromRouteInformation } from 'api-client/src'

import buildConfig from '../constants/buildConfig'

const FooterContainer = styled.div`
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid ${props => props.theme.colors.textColor};
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

const CityNotCooperatingFooter = ({ languageCode }: PropsType): ReactElement | null => {
  const { t } = useTranslation('landing')

  if (!buildConfig().featureFlags.cityNotCooperating) {
    return null
  }

  return (
    <FooterContainer>
      <Icon alt='' src={buildConfig().icons.cityNotCooperating!} />
      <Question>{t('cityNotFound')}</Question>
      <Button to={pathnameFromRouteInformation({ route: CITY_NOT_COOPERATING_ROUTE, ...{ languageCode } })}>
        {t('clickHere')}
      </Button>
    </FooterContainer>
  )
}

export default CityNotCooperatingFooter

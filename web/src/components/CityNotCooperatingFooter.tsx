import styled from '@emotion/styled'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { CITY_NOT_COOPERATING_ROUTE, pathnameFromRouteInformation } from 'shared'

import buildConfig from '../constants/buildConfig'
import { helpers } from '../constants/theme'
import Icon from './base/Icon'

const FooterContainer = styled.div`
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid ${props => props.theme.colors.footerLineColor};
`

const StyledIcon = styled(Icon)`
  width: calc(30px + 8vw);
  height: calc(30px + 8vw);
  flex-shrink: 0;
`

const Button = styled(Link)`
  background-color: ${props => props.theme.colors.themeColor};
  text-decoration: none;
  ${helpers.adaptiveThemeTextColor}
  padding: 5px 20px;
  margin: 15px;
  text-align: center;
`

const Question = styled.p`
  font: ${props => props.theme.fonts.web.decorativeFont};
  font-weight: 400;
`

type CityNotCooperatingFooterProps = {
  languageCode: string
}

const CityNotCooperatingFooter = ({ languageCode }: CityNotCooperatingFooterProps): ReactElement | null => {
  const { t } = useTranslation('landing')
  const CityNotCooperatingIcon = buildConfig().icons.cityNotCooperating

  if (!buildConfig().featureFlags.cityNotCooperating || !CityNotCooperatingIcon) {
    return null
  }

  return (
    <FooterContainer>
      <StyledIcon src={CityNotCooperatingIcon} />
      <Question>{t('cityNotFound')}</Question>
      <Button to={pathnameFromRouteInformation({ route: CITY_NOT_COOPERATING_ROUTE, ...{ languageCode } })}>
        {t('suggestToRegion', { appName: buildConfig().appName })}
      </Button>
    </FooterContainer>
  )
}

export default CityNotCooperatingFooter

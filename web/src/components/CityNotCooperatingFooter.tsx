import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CITY_NOT_COOPERATING_ROUTE, pathnameFromRouteInformation } from 'shared'

import buildConfig from '../constants/buildConfig'
import Icon from './base/Icon'
import Link from './base/Link'

const FooterContainer = styled('div')`
  background-color: ${props => props.theme.legacy.colors.backgroundAccentColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

const StyledIcon = styled(Icon)`
  width: calc(30px + 8vw);
  height: calc(30px + 8vw);
  flex-shrink: 0;
`

const Question = styled('p')`
  font: ${props => props.theme.legacy.fonts.web.decorativeFont};
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
      <Button variant='outlined'>
        <Link to={pathnameFromRouteInformation({ route: CITY_NOT_COOPERATING_ROUTE, ...{ languageCode } })}>
          {t('suggestToRegion', { appName: buildConfig().appName })}
        </Link>
      </Button>
      <Divider />
    </FooterContainer>
  )
}

export default CityNotCooperatingFooter

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CITY_NOT_COOPERATING_ROUTE, pathnameFromRouteInformation } from 'shared'

import buildConfig from '../constants/buildConfig'
import Link from './base/Link'
import Svg from './base/Svg'

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
    <Stack alignItems='center' padding={2} gap={2}>
      <Svg src={CityNotCooperatingIcon} width={160} height={160} />
      <Typography variant='body1'>{t('cityNotFound')}</Typography>
      <Button
        component={Link}
        to={pathnameFromRouteInformation({ route: CITY_NOT_COOPERATING_ROUTE, ...{ languageCode } })}
        variant='outlined'>
        {t('suggestToRegion', { appName: buildConfig().appName })}
      </Button>
    </Stack>
  )
}

export default CityNotCooperatingFooter

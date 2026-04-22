import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { SUGGEST_TO_REGION_ROUTE, pathnameFromRouteInformation } from 'shared'

import buildConfig from '../constants/buildConfig'
import Link from './base/Link'
import Svg from './base/Svg'

type SuggestToRegionFooterProps = {
  languageCode: string
}

const SuggestToRegionFooter = ({ languageCode }: SuggestToRegionFooterProps): ReactElement | null => {
  const { t } = useTranslation('landing')
  const SuggestToRegionIcon = buildConfig().icons.suggestToRegion

  if (!buildConfig().featureFlags.suggestToRegion || !SuggestToRegionIcon) {
    return null
  }

  return (
    <Stack alignItems='center' padding={2} gap={2}>
      <Svg src={SuggestToRegionIcon} width={160} height={160} />
      <Typography variant='body1'>{t('cityNotFound')}</Typography>
      <Button
        component={Link}
        to={pathnameFromRouteInformation({ route: SUGGEST_TO_REGION_ROUTE, ...{ languageCode } })}
        variant='outlined'
        textAlign='center'>
        {t('suggestToRegion', { appName: buildConfig().appName })}
      </Button>
    </Stack>
  )
}

export default SuggestToRegionFooter

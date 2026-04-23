import RefreshIcon from '@mui/icons-material/Refresh'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { getNearbyRegions } from 'shared'
import { RegionModel } from 'shared/api'

import useUserLocation from '../hooks/useUserLocation'
import RegionListGroup, { RegionGroupHeader } from './RegionListGroup'

type NearbyRegionsProps = {
  regions: RegionModel[]
  language: string
  filterText: string
  stickyTop: number
}

const NearbyRegions = ({ regions, language, filterText, stickyTop }: NearbyRegionsProps): ReactElement => {
  const { t } = useTranslation('landing')
  const { data: userLocation, refresh } = useUserLocation()
  const liveRegions = regions.filter(region => region.live)
  const nearbyRegions = userLocation ? getNearbyRegions(userLocation, liveRegions) : []

  if (nearbyRegions.length === 0) {
    return (
      <Stack paddingBlock={1}>
        <RegionGroupHeader stickyTop={stickyTop}>{t('common:nearby')}</RegionGroupHeader>
        <Stack direction='row' alignItems='center' justifyContent='space-between' paddingInline={2}>
          <ListItemText primary={t(userLocation ? 'noNearbyRegions' : 'locationError')} />
          <IconButton aria-label={t('refresh')} onClick={refresh}>
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Stack>
    )
  }

  return (
    <RegionListGroup
      title={t('common:nearby')}
      regions={nearbyRegions}
      stickyTop={stickyTop}
      languageCode={language}
      filterText={filterText}
    />
  )
}

export default NearbyRegions

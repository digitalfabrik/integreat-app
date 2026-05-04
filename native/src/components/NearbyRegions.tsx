import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components/native'

import { getNearbyRegions } from 'shared'
import { RegionModel } from 'shared/api'

import useUserLocation from '../hooks/useUserLocation'
import RegionEntry from './RegionEntry'
import Icon from './base/Icon'
import IconButton from './base/IconButton'
import Text from './base/Text'

const NearbyMessageContainer = styled.View`
  padding: 7px;
  flex-direction: row;
  justify-content: space-between;
`
const RetryButtonContainer = styled.View`
  flex-direction: column;
  height: 46px;
`

type NearbyRegionsProps = {
  regions: RegionModel[]
  navigateToDashboard: (region: RegionModel) => void
  filterText: string
}

const NearbyRegions = ({ regions, navigateToDashboard, filterText }: NearbyRegionsProps): ReactElement => {
  const { status, coordinates, message, refreshPermissionAndLocation } = useUserLocation({
    requestPermissionInitially: false,
  })
  const { t } = useTranslation('landing')
  const theme = useTheme()

  if (!coordinates) {
    return (
      <NearbyMessageContainer>
        <Text variant='body2' style={{ paddingTop: 16 }}>
          {t(message)}
        </Text>
        <RetryButtonContainer>
          {status !== 'loading' && (
            <IconButton
              icon={<Icon color={theme.colors.onSurfaceVariant} source='refresh' />}
              onPress={refreshPermissionAndLocation}
              accessibilityLabel={t('refresh')}
            />
          )}
        </RetryButtonContainer>
      </NearbyMessageContainer>
    )
  }

  const nearbyRegions = getNearbyRegions(
    coordinates,
    regions.filter(region => region.live),
  )

  if (nearbyRegions.length === 0) {
    return (
      <NearbyMessageContainer>
        <Text variant='body2' style={{ paddingTop: 16 }}>
          {t('noNearbyRegions')}
        </Text>
      </NearbyMessageContainer>
    )
  }

  return (
    <>
      {nearbyRegions.map(region => (
        <RegionEntry key={region.code} region={region} query={filterText} navigateToDashboard={navigateToDashboard} />
      ))}
    </>
  )
}

export default NearbyRegions

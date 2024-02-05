import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { getNearbyCities } from 'shared'
import { CityModel } from 'shared/api'

import { RefreshIcon } from '../assets'
import useUserLocation from '../hooks/useUserLocation'
import CityEntry from './CityEntry'
import Icon from './base/Icon'
import IconButton from './base/IconButton'

const NearbyMessageContainer = styled.View`
  padding: 7px;
  flex-direction: row;
  justify-content: space-between;
`
const RetryButtonContainer = styled.View`
  flex-direction: column;
  height: 46px;
`
const NearbyMessage = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  padding-top: 15px;
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.textSecondaryColor};
`

type NearbyCitiesProps = {
  cities: Array<CityModel>
  navigateToDashboard: (city: CityModel) => void
  filterText: string
}

const NearbyCities = ({ cities, navigateToDashboard, filterText }: NearbyCitiesProps): ReactElement => {
  const locationInformation = useUserLocation()
  const { status, coordinates, message, requestAndDetermineLocation } = locationInformation
  const { t } = useTranslation('landing')

  if (!coordinates) {
    return (
      <NearbyMessageContainer>
        <NearbyMessage>{t(message)}</NearbyMessage>
        <RetryButtonContainer>
          {status !== 'loading' && (
            <IconButton
              icon={<StyledIcon Icon={RefreshIcon} />}
              onPress={requestAndDetermineLocation}
              accessibilityLabel={t('refresh')}
            />
          )}
        </RetryButtonContainer>
      </NearbyMessageContainer>
    )
  }

  const nearbyCities = getNearbyCities(
    coordinates,
    cities.filter(city => city.live),
  )

  if (nearbyCities.length === 0) {
    return (
      <NearbyMessageContainer>
        <NearbyMessage>{t('noNearbyCities')}</NearbyMessage>
      </NearbyMessageContainer>
    )
  }

  return (
    <>
      {nearbyCities.map(city => (
        <CityEntry key={city.code} city={city} query={filterText} navigateToDashboard={navigateToDashboard} />
      ))}
    </>
  )
}

export default NearbyCities

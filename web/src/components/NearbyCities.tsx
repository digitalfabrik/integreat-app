import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { getNearbyCities } from 'shared'
import { CityModel } from 'shared/api'

import { RefreshIcon } from '../assets'
import useUserLocation from '../hooks/useUserLocation'
import CityEntry from './CityEntry'
import { CityListParent } from './CitySelector'
import Button from './base/Button'
import Icon from './base/Icon'

const NearbyMessageContainer = styled.div`
  padding: 8px;
  flex-direction: row;
  justify-content: space-between;
`

const NearbyMessage = styled.span`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  padding-top: 16px;
`

const RetryButtonContainer = styled(Button)`
  flex-direction: column;
  height: 24px;
`

const StyledMessageWrapper = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
`

type NearbyCitiesProps = {
  cities: CityModel[]
  language: string
  filterText: string
  stickyTop: number
}

const NearbyCities = ({ cities, language, filterText, stickyTop }: NearbyCitiesProps): ReactElement => {
  const { t } = useTranslation('landing')
  const { data: userLocation, refresh } = useUserLocation()

  const nearbyCities = userLocation?.coordinates
    ? getNearbyCities(
        userLocation.coordinates,
        cities.filter(city => city.live),
      )
    : []

  return (
    <>
      <CityListParent $stickyTop={stickyTop}>{t('nearbyCities')}</CityListParent>
      {nearbyCities.length > 0 ? (
        <div>
          {nearbyCities.map(city => (
            <CityEntry key={city.code} city={city} language={language} filterText={filterText} />
          ))}
        </div>
      ) : (
        <NearbyMessageContainer>
          <StyledMessageWrapper>
            <NearbyMessage>{userLocation !== null ? t('noNearbyCities') : t('locationError')}</NearbyMessage>
            <RetryButtonContainer label={t('refresh')} onClick={() => refresh()}>
              {userLocation?.status !== 'ready' && <Icon src={RefreshIcon} />}
            </RetryButtonContainer>
          </StyledMessageWrapper>
        </NearbyMessageContainer>
      )}
    </>
  )
}

export default NearbyCities

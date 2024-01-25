import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { GeoJsonPoi, LocationType, sortMapFeatures } from 'shared'
import { PoiModel } from 'shared/api'

import Failure from './Failure'
import List from './List'
import PoiDetails from './PoiDetails'
import PoiListItem from './PoiListItem'

const StyledFailure = styled(Failure)`
  padding: 0;
`

type PoiSharedChildrenProps = {
  poiListFeatures: GeoJsonPoi[]
  currentPoi: PoiModel | null
  slug?: string
  selectPoi: (geoJsonPoi: GeoJsonPoi | null) => void
  userLocation: LocationType | undefined
  toolbar?: ReactElement
}

const PoiSharedChildren = ({
  poiListFeatures,
  currentPoi,
  slug,
  selectPoi,
  userLocation,
  toolbar,
}: PoiSharedChildrenProps): ReactElement => {
  const { t } = useTranslation('pois')

  if (currentPoi) {
    return <PoiDetails poi={currentPoi} feature={currentPoi.getFeature(userLocation)} toolbar={toolbar} />
  }

  if (slug) {
    return <StyledFailure errorMessage='notFound.poi' goToMessage='pois:detailsHeader' goToPath='.' />
  }

  const renderPoiListItem = (poi: GeoJsonPoi) => <PoiListItem key={poi.path} poi={poi} selectPoi={selectPoi} />
  return (
    <List
      noItemsMessage={t('noPois')}
      items={sortMapFeatures(poiListFeatures)}
      renderItem={renderPoiListItem}
      borderless
    />
  )
}

export default PoiSharedChildren

import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { GeoJsonPoi, LocationType, PoiModel, sortMapFeatures } from 'api-client'
import { UiDirectionType } from 'translations'

import Failure from './Failure'
import List from './List'
import PoiDetails from './PoiDetails'
import PoiListItem from './PoiListItem'

type PoiSharedChildrenProps = {
  poiListFeatures: GeoJsonPoi[]
  currentPoi: PoiModel | null
  slug?: string
  selectPoi: (geoJsonPoi: GeoJsonPoi | null) => void
  userLocation: LocationType | undefined
  direction: UiDirectionType
  toolbar?: ReactElement
}

const PoiSharedChildren = ({
  poiListFeatures,
  currentPoi,
  slug,
  selectPoi,
  userLocation,
  direction,
  toolbar,
}: PoiSharedChildrenProps): ReactElement => {
  const { t } = useTranslation('pois')

  if (currentPoi) {
    return (
      <PoiDetails
        poi={currentPoi}
        feature={currentPoi.getFeature(userLocation)}
        direction={direction}
        toolbar={toolbar}
      />
    )
  }

  if (slug) {
    return <Failure errorMessage='notFound.poi' goToMessage='pois:detailsHeader' goToPath='.' />
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

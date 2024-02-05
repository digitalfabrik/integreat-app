import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { LocationType, sortPois } from 'shared'
import { PoiModel } from 'shared/api'

import Failure from './Failure'
import List from './List'
import PoiDetails from './PoiDetails'
import PoiListItem from './PoiListItem'

const StyledFailure = styled(Failure)`
  padding: 0;
`

type PoiSharedChildrenProps = {
  pois: PoiModel[]
  poi: PoiModel | undefined
  slug: string | undefined
  selectPoi: (poi: PoiModel) => void
  userLocation: LocationType | null
  toolbar?: ReactElement
}

const PoiSharedChildren = ({
  pois,
  poi,
  slug,
  selectPoi,
  userLocation,
  toolbar,
}: PoiSharedChildrenProps): ReactElement => {
  const { t } = useTranslation('pois')

  if (poi) {
    return <PoiDetails poi={poi} distance={userLocation && poi.distance(userLocation)} toolbar={toolbar} />
  }

  if (slug) {
    return <StyledFailure errorMessage='notFound.poi' goToMessage='pois:detailsHeader' goToPath='.' />
  }

  const renderPoiListItem = (poi: PoiModel) => (
    <PoiListItem
      key={poi.path}
      poi={poi}
      selectPoi={() => selectPoi(poi)}
      distance={userLocation ? poi.distance(userLocation) : null}
    />
  )
  return (
    <List noItemsMessage={t('noPois')} items={sortPois(pois, userLocation)} renderItem={renderPoiListItem} borderless />
  )
}

export default PoiSharedChildren

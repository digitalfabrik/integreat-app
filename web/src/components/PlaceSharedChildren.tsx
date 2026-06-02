import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { LocationType, sortPlaces } from 'shared'
import { PlaceModel } from 'shared/api'

import Failure from './Failure'
import PlaceDetails from './PlaceDetails'
import PlaceListItem from './PlaceListItem'
import List from './base/List'

const StyledFailure = styled(Failure)`
  padding: 0;
`

type PlaceSharedChildrenProps = {
  places: PlaceModel[]
  place: PlaceModel | undefined
  slug: string | undefined
  scrollToTop: () => void
  userLocation: LocationType | null
}

const PlaceSharedChildren = ({
  places,
  place,
  slug,
  scrollToTop,
  userLocation,
}: PlaceSharedChildrenProps): ReactElement => {
  const { t } = useTranslation('places')

  if (place) {
    return <PlaceDetails place={place} distance={userLocation && place.distance(userLocation)} />
  }

  if (slug) {
    return <StyledFailure errorMessage='notFound.place' goToMessage='places:backToOverview' goToPath='.' />
  }

  const renderPlaceListItem = (place: PlaceModel) => (
    <PlaceListItem
      key={place.path}
      place={place}
      onClick={scrollToTop}
      distance={userLocation ? place.distance(userLocation) : null}
    />
  )
  return <List NoItemsMessage={t('noPlaces')} items={sortPlaces(places, userLocation).map(renderPlaceListItem)} />
}

export default PlaceSharedChildren

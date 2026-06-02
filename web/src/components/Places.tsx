import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'

import {
  parseQueryParams,
  isMultipoi,
  LocationType,
  MapFeature,
  MapViewViewport,
  normalizePath,
  preparePlaces,
  safeParseInt,
  toQueryParams,
} from 'shared'
import { PlaceCategoryModel, PlaceModel, RegionModel } from 'shared/api'

import PlaceFilters from '../components/PlaceFilters'
import PlacesDesktop from '../components/PlacesDesktop'
import PlacesMobile from '../components/PlacesMobile'
import useDimensions from '../hooks/useDimensions'
import moveViewportToRegion from '../utils/moveViewportToRegion'
import PlaceFiltersOverlayButtons from './PlaceFiltersOverlayButtons'

const Container = styled('div')`
  display: flex;
  height: calc(100vh - ${props => props.theme.dimensions.headerHeight}px);
`

type PlaceProps = {
  places: PlaceModel[]
  userLocation: LocationType | null
  region: RegionModel
  loading: boolean
}

const Places = ({ places: allPlaces, userLocation, region, loading }: PlaceProps): ReactElement | null => {
  const [currentlyOpenFilter, setCurrentlyOpenFilter] = useState(false)
  const [showFilterSelection, setShowFilterSelection] = useState(false)
  const [queryParams, setQueryParams] = useSearchParams()
  const { multipoi, placeCategoryId, zoom } = parseQueryParams(queryParams)
  const [mapViewport, setMapViewport] = useState<MapViewViewport>(moveViewportToRegion(region, zoom))
  const params = useParams()
  const navigate = useNavigate()
  const { mobile } = useDimensions()

  const slug = params.slug ? normalizePath(params.slug) : undefined

  const preparedData = preparePlaces({
    places: allPlaces,
    params: { slug, multipoi, placeCategoryId, currentlyOpen: currentlyOpenFilter },
  })
  const { places, placeCategories, placeCategory } = preparedData

  const deselectAll = () => navigate(`.?${toQueryParams({ placeCategoryId })}`)

  const updatePlaceCategoryFilter = (placeCategoryFilter: PlaceCategoryModel | null) => {
    if (placeCategoryFilter) {
      navigate(`.?${toQueryParams({ placeCategoryId: placeCategoryFilter.id })}`)
    } else {
      setQueryParams(toQueryParams({ ...queryParams, placeCategoryId: undefined }))
    }
  }

  const updatePlaceCurrentlyOpenFilter = (placeCurrentlyOpenFilter: boolean) => {
    if (placeCurrentlyOpenFilter) {
      deselectAll()
    }
    setCurrentlyOpenFilter(placeCurrentlyOpenFilter)
  }

  const selectMapFeature = (mapFeature: MapFeature | null) => {
    deselectAll()
    setShowFilterSelection(false)

    const slug = mapFeature?.properties.places[0]?.slug
    if (mapFeature && isMultipoi(mapFeature)) {
      navigate(`.?${toQueryParams({ placeCategoryId, multipoi: safeParseInt(mapFeature.id) })}`)
    } else if (slug) {
      navigate(`${slug}?${toQueryParams({ placeCategoryId })}`)
    }
  }

  const selectPlace = (place: PlaceModel) => {
    navigate(`${place.slug}?${queryParams}`)
  }

  const deselect = () => {
    if (preparedData.mapFeature && slug) {
      navigate(`.?${queryParams}`)
    } else {
      deselectAll()
    }
  }

  const sharedPlaceProps = {
    data: preparedData,
    selectMapFeature,
    selectPlace,
    deselect,
    userLocation,
    slug,
    mapViewport,
    setMapViewport,
    loading,
    MapOverlay: (
      <PlaceFiltersOverlayButtons
        currentlyOpenFilter={currentlyOpenFilter}
        setCurrentlyOpenFilter={setCurrentlyOpenFilter}
        placeCategory={placeCategory}
        setPlaceCategoryFilter={updatePlaceCategoryFilter}
        setShowFilterSelection={setShowFilterSelection}
      />
    ),
  }

  return (
    <Container>
      {mobile ? <PlacesMobile {...sharedPlaceProps} /> : <PlacesDesktop {...sharedPlaceProps} />}
      {showFilterSelection && (
        <PlaceFilters
          close={() => setShowFilterSelection(false)}
          placeCategories={placeCategories}
          selectedPlaceCategory={placeCategory}
          setSelectedPlaceCategory={updatePlaceCategoryFilter}
          currentlyOpenFilter={currentlyOpenFilter}
          setCurrentlyOpenFilter={updatePlaceCurrentlyOpenFilter}
          placesCount={places.length}
        />
      )}
    </Container>
  )
}

export default Places

import React, { ReactElement, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'

import {
  parseQueryParams,
  isMultipoi,
  LocationType,
  MapFeature,
  MapViewViewport,
  normalizePath,
  POIS_ROUTE,
  preparePois,
  safeParseInt,
  toQueryParams,
} from 'shared'
import { PoiCategoryModel, PoiModel, CityModel } from 'shared/api'

import CityContentToolbar from '../components/CityContentToolbar'
import PoiFilters from '../components/PoiFilters'
import PoisDesktop from '../components/PoisDesktop'
import PoisMobile from '../components/PoisMobile'
import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'
import moveViewportToCity from '../utils/moveViewportToCity'
import PoiFiltersOverlayButtons from './PoiFiltersOverlayButtons'

const Container = styled.div<{ panelHeights: number }>`
  display: flex;
  ${({ panelHeights }) => `height: calc(100vh - ${panelHeights}px);`};
`

type PoiProps = {
  pois: PoiModel[]
  userLocation: LocationType | null
  city: CityModel
  languageCode: string
  pageTitle: string
}

const Pois = ({ pois: allPois, userLocation, city, languageCode, pageTitle }: PoiProps): ReactElement | null => {
  const [currentlyOpenFilter, setCurrentlyOpenFilter] = useState(false)
  const [showFilterSelection, setShowFilterSelection] = useState(false)
  const [queryParams, setQueryParams] = useSearchParams()
  const { multipoi, poiCategoryId, zoom } = parseQueryParams(queryParams)
  const [mapViewport, setMapViewport] = useState<MapViewViewport>(moveViewportToCity(city, zoom))
  const params = useParams()
  const navigate = useNavigate()
  const { viewportSmall, width } = useWindowDimensions()

  const slug = params.slug ? normalizePath(params.slug) : undefined

  const preparedData = preparePois({
    pois: allPois,
    params: { slug, multipoi, poiCategoryId, currentlyOpen: currentlyOpenFilter },
  })
  const { pois, poi, poiCategories, poiCategory } = preparedData

  const deselectAll = () => navigate(`.?${toQueryParams({ poiCategoryId })}`)

  const updatePoiCategoryFilter = (poiCategoryFilter: PoiCategoryModel | null) => {
    if (poiCategoryFilter) {
      navigate(`.?${toQueryParams({ poiCategoryId: poiCategoryFilter.id })}`)
    } else {
      setQueryParams(toQueryParams({ ...queryParams, poiCategoryId: undefined }))
    }
  }

  const updatePoiCurrentlyOpenFilter = (poiCurrentlyOpenFilter: boolean) => {
    if (poiCurrentlyOpenFilter) {
      deselectAll()
    }
    setCurrentlyOpenFilter(poiCurrentlyOpenFilter)
  }

  const selectMapFeature = (mapFeature: MapFeature | null) => {
    deselectAll()
    setShowFilterSelection(false)

    const slug = mapFeature?.properties.pois[0]?.slug
    if (mapFeature && isMultipoi(mapFeature)) {
      navigate(`.?${toQueryParams({ poiCategoryId, multipoi: safeParseInt(mapFeature.id) })}`)
    } else if (slug) {
      navigate(`${slug}?${toQueryParams({ poiCategoryId })}`)
    }
  }

  const selectPoi = (poi: PoiModel) => {
    navigate(`${poi.slug}?${queryParams}`)
  }

  const deselect = () => {
    if (preparedData.mapFeature && slug) {
      navigate(`.?${queryParams}`)
    } else {
      deselectAll()
    }
  }

  const toolbar = (
    <CityContentToolbar
      feedbackTarget={poi?.slug}
      route={POIS_ROUTE}
      iconDirection='row'
      hideDivider
      pageTitle={pageTitle}
      isInBottomActionSheet={viewportSmall}
    />
  )

  const FiltersModal = (
    <PoiFilters
      closeModal={() => setShowFilterSelection(false)}
      poiCategories={poiCategories}
      selectedPoiCategory={poiCategory}
      setSelectedPoiCategory={updatePoiCategoryFilter}
      currentlyOpenFilter={currentlyOpenFilter}
      setCurrentlyOpenFilter={updatePoiCurrentlyOpenFilter}
      panelWidth={viewportSmall ? width : dimensions.poiDesktopPanelWidth}
      poisCount={pois.length}
    />
  )
  if (showFilterSelection && viewportSmall) {
    return FiltersModal
  }

  const sharedPoiProps = {
    toolbar,
    data: preparedData,
    selectMapFeature,
    selectPoi,
    deselect,
    userLocation,
    languageCode,
    slug,
    mapViewport,
    setMapViewport,
    MapOverlay: (
      <PoiFiltersOverlayButtons
        poiFiltersShown={showFilterSelection}
        currentlyOpenFilter={currentlyOpenFilter}
        setCurrentlyOpenFilter={setCurrentlyOpenFilter}
        poiCategory={poiCategory}
        setPoiCategoryFilter={updatePoiCategoryFilter}
        setShowFilterSelection={setShowFilterSelection}
      />
    ),
  }

  const panelHeights = dimensions.headerHeightLarge + dimensions.navigationMenuHeight

  return (
    <Container panelHeights={panelHeights}>
      {viewportSmall ? (
        <PoisMobile {...sharedPoiProps} />
      ) : (
        <PoisDesktop
          {...sharedPoiProps}
          panelHeights={panelHeights}
          cityModel={city}
          PanelContent={showFilterSelection ? FiltersModal : undefined}
        />
      )}
    </Container>
  )
}

export default Pois

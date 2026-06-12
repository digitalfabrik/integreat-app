import Stack from '@mui/material/Stack'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { GeolocateControl, NavigationControl } from 'react-map-gl/maplibre'

import { LocationType, MapViewViewport, MapFeature, PreparePlacesReturn } from 'shared'
import { PlaceModel } from 'shared/api'

import MapAttribution from './MapAttribution'
import MapView from './MapView'
import PlacePanelHeader from './PlacePanelHeader'
import PlacePanelNavigation from './PlacePanelNavigation'
import PlaceSharedChildren from './PlaceSharedChildren'
import SkeletonHeader from './SkeletonHeader'
import SkeletonList from './SkeletonList'

const PanelContainer = styled('article')`
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 400px;

  /* additional min-width is needed because the article would shrink to a smaller width if the content can be smaller */
  min-width: 400px;
`

const ListViewWrapper = styled('div')`
  padding: 16px;
  overflow: auto;
`

const StyledMapAttribution = styled(MapAttribution)({
  position: 'absolute',
  bottom: 0,
  left: 0,
})

const SkeletonPanelContent = () => (
  <Stack paddingX={2}>
    <SkeletonHeader width='60%' />
    <SkeletonList />
  </Stack>
)

type PanelContentProps = {
  listRef: React.RefObject<HTMLDivElement | null>
  canDeselect: boolean
  deselect: () => void
  places: PlaceModel[]
  place: PlaceModel | undefined
  scrollToTop: () => void
  userLocation: LocationType | null
  slug: string | undefined
  switchPlace: (step: 1 | -1) => void
}

const PanelContent = ({
  listRef,
  canDeselect,
  deselect,
  places,
  place,
  scrollToTop,
  userLocation,
  slug,
  switchPlace,
}: PanelContentProps): ReactElement => (
  <Stack justifyContent='space-between' height='100%'>
    <ListViewWrapper ref={listRef}>
      <PlacePanelHeader goBack={canDeselect ? deselect : null} />
      <PlaceSharedChildren
        places={places}
        place={place}
        scrollToTop={scrollToTop}
        userLocation={userLocation}
        slug={slug}
      />
    </ListViewWrapper>
    {place && places.length > 0 && <PlacePanelNavigation switchPlace={switchPlace} />}
  </Stack>
)

type PlacesDesktopProps = {
  data: PreparePlacesReturn
  selectMapFeature: (mapFeature: MapFeature | null) => void
  selectPlace: (place: PlaceModel) => void
  deselect: () => void
  userLocation: LocationType | null
  slug: string | undefined
  mapViewport?: MapViewViewport
  setMapViewport: (mapViewport: MapViewViewport) => void
  mapOverlay: ReactElement
  loading: boolean
}

const nextPlaceIndex = (step: 1 | -1, arrayLength: number, currentIndex: number): number => {
  if (currentIndex === arrayLength - 1 && step === 1) {
    return 0
  }
  if (currentIndex === 0 && step === -1) {
    return arrayLength - 1
  }
  return currentIndex + step
}

const PlacesDesktop = ({
  data,
  userLocation,
  selectMapFeature,
  selectPlace,
  deselect,
  slug,
  mapViewport,
  setMapViewport,
  mapOverlay,
  loading,
}: PlacesDesktopProps): ReactElement => {
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const listRef = useRef<HTMLDivElement>(null)
  const { places, place, mapFeatures, mapFeature } = data
  const canDeselect = !!mapFeature || !!slug
  const { contentDirection } = useTheme()

  const scrollToTop = () => {
    if (listRef.current) {
      setScrollOffset(listRef.current.scrollTop)
    }
  }

  const switchPlace = (step: 1 | -1) => {
    const currentPlaceIndex = places.findIndex(it => it.slug === place?.slug)
    const updatedIndex = nextPlaceIndex(step, places.length, currentPlaceIndex)
    const newPlace = places[updatedIndex]
    if (newPlace) {
      selectPlace(newPlace)
    }
  }

  useEffect(() => {
    listRef.current?.scrollTo({ top: mapFeature ? 0 : scrollOffset })
  }, [mapFeature, scrollOffset])

  return (
    <>
      <PanelContainer>
        {loading ? (
          <SkeletonPanelContent />
        ) : (
          <PanelContent
            listRef={listRef}
            canDeselect={canDeselect}
            deselect={deselect}
            places={places}
            place={place}
            scrollToTop={scrollToTop}
            userLocation={userLocation}
            slug={slug}
            switchPlace={switchPlace}
          />
        )}
      </PanelContainer>
      <MapView
        viewport={mapViewport}
        setViewport={setMapViewport}
        selectFeature={selectMapFeature}
        features={mapFeatures}
        currentFeature={mapFeature ?? null}
        overlay={mapOverlay}>
        <NavigationControl showCompass={false} position={contentDirection === 'rtl' ? 'bottom-left' : 'bottom-right'} />
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
          position={contentDirection === 'rtl' ? 'bottom-left' : 'bottom-right'}
        />
        <StyledMapAttribution />
      </MapView>
    </>
  )
}

export default PlacesDesktop

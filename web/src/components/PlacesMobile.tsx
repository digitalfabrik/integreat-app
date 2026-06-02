import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { GeolocateControl } from 'maplibre-gl'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LocationType, MapViewViewport, MapFeature, PreparePlacesReturn } from 'shared'
import { PlaceModel } from 'shared/api'

import useDimensions from '../hooks/useDimensions'
import BottomActionSheet, { ScrollableBottomSheetRef } from './BottomActionSheet'
import MapAttribution from './MapAttribution'
import MapView, { MapViewRef } from './MapView'
import MapZoomControls from './MapZoomControls'
import PlaceSharedChildren from './PlaceSharedChildren'
import SkeletonHeader from './SkeletonHeader'
import SkeletonList from './SkeletonList'
import { DirectionDependentBackIcon } from './base/Dialog'

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.accent,
  border: `1px solid ${theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[700]}`,
  ':hover': {
    backgroundColor: theme.palette.background.default,
  },
}))

const AttributionContainer = styled('div')`
  position: fixed;
  right: 0;
  bottom: calc(min(var(--rsbs-overlay-h, 0), ${props => props.theme.dimensions.bottomSheet.snapPoints.medium}px));
`

const MapControlsContainer = styled(AttributionContainer)`
  right: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`

const SkeletonPlaceContent = () => (
  <Stack paddingX={2}>
    <SkeletonHeader width='40%' />
    <SkeletonList />
  </Stack>
)

type PlaceContentProps = {
  canDeselect: boolean
  places: PlaceModel[]
  place: PlaceModel | undefined
  scrollToTop: () => void
  userLocation: LocationType | null
  slug: string | undefined
  t: (key: string) => string
}

const PlaceContent = ({
  canDeselect,
  places,
  place,
  scrollToTop,
  userLocation,
  slug,
  t,
}: PlaceContentProps): ReactElement => (
  <Stack padding={2} gap={1}>
    {!canDeselect && (
      <Typography component='h1' variant='h3' alignContent='center'>
        {t('common:nearby')}
      </Typography>
    )}
    <PlaceSharedChildren
      places={places}
      place={place}
      scrollToTop={scrollToTop}
      userLocation={userLocation}
      slug={slug}
    />
  </Stack>
)

type PlacesMobileProps = {
  data: PreparePlacesReturn
  userLocation: LocationType | null
  slug: string | undefined
  mapViewport?: MapViewViewport
  setMapViewport: (mapViewport: MapViewViewport) => void
  selectMapFeature: (mapFeature: MapFeature | null) => void
  deselect: () => void
  MapOverlay: ReactElement
  loading: boolean
}

const PlacesMobile = ({
  data,
  userLocation,
  slug,
  mapViewport,
  setMapViewport,
  selectMapFeature,
  deselect,
  MapOverlay,
  loading,
}: PlacesMobileProps): ReactElement => {
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const sheetRef = useRef<ScrollableBottomSheetRef>(null)
  const geocontrolPosition = useRef<HTMLDivElement>(null)
  const [mapViewRef, setMapViewRef] = useState<MapViewRef | null>(null)
  const { places, place, mapFeatures, mapFeature } = data
  const dimensions = useDimensions()
  const canDeselect = !!mapFeature || !!slug
  const { t } = useTranslation('places')

  const scrollToTop = () => {
    if (sheetRef.current?.scrollElement) {
      setScrollOffset(sheetRef.current.scrollElement.scrollTop)
    }
  }

  const handleSelectMapFeature = (feature: MapFeature | null) => {
    if (feature && sheetRef.current?.scrollElement) {
      sheetRef.current.sheet?.snapTo(dimensions.bottomSheet.snapPoints.medium)
      setScrollOffset(sheetRef.current.scrollElement.scrollTop)
    }
    selectMapFeature(feature)
  }

  useEffect(() => {
    sheetRef.current?.scrollElement?.scrollTo({ top: mapFeature ? 0 : scrollOffset })
  }, [mapFeature, scrollOffset])

  useEffect(() => {
    if (mapViewRef && geocontrolPosition.current) {
      const geocontrol = new GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      })
      mapViewRef.setGeocontrol(geocontrol)
      geocontrolPosition.current.appendChild(geocontrol._container)
    }
  }, [mapViewRef])

  return (
    <>
      <MapView
        ref={setMapViewRef}
        viewport={mapViewport}
        setViewport={setMapViewport}
        selectFeature={handleSelectMapFeature}
        snapBottomSheetTo={sheetRef.current?.sheet?.snapTo}
        features={mapFeatures}
        currentFeature={mapFeature ?? null}
        Overlay={
          <>
            {canDeselect && (
              <StyledIconButton onClick={deselect} tabIndex={0} aria-label={t('backToOverview')}>
                <DirectionDependentBackIcon />
              </StyledIconButton>
            )}
            {MapOverlay}
          </>
        }
      />
      <BottomActionSheet
        ref={sheetRef}
        sibling={
          <>
            <MapControlsContainer>
              {mapViewRef && <MapZoomControls mapViewRef={mapViewRef} />}
              <div ref={geocontrolPosition} />
            </MapControlsContainer>
            <AttributionContainer>
              <MapAttribution />
            </AttributionContainer>
          </>
        }>
        {loading ? (
          <SkeletonPlaceContent />
        ) : (
          <PlaceContent
            canDeselect={canDeselect}
            places={places}
            place={place}
            scrollToTop={scrollToTop}
            userLocation={userLocation}
            slug={slug}
            t={t}
          />
        )}
      </BottomActionSheet>
    </>
  )
}

export default PlacesMobile

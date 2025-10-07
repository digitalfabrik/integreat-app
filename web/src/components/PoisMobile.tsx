import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { GeolocateControl } from 'maplibre-gl'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LocationType, MapViewViewport, MapFeature, PreparePoisReturn } from 'shared'
import { PoiModel } from 'shared/api'

import useDimensions from '../hooks/useDimensions'
import BottomActionSheet, { ScrollableBottomSheetRef } from './BottomActionSheet'
import MapAttribution from './MapAttribution'
import MapView, { MapViewRef } from './MapView'
import PoiSharedChildren from './PoiSharedChildren'
import { DirectionDependentBackIcon } from './base/Dialog'

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.surface.main,
}))

const ListContainer = styled('div')`
  padding: 0 30px;
`

const ListTitle = styled('div')`
  margin: 12px 0;
  font-weight: 700;
`

const AttributionContainer = styled('div')`
  position: fixed;
  right: 0;
  bottom: calc(min(var(--rsbs-overlay-h, 0), ${props => props.theme.dimensions.bottomSheet.snapPoints.medium}px));
`

const GeocontrolContainer = styled(AttributionContainer)`
  right: 16px;
  margin-bottom: 24px;
`

type PoisMobileProps = {
  data: PreparePoisReturn
  userLocation: LocationType | null
  slug: string | undefined
  mapViewport?: MapViewViewport
  setMapViewport: (mapViewport: MapViewViewport) => void
  selectMapFeature: (mapFeature: MapFeature | null) => void
  selectPoi: (poi: PoiModel) => void
  deselect: () => void
  MapOverlay: ReactElement
}

const PoisMobile = ({
  data,
  userLocation,
  slug,
  mapViewport,
  setMapViewport,
  selectMapFeature,
  selectPoi,
  deselect,
  MapOverlay,
}: PoisMobileProps): ReactElement => {
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const sheetRef = useRef<ScrollableBottomSheetRef>(null)
  const geocontrolPosition = useRef<HTMLDivElement>(null)
  const [mapViewRef, setMapViewRef] = useState<MapViewRef | null>(null)
  const { pois, poi, mapFeatures, mapFeature } = data
  const dimensions = useDimensions()
  const canDeselect = !!mapFeature || !!slug
  const { t } = useTranslation('pois')

  const handleSelectPoi = (poi: PoiModel) => {
    if (sheetRef.current?.scrollElement) {
      setScrollOffset(sheetRef.current.scrollElement.scrollTop)
    }
    selectPoi(poi)
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
            <GeocontrolContainer ref={geocontrolPosition} />
            <AttributionContainer>
              <MapAttribution />
            </AttributionContainer>
          </>
        }>
        <ListContainer>
          {!canDeselect && <ListTitle>{t('common:nearby')}</ListTitle>}
          <PoiSharedChildren
            pois={pois}
            poi={poi}
            selectPoi={handleSelectPoi}
            userLocation={userLocation}
            slug={slug}
          />
        </ListContainer>
      </BottomActionSheet>
    </>
  )
}

export default PoisMobile

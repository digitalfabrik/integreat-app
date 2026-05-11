import {
  Camera,
  CameraRef,
  NativeUserLocation,
  GeoJSONSource,
  Layer,
  type LngLat,
  type LngLatBounds,
  Map as MapLibreMapView,
  MapRef,
  type PressEvent,
  type PressEventWithFeatures,
  TrackUserLocation,
} from '@maplibre/maplibre-react-native'
import type { BBox } from 'geojson'
import React, { ReactElement, type Ref, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { NativeSyntheticEvent, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import {
  animationDuration,
  clusterClickZoomFactor,
  clusterLayerId,
  clusterRadius,
  defaultViewportConfig,
  embedInCollection,
  featureLayerId,
  LocationStateType,
  LocationType,
  mapConfig,
  MapFeature,
  normalDetailZoom,
  isMultipoi,
} from 'shared'

import { clusterCountLayer, clusterLayer, markerLayer } from '../constants/layers'
import usePreviousProp from '../hooks/usePreviousProp'
import { conditionalA11yProps } from '../utils/helpers'
import MapZoomControls from './MapZoomControls'
import MapAttribution from './MapsAttribution'
import Icon from './base/Icon'
import IconButton from './base/IconButton'

const OuterWrapper = styled.View`
  flex: 1;
  position: relative;
`

const MapContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
`

const StyledMap = styled(MapLibreMapView)`
  width: 100%;
`

const StyledIcon = styled(IconButton)<{
  position: number | string
}>`
  position: absolute;
  right: 0;
  bottom: ${props => props.position}${props => (typeof props.position === 'number' ? 'px' : '')};
  background-color: ${props => props.theme.colors.secondary};
  margin: 16px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
`

const OverlayContainer = styled.View`
  flex-flow: row wrap;
  position: absolute;
  top: 24px;
  left: 8px;
  right: 8px;
  row-gap: 8px;
`

type MapViewProps = {
  boundingBox: BBox
  features: MapFeature[]
  selectedFeature: MapFeature | null
  userLocation: LocationType | null
  refreshPermissionAndLocation: () => Promise<LocationStateType | null>
  selectFeature: (feature: MapFeature | null) => void
  bottomSheetHeight: number
  bottomSheetMidHeight: number
  bottomSheetFullscreen: boolean
  zoom: number | undefined
  Overlay?: ReactElement
  zoomRef?: Ref<View>
}

const MapView = ({
  boundingBox,
  features,
  selectedFeature,
  userLocation,
  refreshPermissionAndLocation,
  selectFeature,
  Overlay,
  bottomSheetHeight,
  bottomSheetMidHeight,
  bottomSheetFullscreen,
  zoom,
  zoomRef,
}: MapViewProps): ReactElement => {
  const mapRef = useRef<MapRef>(null)
  const cameraRef = useRef<CameraRef>(null)
  const [trackUserLocation, setTrackUserLocation] = useState<TrackUserLocation | null>(null)
  const { t } = useTranslation('pois')
  const theme = useTheme()

  const bounds: LngLatBounds = [boundingBox[0], boundingBox[1], boundingBox[2], boundingBox[3]]

  const coordinates = selectedFeature?.geometry.coordinates
  const defaultZoom = coordinates ? normalDetailZoom : defaultViewportConfig.zoom

  const initialCameraSettings = {
    ...(coordinates !== undefined ? { center: coordinates as LngLat } : { bounds }),
    zoom: zoom ?? defaultZoom,
    padding: { bottom: bottomSheetHeight },
  }

  const moveTo = useCallback(
    (position: LngLat, zoomLevel = normalDetailZoom) => {
      cameraRef.current?.easeTo({
        center: position,
        zoom: zoomLevel,
        duration: animationDuration,
        padding: { bottom: bottomSheetMidHeight },
      })
    },
    [bottomSheetMidHeight],
  )

  const onRequestLocation = useCallback(async () => {
    const newUserLocation = (await refreshPermissionAndLocation())?.userLocation
    if (newUserLocation) {
      moveTo(newUserLocation)
      setTrackUserLocation('default')
    }
  }, [refreshPermissionAndLocation, moveTo])

  usePreviousProp({
    prop: selectedFeature?.id,
    onPropChange: () => selectedFeature && moveTo(selectedFeature.geometry.coordinates as LngLat),
  })

  usePreviousProp({
    prop: bottomSheetHeight,
    onPropChange: (newHeight, oldHeight) =>
      newHeight > oldHeight && selectedFeature && moveTo(selectedFeature.geometry.coordinates as LngLat),
  })

  const zoomOnClusterPress = async (pressedCoordinates: [number, number]) => {
    const clusterCollection = await mapRef.current?.queryRenderedFeatures(pressedCoordinates, {
      layers: [clusterLayerId],
    })
    const feature = clusterCollection?.[0] as MapFeature | undefined
    if (feature && mapRef.current !== null) {
      moveTo(feature.geometry.coordinates as LngLat, (await mapRef.current.getZoom()) + clusterClickZoomFactor)
    }
  }

  const onPress = async (event: NativeSyntheticEvent<PressEvent | PressEventWithFeatures>) => {
    if (mapRef.current === null) {
      return
    }
    const pressedCoordinates = event.nativeEvent.point
    const featureCollection = await mapRef.current.queryRenderedFeatures(pressedCoordinates, {
      layers: [featureLayerId, 'selected-marker'],
    })

    const feature = featureCollection.find((it): it is MapFeature => it.geometry.type === 'Point')
    selectFeature(feature ?? null)

    if (feature && isMultipoi(feature)) {
      await zoomOnClusterPress(pressedCoordinates)
    }
  }

  const locationPermissionGrantedIcon = trackUserLocation ? 'crosshairs-gps' : 'crosshairs'
  const locationPermissionIcon = userLocation ? locationPermissionGrantedIcon : 'crosshairs-off'

  return (
    <OuterWrapper>
      <MapContainer importantForAccessibility='no' accessibilityElementsHidden>
        <StyledMap
          {...conditionalA11yProps({ hidden: bottomSheetFullscreen })}
          mapStyle={mapConfig.styleJSON}
          onPress={onPress}
          ref={mapRef}
          attribution={false}
          logo={false}>
          {userLocation && <NativeUserLocation />}
          <GeoJSONSource
            id='location-pois'
            data={embedInCollection(features.filter(feature => feature !== selectedFeature))}
            cluster
            clusterRadius={clusterRadius}>
            <Layer type='circle' {...clusterLayer(theme)} />
            <Layer type='symbol' {...clusterCountLayer} />
            <Layer type='symbol' {...markerLayer(null)} />
          </GeoJSONSource>
          {selectedFeature && (
            <GeoJSONSource id='selected-feature' data={embedInCollection([selectedFeature])}>
              <Layer type='symbol' {...markerLayer(selectedFeature)} id='selected-marker' />
            </GeoJSONSource>
          )}
          <Camera
            onTrackUserLocationChange={event => setTrackUserLocation(event.nativeEvent.trackUserLocation)}
            trackUserLocation={trackUserLocation ?? undefined}
            ref={cameraRef}
            initialViewState={initialCameraSettings}
          />
        </StyledMap>
      </MapContainer>
      <OverlayContainer {...conditionalA11yProps({ hidden: bottomSheetFullscreen })}>{Overlay}</OverlayContainer>
      <MapAttribution accessible={bottomSheetFullscreen} />
      <StyledIcon
        {...conditionalA11yProps({ hidden: bottomSheetFullscreen })}
        icon={
          <Icon color={theme.dark ? theme.colors.background : theme.colors.onSurface} source={locationPermissionIcon} />
        }
        onPress={onRequestLocation}
        position={bottomSheetHeight}
        accessibilityLabel={t('showOwnLocation')}
      />
      <MapZoomControls mapRef={mapRef} cameraRef={cameraRef} bottomSheetHeight={bottomSheetHeight} ref={zoomRef} />
    </OuterWrapper>
  )
}

export default MapView

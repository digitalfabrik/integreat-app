import {
  Camera,
  NativeUserLocation,
  type CameraRef,
  type CameraStop,
  GeoJSONSource,
  Layer,
  type LngLat,
  type LngLatBounds,
  Map as MapLibreMapView,
  MapRef,
  type PressEvent,
  type PressEventWithFeatures,
  useCurrentPosition,
} from '@maplibre/maplibre-react-native'
import type { BBox, Feature, GeoJsonProperties, Geometry, Position } from 'geojson'
import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { NativeSyntheticEvent } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import {
  animationDuration,
  clusterClickZoomFactor,
  clusterLayerId,
  clusterRadius,
  defaultViewportConfig,
  calculateDistance,
  embedInCollection,
  featureLayerId,
  LocationType,
  mapConfig,
  MapFeature,
  MIN_DISTANCE_THRESHOLD,
  normalDetailZoom,
} from 'shared'

import { clusterCountLayer, clusterLayer, markerLayer } from '../constants/layers'
import useUserLocation from '../hooks/useUserLocation'
import { conditionalA11yProps } from '../utils/helpers'
import { reportError } from '../utils/sentry'
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
  setUserLocation: (userLocation: LocationType | null) => void
  selectFeature: (feature: MapFeature | null) => void
  bottomSheetHeight: number
  bottomSheetFullscreen: boolean
  zoom: number | undefined
  Overlay?: ReactElement
}

const MapView = ({
  boundingBox,
  features,
  selectedFeature,
  userLocation,
  setUserLocation,
  selectFeature,
  Overlay,
  bottomSheetHeight,
  bottomSheetFullscreen,
  zoom,
}: MapViewProps): ReactElement => {
  const toLngLat = (position: Position): LngLat => {
    const [longitude, latitude] = position

    if (longitude === undefined || latitude === undefined) {
      reportError('Expected two-dimensional map coordinates.')
      return [0, 0]
    }

    return [longitude, latitude]
  }

  const mapRef = useRef<MapRef>(null)
  const cameraRef = useRef<CameraRef>(null)
  const [followUserLocation, setFollowUserLocation] = useState<boolean>(false)
  const { refreshPermissionAndLocation } = useUserLocation({ requestPermissionInitially: true })
  const currentPosition = useCurrentPosition()
  const { t } = useTranslation('pois')
  const theme = useTheme()

  const bounds: LngLatBounds = [boundingBox[0], boundingBox[1], boundingBox[2], boundingBox[3]]

  const coordinates = selectedFeature?.geometry.coordinates
  const lngLatCoordinates = coordinates ? toLngLat(coordinates) : undefined
  const defaultZoom = coordinates ? normalDetailZoom : defaultViewportConfig.zoom

  const [cameraSettings, setCameraSettings] = useState<CameraStop>({
    ...(lngLatCoordinates !== undefined ? { center: lngLatCoordinates } : { bounds }),
    zoom: zoom ?? defaultZoom,
    duration: animationDuration,
    easing: 'ease',
  })

  const moveTo = useCallback((location: LngLat, zoomLevel = normalDetailZoom) => {
    setCameraSettings({
      center: location,
      zoom: zoomLevel,
      duration: animationDuration,
      easing: 'ease',
    })
  }, [])

  const onRequestLocation = useCallback(async () => {
    const currentUserLocation: LocationType | null =
      currentPosition?.coords == null ? null : [currentPosition.coords.longitude, currentPosition.coords.latitude]
    const newUserLocation = currentUserLocation ?? userLocation ?? (await refreshPermissionAndLocation())?.coordinates
    if (newUserLocation) {
      setUserLocation(newUserLocation)
      moveTo(newUserLocation)
      cameraRef.current?.easeTo({
        center: newUserLocation,
        zoom: normalDetailZoom,
        duration: animationDuration,
        padding: { bottom: bottomSheetHeight },
      })
      setFollowUserLocation(true)
    }
  }, [bottomSheetHeight, currentPosition, refreshPermissionAndLocation, moveTo, setUserLocation, userLocation])

  // Recenter on the selected marker.
  useEffect(() => {
    if (selectedFeature) {
      moveTo(toLngLat(selectedFeature.geometry.coordinates))
      setFollowUserLocation(false)
    }
  }, [moveTo, selectedFeature])

  // Set device position.
  useEffect(() => {
    if (currentPosition?.coords == null) {
      return
    }

    const currentUserLocation: LocationType = [currentPosition.coords.longitude, currentPosition.coords.latitude]

    // Avoid frequent rerenders if distance only changes minimally
    if (!userLocation || calculateDistance(userLocation, currentUserLocation) > MIN_DISTANCE_THRESHOLD) {
      setUserLocation(currentUserLocation)
    }
  }, [currentPosition, setUserLocation, userLocation])

  const zoomOnClusterPress = async (pressedCoordinates: [number, number]) => {
    const clusterCollection: Feature<Geometry, GeoJsonProperties>[] | undefined =
      await mapRef.current?.queryRenderedFeatures(pressedCoordinates, {
        layers: [clusterLayerId],
      })
    const feature = clusterCollection?.[0] as MapFeature | undefined
    if (feature && mapRef.current !== null) {
      moveTo(toLngLat(feature.geometry.coordinates), (await mapRef.current.getZoom()) + clusterClickZoomFactor)
    }
  }

  const onPress = async (event: NativeSyntheticEvent<PressEvent | PressEventWithFeatures>) => {
    setFollowUserLocation(false)
    if (mapRef.current === null) {
      return
    }
    const pressedCoordinates = event.nativeEvent.point
    const featureCollection: Feature<Geometry, GeoJsonProperties>[] = await mapRef.current.queryRenderedFeatures(
      pressedCoordinates,
      { layers: [featureLayerId, 'selected-marker'] },
    )

    const feature = featureCollection.find((it): it is MapFeature => it.geometry.type === 'Point')
    selectFeature(feature ?? null)

    zoomOnClusterPress(pressedCoordinates)
  }

  const locationPermissionGrantedIcon = followUserLocation ? 'crosshairs-gps' : 'crosshairs'
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
          {followUserLocation && <NativeUserLocation />}
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
            ref={cameraRef}
            {...cameraSettings}
            trackUserLocation={followUserLocation ? 'default' : undefined}
            padding={{ bottom: bottomSheetHeight }}
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
    </OuterWrapper>
  )
}

export default MapView

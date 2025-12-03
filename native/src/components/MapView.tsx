import {
  Camera,
  CircleLayer,
  Location,
  MapView as MapLibreMapView,
  MapViewRef,
  ShapeSource,
  SymbolLayer,
  UserLocation,
  UserTrackingMode,
} from '@maplibre/maplibre-react-native'
import type { BBox, Feature, GeoJsonProperties, Geometry } from 'geojson'
import { Position } from 'geojson'
import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import MapAttribution from './MapsAttribution'
import Icon from './base/Icon'
import IconButton from './base/IconButton'

const MapContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
`

const StyledMap = styled(MapLibreMapView)`
  width: 100%;
`

const StyledIcon = styled(IconButton)<{ position: number | string }>`
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
  flex: 1;
  flex-direction: row;
  position: absolute;
  top: 24px;
  left: 8px;
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
  const mapRef = useRef<MapViewRef>(null)
  const [followUserLocation, setFollowUserLocation] = useState<boolean>(false)
  const { refreshPermissionAndLocation } = useUserLocation({ requestPermissionInitially: true })
  const { t } = useTranslation('pois')
  const theme = useTheme()

  const bounds = {
    ne: [boundingBox[2], boundingBox[3]],
    sw: [boundingBox[0], boundingBox[1]],
  }

  const coordinates = selectedFeature?.geometry.coordinates
  const defaultZoom = coordinates ? normalDetailZoom : defaultViewportConfig.zoom

  const [cameraSettings, setCameraSettings] = useState<{
    zoomLevel: number
    centerCoordinate: Position | undefined
    bounds?: { ne: number[]; sw: number[] } | undefined
    animationDuration: number
  }>({
    zoomLevel: zoom ?? defaultZoom,
    centerCoordinate: coordinates,
    bounds: coordinates ? undefined : bounds,
    animationDuration,
  })

  const moveTo = useCallback(
    (location: Position, zoomLevel = normalDetailZoom) =>
      setCameraSettings({
        centerCoordinate: location,
        zoomLevel,
        animationDuration,
      }),
    [],
  )

  const onRequestLocation = useCallback(async () => {
    const newUserLocation = userLocation ?? (await refreshPermissionAndLocation())?.coordinates
    if (newUserLocation) {
      moveTo(newUserLocation)
      setFollowUserLocation(true)
    }
  }, [refreshPermissionAndLocation, moveTo, userLocation])

  useEffect(() => {
    if (selectedFeature) {
      moveTo(selectedFeature.geometry.coordinates)
      setFollowUserLocation(false)
    }
  }, [moveTo, selectedFeature])

  const zoomOnClusterPress = async (pressedCoordinates: [number, number]) => {
    const clusterCollection = await mapRef.current?.queryRenderedFeaturesAtPoint(pressedCoordinates, undefined, [
      clusterLayerId,
    ])
    if (clusterCollection && 0 in clusterCollection.features && mapRef.current) {
      const feature = clusterCollection.features[0] as MapFeature
      moveTo(feature.geometry.coordinates, (await mapRef.current.getZoom()) + clusterClickZoomFactor)
    }
  }

  const onPress = async (pressedLocation: Feature<Geometry, GeoJsonProperties>) => {
    setFollowUserLocation(false)
    if (!mapRef.current || !pressedLocation.properties) {
      return
    }
    const pressedCoordinates: [number, number] = [
      pressedLocation.properties.screenPointX,
      pressedLocation.properties.screenPointY,
    ]
    const featureCollection = await mapRef.current.queryRenderedFeaturesAtPoint(pressedCoordinates, undefined, [
      featureLayerId,
      'selected-marker',
    ])

    const feature = featureCollection.features.find((it): it is MapFeature => it.geometry.type === 'Point')
    selectFeature(feature ?? null)

    zoomOnClusterPress(pressedCoordinates)
  }

  const updateUserLocation = (location: Location) => {
    const newUserLocation: [number, number] = [location.coords.longitude, location.coords.latitude]
    // Avoid frequent rerenders if distance only changes minimally
    if (!userLocation || calculateDistance(userLocation, newUserLocation) > MIN_DISTANCE_THRESHOLD) {
      setUserLocation(newUserLocation)
    }
  }

  const locationPermissionGrantedIcon = followUserLocation ? 'crosshairs-gps' : 'crosshairs'
  const locationPermissionIcon = userLocation ? locationPermissionGrantedIcon : 'crosshairs-off'

  return (
    <MapContainer importantForAccessibility='no' accessibilityElementsHidden>
      <StyledMap
        mapStyle={mapConfig.styleJSON}
        zoomEnabled
        onPress={onPress}
        ref={mapRef}
        attributionEnabled={false}
        logoEnabled={false}>
        <UserLocation visible={!!userLocation} onUpdate={updateUserLocation} />
        <ShapeSource
          id='location-pois'
          shape={embedInCollection(features.filter(feature => feature !== selectedFeature))}
          cluster
          clusterRadius={clusterRadius}>
          <CircleLayer {...clusterLayer(theme.legacy)} />
          <SymbolLayer {...clusterCountLayer} />
          <SymbolLayer {...markerLayer(null)} />
        </ShapeSource>
        {selectedFeature && (
          <ShapeSource id='selected-feature' shape={embedInCollection([selectedFeature])}>
            <SymbolLayer {...markerLayer(selectedFeature)} id='selected-marker' />
          </ShapeSource>
        )}
        <Camera
          {...cameraSettings}
          followUserMode={UserTrackingMode.Follow}
          animationDuration={animationDuration}
          animationMode='easeTo'
          padding={{ paddingBottom: bottomSheetHeight }}
        />
      </StyledMap>
      {Boolean(!bottomSheetFullscreen) && (
        <>
          <OverlayContainer>{Overlay}</OverlayContainer>
          <MapAttribution />
          <StyledIcon
            icon={
              <Icon
                color={theme.legacy.isContrastTheme ? theme.colors.background : theme.colors.onSurface}
                source={locationPermissionIcon}
              />
            }
            onPress={onRequestLocation}
            position={bottomSheetFullscreen ? 0 : bottomSheetHeight}
            accessibilityLabel={t('showOwnLocation')}
          />
        </>
      )}
    </MapContainer>
  )
}

export default MapView

import MapLibreGL, { CameraSettings, MapLibreGLEvent } from '@maplibre/maplibre-react-native'
import type { BBox, Feature } from 'geojson'
import React, { ReactElement, useCallback, useLayoutEffect, useRef } from 'react'
import { useWindowDimensions } from 'react-native'
import { FAB } from 'react-native-elements'
import styled, { useTheme } from 'styled-components/native'

import {
  clusterRadius,
  defaultViewportConfig,
  normalDetailZoom,
  mapConfig,
  MapFeature,
  MapFeatureCollection,
  animationDuration,
} from 'api-client'

import { clusterCountLayer, clusterLayer, markerLayer } from '../constants/layers'
import { midSnapPointPercentage } from '../routes/Pois'
import MapAttribution from './MapsAttribution'

const MapContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
`
const StyledMap = styled(MapLibreGL.MapView)`
  width: 100%;
`

const StyledFAB = styled(FAB)<{ position: number | string }>`
  align-items: flex-end;
  bottom: ${props => props.position}${props => (typeof props.position === 'number' ? 'px' : '')};
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
  featureCollection: MapFeatureCollection
  selectedFeature: MapFeature | null
  onRequestLocationPermission: () => Promise<void>
  locationPermissionGranted: boolean
  fabPosition: string | number
  selectFeature: (feature: MapFeature | null) => void
  setSheetSnapPointIndex: (index: number) => void
  followUserLocation: boolean
  setFollowUserLocation: (value: boolean) => void
  Overlay?: ReactElement
}

const featureLayerId = 'point'

// Has to be set even if we use map libre
MapLibreGL.setAccessToken(null)
const MapView = ({
  boundingBox,
  featureCollection,
  selectedFeature,
  fabPosition,
  onRequestLocationPermission,
  locationPermissionGranted,
  selectFeature,
  setSheetSnapPointIndex,
  followUserLocation,
  setFollowUserLocation,
  Overlay,
}: MapViewProps): ReactElement => {
  const deviceHeight = useWindowDimensions().height
  const cameraRef = useRef<MapLibreGL.Camera | null>(null)
  const mapRef = useRef<MapLibreGL.MapView | null>(null)
  const theme = useTheme()

  const bounds = {
    ne: [boundingBox[2], boundingBox[3]],
    sw: [boundingBox[0], boundingBox[1]],
  }

  // if there is a current feature use the coordinates; if not use bounding box
  const coordinates = selectedFeature?.geometry.coordinates
  const defaultSettings: CameraSettings = {
    zoomLevel: coordinates ? normalDetailZoom : defaultViewportConfig.zoom,
    centerCoordinate: coordinates,
    bounds: coordinates ? undefined : bounds,
  }

  const onRequestLocation = useCallback(async () => {
    await onRequestLocationPermission()
    setFollowUserLocation(true)
  }, [onRequestLocationPermission, setFollowUserLocation])

  const onUserTrackingModeChange = (
    event: MapLibreGLEvent<'usertrackingmodechange', { followUserLocation: boolean }>,
  ) => {
    if (!event.nativeEvent.payload.followUserLocation) {
      setFollowUserLocation(event.nativeEvent.payload.followUserLocation)
    }
  }

  // Wait for followUserLocation change before moving the camera to avoid position lock
  // https://github.com/rnmapbox/maps/issues/1079
  useLayoutEffect(() => {
    if (!followUserLocation && selectedFeature && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: selectedFeature.geometry.coordinates,
        zoomLevel: normalDetailZoom,
        animationDuration,
        padding: { paddingBottom: deviceHeight * midSnapPointPercentage },
      })
    }
  }, [deviceHeight, followUserLocation, selectedFeature])

  const locationPermissionGrantedIcon = followUserLocation ? 'my-location' : 'location-searching'
  const locationPermissionIcon = locationPermissionGranted ? locationPermissionGrantedIcon : 'location-disabled'

  const onPress = async (pressedLocation: Feature) => {
    if (!mapRef.current || !pressedLocation.properties) {
      return
    }
    const featureCollection = await mapRef.current.queryRenderedFeaturesAtPoint(
      [pressedLocation.properties.screenPointX, pressedLocation.properties.screenPointY],
      undefined,
      [featureLayerId],
    )

    const feature = featureCollection?.features.find((it): it is MapFeature => it.geometry.type === 'Point')
    selectFeature(feature ?? null)
    setSheetSnapPointIndex(1)
  }

  return (
    <MapContainer>
      <StyledMap
        styleJSON={mapConfig.styleJSON}
        zoomEnabled
        onPress={onPress}
        ref={mapRef}
        attributionEnabled={false}
        logoEnabled={false}>
        <MapLibreGL.UserLocation visible={locationPermissionGranted} />
        <MapLibreGL.ShapeSource id='location-pois' shape={featureCollection} cluster clusterRadius={clusterRadius}>
          <MapLibreGL.SymbolLayer {...clusterCountLayer} />
          <MapLibreGL.CircleLayer {...clusterLayer(theme)} />
          <MapLibreGL.SymbolLayer {...markerLayer(selectedFeature, featureLayerId)} />
        </MapLibreGL.ShapeSource>
        <MapLibreGL.Camera
          defaultSettings={defaultSettings}
          followUserMode='normal'
          followUserLocation={followUserLocation && locationPermissionGranted}
          onUserTrackingModeChange={onUserTrackingModeChange}
          ref={cameraRef}
        />
      </StyledMap>
      <OverlayContainer>{Overlay}</OverlayContainer>
      <MapAttribution />
      <StyledFAB
        placement='right'
        onPress={onRequestLocation}
        buttonStyle={{ borderRadius: 50 }}
        icon={{ name: locationPermissionIcon }}
        color={theme.colors.themeColor}
        position={fabPosition}
      />
    </MapContainer>
  )
}

export default MapView

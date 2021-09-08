import MapboxGL, { CameraSettings, MapboxGLEvent, SymbolLayerProps } from '@react-native-mapbox-gl/maps'
import type { BBox, Feature, FeatureCollection, Point } from 'geojson'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { FAB } from 'react-native-elements'
import { PermissionStatus, RESULTS } from 'react-native-permissions'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { defaultViewportConfig, detailZoom, mapConfig } from 'api-client'

import MapPopup from './MapPopup'

import { checkLocationPermission, requestLocationPermission } from '../utils/LocationPermissionManager'

const MapContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`
const StyledMap = styled(MapboxGL.MapView)`
  width: 100%;
  height: 500px;
`

type MapViewPropsType = {
  boundingBox: BBox
  featureCollection: FeatureCollection
  currentFeature?: Feature<Point>
}

const textOffsetY = 1.25
const featureLayerId = 'point'

// Has to be set even if we use map libre
MapboxGL.setAccessToken(mapConfig.accessToken)
const MapView = ({ boundingBox, featureCollection, currentFeature }: MapViewPropsType): ReactElement => {
  const mapRef = React.useRef<MapboxGL.MapView | null>(null)
  const cameraRef = React.useRef<MapboxGL.Camera | null>(null)
  const [selectedFeature, setSelectedFeature] = useState<Feature<Point> | null>(currentFeature ?? null)
  const layerProps: SymbolLayerProps = {
    id: featureLayerId,
    style: {
      symbolPlacement: 'point',
      iconAllowOverlap: true,
      iconIgnorePlacement: true,
      iconImage: ['get', 'symbol'],
      textField: ['get', 'title'],
      textFont: ['Roboto Regular'],
      textOffset: [0, textOffsetY],
      textAnchor: 'top',
      textSize: 12
    }
  }

// Has to be set even if we use map libre
MapboxGL.setAccessToken(mapConfig.accessToken)
const MapView = ({ boundingBox, featureCollection }: MapViewPropsType): ReactElement => {
  const [followUserLocation, setFollowUserLocation] = useState<boolean>(false)
  const [locationPermissionGranted, setLocationPermissionGranted] = useState<boolean>(false)
  const theme = useTheme()

  const bounds = {
    ne: [boundingBox[2], boundingBox[3]],
    sw: [boundingBox[0], boundingBox[1]]
  }

  // if there is a current feature use the coordinates if not use bounding box
  const coordinates = selectedFeature?.geometry?.coordinates
  const defaultSettings: CameraSettings = {
    zoomLevel: coordinates ? detailZoom : defaultViewportConfig.zoom,
    centerCoordinate: coordinates,
    bounds: coordinates ? undefined : bounds
  }

  const onLocationPermissionRequest = useCallback((locationPermission: PermissionStatus | undefined) => {
    const permissionGranted = locationPermission === RESULTS.GRANTED
    setFollowUserLocation(permissionGranted)
    setLocationPermissionGranted(permissionGranted)
  }, [])

  useEffect(() => {
    checkLocationPermission().then(onLocationPermissionRequest)
  }, [onLocationPermissionRequest])

  const requestPermission = useCallback(() => {
    requestLocationPermission().then(onLocationPermissionRequest)
  }, [onLocationPermissionRequest])

  const onUserTrackingModeChange = (
    event: MapboxGLEvent<'usertrackingmodechange', { followUserLocation: boolean }>
  ) => {
    setFollowUserLocation(event.nativeEvent.payload.followUserLocation)
  }

  const locationPermissionIcon =
    locationPermissionGranted && followUserLocation
      ? 'my-location'
      : locationPermissionGranted
      ? 'location-searching'
      : 'location-disabled'


  const onPress = useCallback(async (pressedLocation: Feature) => {
    if (!mapRef?.current || !cameraRef?.current || !pressedLocation.properties) {
      return
    }
    const featureCollection = await mapRef.current.queryRenderedFeaturesAtPoint(
      [pressedLocation.properties.screenPointX, pressedLocation.properties.screenPointY],
      undefined,
      [featureLayerId]
    )
    const feature = featureCollection?.features?.find((it): it is Feature<Point> => it.geometry.type === 'Point')
    if (feature) {
      setSelectedFeature(feature)
      const {
        geometry: { coordinates }
      } = feature
      cameraRef.current.flyTo(coordinates)
    } else {
      setSelectedFeature(null)
    }
  }, [])

  return (
    <MapContainer>
      <StyledMap styleJSON={mapConfig.styleJSON} zoomEnabled onPress={onPress} ref={mapRef}>
        <MapboxGL.UserLocation visible={locationPermissionGranted} />
        <MapboxGL.ShapeSource id='location-pois' shape={featureCollection}>
          <MapboxGL.SymbolLayer {...layerProps} />
        </MapboxGL.ShapeSource>
        <MapboxGL.Camera
          defaultSettings={defaultSettings}
          followUserMode='normal'
          followUserLocation={followUserLocation}
          onUserTrackingModeChange={onUserTrackingModeChange}
          ref={cameraRef}
        />

      {selectedFeature && <MapPopup feature={selectedFeature} />}
      </StyledMap>
      <FAB
        placement='right'
        onPress={requestPermission}
        icon={{ name: locationPermissionIcon }}
        color={theme.colors.themeColor}
      />
    </MapContainer>
  )
}

export default MapView

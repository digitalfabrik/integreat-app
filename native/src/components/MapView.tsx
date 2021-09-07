import MapboxGL, { CameraSettings, MapboxGLEvent, SymbolLayerProps } from '@react-native-mapbox-gl/maps'
import type { BBox, FeatureCollection } from 'geojson'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { FAB } from 'react-native-elements'
import { PermissionStatus, RESULTS } from 'react-native-permissions'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { defaultViewportConfig, mapConfig } from 'api-client'

import { checkLocationPermission, requestLocationPermission } from '../utils/LocationPermissionManager'

const MapContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`
const StyledMap = styled(MapboxGL.MapView)`
  width: 700px;
  height: 500px;
`

type MapViewPropsType = {
  boundingBox: BBox
  featureCollection: FeatureCollection
}

const textOffsetY = 1.25
const layerProps: SymbolLayerProps = {
  id: 'point',
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

  const defaultSettings: CameraSettings = {
    zoomLevel: defaultViewportConfig.zoom,
    bounds
  }

  const onLocationPermissionRequest = useCallback((locationPermission: PermissionStatus | undefined) => {
    if (locationPermission === RESULTS.GRANTED) {
      setFollowUserLocation(true)
      setLocationPermissionGranted(true)
    } else {
      setFollowUserLocation(false)
      setLocationPermissionGranted(false)
    }
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

  return (
    <MapContainer>
      <StyledMap styleJSON={mapConfig.styleJSON} zoomEnabled>
        <MapboxGL.UserLocation visible={locationPermissionGranted} />
        <MapboxGL.ShapeSource id='location-pois' shape={featureCollection}>
          <MapboxGL.SymbolLayer {...layerProps} />
        </MapboxGL.ShapeSource>
        <MapboxGL.Camera
          defaultSettings={defaultSettings}
          followUserMode={'normal'}
          followUserLocation={followUserLocation}
          onUserTrackingModeChange={onUserTrackingModeChange}
        />
      </StyledMap>
      <FAB
        placement={'right'}
        onPress={requestPermission}
        icon={{ name: locationPermissionIcon }}
        color={theme.colors.themeColor}
      />
    </MapContainer>
  )
}

export default MapView

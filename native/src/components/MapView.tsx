import React, { ReactElement, useCallback, useState } from 'react'
import styled from 'styled-components/native'
import MapboxGL, { CameraSettings, SymbolLayerProps } from '@react-native-mapbox-gl/maps'
import type { BBox, FeatureCollection } from 'geojson'
import { defaultViewportConfig, mapConfig } from 'api-client'
import LocationButton from './LocationButton'

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
  const [locationPermission, setLocationPermission] = useState(false)
  const [followUserLocation, setFollowUserLocation] = useState(false)

  const bounds = {
    ne: [boundingBox[2], boundingBox[3]],
    sw: [boundingBox[0], boundingBox[1]]
  }

  const defaultSettings: CameraSettings = {
    zoomLevel: defaultViewportConfig.zoom,
    bounds
  }

  const updateLocationPermission = useCallback((locationPermission: boolean) => {
    setLocationPermission(locationPermission)
    setFollowUserLocation(false)
    if (locationPermission) {
      setFollowUserLocation(true)
    }
  }, [])


  return (
    <MapContainer>
      <StyledMap styleJSON={mapConfig.styleJSON} zoomEnabled>
        <MapboxGL.UserLocation visible={locationPermission} />
        <MapboxGL.ShapeSource id='location-pois' shape={featureCollection}>
          <MapboxGL.SymbolLayer {...layerProps} />
        </MapboxGL.ShapeSource>
        <MapboxGL.Camera defaultSettings={defaultSettings}
                         followUserLocation={followUserLocation}
                         followZoomLevel={16}/>
      </StyledMap>
      <LocationButton updateLocationPermission={updateLocationPermission} />
    </MapContainer>
  )
}

export default MapView

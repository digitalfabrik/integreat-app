import React, { ReactElement, useState } from 'react'
import styled from 'styled-components/native'
import MapboxGL, { CameraSettings } from '@react-native-mapbox-gl/maps'
import type { BBox } from 'geojson'
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
}

// Has to be set even if we use map libre
MapboxGL.setAccessToken(mapConfig.accessToken)
const MapView = ({ boundingBox }: MapViewPropsType): ReactElement => {
  const [locationPermission, setLocationPermission] = useState(false)

  const bounds = {
    ne: [boundingBox[2], boundingBox[3]],
    sw: [boundingBox[0], boundingBox[1]]
  }

  const defaultSettings: CameraSettings = {
    zoomLevel: defaultViewportConfig.zoom,
    bounds
  }

  return (
    <MapContainer>
      <StyledMap styleJSON={mapConfig.styleJSON} zoomEnabled>
        <MapboxGL.UserLocation visible={locationPermission} />
        <MapboxGL.Camera defaultSettings={defaultSettings} />
      </StyledMap>
      <LocationButton setLocationPermission={setLocationPermission}/>
    </MapContainer>
  )
}

export default MapView

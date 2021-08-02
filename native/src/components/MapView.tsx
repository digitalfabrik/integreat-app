import React, { ReactElement } from 'react'
import styled from 'styled-components/native'
import MapboxGL from '@react-native-mapbox-gl/maps'

import { mapConfig } from 'api-client'

const MapContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`
const StyledMap = styled(MapboxGL.MapView)`
  width: 700px;
  height: 500px;
`

MapboxGL.setAccessToken(mapConfig.accessToken)
const MapView: React.FunctionComponent = (): ReactElement => {
  return (
    <MapContainer>
      <StyledMap styleJSON={mapConfig.styleJSON} zoomEnabled />
    </MapContainer>
  )
}

export default MapView

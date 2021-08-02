import React, { ReactElement } from 'react'
import styled from 'styled-components/native'
import MapboxGL from '@react-native-mapbox-gl/maps'

import { mapConfig } from 'api-client'

const StyledContainer = styled.View`
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
    <StyledContainer>
      <StyledMap styleJSON={mapConfig.styleJSON} zoomEnabled />
    </StyledContainer>
  )
}

export default MapView

import React, { ReactElement } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import MapboxGL from '@react-native-mapbox-gl/maps'

import { mapConfig } from 'api-client/src/maps'

const StyledMap = styled(MapboxGL.MapView)`
  width: 700px;
  height: 500px;
`
MapboxGL.setAccessToken(mapConfig.accessToken)
const MapView: React.FunctionComponent = (): ReactElement => {
  return (
    <View>
      <View>
        <StyledMap styleJSON={mapConfig.styleJSON} zoomEnabled />
      </View>
    </View>
  )
}

export default MapView

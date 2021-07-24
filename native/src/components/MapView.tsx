import MapboxGL from '@react-native-mapbox-gl/maps'
import React, { ReactElement } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'

const StyledMap = styled(MapboxGL.MapView)`
  width: 700px;
  height: 500px;
  resize-mode: contain;
`
MapboxGL.setAccessToken('<YOUR_ACCESSTOKEN>')
const MapView: React.FunctionComponent = (): ReactElement => {
  return (
    <View>
      <View>
        <StyledMap styleJSON={'https://integreat.github.io/integreat-osm-liberty/style.json'} zoomEnabled />
      </View>
    </View>
  )
}

export default MapView

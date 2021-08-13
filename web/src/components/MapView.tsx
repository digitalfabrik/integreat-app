import React, { useEffect, useState } from 'react'
import ReactMapGL, { FullscreenControl, GeolocateControl, Layer, LayerProps, Source } from 'react-map-gl'
import styled from 'styled-components'
import 'maplibre-gl/dist/maplibre-gl.css'

import { defaultViewportConfig, mapConfig } from 'api-client'
import { geoJSON } from '../__mocks__/geoJSON'

const MapContainer = styled.div`
  display: flex;
  justify-content: center;
`

const layerStyle: LayerProps = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf'
  }
}
const geolocateControlStyle = {
  right: 10,
  top: 10
}

const MapView: React.FunctionComponent = () => {
  const [viewport, setViewport] = useState(defaultViewportConfig)

  return (
    <MapContainer>
      <ReactMapGL {...viewport} onViewportChange={setViewport} mapStyle={mapConfig.styleJSON}>
        <GeolocateControl
          style={geolocateControlStyle}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
        <Source id='my-data' type='geojson' data={geoJSON}>
          <Layer {...layerStyle} />
        </Source>
      </ReactMapGL>
    </MapContainer>
  )
}

export default MapView

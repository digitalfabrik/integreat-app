import React, { useState } from 'react'
import ReactMapGL from 'react-map-gl'
import styled from 'styled-components'
import 'maplibre-gl/dist/maplibre-gl.css'

import { defaultViewportConfig, mapConfig } from 'api-client'

const MapContainer = styled.div`
  display: flex;
  justify-content: center;
`

const MapView: React.FunctionComponent = () => {
  const [viewport, setViewport] = useState(defaultViewportConfig)

  return (
    <MapContainer>
      <ReactMapGL {...viewport} onViewportChange={setViewport} mapStyle={mapConfig.styleJSON} />
    </MapContainer>
  )
}

export default MapView

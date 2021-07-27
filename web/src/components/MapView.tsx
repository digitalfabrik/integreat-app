import React, { useState } from 'react'
import ReactMapGL from 'react-map-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import { defaultViewportConfig, mapStyleUrl } from 'api-client/src/mapView'

const MapView: React.FunctionComponent = () => {
  const [viewport, setViewport] = useState(defaultViewportConfig)

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <ReactMapGL {...viewport} onViewportChange={nextViewport => setViewport(nextViewport)} mapStyle={mapStyleUrl} />
    </div>
  )
}

export default MapView

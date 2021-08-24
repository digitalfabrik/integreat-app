import React, { ReactElement, useState } from 'react'
import ReactMapGL, { GeolocateControl, Layer, LayerProps, Source } from 'react-map-gl'
import styled from 'styled-components'
import 'maplibre-gl/dist/maplibre-gl.css'
import { defaultViewportConfig, mapConfig } from 'api-client'
import { FeatureCollection } from 'geojson'

const MapContainer = styled.div`
  display: flex;
  justify-content: center;
`

const textOffsetY = 1.25
const layerStyle: LayerProps = {
  id: 'point',
  type: 'symbol',
  source: 'point',
  layout: {
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
    'icon-image': ['get', 'symbol'],
    'text-field': ['get', 'title'],
    'text-font': ['Roboto Regular'],
    'text-offset': [0, textOffsetY],
    'text-anchor': 'top',
    'text-size': 12
  },
  paint: {}
}
const geolocateControlStyle: React.CSSProperties = {
  right: 10,
  top: 10
}

interface MapViewProps {
  featureCollection: FeatureCollection
}

const MapView: React.FunctionComponent<MapViewProps> = (props: MapViewProps): ReactElement => {
  const [viewport, setViewport] = useState(defaultViewportConfig)
  const { featureCollection } = props

  return (
    <MapContainer>
      <ReactMapGL {...viewport} onViewportChange={setViewport} mapStyle={mapConfig.styleJSON}>
        <GeolocateControl
          style={geolocateControlStyle}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
        <Source id='location-pois' type='geojson' data={featureCollection}>
          <Layer {...layerStyle} />
        </Source>
      </ReactMapGL>
    </MapContainer>
  )
}

export default MapView

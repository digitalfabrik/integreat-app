import React, { ReactElement, useEffect, useState } from 'react'
import ReactMapGL, { Layer, LayerProps, Source, WebMercatorViewport } from 'react-map-gl'
import styled from 'styled-components'
import 'maplibre-gl/dist/maplibre-gl.css'
import { defaultViewportConfig, mapConfig, MapViewViewport } from 'api-client'
import { FeatureCollection, BBox } from 'geojson'

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

interface MapViewProps {
  featureCollection: FeatureCollection
  boundingBox?: BBox
}

const moveViewToBBox = (bBox: BBox, defaultVp: MapViewViewport): MapViewViewport => {
  const mercatorVp = new WebMercatorViewport(defaultVp)
  const vp = mercatorVp.fitBounds([
    [bBox[0], bBox[1]],
    [bBox[2], bBox[3]]
  ])
  return vp
}

const MapView: React.FunctionComponent<MapViewProps> = (props: MapViewProps): ReactElement => {
  const { featureCollection, boundingBox } = props
  const [viewport, setViewport] = useState<MapViewViewport>(defaultViewportConfig)

  useEffect(() => {
    boundingBox && setViewport(moveViewToBBox(boundingBox, defaultViewportConfig))
  }, [boundingBox])

  return (
    <MapContainer>
      <ReactMapGL {...viewport} onViewportChange={setViewport} mapStyle={mapConfig.styleJSON}>
        <Source id='location-pois' type='geojson' data={featureCollection}>
          <Layer {...layerStyle} />
        </Source>
      </ReactMapGL>
    </MapContainer>
  )
}

export default MapView

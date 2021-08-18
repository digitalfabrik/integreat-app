import React, { ReactElement, useEffect, useState } from 'react'
import ReactMapGL, { Layer, LayerProps, MapRef, Source } from 'react-map-gl'
import styled from 'styled-components'
import 'maplibre-gl/dist/maplibre-gl.css'
import { customMarker, defaultViewportConfig, mapConfig } from 'api-client'
import { FeatureCollection } from 'geojson'

const MapContainer = styled.div`
  display: flex;
  justify-content: center;
`

const textOffsetY = 1.75
const layerStyle: LayerProps = {
  id: 'point',
  type: 'symbol',
  source: 'point',
  layout: {
    'icon-image': ['get', 'symbol'],
    'text-field': ['get', 'title'],
    'text-font': ['Roboto Regular'],
    'text-offset': [0, textOffsetY],
    'text-anchor': 'top',
    'text-size': 12
  },
  paint: {
    'icon-color': 'blue'
  }
}

interface MapViewProps {
  featureCollection: FeatureCollection
}

const MapView: React.FunctionComponent<MapViewProps> = (props: MapViewProps): ReactElement => {
  const [viewport, setViewport] = useState(defaultViewportConfig)
  const { featureCollection } = props

  const mapRef = React.useRef<MapRef>(null)
  useEffect(() => {
    const map = mapRef?.current?.getMap()
    map?.loadImage(customMarker.iconSrc, (error: Error, image: ImageBitmap) => {
      if (error) {
        console.error(error)
        throw new Error(`Image can not be loaded: ${error.message}`)
      }
      if (!map.hasImage(customMarker.name)) {
        map.addImage(customMarker.name, image, { sdf: true })
      }
    })
  }, [mapRef])

  return (
    <MapContainer>
      <ReactMapGL ref={mapRef} {...viewport} onViewportChange={setViewport} mapStyle={mapConfig.styleJSON}>
        <Source id='my-data' type='geojson' data={featureCollection}>
          <Layer {...layerStyle} />
        </Source>
      </ReactMapGL>
    </MapContainer>
  )
}

export default MapView

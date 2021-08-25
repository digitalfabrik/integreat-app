import React, { ReactElement, useState, useEffect } from 'react'
import ReactMapGL, { Layer, LayerProps, MapEvent, Source } from 'react-map-gl'
import styled from 'styled-components'
import 'maplibre-gl/dist/maplibre-gl.css'
import { defaultViewportConfig, detailZoom, mapConfig, mapQueryId, MapViewViewport } from 'api-client'
import { FeatureCollection, Feature, Point } from 'geojson'
import { useLocation } from 'react-router-dom'

import MapPopup from './MapPopup'

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
  featureCollection: FeatureCollection<Point>
}

const MapView: React.FunctionComponent<MapViewProps> = (props: MapViewProps): ReactElement => {
  const [viewport, setViewport] = useState<MapViewViewport>(defaultViewportConfig)
  const [showPopup, togglePopup] = React.useState<boolean>(false)
  const [currentPoi, setCurrentPoi] = React.useState<Feature<Point> | null>(null)

  const { featureCollection } = props
  const queryId = Number(new URLSearchParams(useLocation().search).get(mapQueryId))

  useEffect(() => {
    if (!queryId) {
      return
    }
    const currentPoi = featureCollection.features.find(feature => feature.properties?.id === queryId)
    if (currentPoi?.geometry.coordinates) {
      const { geometry } = currentPoi
      setViewport(prevState => ({
        ...prevState,
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
        zoom: detailZoom
      }))
      setCurrentPoi(currentPoi)
      togglePopup(true)
    }
  }, [featureCollection, queryId])

  const clickItem = (e: MapEvent) => {
    if (e.features?.length) {
      setCurrentPoi(e.features[0])
      togglePopup(true)
    } else {
      togglePopup(false)
    }
  }

  return (
    <MapContainer>
      <ReactMapGL
        interactiveLayerIds={[layerStyle.id!]}
        {...viewport}
        onViewportChange={setViewport}
        mapStyle={mapConfig.styleJSON}
        onClick={clickItem}>
        <Source id='location-pois' type='geojson' data={featureCollection}>
          <Layer {...layerStyle} />
          {showPopup && currentPoi && (
            <MapPopup coordinates={currentPoi.geometry.coordinates} properties={currentPoi.properties} />
          )}
        </Source>
      </ReactMapGL>
    </MapContainer>
  )
}

export default MapView

import 'maplibre-gl/dist/maplibre-gl.css'
import React, { ReactElement, useEffect, useState } from 'react'
import ReactMapGL, { GeolocateControl, Layer, LayerProps, MapEvent, Source } from 'react-map-gl'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import {
  detailZoom,
  mapConfig,
  locationName,
  MapViewViewport,
  PoiFeature,
  PoiFeatureCollection,
  mapMarker
} from 'api-client'

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
    'icon-size': mapMarker.iconSize,
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

type MapViewProps = {
  bboxViewport: MapViewViewport
  featureCollection: PoiFeatureCollection
}

const MapView: React.FunctionComponent<MapViewProps> = (props: MapViewProps): ReactElement => {
  const { featureCollection, bboxViewport } = props
  const [viewport, setViewport] = useState<MapViewViewport>(bboxViewport)
  const [showPopup, togglePopup] = useState<boolean>(false)
  const [currentFeature, setCurrentFeature] = useState<PoiFeature | null>(null)
  const queryLocation = new URLSearchParams(useLocation().search).get(locationName)

  useEffect(() => {
    if (queryLocation) {
      const currentFeature = featureCollection.features.find(feature => feature.properties.urlSlug === queryLocation)
      if (currentFeature?.geometry.coordinates) {
        const { geometry } = currentFeature
        setViewport(prevState => ({
          ...prevState,
          longitude: geometry.coordinates[0]!,
          latitude: geometry.coordinates[1]!,
          zoom: detailZoom
        }))
        setCurrentFeature(currentFeature)
        togglePopup(true)
      }
    }
  }, [featureCollection, queryLocation])

  const clickItem = (e: MapEvent) => {
    if (e.features?.length) {
      setCurrentFeature(e.features[0])
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
        {/* To use geolocation in a development build you have to start the dev server with "yarn start --https" */}
        <GeolocateControl
          style={geolocateControlStyle}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
        />
        <Source id='location-pois' type='geojson' data={featureCollection}>
          <Layer {...layerStyle} />
          {showPopup && currentFeature && <MapPopup properties={currentFeature.properties} />}
        </Source>
      </ReactMapGL>
    </MapContainer>
  )
}

export default MapView

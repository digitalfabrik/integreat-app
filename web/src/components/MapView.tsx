import 'maplibre-gl/dist/maplibre-gl.css'
import React, { ReactElement, useEffect, useState } from 'react'
import ReactMapGL, { GeolocateControl, Layer, LayerProps, MapEvent, Source } from 'react-map-gl'
import { useLocation } from 'react-router-dom'
import { BottomSheetRef } from 'react-spring-bottom-sheet'
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

import { getSnapPoints } from '../utils/getSnapPoints'

// Workaround since nothing is rendered if height is set to 100% 
const MapContainer = styled.div`
  ${`height: calc(100vh - 190px);`}
  width: 100%;
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
  featureCollection: PoiFeatureCollection | null
  currentFeature: PoiFeature | null
  setCurrentFeature: (feature: PoiFeature | null) => void
}

const MapView = React.forwardRef((props: MapViewProps, ref: React.Ref<BottomSheetRef>): ReactElement => {
  const { featureCollection, bboxViewport, setCurrentFeature } = props
  const [viewport, setViewport] = useState<MapViewViewport>(bboxViewport)
  const queryLocation = new URLSearchParams(useLocation().search).get(locationName)

  useEffect(() => {
    if (queryLocation && featureCollection) {
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
      }
    }
  }, [featureCollection, queryLocation])

  const clickItem = (e: MapEvent) => {
    if (e.features?.length) {
      // @ts-ignore BottomSheetRef does not provide current
      ref?.current.snapTo(({ maxHeight }: { maxHeight: number }) => getSnapPoints(maxHeight)[1])
      setCurrentFeature(e.features[0])
    } else {
      setCurrentFeature(null)
    }
  }

  return (
    <MapContainer>
      <ReactMapGL
        interactiveLayerIds={[layerStyle.id!]}
        {...viewport}
        height='100%'
        width='100%'
        onViewportChange={setViewport}
        mapStyle={mapConfig.styleJSON}
        onClick={clickItem}
        // @ts-ignore BottomSheetRef does not provide current
        onTouchMove={() => ref?.current.snapTo(({ maxHeight }: { maxHeight: number }) => getSnapPoints(maxHeight)[0])}>
        {/* To use geolocation in a development build you have to start the dev server with "yarn start --https" */}
        <GeolocateControl
          style={geolocateControlStyle}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
        />
        <Source id='location-pois' type='geojson' data={featureCollection!}>
          <Layer {...layerStyle} />
        </Source>
      </ReactMapGL>
    </MapContainer>
  )
})

export default MapView

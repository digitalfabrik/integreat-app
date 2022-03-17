import { Position } from 'geojson'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { ReactElement, useEffect, useState } from 'react'
import ReactMapGL, {
  GeolocateControl,
  Layer,
  LayerProps,
  MapEvent,
  MapRef,
  NavigationControl,
  Source
} from 'react-map-gl'
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

import useWindowDimensions from '../hooks/useWindowDimensions'
import updateQueryParams from '../utils/updateQueryParams'

// Workaround since nothing is rendered if height is set to 100%, 190px is the header size
const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
`

const StyledNavigationControl = styled(NavigationControl)`
  position: absolute;
  bottom: 30px;
  right: 10px;
`

const StyledGeolocateControl = styled(GeolocateControl)`
  right: 10px;
  top: 10px;
`

type MapViewProps = {
  bboxViewport: MapViewViewport
  featureCollection: PoiFeatureCollection
  currentFeature: PoiFeature | null
  selectFeature: (feature: PoiFeature | null) => void
  changeSnapPoint: (snapPoint: number) => void
  queryParams: URLSearchParams
  queryLocation: string | null
  setQueryLocation: (location: string | null) => void
  flyToPoi: (coordinates: Position) => void
}

const MapView = React.forwardRef((props: MapViewProps, ref: React.Ref<MapRef>): ReactElement => {
  const {
    featureCollection,
    bboxViewport,
    selectFeature,
    changeSnapPoint,
    queryParams,
    currentFeature,
    queryLocation,
    setQueryLocation,
    flyToPoi
  } = props

  const textOffsetY = 1.25

  const layerStyle: LayerProps = {
    id: 'point',
    type: 'symbol',
    source: 'point',
    layout: {
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
      'icon-size': mapMarker.iconSize,
      'icon-image': [
        'case',
        ['==', ['get', 'id'], currentFeature?.properties.id ?? -1],
        mapMarker.symbolActive,
        ['get', 'symbol']
      ],
      'text-field': ['get', 'title'],
      'text-font': ['Roboto Regular'],
      'text-offset': [0, textOffsetY],
      'text-anchor': 'top',
      'text-size': 12
    },
    paint: {}
  }
  const [viewport, setViewport] = useState<MapViewViewport>(bboxViewport)

  const { viewportSmall } = useWindowDimensions()

  useEffect(() => {
    if (queryLocation && !currentFeature) {
      const feature = featureCollection.features.find(feature => feature.properties.urlSlug === queryLocation)
      if (feature?.geometry.coordinates) {
        const { geometry } = feature
        setViewport(prevState => ({
          ...prevState,
          longitude: geometry.coordinates[0]!,
          latitude: geometry.coordinates[1]!,
          zoom: detailZoom
        }))
        selectFeature(feature)
      }
    }
  }, [currentFeature, featureCollection, queryLocation, queryParams, selectFeature])

  const onSelectFeature = (e: MapEvent) => {
    if (e.features?.length) {
      flyToPoi(e.features[0].geometry.coordinates)
      selectFeature(e.features[0])
      changeSnapPoint(1)
      queryParams.set(locationName, e.features[0].properties.urlSlug)
      updateQueryParams(queryParams)
    } else {
      setQueryLocation(null)
      selectFeature(null)
      updateQueryParams()
    }
  }

  return (
    <MapContainer>
      <ReactMapGL
        ref={ref}
        reuseMaps
        interactiveLayerIds={[layerStyle.id!]}
        {...viewport}
        height='100%'
        width='100%'
        onViewportChange={setViewport}
        mapStyle={mapConfig.styleJSON}
        onClick={onSelectFeature}
        onTouchMove={() => changeSnapPoint(0)}>
        {/* To use geolocation in a development build you have to start the dev server with "yarn start --https" */}
        <StyledGeolocateControl auto positionOptions={{ enableHighAccuracy: true }} trackUserLocation />
        <Source id='location-pois' type='geojson' data={featureCollection}>
          <Layer {...layerStyle} />
        </Source>
        {!viewportSmall && <StyledNavigationControl showCompass={false} />}
      </ReactMapGL>
    </MapContainer>
  )
})

export default MapView

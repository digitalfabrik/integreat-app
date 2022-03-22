import { Position } from 'geojson'
import * as mapLibreGl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import Map, { GeolocateControl, Layer, LayerProps, MapRef, NavigationControl, Source } from 'react-map-gl'
import styled from 'styled-components'

import {
  detailZoom,
  mapConfig,
  locationName,
  MapViewViewport,
  PoiFeature,
  PoiFeatureCollection,
  mapMarker,
  MapViewMercatorViewport
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

const StyledGeolocateControl = styled(GeolocateControl)`
  right: 10px;
  top: 10px;
`

type MapViewProps = {
  bboxViewport: MapViewMercatorViewport
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
    //  setQueryLocation,
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
  const [cursor, setCursor] = useState<string>('auto')

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

  const onSelectFeature = useCallback(
    event => {
      const feature = event.features && event.features[0]
      if (feature) {
        flyToPoi(feature.geometry.coordinates)
        selectFeature(feature)
        changeSnapPoint(1)
        queryParams.set(locationName, feature.properties?.urlSlug)
        updateQueryParams(queryParams)
      }
    },
    [changeSnapPoint, flyToPoi, queryParams, selectFeature]
  )
  // TODO implement deselection
  // const onDeselectFeature = () => {
  //   setQueryLocation(null)
  //   selectFeature(null)
  //   updateQueryParams()
  // }

  const changeCursor = useCallback((cursor: 'grab' | 'auto' | 'pointer') => setCursor(cursor), [])

  return (
    <MapContainer>
      <Map
        mapLib={mapLibreGl}
        ref={ref}
        reuseMaps
        cursor={cursor}
        interactiveLayerIds={[layerStyle.id!]}
        {...viewport}
        style={{
          height: '100%',
          width: '100%'
        }}
        onMove={evt => setViewport(evt.viewState)}
        onDragStart={() => changeCursor('grab')}
        onDragEnd={() => changeCursor('auto')}
        onMouseEnter={() => changeCursor('pointer')}
        onMouseLeave={() => changeCursor('auto')}
        mapStyle={mapConfig.styleJSON}
        onClick={onSelectFeature}
        onTouchMove={() => viewportSmall && changeSnapPoint(0)}>
        {/* To use geolocation in a development build you have to start the dev server with "yarn start --https" */}
        <StyledGeolocateControl positionOptions={{ enableHighAccuracy: true }} trackUserLocation />
        <Source id='location-pois' type='geojson' data={featureCollection}>
          <Layer {...layerStyle} />
        </Source>
        {!viewportSmall && <NavigationControl showCompass={false} position='bottom-right' />}
      </Map>
    </MapContainer>
  )
})

export default MapView

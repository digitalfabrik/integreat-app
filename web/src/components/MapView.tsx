import { Position } from 'geojson'
import * as mapLibreGl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { ReactElement, useCallback, useState } from 'react'
import Map, { GeolocateControl, Layer, LayerProps, MapRef, NavigationControl, Source } from 'react-map-gl'
import styled from 'styled-components'

import {
  mapConfig,
  locationName,
  MapViewViewport,
  PoiFeature,
  PoiFeatureCollection,
  mapMarker,
  MapViewMercatorViewport
} from 'api-client'

import useWindowDimensions from '../hooks/useWindowDimensions'
import '../styles/MapView.css'
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
  setQueryLocation: (location: string | null) => void
  flyToPoi: (coordinates: Position) => void
}

type MapCursorType = 'grab' | 'auto' | 'pointer'

const MapView = React.forwardRef((props: MapViewProps, ref: React.Ref<MapRef>): ReactElement => {
  const {
    featureCollection,
    bboxViewport,
    selectFeature,
    changeSnapPoint,
    queryParams,
    currentFeature,
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
  const [cursor, setCursor] = useState<MapCursorType>('auto')

  const { viewportSmall } = useWindowDimensions()

  const onDeselectFeature = useCallback(() => {
    setQueryLocation(null)
    selectFeature(null)
    updateQueryParams()
  }, [selectFeature, setQueryLocation])

  const onSelectFeature = useCallback(
    event => {
      // Stop propagation to children to prevent onClick select event as it is already handled
      event.originalEvent.stopPropagation()
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

  const changeCursor = useCallback((cursor: MapCursorType) => setCursor(cursor), [])

  return (
    <MapContainer onClick={onDeselectFeature} role='button' tabIndex={-1} onKeyPress={onDeselectFeature}>
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
        onTouchMove={() => changeSnapPoint(0)}>
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

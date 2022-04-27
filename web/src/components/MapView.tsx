import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as mapLibreGl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { ReactElement, useCallback, useState } from 'react'
import Map, { GeolocateControl, Layer, LayerProps, MapRef, NavigationControl, Source } from 'react-map-gl'
import styled, { css } from 'styled-components'

import {
  mapConfig,
  MapViewViewport,
  PoiFeature,
  PoiFeatureCollection,
  mapMarker,
  MapViewMercatorViewport
} from 'api-client'
import { UiDirectionType } from 'translations'

import { faArrowLeft } from '../constants/icons'
import useWindowDimensions from '../hooks/useWindowDimensions'
import '../styles/MapView.css'

// Workaround since nothing is rendered if height is set to 100%, 190px is the header size
const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
`

const BackNavigation = styled.div<{ direction: string }>`
  position: absolute;
  top: 10px;
  ${props => (props.direction === 'rtl' ? `right: 10px;` : `left: 10px;`)}
  background-color: ${props => props.theme.colors.textDisabledColor};
  height: 28px;
  width: 28px;
  border: 1px solid #818181;
  border-radius: 50px;
  box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
  justify-content: center;
  align-items: center;
  display: flex;
`

const StyledIcon = styled(FontAwesomeIcon)<{ direction: string }>`
  font-size: 12px;
  color: white;
  ${props =>
    props.direction === 'rtl' &&
    css`
      transform: scaleX(-1);
    `};
`

type MapViewProps = {
  bboxViewport: MapViewMercatorViewport
  featureCollection: PoiFeatureCollection
  currentFeature: PoiFeature | null
  selectFeature: (feature: PoiFeature | null) => void
  changeSnapPoint: (snapPoint: number) => void
  direction: UiDirectionType
}

type MapCursorType = 'grab' | 'auto' | 'pointer'

const MapView = React.forwardRef((props: MapViewProps, ref: React.Ref<MapRef>): ReactElement => {
  const { featureCollection, bboxViewport, selectFeature, changeSnapPoint, currentFeature, direction } = props

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

  const onDeselectFeature = useCallback(
    e => {
      // Currently selected feature should not be deselected if the user clicks on the controls like zoom or user location
      if (e.target.classList.toString().includes('mapboxgl-canvas')) {
        selectFeature(null)
      }
    },
    [selectFeature]
  )

  const onSelectFeature = useCallback(
    event => {
      // Stop propagation to children to prevent onClick select event as it is already handled
      event.originalEvent.stopPropagation()
      const feature = event.features && event.features[0]
      if (feature) {
        selectFeature(feature)
        changeSnapPoint(2)
      }
    },
    [changeSnapPoint, selectFeature]
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
        {currentFeature && viewportSmall && (
          <BackNavigation
            onClick={() => selectFeature(null)}
            role='button'
            tabIndex={-1}
            onKeyPress={() => selectFeature(null)}
            direction={direction}>
            <StyledIcon icon={faArrowLeft} direction={direction} />
          </BackNavigation>
        )}
        {/* To use geolocation in a development build you have to start the dev server with "yarn start --https" */}
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
          position={direction === 'rtl' ? 'top-left' : 'top-right'}
        />
        <Source id='location-pois' type='geojson' data={featureCollection}>
          <Layer {...layerStyle} />
        </Source>
        {!viewportSmall && (
          <NavigationControl showCompass={false} position={direction === 'rtl' ? 'bottom-left' : 'bottom-right'} />
        )}
      </Map>
    </MapContainer>
  )
})

export default MapView

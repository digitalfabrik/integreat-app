import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as mapLibreGl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { forwardRef, ReactElement, useCallback, useState } from 'react'
import Map, { GeolocateControl, Layer, MapRef, NavigationControl, Source } from 'react-map-gl'
import styled, { css, useTheme } from 'styled-components'

import {
  mapConfig,
  MapViewViewport,
  PoiFeature,
  PoiFeatureCollection,
  MapViewMercatorViewport,
  clusterZoom,
} from 'api-client'
import { UiDirectionType } from 'translations'

import { faArrowLeft } from '../constants/icons'
import { clusterCountLayer, clusterLayer, markerLayer } from '../constants/layers'
import useWindowDimensions from '../hooks/useWindowDimensions'
import '../styles/MapView.css'
import LocationFooter from './LocationFooter'

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

const FooterContainer = styled.div`
  position: absolute;
  bottom: 0;
`

type MapViewProps = {
  bboxViewport: MapViewMercatorViewport
  featureCollection: PoiFeatureCollection
  currentFeature: PoiFeature | null
  selectFeature: (feature: PoiFeature | null) => void
  changeSnapPoint: (snapPoint: number) => void
  direction: UiDirectionType
  cityCode: string
  languageCode: string
}

type MapCursorType = 'grab' | 'auto' | 'pointer'

const MapView = forwardRef((props: MapViewProps, ref: React.Ref<MapRef>): ReactElement => {
  const {
    featureCollection,
    bboxViewport,
    selectFeature,
    changeSnapPoint,
    currentFeature,
    direction,
    cityCode,
    languageCode,
  } = props
  const [viewport, setViewport] = useState<MapViewViewport>(bboxViewport)
  const [cursor, setCursor] = useState<MapCursorType>('auto')
  const theme = useTheme()

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
        changeSnapPoint(1)
      }
    },
    [changeSnapPoint, selectFeature]
  )

  const onDeselect = () => {
    selectFeature(null)
    changeSnapPoint(1)
  }

  const changeCursor = useCallback((cursor: MapCursorType) => setCursor(cursor), [])

  return (
    <MapContainer onClick={onDeselectFeature} role='button' tabIndex={-1} onKeyPress={onDeselectFeature}>
      <Map
        mapLib={mapLibreGl}
        ref={ref}
        reuseMaps
        cursor={cursor}
        interactiveLayerIds={[markerLayer(currentFeature).id!]}
        {...viewport}
        style={{
          height: '100%',
          width: '100%',
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
            onClick={onDeselect}
            role='button'
            tabIndex={-1}
            onKeyPress={onDeselect}
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
        <Source
          id='location-pois'
          type='geojson'
          data={featureCollection}
          cluster
          clusterMaxZoom={clusterZoom}
          clusterRadius={50}>
          <Layer {...clusterLayer(theme)} />
          <Layer {...clusterCountLayer} />
          <Layer {...markerLayer(currentFeature)} />
        </Source>
        {!viewportSmall && (
          <>
            <NavigationControl showCompass={false} position={direction === 'rtl' ? 'bottom-left' : 'bottom-right'} />
            <FooterContainer>
              <LocationFooter city={cityCode} language={languageCode} overlay />
            </FooterContainer>
          </>
        )}
      </Map>
    </MapContainer>
  )
})

export default MapView

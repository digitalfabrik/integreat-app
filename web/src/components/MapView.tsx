import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as mapLibreGl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { forwardRef, ReactElement, useCallback, useState } from 'react'
import Map, { GeolocateControl, Layer, MapRef, NavigationControl, Source, MapLayerMouseEvent } from 'react-map-gl'
import { useLocation, useNavigate } from 'react-router-dom'
import styled, { css, useTheme } from 'styled-components'

import {
  mapConfig,
  MapViewViewport,
  PoiFeature,
  PoiFeatureCollection,
  MapViewMercatorViewport,
  clusterRadius,
  maxMapZoom,
} from 'api-client'
import { UiDirectionType } from 'translations'

import { faArrowLeft } from '../constants/icons'
import { clusterCountLayer, clusterLayer, markerLayer } from '../constants/layers'
import useWindowDimensions from '../hooks/useWindowDimensions'
import '../styles/MapView.css'
import CityContentFooter from './CityContentFooter'
import MapAttribution from './MapAttribution'

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
  selectFeature: (feature: PoiFeature | null, restoreScrollPosition: boolean) => void
  changeSnapPoint: (snapPoint: number) => void
  direction: UiDirectionType
  cityCode: string
  languageCode: string
  geolocationControlPosition: number
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
    geolocationControlPosition,
  } = props
  // Workaround for https://github.com/mapbox/mapbox-gl-js/issues/8890
  const [viewport, setViewport] = useState<MapViewViewport>({ ...bboxViewport, maxZoom: maxMapZoom })
  const [cursor, setCursor] = useState<MapCursorType>('auto')
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const { viewportSmall } = useWindowDimensions()

  const onDeselect = useCallback(() => {
    navigate('.', { state: { from: location } })
  }, [location, navigate])

  const onSelectFeature = useCallback(
    (event: MapLayerMouseEvent) => {
      // Stop propagation to children to prevent onClick select event as it is already handled
      event.originalEvent.stopPropagation()
      const feature = event.features && (event.features[0] as unknown as PoiFeature)
      if (feature) {
        selectFeature(feature, false)
        changeSnapPoint(1)
      } else {
        onDeselect()
      }
    },
    [changeSnapPoint, onDeselect, selectFeature],
  )

  const changeCursor = useCallback((cursor: MapCursorType) => setCursor(cursor), [])

  return (
    <MapContainer>
      <Map
        mapLib={mapLibreGl}
        ref={ref}
        reuseMaps
        cursor={cursor}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        interactiveLayerIds={[markerLayer(currentFeature).id!]}
        {...viewport}
        style={{
          height: '100%',
          width: '100%',
        }}
        onMove={evt => setViewport(prevState => ({ ...prevState, ...evt.viewState }))}
        onDragStart={() => changeCursor('grab')}
        onDragEnd={() => changeCursor('auto')}
        onMouseEnter={() => changeCursor('pointer')}
        onMouseLeave={() => changeCursor('auto')}
        mapStyle={mapConfig.styleJSON}
        onClick={onSelectFeature}
        onTouchMove={() => changeSnapPoint(0)}
        attributionControl={false}>
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
        {!viewportSmall && (
          <NavigationControl showCompass={false} position={direction === 'rtl' ? 'bottom-left' : 'bottom-right'} />
        )}
        {/* To use geolocation in a development build you have to start the dev server with "yarn start --https" */}
        <GeolocateControl
          style={
            viewportSmall
              ? {
                  bottom: geolocationControlPosition,
                  position: 'fixed',
                  right: 0,
                }
              : undefined
          }
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
          position='bottom-right'
        />
        <Source id='location-pois' type='geojson' data={featureCollection} cluster clusterRadius={clusterRadius}>
          <Layer {...clusterLayer(theme)} />
          <Layer {...clusterCountLayer} />
          <Layer {...markerLayer(currentFeature)} />
        </Source>
        {!viewportSmall && (
          <FooterContainer>
            <CityContentFooter city={cityCode} language={languageCode} mode='overlay' />
          </FooterContainer>
        )}
        <MapAttribution initialExpanded={!viewportSmall} />
      </Map>
    </MapContainer>
  )
})

export default MapView

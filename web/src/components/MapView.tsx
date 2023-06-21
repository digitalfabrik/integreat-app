import WebMercatorViewport from '@math.gl/web-mercator'
import { BBox } from 'geojson'
import * as mapLibreGl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import Map, { Layer, MapRef, Source, MapLayerMouseEvent } from 'react-map-gl'
import styled, { useTheme } from 'styled-components'

import {
  mapConfig,
  MapViewViewport,
  PoiFeature,
  PoiFeatureCollection,
  MapViewMercatorViewport,
  clusterRadius,
  maxMapZoom,
  CityModel,
  defaultMercatorViewportConfig,
  closerDetailZoom,
} from 'api-client'

import { clusterCountLayer, clusterLayer, clusterProperties, markerLayer } from '../constants/layers'
import useWindowDimensions from '../hooks/useWindowDimensions'
import '../styles/MapView.css'
import { midSnapPercentage } from '../utils/getSnapPoints'
import MapAttribution from './MapAttribution'

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
`

type MapViewProps = {
  featureCollection: PoiFeatureCollection
  currentFeature: PoiFeature | null
  selectFeature: (feature: PoiFeature | null, restoreScrollPosition: boolean) => void
  changeSnapPoint?: (snapPoint: number) => void
  cityModel: CityModel
  languageCode: string
  children: ReactNode
}

type MapCursorType = 'grab' | 'auto' | 'pointer'

const moveViewToBBox = (bBox: BBox, defaultVp: MapViewMercatorViewport): MapViewMercatorViewport => {
  const mercatorVp = new WebMercatorViewport(defaultVp)
  return mercatorVp.fitBounds([
    [bBox[0], bBox[1]],
    [bBox[2], bBox[3]],
  ])
}

const MapView = ({
  featureCollection,
  selectFeature,
  changeSnapPoint,
  currentFeature,
  cityModel,
  children,
}: MapViewProps): ReactElement => {
  const bboxViewport = useMemo(
    () => moveViewToBBox(cityModel.boundingBox!, defaultMercatorViewportConfig),
    [cityModel.boundingBox]
  )
  // Workaround for https://github.com/mapbox/mapbox-gl-js/issues/8890
  const [viewport, setViewport] = useState<MapViewViewport>({ ...bboxViewport, maxZoom: maxMapZoom })
  const [cursor, setCursor] = useState<MapCursorType>('auto')
  const [mapRef, setMapRef] = useState<mapLibreGl.Map | null>(null)
  const theme = useTheme()

  const { viewportSmall, height } = useWindowDimensions()

  const updateMapRef = useCallback((node: MapRef | null) => {
    // This allows us to use the map (ref) as dependency in hooks which is not possible using useRef.
    // This is needed because on initial render the ref is null such that flyTo is not possible.
    // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
    if (node) {
      setMapRef(node.getMap() as unknown as mapLibreGl.Map)
    }
  }, [])

  const onSelectFeature = useCallback(
    (event: MapLayerMouseEvent) => {
      // Stop propagation to children to prevent onClick select event as it is already handled
      event.originalEvent.stopPropagation()
      const feature = event.features && (event.features[0] as unknown as PoiFeature)
      if (feature) {
        selectFeature(
          {
            ...feature,
            properties: {
              pois: JSON.parse(feature.properties.pois as unknown as string),
            },
          },
          false
        )
      } else {
        selectFeature(null, false)
      }
    },
    [selectFeature]
  )

  useEffect(() => {
    const coordinates = currentFeature?.geometry.coordinates ?? []
    if (mapRef && coordinates[0] && coordinates[1]) {
      const coords: mapLibreGl.LngLatLike = [coordinates[0], coordinates[1]]
      // TODO IGAPP-1154 - remove setTimeout
      mapRef.flyTo({
        center: coords,
        zoom: closerDetailZoom,
        padding: { bottom: viewportSmall ? height * midSnapPercentage : 0, top: 0, left: 0, right: 0 },
      })
    }
  }, [currentFeature?.geometry.coordinates, height, mapRef, viewportSmall])

  const changeCursor = useCallback((cursor: MapCursorType) => setCursor(cursor), [])

  return (
    <MapContainer>
      <Map
        mapLib={mapLibreGl}
        ref={updateMapRef}
        reuseMaps
        cursor={cursor}
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
        onTouchMove={() => (changeSnapPoint ? changeSnapPoint(0) : null)}
        attributionControl={false}>
        {children}
        <Source
          id='location-pois'
          type='geojson'
          data={featureCollection}
          cluster
          clusterRadius={clusterRadius}
          clusterProperties={clusterProperties}>
          <Layer {...clusterLayer(theme)} />
          <Layer {...clusterCountLayer} />
          <Layer {...markerLayer(currentFeature)} />
        </Source>
        <MapAttribution initialExpanded={!viewportSmall} />
      </Map>
    </MapContainer>
  )
}

export default MapView

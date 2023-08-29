import * as mapLibreGl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, {
  ForwardedRef,
  ReactElement,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import Map, { Layer, MapRef, Source, MapLayerMouseEvent } from 'react-map-gl'
import styled, { useTheme } from 'styled-components'

import {
  mapConfig,
  MapViewViewport,
  MapFeature,
  MapFeatureCollection,
  clusterRadius,
  closerDetailZoom,
} from 'api-client'
import { config } from 'translations'

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
  featureCollection: MapFeatureCollection
  currentFeature: MapFeature | null
  selectFeature: (feature: MapFeature | null, restoreScrollPosition: boolean) => void
  changeSnapPoint?: (snapPoint: number) => void
  languageCode: string
  children: ReactNode
  viewport?: MapViewViewport
  setViewport: (mapViewport: MapViewViewport) => void
}

type MapCursorType = 'grab' | 'auto' | 'pointer'

export type MapViewRef = {
  setGeocontrol: (position: string, control: mapLibreGl.IControl) => void
}

const MapView = forwardRef(
  (
    {
      featureCollection,
      selectFeature,
      changeSnapPoint,
      currentFeature,
      viewport,
      setViewport,
      languageCode,
      children,
    }: MapViewProps,
    ref: ForwardedRef<MapViewRef>,
  ): ReactElement => {
    const [cursor, setCursor] = useState<MapCursorType>('auto')
    const [mapRef, setMapRef] = useState<mapLibreGl.Map | null>(null)
    const theme = useTheme()

    const { viewportSmall, height } = useWindowDimensions()

    useImperativeHandle(
      ref,
      () => ({
        setGeocontrol: (position: string, control: mapLibreGl.IControl) => mapRef?.addControl(control),
      }),
      [mapRef],
    )

    const updateMapRef = useCallback((node: MapRef | null) => {
      // This allows us to use the map (ref) as dependency in hooks which is not possible using useRef.
      // This is needed because on initial render the ref is null such that flyTo is not possible.
      // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
      if (node) {
        const ref = node.getMap() as unknown as mapLibreGl.Map
        setMapRef(ref)
      }
    }, [])

    const onSelectFeature = useCallback(
      (event: MapLayerMouseEvent) => {
        // Stop propagation to children to prevent onClick select event as it is already handled
        event.originalEvent.stopPropagation()
        const feature = event.features && (event.features[0] as unknown as MapFeature)
        if (feature) {
          selectFeature(
            {
              ...feature,
              properties: {
                // https://github.com/maplibre/maplibre-gl-js/issues/1325
                pois: JSON.parse(feature.properties.pois as unknown as string),
              },
            },
            false,
          )
        } else {
          selectFeature(null, false)
        }
      },
      [selectFeature],
    )

    useEffect(
      () => () => {
        if (mapRef) {
          // we only need the viewport on unmount
          const center = mapRef.getCenter()
          setViewport({
            longitude: center.lng,
            latitude: center.lat,
            zoom: mapRef.getZoom(),
            maxZoom: mapRef.getMaxZoom(),
          })
        }
      },
      [mapRef, setViewport],
    )

    useEffect(() => {
      const coordinates = currentFeature?.geometry.coordinates ?? []
      if (mapRef && coordinates[0] && coordinates[1]) {
        const coords: mapLibreGl.LngLatLike = [coordinates[0], coordinates[1]]
        mapRef.flyTo({
          center: coords,
          zoom: closerDetailZoom,
          padding: { bottom: viewportSmall ? height * midSnapPercentage : 0, top: 0, left: 0, right: 0 },
        })
      }
    }, [currentFeature?.geometry.coordinates, height, mapRef, viewportSmall])

    return (
      <MapContainer>
        <Map
          mapLib={mapLibreGl}
          ref={updateMapRef}
          reuseMaps
          cursor={cursor}
          initialViewState={viewport ?? undefined}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          interactiveLayerIds={[markerLayer(currentFeature).id!]}
          style={{
            height: '100%',
            width: '100%',
          }}
          onDragStart={() => setCursor('grab')}
          onDragEnd={() => setCursor('auto')}
          onMouseEnter={() => setCursor('pointer')}
          onMouseLeave={() => setCursor('auto')}
          maxZoom={viewport?.maxZoom}
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
          <MapAttribution initialExpanded={!viewportSmall} direction={config.getScriptDirection(languageCode)} />
        </Map>
      </MapContainer>
    )
  },
)

export default MapView

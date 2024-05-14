import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, {
  ForwardedRef,
  forwardRef,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import Map, { Layer, MapLayerMouseEvent, MapRef, Source } from 'react-map-gl/maplibre'
import styled, { useTheme } from 'styled-components'

import {
  closerDetailZoom,
  clusterClickZoomFactor,
  clusterRadius,
  embedInCollection,
  featureLayerId,
  mapConfig,
  MapFeature,
  MapViewViewport,
} from 'shared'

import { clusterCountLayer, clusterLayer, clusterProperties, markerLayer } from '../constants/layers'
import useWindowDimensions from '../hooks/useWindowDimensions'
import '../styles/MapView.css'
import { midSnapPercentage } from '../utils/getSnapPoints'
import { reportError } from '../utils/sentry'
import MapAttribution from './MapAttribution'

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
`

const OverlayContainer = styled.div`
  display: flex;
  padding: 12px 8px;
  flex: 1;
  z-index: 1;
  position: absolute;
  top: 0;
  gap: 8px;
`

type MapViewProps = {
  features: MapFeature[]
  currentFeature: MapFeature | null
  selectFeature: (feature: MapFeature | null, restoreScrollPosition: boolean) => void
  changeSnapPoint?: (snapPoint: number) => void
  children?: ReactNode
  viewport?: MapViewViewport
  setViewport: (mapViewport: MapViewViewport) => void
  Overlay?: ReactElement
}

type MapCursorType = 'grab' | 'auto' | 'pointer'

export type MapViewRef = {
  setGeocontrol: (control: maplibregl.IControl) => void
}

const MapView = forwardRef(
  (
    {
      features,
      selectFeature,
      changeSnapPoint,
      currentFeature,
      viewport,
      setViewport,
      children,
      Overlay,
    }: MapViewProps,
    ref: ForwardedRef<MapViewRef>,
  ): ReactElement => {
    const [cursor, setCursor] = useState<MapCursorType>('auto')
    const [mapRef, setMapRef] = useState<maplibregl.Map | null>(null)
    const theme = useTheme()

    const { viewportSmall, height } = useWindowDimensions()

    useEffect(() => {
      if (maplibregl.getRTLTextPluginStatus() === 'unavailable') {
        maplibregl.setRTLTextPlugin(mapConfig.rtlPluginUrl, true).catch(reportError)
      }
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        setGeocontrol: (control: maplibregl.IControl) => mapRef?.addControl(control),
      }),
      [mapRef],
    )

    const updateMapRef = useCallback((node: MapRef | null) => {
      // This allows us to use the map (ref) as dependency in hooks which is not possible using useRef.
      // This is needed because on initial render the ref is null such that flyTo is not possible.
      // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
      if (node) {
        setMapRef(node.getMap() as unknown as maplibregl.Map)
      }
    }, [])

    const zoomOnClusterPress = useCallback(
      (event: MapLayerMouseEvent) => {
        if (mapRef) {
          const feature = mapRef.queryRenderedFeatures(event.point)[0]
          if (feature?.properties.cluster !== undefined) {
            mapRef.flyTo({
              center: event.lngLat,
              zoom: mapRef.getZoom() + clusterClickZoomFactor,
            })
          }
        }
      },
      [mapRef],
    )

    const onSelectFeature = useCallback(
      (event: MapLayerMouseEvent) => {
        // Stop propagation to children to prevent onClick select event as it is already handled
        event.originalEvent.stopPropagation()
        const feature = event.features && (event.features[0] as unknown as MapFeature)
        if (feature && feature.layer.id === featureLayerId) {
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

        zoomOnClusterPress(event)
      },
      [selectFeature, zoomOnClusterPress],
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
      const [longitude, latitude] = currentFeature?.geometry.coordinates ?? []
      if (mapRef && longitude !== undefined && latitude !== undefined) {
        mapRef.flyTo({
          center: [longitude, latitude],
          zoom: closerDetailZoom,
          padding: { bottom: viewportSmall ? height * midSnapPercentage : 0, top: 0, left: 0, right: 0 },
        })
      }
    }, [currentFeature?.geometry.coordinates, height, mapRef, viewportSmall])

    return (
      <MapContainer>
        <Map
          mapLib={maplibregl}
          ref={updateMapRef}
          reuseMaps
          cursor={cursor}
          initialViewState={viewport ?? undefined}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          interactiveLayerIds={[markerLayer(currentFeature).id!, clusterLayer(theme).id!]}
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
          <OverlayContainer>{Overlay}</OverlayContainer>
          {children}
          <Source
            id='location-pois'
            type='geojson'
            data={embedInCollection(features)}
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
  },
)

export default MapView

import React, { ReactElement, useState, useEffect, useCallback } from 'react'
import ReactMapGL, { Layer, LayerProps, MapEvent, Popup, Source } from 'react-map-gl'
import styled from 'styled-components'
import 'maplibre-gl/dist/maplibre-gl.css'
import { defaultViewportConfig, detailZoom, mapConfig, mapParam, MapViewViewport } from 'api-client'
import { FeatureCollection, Feature, Point, GeoJsonProperties, Position } from 'geojson'
import { useLocation } from 'react-router-dom'
import { Property } from 'csstype'

const MapContainer = styled.div`
  display: flex;
  justify-content: center;
`

const StyledPopup = styled(Popup)`
  width: 250px;
`

const textOffsetY = 1.25
const layerStyle: LayerProps = {
  id: 'point',
  type: 'symbol',
  source: 'point',
  layout: {
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
    'icon-image': ['get', 'symbol'],
    'text-field': ['get', 'title'],
    'text-font': ['Roboto Regular'],
    'text-offset': [0, textOffsetY],
    'text-anchor': 'top',
    'text-size': 12
  },
  paint: {}
}

const renderPopup = (coordinates: Position, description: string): ReactElement => {
  return (
    <StyledPopup
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      closeButton={false}
      closeOnClick={false}
      anchor='bottom'>
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </StyledPopup>
  )
}

const getPopUpDescription = (properties: GeoJsonProperties): string => {
  return `<div><strong>${properties?.title}</strong></div>`
}

const getCursor = ({ isHovering, isDragging }: { isHovering: boolean; isDragging: boolean }): Property.Cursor => {
  return isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default'
}

interface MapViewProps {
  featureCollection: FeatureCollection<Point, GeoJsonProperties>
}

const MapView: React.FunctionComponent<MapViewProps> = (props: MapViewProps): ReactElement => {
  const [viewport, setViewport] = useState<MapViewViewport>(defaultViewportConfig)
  const [showPopup, togglePopup] = React.useState<boolean>(false)
  const [currentPoi, setCurrentPoi] = React.useState<Feature<Point, GeoJsonProperties> | null>(null)

  const { featureCollection } = props
  const query = new URLSearchParams(useLocation().search)
  const queryId = Number(query.get(mapParam))

  const getCurrentPoi = useCallback(
    (
      features: FeatureCollection<Point, GeoJsonProperties>,
      queryId: number
    ): Feature<Point, GeoJsonProperties> | undefined => {
      return featureCollection.features.find(feature => feature.properties?.id === queryId)
    },
    [featureCollection.features]
  )

  useEffect(() => {
    const currentPoi = getCurrentPoi(featureCollection, queryId)
    if (currentPoi?.geometry?.coordinates) {
      const { geometry } = currentPoi
      setViewport({
        ...defaultViewportConfig,
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
        zoom: detailZoom
      })
      setCurrentPoi(currentPoi)
      togglePopup(true)
    }
  }, [featureCollection, getCurrentPoi, queryId])

  const clickItem = (e: MapEvent) => {
    if (e.features) {
      const feature: Feature<Point, GeoJsonProperties> = e.features[0]

      if (feature.properties?.title) {
        setCurrentPoi(feature)
        togglePopup(true)
      } else {
        togglePopup(false)
      }
    }
  }

  return (
    <MapContainer>
      <ReactMapGL
        interactiveLayerIds={[layerStyle.id!]}
        getCursor={getCursor}
        {...viewport}
        onViewportChange={setViewport}
        mapStyle={mapConfig.styleJSON}
        onClick={clickItem}>
        <Source id='location-pois' type='geojson' data={featureCollection}>
          <Layer {...layerStyle} />
          {showPopup &&
            currentPoi &&
            renderPopup(currentPoi.geometry.coordinates, getPopUpDescription(currentPoi.properties))}
        </Source>
      </ReactMapGL>
    </MapContainer>
  )
}

export default MapView

import React, { ReactElement, useState, useEffect } from 'react'
import ReactMapGL, { Layer, LayerProps, MapEvent, Popup, Source } from 'react-map-gl'
import styled from 'styled-components'
import 'maplibre-gl/dist/maplibre-gl.css'
import { defaultViewportConfig, detailZoom, mapConfig, mapParam } from 'api-client'
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
  const [viewport, setViewport] = useState(defaultViewportConfig)
  const [showPopup, togglePopup] = React.useState(false)
  const [popUp, setPopup] = React.useState<{ coordinates: Position; description: string }>({
    coordinates: [],
    description: ''
  })
  const { featureCollection } = props
  const query = new URLSearchParams(useLocation().search)
  const geoId = Number(query.get(mapParam))

  useEffect(() => {
    const item: Feature<Point, GeoJsonProperties> | undefined = featureCollection.features.find(
      feature => feature?.properties?.id === geoId
    )
    if (item?.geometry?.coordinates) {
      const { geometry, properties } = item
      setViewport({
        ...defaultViewportConfig,
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
        zoom: detailZoom
      })
      setPopup({ coordinates: geometry.coordinates, description: getPopUpDescription(properties) })
      togglePopup(true)
    }
  }, [featureCollection.features, geoId])

  const renderPopup = (coordinates?: Position, description?: string): ReactElement | null => {
    if (!coordinates || !description) {
      return null
    }

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

  const clickItem = (e: MapEvent) => {
    if (e.features) {
      const feature = e.features[0]
      const coordinates = feature?.geometry.coordinates
      const description = getPopUpDescription(feature?.properties)

      if (feature?.properties?.title) {
        setPopup({ coordinates: coordinates, description: description })
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
        onClick={e => clickItem(e)}>
        <Source id='location-pois' type='geojson' data={featureCollection}>
          <Layer {...layerStyle} />
          {showPopup && renderPopup(popUp.coordinates, popUp.description)}
        </Source>
      </ReactMapGL>
    </MapContainer>
  )
}

export default MapView

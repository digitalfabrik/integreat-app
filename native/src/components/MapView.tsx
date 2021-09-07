import MapboxGL, { CameraSettings, SymbolLayerProps } from '@react-native-mapbox-gl/maps'
import type { BBox, Feature, FeatureCollection, GeoJsonProperties, Geometry, Point } from 'geojson'
import React, { ReactElement, useCallback, useState } from 'react'
import styled from 'styled-components/native'

import { defaultViewportConfig, detailZoom, mapConfig } from 'api-client'

import MapPopup from './MapPopup'

const MapContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`
const StyledMap = styled(MapboxGL.MapView)`
  width: 100%;
  height: 500px;
`

type MapViewPropsType = {
  boundingBox: BBox
  featureCollection: FeatureCollection
  currentFeature?: Feature<Point>
}

const textOffsetY = 1.25
const featureLayerId = 'point'

// Has to be set even if we use map libre
MapboxGL.setAccessToken(mapConfig.accessToken)
const MapView = ({ boundingBox, featureCollection, currentFeature }: MapViewPropsType): ReactElement => {
  const mapRef = React.useRef<MapboxGL.MapView | null>(null)
  const cameraRef = React.useRef<MapboxGL.Camera | null>(null)
  const [activeFeature, setActiveFeature] = useState<Feature<Point> | null>(currentFeature ?? null)
  const layerProps: SymbolLayerProps = {
    id: featureLayerId,
    style: {
      symbolPlacement: 'point',
      iconAllowOverlap: true,
      iconIgnorePlacement: true,
      iconImage: ['get', 'symbol'],
      textField: ['get', 'title'],
      textFont: ['Roboto Regular'],
      textOffset: [0, textOffsetY],
      textAnchor: 'top',
      textSize: 12
    }
  }

  const bounds = {
    ne: [boundingBox[2], boundingBox[3]],
    sw: [boundingBox[0], boundingBox[1]]
  }

  // if there is a current feature use the coordinates if not use bounding box
  const coordinates = activeFeature?.geometry?.coordinates
  const defaultSettings: CameraSettings = {
    zoomLevel: coordinates ? detailZoom : defaultViewportConfig.zoom,
    centerCoordinate: coordinates,
    bounds: coordinates ? undefined : bounds
  }

  const onPress = useCallback(async (pressedLocation: Feature<Geometry, GeoJsonProperties>) => {
    if (!mapRef?.current || !cameraRef?.current || !pressedLocation.properties) {
      return
    }
    const featureCollection = await mapRef.current.queryRenderedFeaturesAtPoint(
      [pressedLocation.properties.screenPointX, pressedLocation.properties.screenPointY],
      undefined,
      [featureLayerId]
    )
    const feature = featureCollection?.features?.find((it): it is Feature<Point> => it.geometry.type === 'Point')
    if (feature) {
      setActiveFeature(feature)
      const {
        geometry: { coordinates }
      } = feature
      cameraRef.current.flyTo(coordinates)
    } else {
      setActiveFeature(null)
    }
  }, [])

  return (
    <MapContainer>
      <StyledMap styleJSON={mapConfig.styleJSON} zoomEnabled onPress={onPress} ref={mapRef}>
        <MapboxGL.ShapeSource id='location-pois' shape={featureCollection}>
          <MapboxGL.SymbolLayer {...layerProps} />
        </MapboxGL.ShapeSource>
        <MapboxGL.Camera defaultSettings={defaultSettings} ref={cameraRef} />
      </StyledMap>
      {activeFeature && <MapPopup feature={activeFeature} />}
    </MapContainer>
  )
}

export default MapView

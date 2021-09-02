import React, { ReactElement } from 'react'
import styled from 'styled-components/native'
import MapboxGL, { CameraSettings, SymbolLayerProps } from '@react-native-mapbox-gl/maps'
import type { BBox, Feature, FeatureCollection, Point } from 'geojson'
import { defaultViewportConfig, detailZoom, mapConfig } from 'api-client'

const MapContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`
const StyledMap = styled(MapboxGL.MapView)`
  width: 700px;
  height: 500px;
`

type MapViewPropsType = {
  boundingBox: BBox
  featureCollection: FeatureCollection
  currentFeature?: Feature<Point>
}

const textOffsetY = 1.25

// Has to be set even if we use map libre
MapboxGL.setAccessToken(mapConfig.accessToken)
const MapView = ({ boundingBox, featureCollection, currentFeature }: MapViewPropsType): ReactElement => {
  const layerProps: SymbolLayerProps = {
    id: 'point',
    style: {
      symbolPlacement: 'point',
      iconAllowOverlap: true,
      iconIgnorePlacement: true,
      iconImage: ['get', 'symbol'],
      textField: ['case', ['==', ['get', 'id'], currentFeature?.properties?.id ?? -1], ['get', 'title'], ''],
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
  const defaultSettings: CameraSettings = {
    zoomLevel: currentFeature?.geometry.coordinates ? detailZoom : defaultViewportConfig.zoom,
    centerCoordinate: currentFeature?.geometry.coordinates,
    bounds: currentFeature?.geometry.coordinates ? undefined : bounds
  }
  return (
    <MapContainer>
      <StyledMap styleJSON={mapConfig.styleJSON} zoomEnabled>
        <MapboxGL.ShapeSource id='location-pois' shape={featureCollection}>
          <MapboxGL.SymbolLayer {...layerProps} />
        </MapboxGL.ShapeSource>
        <MapboxGL.Camera defaultSettings={defaultSettings} />
      </StyledMap>
    </MapContainer>
  )
}

export default MapView

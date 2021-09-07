import MapboxGL, { CameraSettings, SymbolLayerProps } from '@react-native-mapbox-gl/maps'
import type { BBox, Feature, FeatureCollection, Point } from 'geojson'
import React, { ReactElement, useCallback, useState } from 'react'
import styled from 'styled-components/native'

import { defaultViewportConfig, detailZoom, mapConfig } from 'api-client'

import MapPopup from './MapPopup'

const MapContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`
const StyledMap = styled(MapboxGL.MapView)`
  width: 700px;
  height: 500px;
  z-index: 1;
`

type MapViewPropsType = {
  boundingBox: BBox
  featureCollection: FeatureCollection
  currentFeature?: Feature<Point>
}

const textOffsetY = 1.25
const layerId = 'point'

// Has to be set even if we use map libre
MapboxGL.setAccessToken(mapConfig.accessToken)
const MapView = ({ boundingBox, featureCollection, currentFeature }: MapViewPropsType): ReactElement => {
  const ref = React.useRef<MapboxGL.MapView | null>(null)
  const [activeFeature, setActiveFeature] = useState<Feature<Point> | null>(currentFeature ?? null)
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const layerProps: SymbolLayerProps = {
    id: layerId,
    style: {
      symbolPlacement: 'point',
      iconAllowOverlap: true,
      iconIgnorePlacement: true,
      iconImage: ['get', 'symbol'],
      textField: ['case', ['==', ['get', 'id'], activeFeature?.properties?.id ?? -1], ['get', 'title'], ''],
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
    zoomLevel: activeFeature?.geometry.coordinates ? detailZoom : defaultViewportConfig.zoom,
    centerCoordinate: activeFeature?.geometry.coordinates,
    bounds: activeFeature?.geometry.coordinates ? undefined : bounds
  }

  const onPress = useCallback(
    async (e: Feature) => {
      const featureCollection: FeatureCollection<Point> = (await ref.current?.queryRenderedFeaturesAtPoint(
        [e.properties?.screenPointX, e.properties?.screenPointY],
        undefined,
        [layerId]
      )) as FeatureCollection<Point>
      const { features } = featureCollection
      if (features?.length) {
        setActiveFeature(features[0])
        setShowPopup(true)
      } else {
        setActiveFeature(null)
        setShowPopup(false)
      }
    },
    [ref]
  )

  return (
    <>
      <MapContainer>
        <StyledMap styleJSON={mapConfig.styleJSON} zoomEnabled onPress={onPress} ref={ref}>
          <MapboxGL.ShapeSource id='location-pois' shape={featureCollection}>
            <MapboxGL.SymbolLayer {...layerProps} />
          </MapboxGL.ShapeSource>
          <MapboxGL.Camera defaultSettings={defaultSettings} />
        </StyledMap>
        {showPopup && activeFeature && <MapPopup feature={activeFeature} />}
      </MapContainer>
    </>
  )
}

export default MapView

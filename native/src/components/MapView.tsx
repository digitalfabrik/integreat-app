import MapboxGL, { CameraSettings, MapboxGLEvent, SymbolLayerProps } from '@react-native-mapbox-gl/maps'
import type { BBox, Feature } from 'geojson'
import React, { ReactElement, useCallback, useState } from 'react'
import { FAB } from 'react-native-elements'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { defaultViewportConfig, detailZoom, mapConfig, mapMarker, PoiFeature, PoiFeatureCollection } from 'api-client'

const MapContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
`
const StyledMap = styled(MapboxGL.MapView)`
  width: 100%;
`

const StyledFAB = styled(FAB)<{ position: number | string }>`
  align-items: flex-end;
  bottom: ${props => props.position}${props => (typeof props.position === 'number' ? 'px' : '')};
`

type MapViewPropsType = {
  boundingBox: BBox
  featureCollection: PoiFeatureCollection
  selectedFeature: PoiFeature | null
  onRequestLocationPermission: () => Promise<void>
  locationPermissionGranted: boolean
  fabPosition: string | number
  selectPoiFeature: (feature: PoiFeature | null) => void
  setSheetSnapPointIndex: (index: number) => void
}

const textOffsetY = 1.25
const featureLayerId = 'point'

// Has to be set even if we use map libre
MapboxGL.setAccessToken(mapConfig.accessToken)
const MapView = ({
  boundingBox,
  featureCollection,
  selectedFeature,
  fabPosition,
  onRequestLocationPermission,
  locationPermissionGranted,
  selectPoiFeature,
  setSheetSnapPointIndex
}: MapViewPropsType): ReactElement => {
  const [followUserLocation, setFollowUserLocation] = useState<boolean>(false)
  const mapRef = React.useRef<MapboxGL.MapView | null>(null)
  const cameraRef = React.useRef<MapboxGL.Camera | null>(null)
  const theme = useTheme()

  const layerProps: SymbolLayerProps = {
    id: featureLayerId,
    style: {
      symbolPlacement: 'point',
      symbolZOrder: 'source',
      iconAllowOverlap: true,
      iconSize: mapMarker.iconSize,
      iconIgnorePlacement: true,
      iconImage: [
        'case',
        ['==', ['get', 'id'], selectedFeature?.properties.id ?? -1],
        mapMarker.symbolActive,
        ['get', 'symbol']
      ],
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
  const coordinates = selectedFeature?.geometry.coordinates
  const defaultSettings: CameraSettings = {
    zoomLevel: coordinates ? detailZoom : defaultViewportConfig.zoom,
    centerCoordinate: coordinates,
    bounds: coordinates ? undefined : bounds
  }

  const onRequestLocation = useCallback(async () => {
    await onRequestLocationPermission()
    setFollowUserLocation(true)
  }, [onRequestLocationPermission])

  const onUserTrackingModeChange = (
    event: MapboxGLEvent<'usertrackingmodechange', { followUserLocation: boolean }>
  ) => {
    setFollowUserLocation(event.nativeEvent.payload.followUserLocation)
  }

  const locationPermissionGrantedIcon = followUserLocation ? 'my-location' : 'location-searching'
  const locationPermissionIcon = locationPermissionGranted ? locationPermissionGrantedIcon : 'location-disabled'

  const onPress = async (pressedLocation: Feature) => {
    if (!mapRef.current || !cameraRef.current || !pressedLocation.properties) {
      return
    }
    const featureCollection = await mapRef.current.queryRenderedFeaturesAtPoint(
      [pressedLocation.properties.screenPointX, pressedLocation.properties.screenPointY],
      undefined,
      [featureLayerId]
    )

    const feature = featureCollection?.features.find((it): it is PoiFeature => it.geometry.type === 'Point')

    if (feature) {
      const {
        geometry: { coordinates }
      } = feature
      selectPoiFeature(feature)
      cameraRef.current.flyTo(coordinates)
      setSheetSnapPointIndex(2)
    } else {
      selectPoiFeature(null)
      setSheetSnapPointIndex(1)
    }
  }

  return (
    <MapContainer>
      <StyledMap
        styleJSON={mapConfig.styleJSON}
        zoomEnabled
        onPress={onPress}
        ref={mapRef}
        attributionEnabled={false}
        logoEnabled={false}>
        <MapboxGL.UserLocation visible={locationPermissionGranted} />
        <MapboxGL.ShapeSource id='location-pois' shape={featureCollection}>
          <MapboxGL.SymbolLayer {...layerProps} />
        </MapboxGL.ShapeSource>
        <MapboxGL.Camera
          defaultSettings={defaultSettings}
          followUserMode='normal'
          followUserLocation={followUserLocation && locationPermissionGranted}
          onUserTrackingModeChange={onUserTrackingModeChange}
          ref={cameraRef}
        />
      </StyledMap>
      <StyledFAB
        placement='right'
        onPress={onRequestLocation}
        buttonStyle={{ borderRadius: 50 }}
        icon={{ name: locationPermissionIcon }}
        color={theme.colors.themeColor}
        position={fabPosition}
      />
    </MapContainer>
  )
}

export default MapView

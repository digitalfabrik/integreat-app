import MapboxGL, { CameraSettings, MapboxGLEvent, SymbolLayerProps } from '@react-native-mapbox-gl/maps'
import { useHeaderHeight } from '@react-navigation/stack'
import type { BBox, Feature, FeatureCollection, Point } from 'geojson'
import React, { ReactElement, useCallback, useMemo, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { FAB } from 'react-native-elements'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { defaultViewportConfig, detailZoom, mapConfig, RouteInformationType } from 'api-client'

import dimensions from '../constants/dimensions'
import MapPopup from './MapPopup'

const MapContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`
const StyledMap = styled(MapboxGL.MapView)<{ calcHeight: number }>`
  width: 100%;
  height: ${props => props.calcHeight}px;
`

const StyledFAB = styled(FAB)<{ position: number | string }>`
  align-items: flex-end;
  bottom: ${props => props.position}${props => typeof props.position === 'number' && 'px'};
`

type MapViewPropsType = {
  boundingBox: BBox
  featureCollection: FeatureCollection
  selectedFeature: Feature<Point> | null
  setSelectedFeature: (feature: Feature<Point> | null) => void
  navigateTo: (routeInformation: RouteInformationType) => void
  language: string
  cityCode: string
  onRequestLocationPermission: () => Promise<void>
  locationPermissionGranted: boolean
  fabPosition: string | number
}

const textOffsetY = 1.25
const featureLayerId = 'point'
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

// Has to be set even if we use map libre
MapboxGL.setAccessToken(mapConfig.accessToken)
const MapView = ({
  boundingBox,
  featureCollection,
  selectedFeature,
  setSelectedFeature,
  navigateTo,
  language,
  cityCode,
  fabPosition,
  onRequestLocationPermission,
  locationPermissionGranted
}: MapViewPropsType): ReactElement => {
  const [followUserLocation, setFollowUserLocation] = useState<boolean>(false)
  const mapRef = React.useRef<MapboxGL.MapView | null>(null)
  const cameraRef = React.useRef<MapboxGL.Camera | null>(null)
  const theme = useTheme()
  const { height } = useWindowDimensions()
  const headerHeight = useHeaderHeight()

  // calculates the map height regarding to navigation and bottom sheet
  const mapHeight = useMemo(
    () => (selectedFeature ? height - headerHeight : height - headerHeight - dimensions.bottomSheetHandler.height),
    [headerHeight, height, selectedFeature]
  )

  const popUpHeight = 150
  const fabMargin = 32

  const bounds = {
    ne: [boundingBox[2], boundingBox[3]],
    sw: [boundingBox[0], boundingBox[1]]
  }

  // if there is a current feature use the coordinates if not use bounding box
  const coordinates = selectedFeature?.geometry?.coordinates
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
  const locationPermissionIcon =
    locationPermissionGranted && followUserLocation
      ? 'my-location'
      : locationPermissionGranted
      ? 'location-searching'
      : 'location-disabled'

  const onPress = useCallback(
    async (pressedLocation: Feature) => {
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
        const {
          geometry: { coordinates }
        } = feature
        setSelectedFeature(feature)

        cameraRef.current.flyTo(coordinates)
      } else {
        setSelectedFeature(null)
      }
    },
    [setSelectedFeature]
  )

  return (
    <MapContainer>
      <StyledMap
        styleJSON={mapConfig.styleJSON}
        zoomEnabled
        onPress={onPress}
        ref={mapRef}
        attributionEnabled={false}
        logoEnabled={false}
        calcHeight={mapHeight}>
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
      {selectedFeature && (
        <MapPopup
          feature={selectedFeature}
          navigateTo={navigateTo}
          language={language}
          cityCode={cityCode}
          height={popUpHeight}
        />
      )}
      <StyledFAB
        placement='right'
        onPress={onRequestLocation}
        buttonStyle={{ borderRadius: 50 }}
        icon={{ name: locationPermissionIcon }}
        color={theme.colors.themeColor}
        position={selectedFeature ? popUpHeight + fabMargin : fabPosition}
      />
    </MapContainer>
  )
}

export default MapView

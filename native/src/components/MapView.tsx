import MapboxGL, { CameraSettings, MapboxGLEvent } from '@react-native-mapbox-gl/maps'
import type { BBox, Feature } from 'geojson'
import React, { ReactElement, useCallback } from 'react'
import { FAB } from 'react-native-elements'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import {
  clusterRadius,
  defaultViewportConfig,
  normalDetailZoom,
  mapConfig,
  PoiFeature,
  PoiFeatureCollection,
} from 'api-client'

import { clusterCountLayer, clusterLayer, markerLayer } from '../constants/layers'
import MapAttribution from './MapsAttribution'

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

type MapViewProps = {
  boundingBox: BBox
  featureCollection: PoiFeatureCollection
  selectedFeature: PoiFeature | null
  onRequestLocationPermission: () => Promise<void>
  locationPermissionGranted: boolean
  fabPosition: string | number
  selectFeature: (feature: PoiFeature | null) => void
  setSheetSnapPointIndex: (index: number) => void
  followUserLocation: boolean
  setFollowUserLocation: (value: boolean) => void
}

const featureLayerId = 'point'

// Has to be set even if we use map libre
MapboxGL.setAccessToken(mapConfig.accessToken)
const MapView = React.forwardRef(
  (
    {
      boundingBox,
      featureCollection,
      selectedFeature,
      fabPosition,
      onRequestLocationPermission,
      locationPermissionGranted,
      selectFeature,
      setSheetSnapPointIndex,
      followUserLocation,
      setFollowUserLocation,
    }: MapViewProps,
    cameraRef: React.Ref<MapboxGL.Camera>
  ): ReactElement => {
    const mapRef = React.useRef<MapboxGL.MapView | null>(null)
    const theme = useTheme()

    const bounds = {
      ne: [boundingBox[2], boundingBox[3]],
      sw: [boundingBox[0], boundingBox[1]],
    }

    // if there is a current feature use the coordinates; if not use bounding box
    const coordinates = selectedFeature?.geometry.coordinates
    const defaultSettings: CameraSettings = {
      zoomLevel: coordinates ? normalDetailZoom : defaultViewportConfig.zoom,
      centerCoordinate: coordinates,
      bounds: coordinates ? undefined : bounds,
    }

    const onRequestLocation = useCallback(async () => {
      await onRequestLocationPermission()
      setFollowUserLocation(true)
    }, [onRequestLocationPermission, setFollowUserLocation])

    const onUserTrackingModeChange = (
      event: MapboxGLEvent<'usertrackingmodechange', { followUserLocation: boolean }>
    ) => {
      if (!event.nativeEvent.payload.followUserLocation) {
        setFollowUserLocation(event.nativeEvent.payload.followUserLocation)
      }
    }

    const locationPermissionGrantedIcon = followUserLocation ? 'my-location' : 'location-searching'
    const locationPermissionIcon = locationPermissionGranted ? locationPermissionGrantedIcon : 'location-disabled'

    const onPress = async (pressedLocation: Feature) => {
      if (!mapRef.current || !pressedLocation.properties) {
        return
      }
      const featureCollection = await mapRef.current.queryRenderedFeaturesAtPoint(
        [pressedLocation.properties.screenPointX, pressedLocation.properties.screenPointY],
        undefined,
        [featureLayerId]
      )

      const feature = featureCollection?.features.find((it): it is PoiFeature => it.geometry.type === 'Point')
      selectFeature(feature ?? null)
      setSheetSnapPointIndex(1)
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
          <MapboxGL.ShapeSource id='location-pois' shape={featureCollection} cluster clusterRadius={clusterRadius}>
            <MapboxGL.SymbolLayer {...clusterCountLayer} />
            <MapboxGL.CircleLayer {...clusterLayer(theme)} />
            <MapboxGL.SymbolLayer {...markerLayer(selectedFeature, featureLayerId)} />
          </MapboxGL.ShapeSource>
          <MapboxGL.Camera
            defaultSettings={defaultSettings}
            followUserMode='normal'
            followUserLocation={followUserLocation && locationPermissionGranted}
            onUserTrackingModeChange={onUserTrackingModeChange}
            ref={cameraRef}
          />
        </StyledMap>
        <MapAttribution />
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
)

export default MapView

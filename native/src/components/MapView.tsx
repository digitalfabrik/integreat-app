import MapLibreGL, { CameraSettings } from '@maplibre/maplibre-react-native'
import type { BBox, Feature, Geometry, GeoJsonProperties } from 'geojson'
import { Position } from 'geojson'
import React, { ReactElement, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import {
  clusterRadius,
  defaultViewportConfig,
  normalDetailZoom,
  mapConfig,
  MapFeature,
  MapFeatureCollection,
  animationDuration,
  clusterLayerId,
  featureLayerId,
  clusterClickZoomFactor,
} from 'api-client'

import { LocationFixedIcon, LocationNotFixedIcon, LocationOffIcon } from '../assets'
import { clusterCountLayer, clusterLayer, markerLayer } from '../constants/layers'
import MapAttribution from './MapsAttribution'
import Icon from './base/Icon'
import IconButton from './base/IconButton'

const MapContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
`

const StyledMap = styled(MapLibreGL.MapView)`
  width: 100%;
`

const StyledIcon = styled(IconButton)<{ position: number | string }>`
  position: absolute;
  right: 0;
  bottom: ${props => props.position}${props => (typeof props.position === 'number' ? 'px' : '')};
  background-color: ${props => props.theme.colors.themeColor};
  margin: 16px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
`

const OverlayContainer = styled.View`
  flex: 1;
  flex-direction: row;
  position: absolute;
  top: 24px;
  left: 8px;
`

type MapViewProps = {
  boundingBox: BBox
  featureCollection: MapFeatureCollection
  selectedFeature: MapFeature | null
  onRequestLocationPermission: () => Promise<void>
  locationPermissionGranted: boolean
  iconPosition: string | number
  selectFeature: (feature: MapFeature | null) => void
  setSheetSnapPointIndex: (index: number) => void
  bottomSheetHeight: number
  Overlay?: ReactElement
}

// Has to be set even if we use map libre
MapLibreGL.setAccessToken(null)
const MapView = ({
  boundingBox,
  featureCollection,
  selectedFeature,
  iconPosition,
  onRequestLocationPermission,
  locationPermissionGranted,
  selectFeature,
  setSheetSnapPointIndex,
  Overlay,
  bottomSheetHeight,
}: MapViewProps): ReactElement => {
  const cameraRef = useRef<MapLibreGL.Camera | null>(null)
  const mapRef = useRef<MapLibreGL.MapView | null>(null)
  const theme = useTheme()
  const { t } = useTranslation('pois')
  const [userLocation, setUserLocation] = useState<MapLibreGL.Location | undefined>(undefined)
  const [followUserLocation, setFollowUserLocation] = useState<boolean>(false)

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

  const moveTo = useCallback((location: Position, bottomSheetHeight: number, zoomLevel = normalDetailZoom) => {
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: location,
        zoomLevel,
        animationDuration,
        padding: { paddingBottom: bottomSheetHeight },
      })
    }
  }, [])

  const onRequestLocation = useCallback(async () => {
    await onRequestLocationPermission()
    if (userLocation?.coords) {
      const { longitude, latitude } = userLocation.coords
      moveTo([longitude, latitude], bottomSheetHeight)
      setFollowUserLocation(true)
    }
  }, [bottomSheetHeight, moveTo, onRequestLocationPermission, userLocation])

  useLayoutEffect(() => {
    if (selectedFeature) {
      moveTo(selectedFeature.geometry.coordinates, bottomSheetHeight)
      setFollowUserLocation(false)
    }
  }, [bottomSheetHeight, moveTo, selectedFeature])

  const locationPermissionGrantedIcon = followUserLocation ? LocationFixedIcon : LocationNotFixedIcon
  const locationPermissionIcon = locationPermissionGranted ? locationPermissionGrantedIcon : LocationOffIcon

  const zoomOnClusterPress = async (pressedLocation: Feature<Geometry, GeoJsonProperties>) => {
    if (!mapRef.current || !pressedLocation.properties) {
      return
    }
    const clusterCollection = await mapRef.current.queryRenderedFeaturesAtPoint(
      [pressedLocation.properties.screenPointX, pressedLocation.properties.screenPointY],
      undefined,
      [clusterLayerId],
    )
    if (clusterCollection && 0 in clusterCollection.features) {
      const feature = clusterCollection.features[0] as MapFeature
      moveTo(feature.geometry.coordinates, bottomSheetHeight, (await mapRef.current.getZoom()) + clusterClickZoomFactor)
    }
  }
  const onPress = async (pressedLocation: Feature) => {
    setFollowUserLocation(false)
    if (!mapRef.current || !pressedLocation.properties) {
      return
    }
    const featureCollection = await mapRef.current.queryRenderedFeaturesAtPoint(
      [pressedLocation.properties.screenPointX, pressedLocation.properties.screenPointY],
      undefined,
      [featureLayerId],
    )

    const feature = featureCollection?.features.find((it): it is MapFeature => it.geometry.type === 'Point')
    selectFeature(feature ?? null)
    setSheetSnapPointIndex(1)

    zoomOnClusterPress(pressedLocation)
  }

  const deactivateFollowUserLocation = () => setFollowUserLocation(false)

  return (
    <MapContainer>
      <StyledMap
        styleJSON={mapConfig.styleJSON}
        zoomEnabled
        onPress={onPress}
        ref={mapRef}
        onStartShouldSetResponder={() => true}
        onResponderMove={deactivateFollowUserLocation}
        attributionEnabled={false}
        logoEnabled={false}>
        <MapLibreGL.UserLocation visible={locationPermissionGranted} onUpdate={setUserLocation} />
        <MapLibreGL.ShapeSource id='location-pois' shape={featureCollection} cluster clusterRadius={clusterRadius}>
          <MapLibreGL.SymbolLayer {...clusterCountLayer} />
          <MapLibreGL.CircleLayer {...clusterLayer(theme)} />
          <MapLibreGL.SymbolLayer {...markerLayer(selectedFeature)} />
        </MapLibreGL.ShapeSource>
        <MapLibreGL.Camera defaultSettings={defaultSettings} followUserMode='normal' ref={cameraRef} />
      </StyledMap>
      <OverlayContainer>{Overlay}</OverlayContainer>
      <MapAttribution />
      <StyledIcon
        icon={<Icon Icon={locationPermissionIcon} />}
        onPress={onRequestLocation}
        position={iconPosition}
        accessibilityLabel={t('showOwnLocation')}
      />
    </MapContainer>
  )
}

export default MapView

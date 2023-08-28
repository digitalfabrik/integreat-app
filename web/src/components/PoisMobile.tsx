import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GeolocateControl } from 'maplibre-gl'
import styled, { css } from 'styled-components'

import {
  embedInCollection,
  GeoJsonPoi,
  LocationType,
  MapViewViewport,
  MapFeature,
  PoiModel,
  sortMapFeatures,
} from 'api-client'
import { UiDirectionType } from 'translations'

import { ArrowBackspaceIcon } from '../assets'
import useMapFeatures from '../hooks/useMapFeatures'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { getSnapPoints } from '../utils/getSnapPoints'
import BottomActionSheet, { ScrollableBottomSheetRef } from './BottomActionSheet'
import GoBack from './GoBack'
import List from './List'
import MapView, { MapViewRef } from './MapView'
import PoiDetails from './PoiDetails'
import PoiListItem from './PoiListItem'
import Icon from './base/Icon'

const geolocatorTopOffset = 40

const ListContainer = styled.div`
  padding: 0 30px;
`

const GoBackContainer = styled.div<{ hidden: boolean }>`
  display: flex;
  flex-direction: column;
  max-height: ${props => (props.hidden ? '0' : '10vh')};
  opacity: ${props => (props.hidden ? '0' : '1')};
  overflow: hidden;
  transition: all 1s;
  padding: 0 30px;
`

const BackNavigation = styled.div<{ direction: string }>`
  position: absolute;
  top: 10px;
  ${props => (props.direction === 'rtl' ? `right: 10px;` : `left: 10px;`)}
  background-color: ${props => props.theme.colors.textDisabledColor};
  height: 28px;
  width: 28px;
  border: 1px solid #818181;
  border-radius: 50px;
  box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
  justify-content: center;
  align-items: center;
  display: flex;
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.backgroundColor};
`

const GeoLocateContainer = styled.div<{ isCurrentPositionVisible: boolean; direction: string }>`
  position: absolute;
  ${props =>
    props.direction === 'ltr'
      ? css`
          right: 10px;
        `
      : css`
          left: 10px;
        `};
  top: -${geolocatorTopOffset}px;
  ${props =>
    props.isCurrentPositionVisible
      ? css`
          transform: translateY(${geolocatorTopOffset}px);
          opacity: 0;
        `
      : ''};
  transition: all 0.2s ease-out;
`

type PoisMobileProps = {
  toolbar: ReactElement
  features: MapFeature[]
  pois: PoiModel[]
  direction: UiDirectionType
  userLocation: LocationType | undefined
  languageCode: string
  slug: string | undefined
  mapViewport?: MapViewViewport
  setMapViewport: (mapViewport: MapViewViewport) => void
}

const PoisMobile = ({
  toolbar,
  languageCode,
  pois,
  features,
  userLocation,
  direction,
  slug,
  mapViewport,
  setMapViewport,
}: PoisMobileProps): ReactElement => {
  const { t } = useTranslation('pois')
  const [bottomActionSheetHeight, setBottomActionSheetHeight] = useState(0)
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const sheetRef = useRef<ScrollableBottomSheetRef>(null)
  const geolocatePosition = useRef<HTMLDivElement>(null)
  const [mapViewRef, setMapViewRef] = useState<MapViewRef | null>(null)
  const { selectGeoJsonPoiInList, selectFeatureOnMap, currentFeatureOnMap, currentPoi, poiListFeatures } =
    useMapFeatures(features, pois, slug)
  const { height } = useWindowDimensions()

  const isBottomActionSheetFullScreen = bottomActionSheetHeight >= height
  const changeSnapPoint = (snapPoint: number) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    sheetRef.current?.sheet?.snapTo(({ maxHeight }) => getSnapPoints(maxHeight)[snapPoint]!)
  }

  const handleSelectFeatureInList = (poiFeature: GeoJsonPoi | null) => {
    if (poiFeature && !currentPoi && sheetRef.current?.scrollElement) {
      setScrollOffset(sheetRef.current.scrollElement.scrollTop)
    }
    selectGeoJsonPoiInList(poiFeature)
  }

  const renderPoiListItem = (poi: GeoJsonPoi) => (
    <PoiListItem key={poi.path} poi={poi} selectPoi={handleSelectFeatureInList} />
  )

  const handleSelectFeatureOnMap = useCallback(
    (feature: MapFeature | null) => {
      if (feature) {
        changeSnapPoint(1)
        if (!currentFeatureOnMap && sheetRef.current?.scrollElement) {
          setScrollOffset(sheetRef.current.scrollElement.scrollTop)
        }
      }
      selectFeatureOnMap(feature)
    },
    [currentFeatureOnMap, selectFeatureOnMap],
  )

  useEffect(() => {
    if (!currentFeatureOnMap) {
      sheetRef.current?.scrollElement?.scrollTo({ top: scrollOffset })
    } else {
      sheetRef.current?.scrollElement?.scrollTo({ top: 0 })
    }
  }, [currentFeatureOnMap, scrollOffset])

  const poiList = (
    <List
      noItemsMessage={t('noPois')}
      items={sortMapFeatures(poiListFeatures)}
      renderItem={renderPoiListItem}
      borderless
    />
  )

  useEffect(() => {
    if (mapViewRef && geolocatePosition.current) {
      const geolocate = new GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      })
      mapViewRef.addGeolocatePosition(geolocatePosition.current, 'geolocate')
      mapViewRef.setGeocontrol('geolocate', geolocate)
    }
  }, [mapViewRef])

  return (
    <>
      <MapView
        ref={setMapViewRef}
        viewport={mapViewport}
        setViewport={setMapViewport}
        selectFeature={handleSelectFeatureOnMap}
        changeSnapPoint={changeSnapPoint}
        featureCollection={embedInCollection(features)}
        currentFeature={currentFeatureOnMap}
        languageCode={languageCode}>
        {currentFeatureOnMap && (
          <BackNavigation
            onClick={() => handleSelectFeatureOnMap(null)}
            role='button'
            tabIndex={0}
            onKeyPress={() => handleSelectFeatureOnMap(null)}
            direction={direction}>
            <StyledIcon src={ArrowBackspaceIcon} directionDependent />
          </BackNavigation>
        )}
      </MapView>
      <BottomActionSheet
        title={!currentFeatureOnMap ? t('listTitle') : undefined}
        toolbar={toolbar}
        ref={sheetRef}
        setBottomActionSheetHeight={setBottomActionSheetHeight}
        direction={direction}>
        <GeoLocateContainer
          id='geolocate'
          direction={direction}
          ref={geolocatePosition}
          isCurrentPositionVisible={bottomActionSheetHeight >= getSnapPoints(height)[2]}
        />
        <GoBackContainer hidden={!isBottomActionSheetFullScreen}>
          <GoBack goBack={() => selectGeoJsonPoiInList(null)} viewportSmall text={t('detailsHeader')} />
        </GoBackContainer>
        <ListContainer>
          {currentPoi ? (
            <PoiDetails poi={currentPoi} feature={currentPoi.getFeature(userLocation)} direction={direction} />
          ) : (
            poiList
          )}
        </ListContainer>
      </BottomActionSheet>
    </>
  )
}

export default PoisMobile

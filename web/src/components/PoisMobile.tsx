import { GeolocateControl } from 'maplibre-gl'
import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { embedInCollection, GeoJsonPoi, LocationType, MapViewViewport, MapFeature, PoiModel } from 'api-client'
import { UiDirectionType } from 'translations'

import { ArrowBackspaceIcon } from '../assets'
import useMapFeatures from '../hooks/useMapFeatures'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { getSnapPoints } from '../utils/getSnapPoints'
import BottomActionSheet, { ScrollableBottomSheetRef } from './BottomActionSheet'
import GoBack from './GoBack'
import MapView, { MapViewRef } from './MapView'
import PoiSharedChildren from './PoiSharedChildren'
import Button from './base/Button'
import Icon from './base/Icon'

const geolocatorTopOffset = 10

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

const BackNavigation = styled(Button)<{ direction: string }>`
  background-color: ${props => props.theme.colors.textSecondaryColor};
  height: 28px;
  width: 28px;
  border: 1px solid ${props => props.theme.colors.textDisabledColor};
  border-radius: 50px;
  box-shadow: 1px 1px 2px 0 rgb(0 0 0 / 20%);
  justify-content: center;
  align-items: center;
  display: flex;
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.backgroundColor};
`

const GeocontrolContainer = styled.div<{ height: number; direction: string }>`
  --max-icon-height: calc(${props => getSnapPoints(props.height)[1]}px + ${geolocatorTopOffset}px);

  position: absolute;
  ${props =>
    props.direction === 'ltr'
      ? css`
          right: 10px;
        `
      : css`
          left: 10px;
        `};
  bottom: min(calc(var(--rsbs-overlay-h, 0) + ${geolocatorTopOffset}px), var(--max-icon-height));
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
  MapOverlay: ReactElement
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
  MapOverlay,
}: PoisMobileProps): ReactElement => {
  const { t } = useTranslation('pois')
  const [bottomActionSheetHeight, setBottomActionSheetHeight] = useState(0)
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const sheetRef = useRef<ScrollableBottomSheetRef>(null)
  const geocontrolPosition = useRef<HTMLDivElement>(null)
  const [mapViewRef, setMapViewRef] = useState<MapViewRef | null>(null)
  const { selectGeoJsonPoiInList, selectFeatureOnMap, currentFeatureOnMap, currentPoi, poiListFeatures } =
    useMapFeatures(features, pois, slug)
  const { height } = useWindowDimensions()
  const canGoBack = !!currentFeatureOnMap || !!slug

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
    sheetRef.current?.scrollElement?.scrollTo({ top: currentFeatureOnMap ? 0 : scrollOffset })
  }, [currentFeatureOnMap, scrollOffset])

  useEffect(() => {
    if (mapViewRef && geocontrolPosition.current) {
      const geocontrol = new GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      })
      mapViewRef.setGeocontrol(geocontrol)
      geocontrolPosition.current.appendChild(geocontrol._container)
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
        languageCode={languageCode}
        Overlay={
          <>
            {canGoBack && (
              <BackNavigation
                onClick={() => handleSelectFeatureOnMap(null)}
                tabIndex={0}
                direction={direction}
                ariaLabel={t('detailsHeader')}>
                <StyledIcon src={ArrowBackspaceIcon} directionDependent />
              </BackNavigation>
            )}
            {MapOverlay}
          </>
        }
      />
      <BottomActionSheet
        title={!canGoBack ? t('listTitle') : undefined}
        toolbar={toolbar}
        ref={sheetRef}
        setBottomActionSheetHeight={setBottomActionSheetHeight}
        direction={direction}
        sibling={<GeocontrolContainer id='geolocate' direction={direction} ref={geocontrolPosition} height={height} />}>
        {canGoBack && (
          <GoBackContainer hidden={!isBottomActionSheetFullScreen}>
            <GoBack goBack={() => selectGeoJsonPoiInList(null)} viewportSmall text={t('detailsHeader')} />
          </GoBackContainer>
        )}
        <ListContainer>
          <PoiSharedChildren
            poiListFeatures={poiListFeatures}
            currentPoi={currentPoi}
            selectPoi={handleSelectFeatureInList}
            userLocation={userLocation}
            direction={direction}
            slug={slug}
          />
        </ListContainer>
      </BottomActionSheet>
    </>
  )
}

export default PoisMobile

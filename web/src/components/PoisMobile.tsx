import { height } from '@fortawesome/free-solid-svg-icons/faSearch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GeolocateControl } from 'react-map-gl'
import styled, { css } from 'styled-components'

import {
  CityModel,
  embedInCollection,
  GeoJsonPoi,
  LocationType,
  PoiFeature,
  PoiModel,
  sortPoiFeatures,
} from 'api-client'
import { UiDirectionType } from 'translations'

import { faArrowLeft } from '../constants/icons'
import usePoiFeatures from '../hooks/usePoiFeatures'
import { getSnapPoints } from '../utils/getSnapPoints'
import BottomActionSheet, { ScrollableBottomSheetRef } from './BottomActionSheet'
import List from './List'
import MapView from './MapView'
import PoiDetails from './PoiDetails'
import PoiGoBack from './PoiGoBack'
import PoiListItem from './PoiListItem'

const ListContainer = styled.div`
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

const StyledIcon = styled(FontAwesomeIcon)<{ direction: string }>`
  font-size: 12px;
  color: white;
  ${props =>
    props.direction === 'rtl' &&
    css`
      transform: scaleX(-1);
    `};
`

type PoisMobileProps = {
  toolbar: ReactElement
  features: PoiFeature[]
  pois: PoiModel[]
  direction: UiDirectionType
  userLocation: LocationType | undefined
  cityModel: CityModel
  languageCode: string
  slug: string | undefined
}

const PoisMobile = ({
  toolbar,
  cityModel,
  languageCode,
  pois,
  features,
  userLocation,
  direction,
  slug,
}: PoisMobileProps): ReactElement => {
  const { t } = useTranslation('pois')
  const [bottomActionSheetHeight, setBottomActionSheetHeight] = useState(0)
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const sheetRef = useRef<ScrollableBottomSheetRef>(null)
  const { selectPoiFeatureInList, selectFeatureOnMap, currentFeatureOnMap, currentPoi, poiListFeatures } =
    usePoiFeatures(features, pois, slug)

  const isBottomActionSheetFullScreen = bottomActionSheetHeight >= height
  const changeSnapPoint = (snapPoint: number) => {
    sheetRef.current?.sheet?.snapTo(({ maxHeight }) => getSnapPoints(maxHeight)[snapPoint]!)
  }

  const handleSelectFeatureInList = (poiFeature: GeoJsonPoi | null) => {
    if (poiFeature && !currentPoi && sheetRef.current?.scrollElement) {
      setScrollOffset(sheetRef.current.scrollElement.scrollTop)
    }
    selectPoiFeatureInList(poiFeature)
  }

  const renderPoiListItem = (poi: GeoJsonPoi) => (
    <PoiListItem key={poi.path} poi={poi} selectPoi={handleSelectFeatureInList} />
  )

  const handleSelectFeatureOnMap = useCallback(
    (feature: PoiFeature | null) => {
      if (feature) {
        changeSnapPoint(1)
        if (!currentFeatureOnMap && sheetRef.current?.scrollElement) {
          setScrollOffset(sheetRef.current.scrollElement.scrollTop)
        }
      }
      selectFeatureOnMap(feature)
    },
    [currentFeatureOnMap, selectFeatureOnMap]
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
      items={sortPoiFeatures(poiListFeatures)}
      renderItem={renderPoiListItem}
      borderless
    />
  )

  return (
    <>
      <MapView
        selectFeature={handleSelectFeatureOnMap}
        changeSnapPoint={changeSnapPoint}
        featureCollection={embedInCollection(features)}
        currentFeature={currentFeatureOnMap}
        cityModel={cityModel}
        languageCode={languageCode}>
        {currentFeatureOnMap && (
          <BackNavigation
            onClick={() => handleSelectFeatureOnMap(null)}
            role='button'
            tabIndex={0}
            onKeyPress={() => handleSelectFeatureOnMap(null)}
            direction={direction}>
            <StyledIcon icon={faArrowLeft} direction={direction} />
          </BackNavigation>
        )}
        {/* To use geolocation in a development build you have to start the dev server with "yarn start --https" */}
        <GeolocateControl
          style={{
            bottom: bottomActionSheetHeight,
            position: 'absolute',
            right: 0,
          }}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
          position='bottom-right'
        />
      </MapView>
      <BottomActionSheet
        title={!currentFeatureOnMap ? t('listTitle') : undefined}
        toolbar={toolbar}
        ref={sheetRef}
        setBottomActionSheetHeight={setBottomActionSheetHeight}
        direction={direction}>
        {currentFeatureOnMap && isBottomActionSheetFullScreen && (
          <PoiGoBack goBack={() => selectPoiFeatureInList(null)} direction={direction} viewportSmall t={t} />
        )}
        <ListContainer>
          {currentPoi ? (
            <PoiDetails poi={currentPoi} feature={currentPoi.getFeature(userLocation)} direction={direction} t={t} />
          ) : (
            poiList
          )}
        </ListContainer>
      </BottomActionSheet>
    </>
  )
}

export default PoisMobile

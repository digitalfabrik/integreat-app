import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GeolocateControl, NavigationControl } from 'react-map-gl'
import styled from 'styled-components'

import {
  CityModel,
  embedInCollection,
  GeoJsonPoi,
  LocationType,
  MapViewViewport,
  PoiFeature,
  PoiModel,
  sortPoiFeatures,
} from 'api-client'
import { UiDirectionType } from 'translations'

import dimensions from '../constants/dimensions'
import usePoiFeatures from '../hooks/usePoiFeatures'
import CityContentFooter from './CityContentFooter'
import List from './List'
import MapView from './MapView'
import PoiDetails from './PoiDetails'
import GoBack from './GoBack'
import PoiListItem from './PoiListItem'
import PoiPanelNavigation from './PoiPanelNavigation'

const PanelContainer = styled.article`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const ListViewWrapper = styled.div<{ panelHeights: number }>`
  width: 300px;
  padding: 0 clamp(16px, 1.4vh, 32px);
  overflow: auto;
  ${({ panelHeights }) => `height: calc(100vh - ${panelHeights}px - ${dimensions.toolbarHeight}px);`};
`

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  box-shadow: 1px 0 4px 0 rgba(0, 0, 0, 0.2);
`

const ListHeader = styled.div`
  padding-top: 32px;
  padding-top: clamp(16px, 1.4vh, 32px);
  padding-bottom: clamp(10px, 1vh, 20px);
  text-align: center;
  font-size: 18px;
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  line-height: ${props => props.theme.fonts.decorativeLineHeight};
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.colors.poiBorderColor};
  margin-bottom: clamp(10px, 1vh, 20px);
`

const FooterContainer = styled.div`
  position: absolute;
  bottom: 0;
`

type PoisDesktopProps = {
  panelHeights: number
  toolbar: ReactElement
  direction: UiDirectionType
  cityModel: CityModel
  pois: PoiModel[]
  userLocation: LocationType | undefined
  features: PoiFeature[]
  languageCode: string
  slug: string | undefined
  mapViewport: MapViewViewport
  setMapViewport: (mapViewport: React.SetStateAction<MapViewViewport>) => void
}

const nextPoiIndex = (step: 1 | -1, arrayLength: number, currentIndex: number): number => {
  if (currentIndex === arrayLength - 1 && step === 1) {
    return 0
  }
  if (currentIndex === 0 && step === -1) {
    return arrayLength - 1
  }
  return currentIndex + step
}

const PoisDesktop = ({
  panelHeights,
  toolbar,
  direction,
  pois,
  userLocation,
  features,
  cityModel,
  languageCode,
  slug,
  mapViewport,
  setMapViewport,
}: PoisDesktopProps): ReactElement => {
  const { t } = useTranslation('pois')
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const listRef = useRef<HTMLDivElement>(null)
  const { selectPoiFeatureInList, selectFeatureOnMap, currentFeatureOnMap, currentPoi, poiListFeatures } =
    usePoiFeatures(features, pois, slug)

  const selectPoiFeature = useCallback(
    (poiFeature: GeoJsonPoi | null) => {
      if (listRef.current && !currentPoi) {
        setScrollOffset(listRef.current.scrollTop)
      }
      selectPoiFeatureInList(poiFeature)
    },
    [currentPoi, selectPoiFeatureInList]
  )
  const renderPoiListItem = (poi: GeoJsonPoi) => <PoiListItem key={poi.path} poi={poi} selectPoi={selectPoiFeature} />
  const poiList = (
    <List
      noItemsMessage={t('noPois')}
      items={sortPoiFeatures(poiListFeatures)}
      renderItem={renderPoiListItem}
      borderless
    />
  )
  const switchPoi = (step: 1 | -1) => {
    if (!currentPoi) {
      return
    }
    const currentPoiIndex = poiListFeatures.findIndex(poi => poi.slug === currentPoi.slug)
    const updatedIndex = nextPoiIndex(step, poiListFeatures.length, currentPoiIndex)
    const poiFeature = poiListFeatures[updatedIndex]
    selectPoiFeatureInList(poiFeature ?? null)
  }

  useEffect(() => {
    if (!currentFeatureOnMap && listRef.current) {
      listRef.current.scrollTo({ top: scrollOffset })
    } else if (listRef.current) {
      listRef.current.scrollTo({ top: 0 })
    }
  }, [currentFeatureOnMap, currentPoi, scrollOffset])

  return (
    <>
      <PanelContainer>
        <ListViewWrapper ref={listRef} panelHeights={panelHeights}>
          {currentFeatureOnMap ? (
            <GoBack goBack={() => selectPoiFeatureInList(null)} direction={direction} text={t('detailsHeader')} />
          ) : (
            <ListHeader>{t('listTitle')}</ListHeader>
          )}

          {currentPoi ? (
            <PoiDetails poi={currentPoi} feature={currentPoi.getFeature(userLocation)} direction={direction} t={t} />
          ) : (
            <>{poiList}</>
          )}
        </ListViewWrapper>
        {currentPoi && features.length > 0 ? (
          <PoiPanelNavigation switchPoi={switchPoi} direction={direction} />
        ) : (
          <ToolbarContainer>{toolbar}</ToolbarContainer>
        )}
      </PanelContainer>
      <MapView
        viewport={mapViewport}
        setViewport={setMapViewport}
        selectFeature={selectFeatureOnMap}
        featureCollection={embedInCollection(features)}
        currentFeature={currentFeatureOnMap}
        languageCode={languageCode}>
        <NavigationControl showCompass={false} position={direction === 'rtl' ? 'bottom-left' : 'bottom-right'} />
        {/* To use geolocation in a development build you have to start the dev server with "yarn start --https" */}
        <GeolocateControl positionOptions={{ enableHighAccuracy: true }} trackUserLocation position='bottom-right' />
        <FooterContainer>
          <CityContentFooter city={cityModel.code} language={languageCode} mode='overlay' />
        </FooterContainer>
      </MapView>
    </>
  )
}

export default PoisDesktop

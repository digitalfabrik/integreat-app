import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GeolocateControl, NavigationControl } from 'react-map-gl'
import styled from 'styled-components'

import { CityModel, embedInCollection, GeoJsonPoi, PoiFeature, PoiModel, sortPoiFeatures } from 'api-client'
import { UiDirectionType } from 'translations'

import dimensions from '../constants/dimensions'
import { usePoiHandles } from '../hooks/usePoiFeatures'
import CityContentFooter from './CityContentFooter'
import List from './List'
import MapView from './MapView'
import PoiDetails from './PoiDetails'
import PoiGoBack from './PoiGoBack'
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
  currentFeatureOnMap: PoiFeature | null
  features: PoiFeature[]
  currentPoi: PoiModel | null
  languageCode: string
}

const nextPoiIndex = (step: 1 | -1, arrayLength: number, currentIndex: number): number => {
  if (currentIndex === arrayLength - 1 && step > 0) {
    return 0
  }
  if (currentIndex === 0 && step < 0) {
    return arrayLength - 1
  }
  return currentIndex + step
}

const PoisDesktop = ({
  panelHeights,
  toolbar,
  direction,
  currentFeatureOnMap,
  features,
  currentPoi,
  cityModel,
  languageCode,
}: PoisDesktopProps): ReactElement => {
  const { t } = useTranslation('pois')
  const poiFeatures = useMemo(() => features.flatMap(feature => feature.properties.pois), [features])
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const ref = useRef<HTMLDivElement>(null)
  const currentPoiFeature = currentFeatureOnMap?.properties.pois.find(poi => poi.slug === currentPoi?.slug)
  const { selectPoiFeatureInList, selectFeatureOnMap } = usePoiHandles(currentFeatureOnMap, currentPoi)

  const selectPoiFeature = useCallback(
    (poiFeature: GeoJsonPoi | null) => {
      if (ref.current && !currentPoi) {
        setScrollOffset(ref.current.scrollTop)
      }
      selectPoiFeatureInList(poiFeature)
    },
    [currentPoi, selectPoiFeatureInList]
  )

  const poiFeatureListItems = currentFeatureOnMap && !currentPoi ? currentFeatureOnMap.properties.pois : poiFeatures
  const renderPoiListItem = (poi: GeoJsonPoi) => <PoiListItem key={poi.path} poi={poi} selectPoi={selectPoiFeature} />
  const poiList = (
    <List
      noItemsMessage={t('noPois')}
      items={sortPoiFeatures(poiFeatureListItems)}
      renderItem={renderPoiListItem}
      borderless
    />
  )
  const switchPoi = (step: 1 | -1) => {
    if (!currentPoi) {
      return
    }
    const currentPoiIndex = poiFeatureListItems.findIndex(poi => poi.slug === currentPoi.slug)
    const updatedIndex = nextPoiIndex(step, poiFeatureListItems.length, currentPoiIndex)
    const poiFeature = poiFeatureListItems[updatedIndex]
    selectPoiFeatureInList(poiFeature ?? null)
  }

  useEffect(() => {
    // scrollTo the id of the selected element for detail view -> list view
    if (!currentFeatureOnMap && ref.current) {
      ref.current.scrollTo({ top: scrollOffset })
    } else {
      ref.current?.scrollTo({ top: 0 })
    }
  }, [currentFeatureOnMap, currentPoi, scrollOffset])

  return (
    <>
      <PanelContainer>
        <ListViewWrapper ref={ref} panelHeights={panelHeights}>
          {currentFeatureOnMap ? (
            <PoiGoBack goBack={() => selectPoiFeatureInList(null)} direction={direction} t={t} />
          ) : (
            <ListHeader>{t('listTitle')}</ListHeader>
          )}

          {currentPoi && currentPoiFeature ? (
            <PoiDetails poi={currentPoi} feature={currentPoiFeature} direction={direction} t={t} />
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
        selectFeature={selectFeatureOnMap}
        featureCollection={embedInCollection(features)}
        currentFeature={currentFeatureOnMap}
        cityModel={cityModel}
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

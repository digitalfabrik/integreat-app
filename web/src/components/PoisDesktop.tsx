import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GeolocateControl, NavigationControl } from 'react-map-gl'
import styled, { useTheme } from 'styled-components'

import { embedInCollection, GeoJsonPoi, LocationType, MapViewViewport, MapFeature } from 'shared'
import { CityModel, PoiModel } from 'shared/api'

import dimensions from '../constants/dimensions'
import useMapFeatures from '../hooks/useMapFeatures'
import CityContentFooter from './CityContentFooter'
import GoBack from './GoBack'
import MapView from './MapView'
import PoiPanelNavigation from './PoiPanelNavigation'
import PoiSharedChildren from './PoiSharedChildren'

const PanelContainer = styled.article`
  height: 100%;
  display: flex;
  flex-direction: column;
  width: ${dimensions.poiDesktopPanelWidth}px;

  /* additional min-width is needed because the article would shrink to a smaller width if the content can be smaller */
  min-width: ${dimensions.poiDesktopPanelWidth}px;
`

const ListViewWrapper = styled.div<{ panelHeights: number; bottomBarHeight: number }>`
  padding: 16px;
  overflow: auto;
  ${({ panelHeights, bottomBarHeight }) => `height: calc(100vh - ${panelHeights}px - ${bottomBarHeight}px);`};
`

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  box-shadow: 1px 0 4px 0 rgb(0 0 0 / 20%);
`

const ListHeader = styled.div`
  padding-top: clamp(16px, 1.4vh, 32px);
  padding-bottom: clamp(10px, 1vh, 20px);
  text-align: center;
  font-size: ${props => props.theme.fonts.subTitleFontSize};
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  line-height: ${props => props.theme.fonts.decorativeLineHeight};
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.colors.borderColor};
  margin-bottom: clamp(10px, 1vh, 20px);
`

const FooterContainer = styled.div`
  position: absolute;
  bottom: 0;
`

type PoisDesktopProps = {
  panelHeights: number
  toolbar: ReactElement
  cityModel: CityModel
  pois: PoiModel[]
  userLocation: LocationType | undefined
  features: MapFeature[]
  languageCode: string
  slug: string | undefined
  mapViewport?: MapViewViewport
  setMapViewport: (mapViewport: MapViewViewport) => void
  MapOverlay: ReactElement
  PanelContent?: ReactElement
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
  pois,
  userLocation,
  features,
  cityModel,
  languageCode,
  slug,
  mapViewport,
  setMapViewport,
  MapOverlay,
  PanelContent: PanelContentProp,
}: PoisDesktopProps): ReactElement => {
  const { t } = useTranslation('pois')
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const listRef = useRef<HTMLDivElement>(null)
  const { selectGeoJsonPoiInList, selectFeatureOnMap, currentFeatureOnMap, currentPoi, poiListFeatures } =
    useMapFeatures(features, pois, slug)
  const canGoBack = !!currentFeatureOnMap || !!slug
  const { contentDirection } = useTheme()

  const selectGeoJsonPoi = useCallback(
    (geoJsonPoi: GeoJsonPoi | null) => {
      if (listRef.current && !currentPoi) {
        setScrollOffset(listRef.current.scrollTop)
      }
      selectGeoJsonPoiInList(geoJsonPoi)
    },
    [currentPoi, selectGeoJsonPoiInList],
  )

  const switchPoi = (step: 1 | -1) => {
    if (!currentPoi) {
      return
    }
    const currentPoiIndex = poiListFeatures.findIndex(poi => poi.slug === currentPoi.slug)
    const updatedIndex = nextPoiIndex(step, poiListFeatures.length, currentPoiIndex)
    const poiFeature = poiListFeatures[updatedIndex]
    selectGeoJsonPoiInList(poiFeature ?? null)
  }

  useEffect(() => {
    listRef.current?.scrollTo({ top: currentFeatureOnMap ? 0 : scrollOffset })
  }, [currentFeatureOnMap, currentPoi, scrollOffset])

  const PanelContent = (
    <>
      <ListViewWrapper
        ref={listRef}
        panelHeights={panelHeights}
        bottomBarHeight={currentPoi ? dimensions.poiDetailNavigation : dimensions.toolbarHeight}>
        {canGoBack ? (
          <GoBack goBack={() => selectGeoJsonPoiInList(null)} text={t('detailsHeader')} />
        ) : (
          <ListHeader>{t('listTitle')}</ListHeader>
        )}

        <PoiSharedChildren
          poiListFeatures={poiListFeatures}
          currentPoi={currentPoi}
          selectPoi={selectGeoJsonPoi}
          userLocation={userLocation}
          toolbar={toolbar}
          slug={slug}
        />
      </ListViewWrapper>
      {currentPoi && features.length > 0 ? (
        <PoiPanelNavigation switchPoi={switchPoi} />
      ) : (
        <ToolbarContainer>{toolbar}</ToolbarContainer>
      )}
    </>
  )

  return (
    <>
      <PanelContainer>{PanelContentProp ?? PanelContent}</PanelContainer>
      <MapView
        viewport={mapViewport}
        setViewport={setMapViewport}
        selectFeature={selectFeatureOnMap}
        featureCollection={embedInCollection(features)}
        currentFeature={currentFeatureOnMap}
        Overlay={MapOverlay}>
        <NavigationControl showCompass={false} position={contentDirection === 'rtl' ? 'bottom-left' : 'bottom-right'} />
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
          position={contentDirection === 'rtl' ? 'bottom-left' : 'bottom-right'}
        />
        <FooterContainer>
          <CityContentFooter city={cityModel.code} language={languageCode} mode='overlay' />
        </FooterContainer>
      </MapView>
    </>
  )
}

export default PoisDesktop

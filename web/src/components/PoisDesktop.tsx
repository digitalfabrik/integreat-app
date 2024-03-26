import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GeolocateControl, NavigationControl } from 'react-map-gl'
import styled, { useTheme } from 'styled-components'

import { LocationType, MapViewViewport, MapFeature, PreparePoisReturn } from 'shared'
import { CityModel, PoiModel } from 'shared/api'

import dimensions from '../constants/dimensions'
import CityContentFooter from './CityContentFooter'
import GoBack from './GoBack'
import MapView from './MapView'
import PoiPanelNavigation from './PoiPanelNavigation'
import PoiSharedChildren from './PoiSharedChildren'

const PanelContainer = styled.article`
  overflow: auto;
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
  data: PreparePoisReturn
  selectMapFeature: (mapFeature: MapFeature | null) => void
  selectPoi: (poi: PoiModel) => void
  deselect: () => void
  userLocation: LocationType | null
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
  data,
  userLocation,
  selectMapFeature,
  selectPoi,
  deselect,
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
  const { pois, poi, mapFeatures, mapFeature } = data
  const canDeselect = !!mapFeature || !!slug
  const { contentDirection } = useTheme()

  const handleSelectPoi = (poi: PoiModel) => {
    if (listRef.current) {
      setScrollOffset(listRef.current.scrollTop)
    }
    selectPoi(poi)
  }

  const switchPoi = (step: 1 | -1) => {
    const currentPoiIndex = pois.findIndex(it => it.slug === poi?.slug)
    const updatedIndex = nextPoiIndex(step, pois.length, currentPoiIndex)
    const newPoi = pois[updatedIndex]
    if (newPoi) {
      selectPoi(newPoi)
    }
  }

  useEffect(() => {
    listRef.current?.scrollTo({ top: mapFeature ? 0 : scrollOffset })
  }, [mapFeature, scrollOffset])

  const PanelContent = (
    <>
      <ListViewWrapper
        ref={listRef}
        panelHeights={panelHeights}
        bottomBarHeight={poi ? dimensions.poiDetailNavigation : dimensions.toolbarHeight}>
        {canDeselect ? (
          <GoBack goBack={deselect} text={t('detailsHeader')} />
        ) : (
          <ListHeader>{t('listTitle')}</ListHeader>
        )}

        <PoiSharedChildren
          pois={pois}
          poi={poi}
          selectPoi={handleSelectPoi}
          userLocation={userLocation}
          toolbar={toolbar}
          slug={slug}
        />
      </ListViewWrapper>
      {poi && pois.length > 0 ? (
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
        selectFeature={selectMapFeature}
        features={mapFeatures}
        currentFeature={mapFeature ?? null}
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

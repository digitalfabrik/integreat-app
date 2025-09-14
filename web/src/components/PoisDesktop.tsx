import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GeolocateControl, NavigationControl } from 'react-map-gl'

import { LocationType, MapViewViewport, MapFeature, PreparePoisReturn } from 'shared'
import { CityModel, PoiModel } from 'shared/api'

import dimensions from '../constants/dimensions'
import CityContentFooter from './CityContentFooter'
import GoBack from './GoBack'
import MapView from './MapView'
import PoiPanelNavigation from './PoiPanelNavigation'
import PoiSharedChildren from './PoiSharedChildren'

const PanelContainer = styled('article')`
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: ${dimensions.poiDesktopPanelWidth}px;

  /* additional min-width is needed because the article would shrink to a smaller width if the content can be smaller */
  min-width: ${dimensions.poiDesktopPanelWidth}px;
`

const ListViewWrapper = styled('div')`
  padding: 16px;
  overflow: auto;
`

const ToolbarContainer = styled('div')`
  display: flex;
  justify-content: center;
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
  box-shadow: 1px 0 4px 0 rgb(0 0 0 / 20%);
`

const StyledTypography = styled(Typography)<TypographyProps>`
  padding-top: clamp(16px, 1.4vh, 32px);
  padding-bottom: clamp(10px, 1vh, 20px);
  margin-bottom: clamp(10px, 1vh, 20px);
`

const FooterContainer = styled('div')`
  position: absolute;
  bottom: 0;
`

type PoisDesktopProps = {
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
      <ListViewWrapper ref={listRef}>
        {canDeselect ? (
          <GoBack goBack={deselect} text={t('detailsHeader')} />
        ) : (
          <StyledTypography component='h1' variant='h3'>
            {t('listTitle')}
          </StyledTypography>
        )}

        <PoiSharedChildren pois={pois} poi={poi} selectPoi={handleSelectPoi} userLocation={userLocation} slug={slug} />
      </ListViewWrapper>
      {poi && pois.length > 0 ? (
        <>
          <ToolbarContainer>{toolbar}</ToolbarContainer>
          <PoiPanelNavigation switchPoi={switchPoi} />
        </>
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

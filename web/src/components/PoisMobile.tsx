import styled from '@emotion/styled'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { GeolocateControl } from 'maplibre-gl'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LocationType, MapViewViewport, MapFeature, PreparePoisReturn } from 'shared'
import { PoiModel } from 'shared/api'

import useWindowDimensions from '../hooks/useWindowDimensions'
import { getSnapPoints } from '../utils/getSnapPoints'
import BottomActionSheet, { ScrollableBottomSheetRef } from './BottomActionSheet'
import GoBack from './GoBack'
import MapView, { MapViewRef } from './MapView'
import PoiSharedChildren from './PoiSharedChildren'
import Button from './base/Button'
import Icon from './base/Icon'

const ListContainer = styled.div`
  padding: 0 30px;
`

const ListTitle = styled.div`
  margin: 12px 0;
  font-weight: 700;
`

const GoBackContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 10vh;
  overflow: hidden;
  transition: all 1s;
  padding: 0 30px;
`

const BackNavigation = styled(Button)`
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

const GeocontrolContainer = styled.div<{ maxOffset: number }>`
  position: absolute;
  inset-inline-end: 10px;
  bottom: calc(min(var(--rsbs-overlay-h, 0), ${props => props.maxOffset}px) + 8px);
`

type PoisMobileProps = {
  toolbar: ReactElement
  data: PreparePoisReturn
  userLocation: LocationType | null
  slug: string | undefined
  mapViewport?: MapViewViewport
  setMapViewport: (mapViewport: MapViewViewport) => void
  selectMapFeature: (mapFeature: MapFeature | null) => void
  selectPoi: (poi: PoiModel) => void
  deselect: () => void
  MapOverlay: ReactElement
}

const PoisMobile = ({
  toolbar,
  data,
  userLocation,
  slug,
  mapViewport,
  setMapViewport,
  selectMapFeature,
  selectPoi,
  deselect,
  MapOverlay,
}: PoisMobileProps): ReactElement => {
  const [bottomActionSheetHeight, setBottomActionSheetHeight] = useState(0)
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const sheetRef = useRef<ScrollableBottomSheetRef>(null)
  const geocontrolPosition = useRef<HTMLDivElement>(null)
  const [mapViewRef, setMapViewRef] = useState<MapViewRef | null>(null)
  const { pois, poi, mapFeatures, mapFeature } = data
  const { height } = useWindowDimensions()
  const canDeselect = !!mapFeature || !!slug
  const { t } = useTranslation('pois')

  const isBottomActionSheetFullScreen = bottomActionSheetHeight >= height
  const changeSnapPoint = (snapPoint: number) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    sheetRef.current?.sheet?.snapTo(({ maxHeight }) => getSnapPoints(maxHeight)[snapPoint]!)
  }

  const handleSelectPoi = (poi: PoiModel) => {
    if (sheetRef.current?.scrollElement) {
      setScrollOffset(sheetRef.current.scrollElement.scrollTop)
    }
    selectPoi(poi)
  }

  const handleSelectMapFeature = (feature: MapFeature | null) => {
    if (feature && sheetRef.current?.scrollElement) {
      changeSnapPoint(1)
      setScrollOffset(sheetRef.current.scrollElement.scrollTop)
    }
    selectMapFeature(feature)
  }

  useEffect(() => {
    sheetRef.current?.scrollElement?.scrollTo({ top: mapFeature ? 0 : scrollOffset })
  }, [mapFeature, scrollOffset])

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
        selectFeature={handleSelectMapFeature}
        changeSnapPoint={changeSnapPoint}
        features={mapFeatures}
        currentFeature={mapFeature ?? null}
        Overlay={
          <>
            {canDeselect && (
              <BackNavigation onClick={deselect} tabIndex={0} label={t('detailsHeader')}>
                <StyledIcon src={ArrowBackIcon} directionDependent />
              </BackNavigation>
            )}
            {MapOverlay}
          </>
        }
      />
      <BottomActionSheet
        toolbar={toolbar}
        ref={sheetRef}
        setBottomActionSheetHeight={setBottomActionSheetHeight}
        sibling={<GeocontrolContainer id='geolocate' ref={geocontrolPosition} maxOffset={getSnapPoints(height)[1]} />}>
        {canDeselect && isBottomActionSheetFullScreen && (
          <GoBackContainer>
            <GoBack goBack={deselect} viewportSmall text={t('detailsHeader')} />
          </GoBackContainer>
        )}
        <ListContainer>
          {!canDeselect && <ListTitle>{t('listTitle')}</ListTitle>}
          <PoiSharedChildren
            pois={pois}
            poi={poi}
            selectPoi={handleSelectPoi}
            userLocation={userLocation}
            slug={slug}
          />
        </ListContainer>
      </BottomActionSheet>
    </>
  )
}

export default PoisMobile

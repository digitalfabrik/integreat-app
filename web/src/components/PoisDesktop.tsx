import Stack from '@mui/material/Stack'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { GeolocateControl, NavigationControl } from 'react-map-gl/maplibre'

import { LocationType, MapViewViewport, MapFeature, PreparePoisReturn } from 'shared'
import { PoiModel } from 'shared/api'

import MapAttribution from './MapAttribution'
import MapView from './MapView'
import PoiPanelHeader from './PoiPanelHeader'
import PoiPanelNavigation from './PoiPanelNavigation'
import PoiSharedChildren from './PoiSharedChildren'
import SkeletonHeader from './SkeletonHeader'
import SkeletonList from './SkeletonList'

const PanelContainer = styled('article')`
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 400px;

  /* additional min-width is needed because the article would shrink to a smaller width if the content can be smaller */
  min-width: 400px;
`

const ListViewWrapper = styled('div')`
  padding: 16px;
  overflow: auto;
`

const StyledMapAttribution = styled(MapAttribution)({
  position: 'absolute',
  bottom: 0,
  left: 0,
})

const SkeletonPanelContent = () => (
  <Stack paddingX={2}>
    <SkeletonHeader width='60%' />
    <SkeletonList />
  </Stack>
)

type PanelContentProps = {
  listRef: React.RefObject<HTMLDivElement | null>
  canDeselect: boolean
  deselect: () => void
  pois: PoiModel[]
  poi: PoiModel | undefined
  scrollToTop: () => void
  userLocation: LocationType | null
  slug: string | undefined
  switchPoi: (step: 1 | -1) => void
}

const PanelContent = ({
  listRef,
  canDeselect,
  deselect,
  pois,
  poi,
  scrollToTop,
  userLocation,
  slug,
  switchPoi,
}: PanelContentProps): ReactElement => (
  <Stack justifyContent='space-between' height='100%'>
    <ListViewWrapper ref={listRef}>
      <PoiPanelHeader goBack={canDeselect ? deselect : null} />
      <PoiSharedChildren pois={pois} poi={poi} scrollToTop={scrollToTop} userLocation={userLocation} slug={slug} />
    </ListViewWrapper>
    {poi && pois.length > 0 && <PoiPanelNavigation switchPoi={switchPoi} />}
  </Stack>
)

type PoisDesktopProps = {
  data: PreparePoisReturn
  selectMapFeature: (mapFeature: MapFeature | null) => void
  selectPoi: (poi: PoiModel) => void
  deselect: () => void
  userLocation: LocationType | null
  slug: string | undefined
  mapViewport?: MapViewViewport
  setMapViewport: (mapViewport: MapViewViewport) => void
  MapOverlay: ReactElement
  loading: boolean
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
  data,
  userLocation,
  selectMapFeature,
  selectPoi,
  deselect,
  slug,
  mapViewport,
  setMapViewport,
  MapOverlay,
  loading,
}: PoisDesktopProps): ReactElement => {
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const listRef = useRef<HTMLDivElement>(null)
  const { pois, poi, mapFeatures, mapFeature } = data
  const canDeselect = !!mapFeature || !!slug
  const { contentDirection } = useTheme()

  const scrollToTop = () => {
    if (listRef.current) {
      setScrollOffset(listRef.current.scrollTop)
    }
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

  return (
    <>
      <PanelContainer>
        {loading ? (
          <SkeletonPanelContent />
        ) : (
          <PanelContent
            listRef={listRef}
            canDeselect={canDeselect}
            deselect={deselect}
            pois={pois}
            poi={poi}
            scrollToTop={scrollToTop}
            userLocation={userLocation}
            slug={slug}
            switchPoi={switchPoi}
          />
        )}
      </PanelContainer>
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
        <StyledMapAttribution />
      </MapView>
    </>
  )
}

export default PoisDesktop

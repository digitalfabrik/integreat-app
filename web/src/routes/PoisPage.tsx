import WebMercatorViewport from '@math.gl/web-mercator'
import { BBox } from 'geojson'
import { Map } from 'maplibre-gl'
import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LngLatLike, MapRef } from 'react-map-gl'
import { useNavigate, useParams } from 'react-router-dom'
import { BottomSheetRef } from 'react-spring-bottom-sheet'
import styled from 'styled-components'

import {
  defaultMercatorViewportConfig,
  normalDetailZoom,
  embedInCollection,
  MapViewMercatorViewport,
  normalizePath,
  NotFoundError,
  pathnameFromRouteInformation,
  PoiFeature,
  POIS_ROUTE,
  closerDetailZoom,
} from 'api-client'
import { config } from 'translations'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import FeedbackModal from '../components/FeedbackModal'
import Helmet from '../components/Helmet'
import List from '../components/List'
import LoadingSpinner from '../components/LoadingSpinner'
import MapView from '../components/MapView'
import PoiListItem from '../components/PoiListItem'
import PoisDesktop from '../components/PoisDesktop'
import PoisMobile from '../components/PoisMobile'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useFeatureLocations from '../hooks/useFeatureLocations'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { getSnapPoints, midSnapPercentage } from '../utils/getSnapPoints'
import { log } from '../utils/sentry'

const PoisPageWrapper = styled.div<{ panelHeights: number }>`
  display: flex;
  ${({ panelHeights }) => `height: calc(100vh - ${panelHeights}px);`};
`

const moveViewToBBox = (bBox: BBox, defaultVp: MapViewMercatorViewport): MapViewMercatorViewport => {
  const mercatorVp = new WebMercatorViewport(defaultVp)
  return mercatorVp.fitBounds([
    [bBox[0], bBox[1]],
    [bBox[2], bBox[3]],
  ])
}

const PoisPage = ({ cityCode, languageCode, cityModel, pathname, languages }: CityRouteProps): ReactElement => {
  const { slug: unsafeSlug } = useParams()
  const slug = unsafeSlug ? normalizePath(unsafeSlug) : undefined
  const navigate = useNavigate()
  const { data, error: featureLocationsError, loading } = useFeatureLocations(cityCode, languageCode)
  const [mapRef, setMapRef] = useState<Map | null>(null)
  const [snapPoint, setSnapPoint] = useState<number>(1)
  const [restoreScrollPosition, setRestoreScrollPosition] = useState<boolean>(false)
  const [currentFeature, setCurrentFeature] = useState<PoiFeature | null>(
    data?.features.find(it => it.properties.slug === slug) ?? null
  )
  const [bottomActionSheetHeight, setBottomActionSheetHeight] = useState<number>(0)
  const poi = data?.pois.find(it => it.slug === slug)
  const { viewportSmall, height } = useWindowDimensions()
  const sheetRef = useRef<BottomSheetRef>(null)
  const [openFeedbackModal, setOpenFeedbackModal] = useState<boolean>(false)
  const { t } = useTranslation('pois')

  const selectFeature = (feature: PoiFeature | null, restoreScrollPosition: boolean) => {
    if (mapRef?.isMoving()) {
      mapRef.stop()
    }
    navigate(feature?.properties.slug ?? '.')
    setRestoreScrollPosition(restoreScrollPosition)
  }

  const updateMapRef = useCallback((node: MapRef | null) => {
    // This allows us to use the map (ref) as dependency in hooks which is not possible using useRef.
    // This is needed because on initial render the ref is null such that flyTo is not possible.
    // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
    if (node) {
      setMapRef(node.getMap() as unknown as Map)
    }
  }, [])

  useEffect(() => {
    const currentFeature = data?.features.find((feature: PoiFeature) => feature.properties.slug === slug) ?? null
    setCurrentFeature(currentFeature)
    const coordinates = currentFeature?.geometry.coordinates ?? []
    if (mapRef && coordinates[0] && coordinates[1] && snapPoint === 1) {
      const coords: LngLatLike = [coordinates[0], coordinates[1]]
      // TODO IGAPP-1154 - remove setTimeout
      setTimeout(
        () =>
          mapRef.flyTo({
            center: coords,
            zoom: currentFeature?.properties.closeToOtherPoi ? closerDetailZoom : normalDetailZoom,
            padding: { bottom: viewportSmall ? height * midSnapPercentage : 0 },
          }),
        0
      )
    }
  }, [mapRef, data, slug, height, snapPoint, viewportSmall])

  if (buildConfig().featureFlags.developerFriendly) {
    log('To use geolocation in a development build you have to start the dev server with\n "yarn start --https"')
  }

  const languageChangePaths = languages.map(({ code, name }) => ({
    path: pathnameFromRouteInformation({
      route: POIS_ROUTE,
      cityCode,
      languageCode: code,
      slug: poi?.slug,
    }),
    name,
    code,
  }))

  const nextFeatureIndex = (step: 1 | -1, arrayLength: number, currentIndex: number): number => {
    if (currentIndex === arrayLength - 1 && step > 0) {
      return 0
    }
    if (currentIndex === 0 && step < 0) {
      return arrayLength - 1
    }
    return currentIndex + step
  }

  const changeSnapPoint = (snapPoint: number) => {
    if (viewportSmall) {
      sheetRef.current?.snapTo(({ maxHeight }) => getSnapPoints(maxHeight)[snapPoint]!)
      setSnapPoint(snapPoint)
    }
  }

  const toolbar = <CityContentToolbar openFeedbackModal={setOpenFeedbackModal} iconDirection='row' hasDivider={false} />

  const feedbackModal = openFeedbackModal && (
    <FeedbackModal
      cityCode={cityModel.code}
      language={languageCode}
      routeType={POIS_ROUTE}
      visible={openFeedbackModal}
      closeModal={() => setOpenFeedbackModal(false)}
    />
  )

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: poi ? { slug: poi.slug } : null,
    languageChangePaths,
    route: POIS_ROUTE,
    languageCode,
    disableScrollingSafari: true,
    showFooter: false,
  }

  if (loading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </CityContentLayout>
    )
  }

  if (!data) {
    const error =
      featureLocationsError ||
      new NotFoundError({
        type: 'poi',
        id: pathname,
        city: cityCode,
        language: languageCode,
      })

    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  const switchFeature = (step: 1 | -1) => {
    const featureIndex = data.features.findIndex(
      (poi: PoiFeature) => poi.properties.slug === currentFeature?.properties.slug
    )
    const updatedIndex = nextFeatureIndex(step, data.features.length, featureIndex)
    const feature = data.features[updatedIndex]
    selectFeature(feature ?? null, false)
  }

  const renderPoiListItem = (poi: PoiFeature) => (
    <PoiListItem key={poi.properties.path} poi={poi} selectFeature={selectFeature} />
  )
  const pageTitle = `${t('pageTitle')} - ${cityModel.name}`
  const direction = config.getScriptDirection(languageCode)

  const mapView = cityModel.boundingBox && (
    <MapView
      geolocationControlPosition={bottomActionSheetHeight}
      ref={updateMapRef}
      selectFeature={selectFeature}
      changeSnapPoint={changeSnapPoint}
      featureCollection={embedInCollection(data.features)}
      bboxViewport={moveViewToBBox(cityModel.boundingBox, defaultMercatorViewportConfig)}
      currentFeature={currentFeature}
      direction={direction}
      cityCode={cityCode}
      languageCode={languageCode}
    />
  )
  const poiList = <List noItemsMessage={t('noPois')} items={data.features} renderItem={renderPoiListItem} borderless />
  // To calculate the height of the PoisPage container, we have to reduce 100vh by header, footer, navMenu
  const panelHeights = dimensions.headerHeightLarge + dimensions.navigationMenuHeight

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams} fullWidth>
      <Helmet
        pageTitle={pageTitle}
        metaDescription={poi?.metaDescription}
        languageChangePaths={languageChangePaths}
        cityModel={cityModel}
      />
      <PoisPageWrapper panelHeights={panelHeights}>
        {viewportSmall ? (
          <PoisMobile
            restoreScrollPosition={restoreScrollPosition}
            currentFeature={currentFeature}
            toolbar={toolbar}
            ref={sheetRef}
            poi={poi}
            mapView={mapView}
            poiList={poiList}
            direction={direction}
            isBottomSheetFullscreen={bottomActionSheetHeight >= height}
            setBottomActionSheetHeight={setBottomActionSheetHeight}
          />
        ) : (
          <PoisDesktop
            restoreScrollPosition={restoreScrollPosition}
            switchFeature={switchFeature}
            poi={poi}
            currentFeature={currentFeature}
            toolbar={toolbar}
            panelHeights={panelHeights}
            mapView={mapView}
            poiList={poiList}
            showFeatureSwitch={data.features.length > 1}
            direction={direction}
          />
        )}
        {feedbackModal}
      </PoisPageWrapper>
    </CityContentLayout>
  )
}

export default PoisPage

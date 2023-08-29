import WebMercatorViewport from '@math.gl/web-mercator'
import { BBox } from 'geojson'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import {
  defaultMercatorViewportConfig,
  LocationType,
  MapViewMercatorViewport,
  MapViewViewport,
  normalizePath,
  NotFoundError,
  pathnameFromRouteInformation,
  POIS_ROUTE,
  PoiCategoryModel,
  prepareFeatureLocations,
  useLoadFromEndpoint,
  createPOIsEndpoint,
} from 'api-client'
import { config } from 'translations'

import { CityRouteProps } from '../CityContentSwitcher'
import { ClockIcon, EditLocationIcon } from '../assets'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import PoiFilters from '../components/PoiFilters'
import PoisDesktop from '../components/PoisDesktop'
import PoisMobile from '../components/PoisMobile'
import ChipButton from '../components/base/ChipButton'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import { cmsApiBaseUrl } from '../constants/urls'
import useWindowDimensions from '../hooks/useWindowDimensions'
import getUserLocation from '../utils/getUserLocation'
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

const PoisPage = ({ cityCode, languageCode, city, pathname }: CityRouteProps): ReactElement | null => {
  const [poiCategoryFilter, setPoiCategoryFilter] = useState<PoiCategoryModel | null>(null)
  const [poiCurrentlyOpenFilter, setPoiCurrentlyOpenFilter] = useState(false)
  const [showFilterSelection, setShowFilterSelection] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation('pois')
  const { slug: unsafeSlug } = useParams()
  const slug = unsafeSlug ? normalizePath(unsafeSlug) : undefined
  const [userLocation, setUserLocation] = useState<LocationType | undefined>(undefined)
  const {
    data,
    loading,
    error: poisError,
  } = useLoadFromEndpoint(createPOIsEndpoint, cmsApiBaseUrl, { city: cityCode, language: languageCode })
  // keep the old mapViewport when changing the viewport
  const [mapViewport, setMapViewport] = useState<MapViewViewport>()
  const { viewportSmall } = useWindowDimensions()
  const direction = config.getScriptDirection(languageCode)

  const pois = useMemo(
    () =>
      data
        ?.filter(poi => !poiCategoryFilter || poi.category.isEqual(poiCategoryFilter))
        .filter(poi => !poiCurrentlyOpenFilter || poi.isCurrentlyOpen),
    [data, poiCategoryFilter, poiCurrentlyOpenFilter],
  )
  const currentPoi = data?.find(poi => slug === poi.slug) ?? null
  const features = useMemo(() => prepareFeatureLocations(pois ?? [], userLocation), [pois, userLocation])

  const updatePoiCategoryFilter = (poiCategoryFilter: PoiCategoryModel | null) => {
    if (currentPoi && poiCategoryFilter && currentPoi.category !== poiCategoryFilter) {
      navigate('.')
    }
    setPoiCategoryFilter(poiCategoryFilter)
  }

  const updatePoiCurrentlyOpenFilter = (poiCurrentlyOpenFilter: boolean) => {
    if (currentPoi && poiCurrentlyOpenFilter && !currentPoi.isCurrentlyOpen) {
      navigate('.')
    }
    setPoiCurrentlyOpenFilter(poiCurrentlyOpenFilter)
  }

  useEffect(() => {
    getUserLocation().then(userLocation =>
      userLocation.status === 'ready' ? setUserLocation(userLocation.coordinates) : null,
    )
  }, [])

  useEffect(
    () =>
      city?.boundingBox ? setMapViewport(moveViewToBBox(city.boundingBox, defaultMercatorViewportConfig)) : undefined,
    [city?.boundingBox],
  )

  if (!city) {
    return null
  }

  if (buildConfig().featureFlags.developerFriendly) {
    log('To use geolocation in a development build you have to start the dev server with\n "yarn start --https"')
  }

  const languageChangePaths = city.languages.map(({ code, name }) => {
    const isCurrentLanguage = code === languageCode
    const path = currentPoi
      ? currentPoi.availableLanguages.get(code) || null
      : pathnameFromRouteInformation({ route: POIS_ROUTE, cityCode, languageCode: code })
    return {
      path: isCurrentLanguage ? pathname : path,
      name,
      code,
    }
  })

  const pageTitle = `${t('pageTitle')} - ${city.name}`

  const toolbar = (
    <CityContentToolbar
      feedbackTarget={currentPoi?.slug}
      route={POIS_ROUTE}
      iconDirection='row'
      hideDivider
      languageCode={languageCode}
      pageTitle={pageTitle}
      isInBottomActionSheet={viewportSmall}
    />
  )

  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
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

  if (!pois) {
    const error =
      poisError ||
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

  const FiltersModal = (
    <PoiFilters
      closeModal={() => setShowFilterSelection(false)}
      pois={data ?? []}
      selectedPoiCategory={poiCategoryFilter}
      setSelectedPoiCategory={updatePoiCategoryFilter}
      currentlyOpenFilter={poiCurrentlyOpenFilter}
      setCurrentlyOpenFilter={updatePoiCurrentlyOpenFilter}
    />
  )

  if (showFilterSelection && viewportSmall) {
    return FiltersModal
  }

  // To calculate the height of the PoisPage container, we have to reduce 100vh by header, footer, navMenu
  const panelHeights = dimensions.headerHeightLarge + dimensions.navigationMenuHeight

  const FiltersOverlayButtons = (
    <>
      <ChipButton text={t('adjustFilters')} icon={EditLocationIcon} onClick={() => setShowFilterSelection(it => !it)} />
      {poiCurrentlyOpenFilter && (
        <ChipButton
          text={t('opened')}
          ariaLabel={t('clearFilter', { filter: t('opened') })}
          icon={ClockIcon}
          onClick={() => setPoiCurrentlyOpenFilter(false)}
          closeButton
        />
      )}
      {!!poiCategoryFilter && (
        <ChipButton
          text={poiCategoryFilter.name}
          ariaLabel={t('clearFilter', { filter: poiCategoryFilter.name })}
          icon={poiCategoryFilter.icon}
          onClick={() => setPoiCategoryFilter(null)}
          closeButton
        />
      )}
    </>
  )

  const sharedPoiProps = {
    toolbar,
    features,
    pois,
    direction,
    userLocation,
    languageCode,
    slug,
    mapViewport,
    setMapViewport,
    MapOverlay: FiltersOverlayButtons,
  }

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams} fullWidth>
      <Helmet
        pageTitle={pageTitle}
        metaDescription={currentPoi?.metaDescription}
        languageChangePaths={languageChangePaths}
        cityModel={city}
      />
      <PoisPageWrapper panelHeights={panelHeights}>
        {viewportSmall ? (
          <PoisMobile {...sharedPoiProps} />
        ) : (
          <PoisDesktop
            {...sharedPoiProps}
            panelHeights={panelHeights}
            cityModel={city}
            PanelContent={showFilterSelection ? FiltersModal : undefined}
          />
        )}
      </PoisPageWrapper>
    </CityContentLayout>
  )
}

export default PoisPage

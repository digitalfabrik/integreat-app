import WebMercatorViewport from '@math.gl/web-mercator'
import { BBox } from 'geojson'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'

import {
  defaultMercatorViewportConfig,
  isMultipoi,
  MapFeature,
  MapViewMercatorViewport,
  MapViewViewport,
  MULTIPOI_QUERY_KEY,
  normalizePath,
  pathnameFromRouteInformation,
  POIS_ROUTE,
  preparePois,
} from 'shared'
import { PoiCategoryModel, useLoadFromEndpoint, createPOIsEndpoint, useLoadAsync, PoiModel } from 'shared/api'

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
import dimensions from '../constants/dimensions'
import { cmsApiBaseUrl } from '../constants/urls'
import useWindowDimensions from '../hooks/useWindowDimensions'
import getUserLocation from '../utils/getUserLocation'

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
  const params = useParams()
  const [searchParams] = useSearchParams()
  const slug = params.slug ? normalizePath(params.slug) : undefined
  // keep the old mapViewport when changing the viewport
  const [mapViewport, setMapViewport] = useState<MapViewViewport>()
  const { viewportSmall, width } = useWindowDimensions()
  const multipoi = searchParams.get(MULTIPOI_QUERY_KEY)

  const { data, loading, error } = useLoadFromEndpoint(createPOIsEndpoint, cmsApiBaseUrl, {
    city: cityCode,
    language: languageCode,
  })

  const preparedData = preparePois({
    pois: data ?? [],
    params: { slug, multipoi, poiCategoryId: poiCategoryFilter?.id, currentlyOpen: poiCurrentlyOpenFilter },
  })
  const { pois, poi } = preparedData

  const { data: userLocation } = useLoadAsync(
    useCallback(async () => {
      const userLocation = await getUserLocation()
      return userLocation.status === 'ready' ? userLocation.coordinates : null
    }, []),
  )

  useEffect(
    () =>
      city?.boundingBox ? setMapViewport(moveViewToBBox(city.boundingBox, defaultMercatorViewportConfig)) : undefined,
    [city?.boundingBox],
  )

  if (!city) {
    return null
  }

  const deselectAll = () => navigate('.')

  const updatePoiCategoryFilter = (poiCategoryFilter: PoiCategoryModel | null) => {
    if (poi && poiCategoryFilter && !poi.category.isEqual(poiCategoryFilter)) {
      deselectAll()
    }
    setPoiCategoryFilter(poiCategoryFilter)
  }

  const updatePoiCurrentlyOpenFilter = (poiCurrentlyOpenFilter: boolean) => {
    if (poi && poiCurrentlyOpenFilter && !poi.isCurrentlyOpen) {
      deselectAll()
    }
    setPoiCurrentlyOpenFilter(poiCurrentlyOpenFilter)
  }

  const selectMapFeature = (mapFeature: MapFeature | null) => {
    if (!mapFeature) {
      deselectAll()
    } else if (isMultipoi(mapFeature)) {
      navigate(`.?${MULTIPOI_QUERY_KEY}=${mapFeature.id}`)
    } else {
      const slug = mapFeature.properties.pois[0]?.slug
      navigate(slug ?? '.')
    }
  }

  const selectPoi = (poi: PoiModel) => {
    navigate(`${poi.slug}?${searchParams}`)
  }

  const deselect = () => {
    if (preparedData.mapFeature && slug) {
      navigate(`.?${searchParams}`)
    } else {
      deselectAll()
    }
  }

  const languageChangePaths = city.languages.map(({ code, name }) => {
    const isCurrentLanguage = code === languageCode
    const path = poi
      ? poi.availableLanguages.get(code) || null
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
      feedbackTarget={poi?.slug}
      route={POIS_ROUTE}
      iconDirection='row'
      hideDivider
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

  if (error) {
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
      panelWidth={viewportSmall ? width : dimensions.poiDesktopPanelWidth}
      poisCount={pois.length}
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
    data: preparedData,
    selectMapFeature,
    selectPoi,
    deselect,
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
        metaDescription={poi?.metaDescription}
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

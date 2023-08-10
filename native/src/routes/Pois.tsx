import { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet'
import React, { ReactElement, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import {
  CityModel,
  embedInCollection,
  ErrorCode,
  PoiModel,
  PoisRouteType,
  prepareFeatureLocations,
  MapPoi,
  MapFeature,
  isMultipoi,
  sortMapPois,
  NotFoundError,
  fromError,
} from 'api-client'

import BottomActionsSheet from '../components/BottomActionsSheet'
import Failure from '../components/Failure'
import MapView from '../components/MapView'
import PoiDetails from '../components/PoiDetails'
import PoiListItem from '../components/PoiListItem'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import dimensions from '../constants/dimensions'
import useOnBackNavigation from '../hooks/useOnBackNavigation'
import useUserLocation from '../hooks/useUserLocation'
import { reportError } from '../utils/sentry'

const ListWrapper = styled.View`
  margin: 0 32px;
`

const NoItemsMessage = styled.Text`
  padding-top: 25px;
  text-align: center;
`

export const midSnapPointPercentage = 0.35
const percentage = 100
const BOTTOM_SHEET_SNAP_POINTS = [
  dimensions.bottomSheetHandler.height,
  `${midSnapPointPercentage * percentage}%`,
  '100%',
]

type PoisProps = {
  pois: Array<PoiModel>
  cityModel: CityModel
  language: string
  route: RouteProps<PoisRouteType>
  navigation: NavigationProps<PoisRouteType>
}

const RESTORE_TIMEOUT = 100

const Pois = ({ pois, language, cityModel, route, navigation }: PoisProps): ReactElement => {
  const { coordinates, requestAndDetermineLocation } = useUserLocation(true)
  const { slug, multipoi } = route.params
  const [sheetSnapPointIndex, setSheetSnapPointIndex] = useState<number>(1)
  const [followUserLocation, setFollowUserLocation] = useState<boolean>(false)
  const [listScrollPosition, setListScrollPosition] = useState<number>(0)
  const mapFeatures = useMemo(() => prepareFeatureLocations(pois, coordinates), [pois, coordinates])
  const { t } = useTranslation('pois')
  const scrollRef = useRef<BottomSheetScrollViewMethods>(null)

  const currentFeatureOnMap = useMemo(
    () =>
      multipoi
        ? mapFeatures.find(feature => feature.id === multipoi)
        : mapFeatures.find(feature => feature.properties.pois.some(poi => poi.slug === slug)),
    [mapFeatures, multipoi, slug]
  )
  const currentPoi = useMemo(() => (slug ? pois.find(poi => slug === poi.slug) : undefined), [pois, slug])

  const scrollTo = (position: number) => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          y: position,
          animated: false,
        })
      }
    }, RESTORE_TIMEOUT)
  }

  const deselectAll = () => {
    navigation.setParams({ slug: undefined, multipoi: undefined })
    scrollTo(listScrollPosition)
  }

  const deselectFeature = () => {
    if (multipoi && currentPoi) {
      navigation.setParams({ slug: undefined })
    } else {
      deselectAll()
    }
  }

  useOnBackNavigation(slug || multipoi ? deselectFeature : undefined)

  const selectFeatureOnMap = (feature: MapFeature | null) => {
    if (!feature) {
      deselectAll()
      return
    }
    setFollowUserLocation(false)
    if (isMultipoi(feature)) {
      navigation.setParams({ multipoi: feature.id as number })
      scrollTo(0)
    } else {
      const poiFeature = feature.properties.pois[0]
      navigation.setParams({ slug: poiFeature?.slug })
      scrollTo(0)
    }
  }

  const selectPoiInList = (newMapPoi: MapPoi | null) => {
    if (!newMapPoi) {
      return
    }
    setFollowUserLocation(false)
    navigation.setParams({ slug: newMapPoi.slug })
    scrollTo(0)
  }

  const renderPoiListItem = (mapPoi: MapPoi): ReactElement => (
    <PoiListItem key={mapPoi.path} mapPoi={mapPoi} language={language} navigateToPoi={() => selectPoiInList(mapPoi)} t={t} />
  )

  const setScrollPosition = useCallback(
    (position: number) => {
      if (!currentPoi) {
        setListScrollPosition(position)
      }
    },
    [currentPoi]
  )

  const singlePoiContent = currentPoi && (
    <PoiDetails language={language} poi={currentPoi} mapPoi={currentPoi.getMapPoi(coordinates)} />
  )
  const failurePoiContent = !currentPoi && slug && (
    <Failure
      code={fromError(
        new NotFoundError({
          type: 'poi',
          id: slug,
          city: cityModel.code,
          language,
        })
      )}
    />
  )

  const list = currentFeatureOnMap
    ? currentFeatureOnMap.properties.pois
    : mapFeatures.flatMap(feature => feature.properties.pois)

  const listPoiContent = (
    <ListWrapper>
      {list.length === 0 ? <NoItemsMessage>{t('noPois')}</NoItemsMessage> : sortMapPois(list).map(renderPoiListItem)}
    </ListWrapper>
  )

  if (!cityModel.boundingBox) {
    reportError(new Error(`Bounding box not set for city ${cityModel.code}!`))
    return <Failure code={ErrorCode.PageNotFound} />
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <MapView
        selectFeature={selectFeatureOnMap}
        boundingBox={cityModel.boundingBox}
        setSheetSnapPointIndex={setSheetSnapPointIndex}
        featureCollection={embedInCollection(mapFeatures)}
        selectedFeature={currentFeatureOnMap ?? null}
        locationPermissionGranted={!!coordinates}
        onRequestLocationPermission={requestAndDetermineLocation}
        fabPosition={
          sheetSnapPointIndex < BOTTOM_SHEET_SNAP_POINTS.length - 1 ? BOTTOM_SHEET_SNAP_POINTS[sheetSnapPointIndex]! : 0
        }
        followUserLocation={followUserLocation}
        setFollowUserLocation={setFollowUserLocation}
      />
      <BottomActionsSheet
        ref={scrollRef}
        setScrollPosition={setScrollPosition}
        title={!currentPoi && !multipoi ? t('listTitle') : undefined}
        onChange={setSheetSnapPointIndex}
        initialIndex={sheetSnapPointIndex}
        snapPoints={BOTTOM_SHEET_SNAP_POINTS}
        snapPointIndex={sheetSnapPointIndex}>
        {singlePoiContent ?? failurePoiContent ?? listPoiContent}
      </BottomActionsSheet>
    </ScrollView>
  )
}

export default Pois

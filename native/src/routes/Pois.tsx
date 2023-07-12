import { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet'
import MapLibreGL from '@maplibre/maplibre-react-native'
import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import {
  animationDuration,
  CityModel,
  normalDetailZoom,
  embedInCollection,
  ErrorCode,
  fromError,
  NotFoundError,
  PoiFeature,
  PoiModel,
  POIS_ROUTE,
  PoisRouteType,
  prepareFeatureLocations,
  closerDetailZoom,
} from 'api-client'

import BottomActionsSheet from '../components/BottomActionsSheet'
import Failure from '../components/Failure'
import MapView from '../components/MapView'
import PoiDetails from '../components/PoiDetails'
import PoiListItem from '../components/PoiListItem'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import dimensions from '../constants/dimensions'
import useOnBackNavigation from '../hooks/useOnBackNavigation'
import useUserLocation from '../hooks/useUserLocation'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import { reportError } from '../utils/sentry'

const ListWrapper = styled.View`
  margin: 0 32px;
`

const NoItemsMessage = styled.Text`
  padding-top: 25px;
  text-align: center;
`

const midSnapPointPercentage = 0.35
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
  const { slug } = route.params
  const [sheetSnapPointIndex, setSheetSnapPointIndex] = useState<number>(1)
  const [followUserLocation, setFollowUserLocation] = useState<boolean>(false)
  const [listScrollPosition, setListScrollPosition] = useState<number>(0)
  const deviceHeight = useWindowDimensions().height
  const features = prepareFeatureLocations(pois, coordinates)
  const selectedFeature = slug ? features.find(it => it.properties.slug === slug) : null
  const poi = pois.find(it => it.slug === slug)
  const { t } = useTranslation('pois')
  const theme = useTheme()
  const cameraRef = useRef<MapLibreGL.Camera | null>(null)
  const scrollRef = useRef<BottomSheetScrollViewMethods>(null)

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
  const selectPoiFeature = (feature: PoiFeature | null) => {
    if (feature && cameraRef.current) {
      setFollowUserLocation(false)
      navigation.setParams({ slug: feature.properties.slug })
      scrollTo(0)
    } else {
      navigation.setParams({ slug: undefined })
    }
  }

  const deselectPoiFeature = useCallback(() => {
    navigation.setParams({ slug: undefined })
    scrollTo(listScrollPosition)
  }, [listScrollPosition, navigation])
  useOnBackNavigation(slug ? deselectPoiFeature : undefined)

  // Wait for followUserLocation change before moving the camera to avoid position lock
  // https://github.com/rnmapbox/maps/issues/1079
  useEffect(() => {
    if (!followUserLocation && selectedFeature && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: selectedFeature.geometry.coordinates,
        zoomLevel: selectedFeature.properties.closeToOtherPoi ? closerDetailZoom : normalDetailZoom,
        animationDuration,
        padding: {
          paddingBottom: deviceHeight * midSnapPointPercentage
        },
      })
    }
  }, [deviceHeight, followUserLocation, selectedFeature])

  const renderPoiListItem = (poi: PoiFeature): ReactElement => (
    <PoiListItem
      key={poi.properties.id}
      poi={poi}
      language={language}
      navigateToPoi={() => selectPoiFeature(poi)}
      t={t}
    />
  )

  const navigateToFeedback = (isPositiveFeedback: boolean) => {
    createNavigateToFeedbackModal(navigation)({
      routeType: POIS_ROUTE,
      language,
      cityCode: cityModel.code,
      isPositiveFeedback,
      slug: poi?.slug,
    })
  }

  if (!cityModel.boundingBox) {
    reportError(new Error(`Bounding box not set for city ${cityModel.code}!`))
    return <Failure code={ErrorCode.PageNotFound} />
  }

  const selectedFeatureContent =
    selectedFeature && poi ? (
      <PoiDetails language={language} poi={poi} feature={selectedFeature} />
    ) : (
      <Failure
        code={fromError(
          new NotFoundError({
            type: 'poi',
            id: slug ?? '',
            city: cityModel.code,
            language,
          })
        )}
      />
    )

  const content = slug ? (
    selectedFeatureContent
  ) : (
    <ListWrapper>
      {features.length === 0 ? <NoItemsMessage>{t('noPois')}</NoItemsMessage> : features.map(renderPoiListItem)}
    </ListWrapper>
  )

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <MapView
        ref={cameraRef}
        selectPoiFeature={selectPoiFeature}
        boundingBox={cityModel.boundingBox}
        setSheetSnapPointIndex={setSheetSnapPointIndex}
        featureCollection={embedInCollection(features)}
        selectedFeature={selectedFeature ?? null}
        locationPermissionGranted={coordinates !== null}
        onRequestLocationPermission={requestAndDetermineLocation}
        fabPosition={
          sheetSnapPointIndex < BOTTOM_SHEET_SNAP_POINTS.length - 1 ? BOTTOM_SHEET_SNAP_POINTS[sheetSnapPointIndex]! : 0
        }
        followUserLocation={followUserLocation}
        setFollowUserLocation={setFollowUserLocation}
      />
      <BottomActionsSheet
        ref={scrollRef}
        selectedFeature={selectedFeature ?? null}
        setListScrollPosition={setListScrollPosition}
        title={!selectedFeature ? t('listTitle') : undefined}
        onChange={setSheetSnapPointIndex}
        initialIndex={sheetSnapPointIndex}
        snapPoints={BOTTOM_SHEET_SNAP_POINTS}
        snapPointIndex={sheetSnapPointIndex}>
        {content}
        <SiteHelpfulBox backgroundColor={theme.colors.backgroundColor} navigateToFeedback={navigateToFeedback} />
      </BottomActionsSheet>
    </ScrollView>
  )
}

export default Pois

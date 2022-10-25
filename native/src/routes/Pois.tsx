import MapboxGL from '@react-native-mapbox-gl/maps'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import {
  animationDuration,
  CityModel,
  detailZoom,
  embedInCollection,
  ErrorCode,
  fromError,
  nameQueryParam,
  NotFoundError,
  PoiFeature,
  PoiModel,
  POIS_ROUTE,
  PoisRouteType,
  prepareFeatureLocations,
} from 'api-client'

import BottomActionsSheet from '../components/BottomActionsSheet'
import Failure from '../components/Failure'
import MapView from '../components/MapView'
import PoiDetails from '../components/PoiDetails'
import PoiListItem from '../components/PoiListItem'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import dimensions from '../constants/dimensions'
import usePrevious from '../hooks/usePrevious'
import useSetShareUrl from '../hooks/useSetShareUrl'
import useUserLocation from '../hooks/useUserLocation'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import urlFromRouteInformation from '../navigation/url'
import { reportError } from '../utils/sentry'

export type PoisProps = {
  pois: Array<PoiModel>
  cityModel: CityModel
  language: string
  route: RouteProps<PoisRouteType>
  navigation: NavigationProps<PoisRouteType>
}

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

const Pois = ({ pois, language, cityModel, route, navigation }: PoisProps): ReactElement => {
  const { coordinates, requestAndDetermineLocation } = useUserLocation(true)
  const [urlSlug, setUrlSlug] = useState<string | null>(route.params.urlSlug ?? null)
  const prevUrlSlug = usePrevious(urlSlug ?? '')
  const [sheetSnapPointIndex, setSheetSnapPointIndex] = useState<number>(1)
  const [followUserLocation, setFollowUserLocation] = useState<boolean>(false)
  const deviceHeight = useWindowDimensions().height
  const features = prepareFeatureLocations(pois, coordinates)
  const selectedFeature = urlSlug ? features.find(it => it.properties.urlSlug === urlSlug) : null
  const poi = pois.find(it => it.slug === urlSlug)
  const { t } = useTranslation('pois')
  const theme = useTheme()
  const cameraRef = React.useRef<MapboxGL.Camera | null>(null)

  const baseUrl = urlFromRouteInformation({
    route: POIS_ROUTE,
    languageCode: language,
    cityCode: cityModel.code,
  })
  const shareUrl = urlSlug ? `${baseUrl}?${nameQueryParam}=${urlSlug}` : baseUrl
  useSetShareUrl({ navigation, shareUrl, route, routeInformation: null })

  const selectPoiFeature = (feature: PoiFeature | null) => {
    if (feature && cameraRef.current) {
      const { properties } = feature
      setFollowUserLocation(false)
      setUrlSlug(properties.urlSlug)
      navigation.setParams({ urlSlug: properties.urlSlug })
    } else {
      setUrlSlug(null)
      navigation.setParams({ urlSlug: undefined })
    }
  }

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (urlSlug) {
          // Only deselect currently selected poi if navigating back
          e.preventDefault()
          setUrlSlug(null)
        }
      }),
    [navigation, urlSlug]
  )

  // Wait for followUserLocation change before moving the camera to avoid position lock
  // https://github.com/rnmapbox/maps/issues/1079
  useEffect(() => {
    if (!followUserLocation && selectedFeature && cameraRef.current && prevUrlSlug !== urlSlug) {
      cameraRef.current.setCamera({
        centerCoordinate: selectedFeature.geometry.coordinates,
        zoomLevel: detailZoom,
        animationDuration,
        padding: { paddingBottom: deviceHeight * midSnapPointPercentage },
      })
    }
  }, [deviceHeight, followUserLocation, prevUrlSlug, selectedFeature, urlSlug])

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
      path: poi ? poi.path : undefined,
      cityCode: cityModel.code,
      isPositiveFeedback,
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
            id: urlSlug ?? '',
            city: cityModel.code,
            language,
          })
        )}
      />
    )

  const content = urlSlug ? (
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

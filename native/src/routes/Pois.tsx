import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import {
  CityModel,
  embedInCollection,
  ErrorCode,
  fromError,
  locationName,
  NotFoundError,
  PoiFeature,
  PoiModel,
  POIS_ROUTE,
  PoisRouteType,
  prepareFeatureLocations,
  RouteInformationType
} from 'api-client'

import BottomActionsSheet from '../components/BottomActionsSheet'
import Failure from '../components/Failure'
import { FeedbackInformationType } from '../components/FeedbackContainer'
import List from '../components/List'
import MapView from '../components/MapView'
import PoiDetails from '../components/PoiDetails'
import { PoiListItem } from '../components/PoiListItem'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import dimensions from '../constants/dimensions'
import useSetShareUrl from '../hooks/useSetShareUrl'
import useUserLocation from '../hooks/useUserLocation'
import urlFromRouteInformation from '../navigation/url'
import { LanguageResourceCacheStateType } from '../redux/StateType'
import { reportError } from '../utils/sentry'

export type PropsType = {
  pois: Array<PoiModel>
  cityModel: CityModel
  language: string
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
  navigateTo: (routeInformation: RouteInformationType) => void
  navigateToFeedback: (feedbackInformation: FeedbackInformationType) => void
  route: RoutePropType<PoisRouteType>
  navigation: NavigationPropType<PoisRouteType>
}

const CustomSheetList = styled.View`
  margin: 0 32px;
`

const BOTTOM_SHEET_SNAP_POINTS = [dimensions.bottomSheetHandler.height, '35%', '95%']

const Pois = ({
  pois,
  language,
  cityModel,
  navigateTo,
  navigateToFeedback,
  route,
  navigation
}: PropsType): ReactElement => {
  const userLocation = useUserLocation(true)
  const [urlSlug, setUrlSlug] = useState<string | null>(route.params.urlSlug ?? null)
  const [features, setFeatures] = useState<PoiFeature[]>(prepareFeatureLocations(pois, userLocation.coordinates))
  const [sheetSnapPointIndex, setSheetSnapPointIndex] = useState<number>(1)
  const selectedFeature = urlSlug ? features.find(it => it.properties.urlSlug === urlSlug) : null
  const poi = pois.find(it => it.urlSlug === urlSlug)
  const { t } = useTranslation('pois')
  const theme = useTheme()

  const baseUrl = urlFromRouteInformation({
    route: POIS_ROUTE,
    languageCode: language,
    cityCode: cityModel.code
  })
  const shareUrl = urlSlug ? `${baseUrl}?${locationName}=${urlSlug}` : baseUrl
  useSetShareUrl({ navigation, shareUrl, route, routeInformation: null })

  useEffect(() => {
    setFeatures(prepareFeatureLocations(pois, userLocation.coordinates))
  }, [pois, userLocation])

  const navigateToPois = (urlSlug: string) => (): void => {
    navigateTo({
      route: POIS_ROUTE,
      cityCode: cityModel.code,
      languageCode: language,
      urlSlug
    })
  }

  const renderPoiListItem = (poi: PoiFeature): ReactNode => (
    <PoiListItem
      key={poi.properties.id}
      poi={poi}
      language={language}
      theme={theme}
      navigateToPoi={navigateToPois(poi.properties.urlSlug)}
    />
  )

  const navigateToPoisFeedback = (isPositiveFeedback: boolean) => {
    navigateToFeedback({
      routeType: POIS_ROUTE,
      language,
      path: poi ? poi.path : undefined,
      cityCode: cityModel.code,
      isPositiveFeedback
    })
  }

  const selectPoiFeature = (feature: PoiFeature | null) => {
    if (feature) {
      setUrlSlug(feature.properties.urlSlug)
      setSheetSnapPointIndex(1)
    } else {
      setUrlSlug(null)
    }
  }

  if (!cityModel.boundingBox) {
    reportError(new Error(`Bounding box not set for city ${cityModel.code}!`))
    return <Failure code={ErrorCode.PageNotFound} />
  }

  const selectedFeatureContent =
    selectedFeature && poi ? (
      <PoiDetails
        language={language}
        poi={poi}
        feature={selectedFeature}
        detailPage={false}
        navigateToPois={navigateToPois(poi.urlSlug)}
      />
    ) : (
      <Failure
        code={fromError(
          new NotFoundError({
            type: 'poi',
            id: urlSlug ?? '',
            city: cityModel.code,
            language
          })
        )}
      />
    )

  const content = urlSlug ? (
    selectedFeatureContent
  ) : (
    <List
      CustomStyledList={CustomSheetList}
      noItemsMessage={t('noPois')}
      items={features}
      renderItem={renderPoiListItem}
      theme={theme}
    />
  )

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <MapView
        selectPoiFeature={selectPoiFeature}
        boundingBox={cityModel.boundingBox}
        featureCollection={embedInCollection(features)}
        selectedFeature={selectedFeature ?? null}
        locationPermissionGranted={userLocation.coordinates !== null}
        onRequestLocationPermission={userLocation.requestAndDetermineLocation}
        fabPosition={
          sheetSnapPointIndex < BOTTOM_SHEET_SNAP_POINTS.length - 1 ? BOTTOM_SHEET_SNAP_POINTS[sheetSnapPointIndex]! : 0
        }
      />
      <BottomActionsSheet
        title={selectedFeature ? selectedFeature.properties.title : t('listTitle')}
        onChange={setSheetSnapPointIndex}
        initialIndex={sheetSnapPointIndex}
        snapPoints={BOTTOM_SHEET_SNAP_POINTS}>
        {content}
        <SiteHelpfulBox backgroundColor={theme.colors.backgroundColor} navigateToFeedback={navigateToPoisFeedback} />
      </BottomActionsSheet>
    </ScrollView>
  )
}

export default Pois

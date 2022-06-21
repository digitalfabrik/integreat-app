import MapboxGL from '@react-native-mapbox-gl/maps'
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
  prepareFeatureLocations
} from 'api-client'

import BottomActionsSheet from '../components/BottomActionsSheet'
import Failure from '../components/Failure'
import List from '../components/List'
import MapView from '../components/MapView'
import PoiDetails from '../components/PoiDetails'
import { PoiListItem } from '../components/PoiListItem'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import dimensions from '../constants/dimensions'
import useSetShareUrl from '../hooks/useSetShareUrl'
import useUserLocation from '../hooks/useUserLocation'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import urlFromRouteInformation from '../navigation/url'
import { LanguageResourceCacheStateType } from '../redux/StateType'
import { reportError } from '../utils/sentry'

export type PropsType = {
  pois: Array<PoiModel>
  cityModel: CityModel
  language: string
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
  route: RoutePropType<PoisRouteType>
  navigation: NavigationPropType<PoisRouteType>
}

const CustomSheetList = styled.View`
  margin: 0 32px;
`

const BOTTOM_SHEET_SNAP_POINTS = [dimensions.bottomSheetHandler.height, '35%', '95%']

const Pois = ({ pois, language, cityModel, route, navigation }: PropsType): ReactElement => {
  const { coordinates, requestAndDetermineLocation } = useUserLocation(true)
  const [urlSlug, setUrlSlug] = useState<string | null>(route.params.urlSlug ?? null)
  const [sheetSnapPointIndex, setSheetSnapPointIndex] = useState<number>(1)
  const features = prepareFeatureLocations(pois, coordinates)
  const selectedFeature = urlSlug ? features.find(it => it.properties.urlSlug === urlSlug) : null
  const poi = pois.find(it => it.urlSlug === urlSlug)
  const { t } = useTranslation('pois')
  const theme = useTheme()
  const cameraRef = React.useRef<MapboxGL.Camera | null>(null)

  const baseUrl = urlFromRouteInformation({
    route: POIS_ROUTE,
    languageCode: language,
    cityCode: cityModel.code
  })
  const shareUrl = urlSlug ? `${baseUrl}?${locationName}=${urlSlug}` : baseUrl
  useSetShareUrl({ navigation, shareUrl, route, routeInformation: null })

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

  const selectPoiFeature = (feature: PoiFeature | null) => {
    if (feature && cameraRef.current) {
      const { properties, geometry } = feature
      setUrlSlug(properties.urlSlug)
      cameraRef.current.flyTo(geometry.coordinates)
    } else {
      setUrlSlug(null)
    }
  }

  const renderPoiListItem = (poi: PoiFeature): ReactNode => (
    <PoiListItem
      key={poi.properties.id}
      poi={poi}
      language={language}
      theme={theme}
      navigateToPoi={() => selectPoiFeature(poi)}
    />
  )

  const navigateToFeedback = (isPositiveFeedback: boolean) => {
    createNavigateToFeedbackModal(navigation)({
      routeType: POIS_ROUTE,
      language,
      path: poi ? poi.path : undefined,
      cityCode: cityModel.code,
      isPositiveFeedback
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
      />
      <BottomActionsSheet
        title={!selectedFeature ? t('listTitle') : undefined}
        onChange={setSheetSnapPointIndex}
        initialIndex={sheetSnapPointIndex}
        snapPoints={BOTTOM_SHEET_SNAP_POINTS}>
        {content}
        <SiteHelpfulBox backgroundColor={theme.colors.backgroundColor} navigateToFeedback={navigateToFeedback} />
      </BottomActionsSheet>
    </ScrollView>
  )
}

export default Pois

import { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet'
import React, { ReactElement, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, useWindowDimensions } from 'react-native'
import { SvgUri } from 'react-native-svg'
import styled from 'styled-components/native'

import {
  CityModel,
  embedInCollection,
  PoiModel,
  PoisRouteType,
  prepareFeatureLocations,
  GeoJsonPoi,
  MapFeature,
  isMultipoi,
  sortMapFeatures,
  NotFoundError,
  fromError,
  PoiCategoryModel,
} from 'api-client'

import { ClockIcon, EditLocationIcon } from '../assets'
import BottomActionsSheet from '../components/BottomActionsSheet'
import Failure from '../components/Failure'
import MapView from '../components/MapView'
import PoiDetails from '../components/PoiDetails'
import PoiFiltersModal from '../components/PoiFiltersModal'
import PoiListItem from '../components/PoiListItem'
import ChipButton from '../components/base/ChipButton'
import Icon from '../components/base/Icon'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import dimensions from '../constants/dimensions'
import useOnBackNavigation from '../hooks/useOnBackNavigation'
import useUserLocation from '../hooks/useUserLocation'

const ListWrapper = styled.View`
  margin: 0 32px;
`

const NoItemsMessage = styled.Text`
  padding-top: 25px;
  text-align: center;
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.textSecondaryColor};
  width: 16px;
  height: 16px;
`

const midSnapPointPercentage = 0.35
export const getBottomSheetSnapPoints = (deviceHeight: number): [number, number, number] => [
  dimensions.bottomSheetHandler.height,
  midSnapPointPercentage * deviceHeight,
  deviceHeight,
]

type PoisProps = {
  pois: Array<PoiModel>
  cityModel: CityModel
  language: string
  route: RouteProps<PoisRouteType>
  navigation: NavigationProps<PoisRouteType>
}

const RESTORE_TIMEOUT = 100

const Pois = ({ pois: allPois, language, cityModel, route, navigation }: PoisProps): ReactElement => {
  const [poiCategoryFilter, setPoiCategoryFilter] = useState<PoiCategoryModel | null>(null)
  const [poiCurrentlyOpenFilter, setPoiCurrentlyOpenFilter] = useState(false)
  const [showFilterSelection, setShowFilterSelection] = useState(false)
  const { coordinates, requestAndDetermineLocation } = useUserLocation(true)
  const { slug, multipoi } = route.params
  const [sheetSnapPointIndex, setSheetSnapPointIndex] = useState<number>(1)
  const [listScrollPosition, setListScrollPosition] = useState<number>(0)
  const { t } = useTranslation('pois')
  const scrollRef = useRef<BottomSheetScrollViewMethods>(null)
  const deviceHeight = useWindowDimensions().height

  const pois = useMemo(
    () =>
      allPois
        .filter(poi => !poiCategoryFilter || poi.category.isEqual(poiCategoryFilter))
        .filter(poi => !poiCurrentlyOpenFilter || poi.isCurrentlyOpen),
    [allPois, poiCategoryFilter, poiCurrentlyOpenFilter],
  )
  const poi = pois.find(it => it.slug === slug)
  const features = useMemo(() => prepareFeatureLocations(pois, coordinates), [pois, coordinates])

  const updatePoiCategoryFilter = (poiCategoryFilter: PoiCategoryModel | null) => {
    if (poi && poiCategoryFilter && poi.category !== poiCategoryFilter) {
      navigation.setParams({ slug: undefined })
    }
    setPoiCategoryFilter(poiCategoryFilter)
  }

  const updatePoiCurrentlyOpenFilter = (poiCurrentlyOpenFilter: boolean) => {
    if (poi && poiCurrentlyOpenFilter && !poi.isCurrentlyOpen) {
      navigation.setParams({ slug: undefined })
    }
    setPoiCurrentlyOpenFilter(poiCurrentlyOpenFilter)
  }

  const currentFeatureOnMap = useMemo(
    () =>
      multipoi
        ? features.find(feature => feature.id === multipoi)
        : features.find(feature => feature.properties.pois.some((poi: GeoJsonPoi) => poi.slug === slug)),
    [features, multipoi, slug],
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

    if (isMultipoi(feature)) {
      navigation.setParams({ multipoi: feature.id as string })
      scrollTo(0)
    } else {
      const poiFeature = feature.properties.pois[0]
      navigation.setParams({ slug: poiFeature?.slug })
      scrollTo(0)
    }
  }

  const selectGeoJsonPoiInList = (newGeoJsonPoi: GeoJsonPoi | null) => {
    if (!newGeoJsonPoi) {
      return
    }
    navigation.setParams({ slug: newGeoJsonPoi.slug })
    scrollTo(0)
  }

  const renderPoiListItem = (poi: GeoJsonPoi): ReactElement => (
    <PoiListItem key={poi.path} poi={poi} language={language} navigateToPoi={() => selectGeoJsonPoiInList(poi)} t={t} />
  )

  const setScrollPosition = useCallback(
    (position: number) => {
      if (!currentPoi) {
        setListScrollPosition(position)
      }
    },
    [currentPoi],
  )

  const singlePoiContent = currentPoi && (
    <PoiDetails language={language} poi={currentPoi} poiFeature={currentPoi.getFeature(coordinates)} />
  )
  const failurePoiContent = !currentPoi && slug && (
    <Failure
      code={fromError(
        new NotFoundError({
          type: 'poi',
          id: '',
          city: cityModel.code,
          language,
        }),
      )}
    />
  )

  const list = currentFeatureOnMap
    ? currentFeatureOnMap.properties.pois
    : features.flatMap(feature => feature.properties.pois)

  const listPoiContent = (
    <ListWrapper>
      {list.length === 0 ? (
        <NoItemsMessage>{t('noPois')}</NoItemsMessage>
      ) : (
        sortMapFeatures(list).map(renderPoiListItem)
      )}
    </ListWrapper>
  )

  const FiltersOverlayButtons = (
    <>
      <ChipButton
        text={t('adjustFilters')}
        Icon={<StyledIcon Icon={EditLocationIcon} />}
        onPress={() => setShowFilterSelection(true)}
      />
      {poiCurrentlyOpenFilter && (
        <ChipButton
          text={t('opened')}
          Icon={<StyledIcon Icon={ClockIcon} />}
          onPress={() => setPoiCurrentlyOpenFilter(false)}
          closeButton
        />
      )}
      {!!poiCategoryFilter && (
        <ChipButton
          text={poiCategoryFilter.name}
          Icon={<SvgUri uri={poiCategoryFilter.icon} height={16} width={16} />}
          onPress={() => setPoiCategoryFilter(null)}
          closeButton
        />
      )}
    </>
  )

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentBottomSheetHeight = getBottomSheetSnapPoints(deviceHeight)[sheetSnapPointIndex]!

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <PoiFiltersModal
        modalVisible={showFilterSelection}
        closeModal={() => setShowFilterSelection(false)}
        pois={allPois}
        selectedPoiCategory={poiCategoryFilter}
        setSelectedPoiCategory={updatePoiCategoryFilter}
        currentlyOpenFilter={poiCurrentlyOpenFilter}
        setCurrentlyOpenFilter={updatePoiCurrentlyOpenFilter}
      />
      <MapView
        selectFeature={selectFeatureOnMap}
        boundingBox={cityModel.boundingBox}
        setSheetSnapPointIndex={setSheetSnapPointIndex}
        featureCollection={embedInCollection(features)}
        selectedFeature={currentFeatureOnMap ?? null}
        bottomSheetHeight={currentBottomSheetHeight}
        locationPermissionGranted={!!coordinates}
        onRequestLocationPermission={requestAndDetermineLocation}
        iconPosition={
          sheetSnapPointIndex < getBottomSheetSnapPoints(deviceHeight).length - 1 ? currentBottomSheetHeight : 0
        }
        Overlay={FiltersOverlayButtons}
      />
      <BottomActionsSheet
        ref={scrollRef}
        setScrollPosition={setScrollPosition}
        title={!currentPoi && !multipoi ? t('listTitle') : undefined}
        onChange={setSheetSnapPointIndex}
        initialIndex={sheetSnapPointIndex}
        snapPoints={getBottomSheetSnapPoints(deviceHeight)}
        snapPointIndex={sheetSnapPointIndex}>
        {singlePoiContent ?? failurePoiContent ?? listPoiContent}
      </BottomActionsSheet>
    </ScrollView>
  )
}

export default Pois

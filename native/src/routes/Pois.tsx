import { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet'
import React, { ReactElement, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, useWindowDimensions } from 'react-native'
import { SvgUri } from 'react-native-svg'
import styled from 'styled-components/native'

import { PoisRouteType, isMultipoi, LocationType, sortPois, MapFeature, preparePois, safeParseInt } from 'shared'
import { PoiCategoryModel, CityModel, PoiModel, ErrorCode } from 'shared/api'

import { ClockIcon, EditLocationIcon } from '../assets'
import BottomActionsSheet from '../components/BottomActionsSheet'
import Failure from '../components/Failure'
import List from '../components/List'
import MapView from '../components/MapView'
import PoiDetails from '../components/PoiDetails'
import PoiFiltersModal from '../components/PoiFiltersModal'
import PoiListItem from '../components/PoiListItem'
import ChipButton from '../components/base/ChipButton'
import Icon from '../components/base/Icon'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import dimensions from '../constants/dimensions'
import useOnBackNavigation from '../hooks/useOnBackNavigation'

const Container = styled.View`
  flex: 1;
  margin: 0 24px;
`

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.textSecondaryColor};
  width: 16px;
  height: 16px;
`

const midSnapPointPercentage = 0.35
const getBottomSheetSnapPoints = (deviceHeight: number): [number, number, number] => [
  dimensions.bottomSheetHandler.height,
  midSnapPointPercentage * deviceHeight,
  deviceHeight,
]

type PoisProps = {
  pois: Array<PoiModel>
  cityModel: CityModel
  language: string
  refresh: () => void
  route: RouteProps<PoisRouteType>
  navigation: NavigationProps<PoisRouteType>
}

const RESTORE_TIMEOUT = 100

const Pois = ({ pois: allPois, language, cityModel, route, navigation, refresh }: PoisProps): ReactElement => {
  const { slug, multipoi, poiCategoryId, zoom } = route.params
  const [poiCurrentlyOpenFilter, setPoiCurrentlyOpenFilter] = useState(false)
  const [showFilterSelection, setShowFilterSelection] = useState(false)
  const [userLocation, setUserLocation] = useState<LocationType | null>(null)
  const [sheetSnapPointIndex, setSheetSnapPointIndex] = useState(1)
  const [listScrollPosition, setListScrollPosition] = useState(0)
  const [deselectOnBackNavigation, setDeselectOnBackNavigation] = useState(slug === undefined && multipoi === undefined)
  const scrollRef = useRef<BottomSheetScrollViewMethods>(null)
  const deviceHeight = useWindowDimensions().height
  const snapPoints = getBottomSheetSnapPoints(deviceHeight)
  const { t } = useTranslation('pois')

  const { pois, poi, mapFeatures, mapFeature, poiCategories, poiCategory } = preparePois({
    pois: allPois,
    params: { slug, multipoi, poiCategoryId, currentlyOpen: poiCurrentlyOpenFilter },
  })

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

  const deselect = () => {
    if (multipoi !== undefined && slug) {
      navigation.setParams({ slug: undefined })
    } else {
      deselectAll()
    }
  }
  useOnBackNavigation((slug || multipoi !== undefined) && deselectOnBackNavigation ? deselect : undefined)

  const updatePoiCategoryFilter = (poiCategoryFilter: PoiCategoryModel | null) => {
    if (poiCategoryFilter) {
      deselectAll()
    }
    navigation.setParams({ poiCategoryId: poiCategoryFilter?.id })
  }

  const updatePoiCurrentlyOpenFilter = (poiCurrentlyOpenFilter: boolean) => {
    if (poiCurrentlyOpenFilter) {
      deselectAll()
    }
    setPoiCurrentlyOpenFilter(poiCurrentlyOpenFilter)
  }

  const selectMapFeature = (mapFeature: MapFeature | null) => {
    setDeselectOnBackNavigation(true)
    deselectAll()

    const slug = mapFeature?.properties.pois[0]?.slug
    if (mapFeature && isMultipoi(mapFeature)) {
      navigation.setParams({ multipoi: safeParseInt(mapFeature.id), slug: undefined })
      scrollTo(0)
    } else if (slug) {
      navigation.setParams({ slug, multipoi: undefined })
      scrollTo(0)
    }
  }

  const selectPoi = (poi: PoiModel) => {
    setDeselectOnBackNavigation(true)
    navigation.setParams({ slug: poi.slug })
    scrollTo(0)
  }

  const setScrollPosition = (position: number) => setListScrollPosition(previous => (poi ? previous : position))

  const PoiDetail = poi ? (
    <PoiDetails language={language} poi={poi} distance={userLocation && poi.distance(userLocation)} />
  ) : (
    <Failure code={ErrorCode.PageNotFound} buttonAction={deselectAll} buttonLabel={t('detailsHeader')} />
  )

  const renderPoiListItem = ({ item: poi }: { item: PoiModel }): ReactElement => (
    <PoiListItem
      key={poi.path}
      poi={poi}
      language={language}
      navigateToPoi={() => selectPoi(poi)}
      distance={userLocation && poi.distance(userLocation)}
    />
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
      {!!poiCategory && (
        <ChipButton
          text={poiCategory.name}
          Icon={<SvgUri uri={poiCategory.icon} height={16} width={16} />}
          onPress={() => navigation.setParams({ poiCategoryId: undefined })}
          closeButton
        />
      )}
    </>
  )

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentBottomSheetHeight = snapPoints[sheetSnapPointIndex]!

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <PoiFiltersModal
        modalVisible={showFilterSelection}
        closeModal={() => setShowFilterSelection(false)}
        poiCategories={poiCategories}
        selectedPoiCategory={poiCategory}
        setSelectedPoiCategory={updatePoiCategoryFilter}
        currentlyOpenFilter={poiCurrentlyOpenFilter}
        setCurrentlyOpenFilter={updatePoiCurrentlyOpenFilter}
        poisCount={pois.length}
      />
      <MapView
        selectFeature={selectMapFeature}
        boundingBox={cityModel.boundingBox}
        setSheetSnapPointIndex={setSheetSnapPointIndex}
        features={mapFeatures}
        selectedFeature={mapFeature ?? null}
        bottomSheetHeight={currentBottomSheetHeight}
        setUserLocation={setUserLocation}
        userLocation={userLocation}
        iconPosition={sheetSnapPointIndex < snapPoints.length - 1 ? currentBottomSheetHeight : 0}
        zoom={zoom}
        Overlay={FiltersOverlayButtons}
      />
      <BottomActionsSheet
        ref={scrollRef}
        setScrollPosition={setScrollPosition}
        onChange={setSheetSnapPointIndex}
        initialIndex={sheetSnapPointIndex}
        snapPoints={snapPoints}
        snapPointIndex={sheetSnapPointIndex}>
        <Container>
          {!slug ? <Title>{t('listTitle')}</Title> : undefined}
          {slug ? (
            PoiDetail
          ) : (
            <List
              items={sortPois(pois, userLocation)}
              noItemsMessage={t('noPois')}
              renderItem={renderPoiListItem}
              scrollEnabled={false}
              refresh={refresh}
            />
          )}
        </Container>
      </BottomActionsSheet>
    </ScrollView>
  )
}

export default Pois

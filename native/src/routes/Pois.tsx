import { BottomSheetFlatListMethods } from '@gorhom/bottom-sheet'
import React, { ReactElement, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowDimensions } from 'react-native'
import { Chip, Text } from 'react-native-paper'
import { SvgUri } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { PoisRouteType, isMultipoi, LocationType, MapFeature, preparePois, safeParseInt, sortPois } from 'shared'
import { PoiCategoryModel, CityModel, PoiModel } from 'shared/api'

import { EditLocationIcon } from '../assets'
import MapView from '../components/MapView'
import PoiFiltersModal from '../components/PoiFiltersModal'
import PoisBottomSheet from '../components/PoisBottomSheet'
import Icon from '../components/base/Icon'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import dimensions from '../constants/dimensions'
import useOnBackNavigation from '../hooks/useOnBackNavigation'

const StyledSvgUri = styled(SvgUri)`
  color: ${props => props.theme.colors.onSurfaceVariant};
  margin-inline-start: 4px;
`

const Container = styled.View`
  flex: 1;
`

const SNAP_POINT_MID_PERCENTAGE = 0.35

type PoisProps = {
  pois: PoiModel[]
  cityModel: CityModel
  route: RouteProps<PoisRouteType>
  navigation: NavigationProps<PoisRouteType>
}

const Pois = ({ pois: allPois, cityModel, route, navigation }: PoisProps): ReactElement => {
  const { slug, multipoi, poiCategoryId, zoom } = route.params
  const [deselectOnBackNavigation, setDeselectOnBackNavigation] = useState(slug === undefined && multipoi === undefined)
  const [poiCurrentlyOpenFilter, setPoiCurrentlyOpenFilter] = useState(false)
  const [showFilterSelection, setShowFilterSelection] = useState(false)
  const [userLocation, setUserLocation] = useState<LocationType | null>(null)
  const [bottomSheetSnapPointIndex, setBottomSheetSnapPointIndex] = useState(1)
  const [listScrollPosition, setListScrollPosition] = useState(0)
  const poiListRef = useRef<BottomSheetFlatListMethods>(null)
  const { t } = useTranslation('pois')
  const { height } = useWindowDimensions()
  const theme = useTheme()
  const bottomSheetSnapPoints = [dimensions.bottomSheetHandle.height, SNAP_POINT_MID_PERCENTAGE * height, height]
  const bottomSheetFullscreen = bottomSheetSnapPointIndex === bottomSheetSnapPoints.length - 1
  const bottomSheetHeight = bottomSheetSnapPoints[bottomSheetSnapPointIndex] ?? 0

  const { pois, poi, mapFeatures, mapFeature, poiCategories, poiCategory } = preparePois({
    pois: allPois,
    params: { slug, multipoi, poiCategoryId, currentlyOpen: poiCurrentlyOpenFilter },
  })

  const scrollToOffset = (offset: number) => poiListRef.current?.scrollToOffset({ offset, animated: false })

  const deselectAll = () => {
    navigation.setParams({ slug: undefined, multipoi: undefined })
    scrollToOffset(listScrollPosition)
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
    setBottomSheetSnapPointIndex(1)

    const slug = mapFeature?.properties.pois[0]?.slug
    if (mapFeature && isMultipoi(mapFeature)) {
      navigation.setParams({ multipoi: safeParseInt(mapFeature.id), slug: undefined })
      scrollToOffset(0)
    } else if (slug) {
      navigation.setParams({ slug, multipoi: undefined })
    }
  }

  const selectPoi = (poi: PoiModel) => {
    setDeselectOnBackNavigation(true)
    navigation.setParams({ slug: poi.slug })
  }

  const chipStyle = { borderColor: 'transparent', borderRadius: 24, height: 32, marginRight: 4 }

  const FiltersOverlayButtons = (
    <>
      <Chip
        mode='outlined'
        style={chipStyle}
        rippleColor='transparent'
        elevated
        avatar={<Icon Icon={EditLocationIcon} color={theme.colors.onSurface} />}
        onPress={() => setShowFilterSelection(true)}>
        <Text>{t('adjustFilters')}</Text>
      </Chip>

      {poiCurrentlyOpenFilter && (
        <Chip
          textStyle={{ color: theme.colors.onSurface }}
          mode='outlined'
          rippleColor='transparent'
          style={chipStyle}
          avatar={
            <Icon source='clock-outline' color={theme.colors.onSurface} size={20} style={{ width: 20, height: 20 }} />
          }
          onPress={() => setPoiCurrentlyOpenFilter(false)}
          onClose={() => setPoiCurrentlyOpenFilter(false)}
          closeIcon='close'>
          <Text>{t('opened')}</Text>
        </Chip>
      )}
      {!!poiCategory && (
        <Chip
          textStyle={{ color: theme.colors.onSurface }}
          mode='outlined'
          rippleColor='transparent'
          style={chipStyle}
          avatar={<StyledSvgUri uri={poiCategory.icon} />}
          onPress={() => navigation.setParams({ poiCategoryId: undefined })}
          onClose={() => navigation.setParams({ poiCategoryId: undefined })}
          closeIcon='close'>
          <Text>{poiCategory.name}</Text>
        </Chip>
      )}
    </>
  )

  return (
    <Container>
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
        features={mapFeatures}
        selectedFeature={mapFeature ?? null}
        bottomSheetHeight={bottomSheetHeight}
        bottomSheetFullscreen={bottomSheetFullscreen}
        setUserLocation={setUserLocation}
        userLocation={userLocation}
        zoom={zoom}
        Overlay={FiltersOverlayButtons}
      />
      <PoisBottomSheet
        poiListRef={poiListRef}
        pois={sortPois(pois, userLocation)}
        poi={poi}
        slug={slug}
        userLocation={userLocation}
        selectPoi={selectPoi}
        deselectAll={deselect}
        snapPoints={bottomSheetSnapPoints}
        snapPointIndex={bottomSheetSnapPointIndex}
        setSnapPointIndex={setBottomSheetSnapPointIndex}
        setScrollPosition={setListScrollPosition}
        isFullscreen={bottomSheetFullscreen}
      />
    </Container>
  )
}

export default Pois

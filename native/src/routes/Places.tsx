import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { findNodeHandle, useWindowDimensions, type View } from 'react-native'
import { Chip } from 'react-native-paper'
import { SvgUri } from 'react-native-svg'
import styled from 'styled-components/native'

import { isMultipoi, MapFeature, preparePlaces, safeParseInt, sortPlaces } from 'shared'
import { PlaceCategoryModel, PlaceModel, RegionModel } from 'shared/api'

import { EditLocationIcon } from '../assets'
import MapView from '../components/MapView'
import PlaceFiltersModal from '../components/PlaceFiltersModal'
import PlacesBottomSheet from '../components/PlacesBottomSheet'
import Icon from '../components/base/Icon'
import Text from '../components/base/Text'
import dimensions from '../constants/dimensions'
import { UseLocalHistoryReturn } from '../hooks/useLocalStackHistory'
import useUserLocation from '../hooks/useUserLocation'

const StyledSvgUri = styled(SvgUri)`
  color: ${props => props.theme.colors.onSurface};
  margin-inline-start: 4px;
`

const Container = styled.View`
  flex: 1;
`

const ChipContainer = styled.View({
  flexDirection: 'row',
  gap: 4,
})

const StyledChip = styled(Chip)({
  borderColor: 'transparent',
  borderRadius: 24,
  height: 32,
})

const SNAP_PLACENT_MID_PERCENTAGE = 0.35

export type PlaceHistory = {
  slug: string | undefined
  multipoi: number | undefined
  placeCategoryId: number | undefined
  currentlyOpen: boolean
  showFilterSelection: boolean
}

type PlacesProps = {
  refresh: () => void
  localHistory: UseLocalHistoryReturn<PlaceHistory>
  places: PlaceModel[]
  regionModel: RegionModel
  initialZoom: number | undefined
}

const Places = ({ refresh, localHistory, initialZoom, places: allPlaces, regionModel }: PlacesProps): ReactElement => {
  const { slug, multipoi, placeCategoryId, currentlyOpen, showFilterSelection } = localHistory.current
  const [bottomSheetSnapPointIndex, setBottomSheetSnapPointIndex] = useState(1)
  const [zoomInFocusTarget, setZoomInFocusTarget] = useState<number | undefined>(undefined)
  const { userLocation, refreshPermissionAndLocation } = useUserLocation({ requestPermissionInitially: false })
  const { t } = useTranslation('places')
  const { height } = useWindowDimensions()
  const bottomSheetSnapPoints = [dimensions.bottomSheetHandle.height, SNAP_PLACENT_MID_PERCENTAGE * height, height]
  const bottomSheetMidHeight = SNAP_PLACENT_MID_PERCENTAGE * height
  const bottomSheetFullscreen = bottomSheetSnapPointIndex === bottomSheetSnapPoints.length - 1
  const bottomSheetHeight = bottomSheetSnapPoints[bottomSheetSnapPointIndex] ?? 0

  const { places, place, mapFeatures, mapFeature, placeCategories, placeCategory } = preparePlaces({
    places: allPlaces,
    params: { slug, multipoi, placeCategoryId, currentlyOpen },
  })

  const handleZoomInRef = useCallback((view: View | null) => {
    setZoomInFocusTarget(findNodeHandle(view) ?? undefined)
  }, [])

  const deselect = () => localHistory.push(multipoi !== undefined && slug ? { multipoi } : {})

  const updateShowFilterSelection = (showFilterSelection: boolean) => localHistory.push({ showFilterSelection })

  const updatePlaceCategoryFilter = (placeCategory: PlaceCategoryModel | null) =>
    localHistory.pushReset({ placeCategoryId: placeCategory?.id, currentlyOpen })

  const updatePlaceCurrentlyOpenFilter = (currentlyOpen: boolean) =>
    localHistory.pushReset({ placeCategoryId, currentlyOpen })

  const selectMapFeature = (mapFeature: MapFeature | null) => {
    setBottomSheetSnapPointIndex(1)

    const slug = mapFeature?.properties.places[0]?.slug
    if (mapFeature && isMultipoi(mapFeature)) {
      localHistory.push({ multipoi: safeParseInt(mapFeature.id), slug: undefined })
    } else if (slug || localHistory.current.slug) {
      localHistory.push({ multipoi: undefined, slug })
    }
  }

  const selectPlace = (place: PlaceModel) => localHistory.push({ slug: place.slug })

  const FiltersOverlayButtons = (
    <ChipContainer>
      <StyledChip
        mode='outlined'
        rippleColor='transparent'
        elevated
        avatar={<Icon Icon={EditLocationIcon} />}
        onPress={() => updateShowFilterSelection(true)}>
        <Text variant='body3'>{t('adjustFilters')}</Text>
      </StyledChip>

      {currentlyOpen && (
        <StyledChip
          mode='outlined'
          rippleColor='transparent'
          avatar={<Icon source='clock-outline' size={20} style={{ width: 20, height: 20 }} />}
          onPress={() => updatePlaceCurrentlyOpenFilter(false)}
          onClose={() => updatePlaceCurrentlyOpenFilter(false)}
          closeIcon='close'>
          <Text variant='body3'>{t('opened')}</Text>
        </StyledChip>
      )}
      {!!placeCategory && (
        <StyledChip
          mode='outlined'
          rippleColor='transparent'
          avatar={<StyledSvgUri uri={placeCategory.icon} />}
          onPress={() => updatePlaceCategoryFilter(null)}
          onClose={() => updatePlaceCategoryFilter(null)}
          closeIcon='close'>
          <Text variant='body3'>{placeCategory.name}</Text>
        </StyledChip>
      )}
    </ChipContainer>
  )

  return (
    <Container>
      <PlaceFiltersModal
        modalVisible={showFilterSelection}
        closeModal={localHistory.pop}
        placeCategories={placeCategories}
        selectedPlaceCategory={placeCategory}
        setSelectedPlaceCategory={updatePlaceCategoryFilter}
        currentlyOpenFilter={currentlyOpen}
        setCurrentlyOpenFilter={updatePlaceCurrentlyOpenFilter}
        placesCount={places.length}
      />
      <MapView
        selectFeature={selectMapFeature}
        boundingBox={regionModel.boundingBox}
        features={mapFeatures}
        selectedFeature={mapFeature ?? null}
        bottomSheetHeight={bottomSheetHeight}
        bottomSheetMidHeight={bottomSheetMidHeight}
        bottomSheetFullscreen={bottomSheetFullscreen}
        refreshPermissionAndLocation={refreshPermissionAndLocation}
        userLocation={userLocation}
        zoom={initialZoom}
        Overlay={FiltersOverlayButtons}
        zoomRef={handleZoomInRef}
      />
      <PlacesBottomSheet
        refresh={refresh}
        places={sortPlaces(places, userLocation)}
        place={place}
        slug={slug}
        userLocation={userLocation}
        selectPlace={selectPlace}
        deselectAll={deselect}
        snapPoints={bottomSheetSnapPoints}
        snapPointIndex={bottomSheetSnapPointIndex}
        setSnapPointIndex={setBottomSheetSnapPointIndex}
        isFullscreen={bottomSheetFullscreen}
        zoomInFocusTarget={zoomInFocusTarget}
      />
    </Container>
  )
}

export default Places
